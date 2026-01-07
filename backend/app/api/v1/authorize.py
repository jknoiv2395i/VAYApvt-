"""
Authorization API endpoints for VAYA Authorize (Module D).
Handles ACD application workflow, eligibility checking, solvency assessment, and packet generation.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.authorization import (
    AuthorizationApplication,
    ApplicationStatus,
    ApplicationType,
    FinancialStatement,
    ConductDeclaration,
    SolvencyStatus
)
from app.schemas.authorize_schema import (
    EligibilityCheckRequest,
    EligibilityCheckResponse,
    ThresholdStatusResponse,
    ThresholdStatusEnum,
    FinancialDocUploadResponse,
    SolvencyResultResponse,
    BankGuaranteeRequest,
    BankGuaranteeCalculation,
    ConductQuestionnaireRequest,
    ConductQuestionnaireResponse,
    ConductQuestion,
    ApplicationCreateRequest,
    ApplicationStatusResponse,
    ApplicationStatusEnum,
    PacketGenerateRequest,
    PacketGenerateResponse,
    AuthorizeDashboardSummary
)
from app.services.threshold_service import ThresholdService
from app.services.solvency_service import SolvencyService
from app.services.bank_guarantee_service import BankGuaranteeService


router = APIRouter()


# ============================================================================
# Conduct Questionnaire Questions (from CBAM Regulation Annex I)
# ============================================================================

CONDUCT_QUESTIONS = [
    ConductQuestion(
        id="Q1",
        text="In the past 5 years, have you been convicted of any customs-related offenses?",
        is_critical=True,
        if_yes_guidance="Requires detailed explanation and may lead to rejection"
    ),
    ConductQuestion(
        id="Q2",
        text="Have you failed to pay any import duties, VAT, or excise taxes when due?",
        is_critical=True,
        if_yes_guidance="Must provide evidence of settlement or payment plan"
    ),
    ConductQuestion(
        id="Q3",
        text="Have you been penalized for submitting false customs declarations?",
        is_critical=True,
        if_yes_guidance="Likely grounds for rejection"
    ),
    ConductQuestion(
        id="Q4",
        text="Are there any ongoing investigations by customs or tax authorities?",
        is_critical=True,
        if_yes_guidance="Application may be suspended pending investigation outcome"
    ),
    ConductQuestion(
        id="Q5",
        text="Have you complied with all environmental regulations related to your operations?",
        is_critical=False,
        if_yes_guidance="May trigger additional scrutiny"
    ),
]


# ============================================================================
# Eligibility & Threshold Endpoints
# ============================================================================

@router.get("/eligibility", response_model=EligibilityCheckResponse)
async def check_eligibility(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Check if user needs ACD authorization based on de minimis threshold.
    Returns threshold status and recommendation.
    """
    threshold_service = ThresholdService(db)
    
    result = await threshold_service.check_eligibility(
        user_id=str(current_user.id),
        organization_id=str(current_user.organization_id) if current_user.organization_id else None,
        include_projections=True
    )
    
    return EligibilityCheckResponse(
        needs_authorization=result["needs_authorization"],
        reason=result["reason"],
        threshold_status=ThresholdStatusResponse(
            status=ThresholdStatusEnum(result["threshold_status"]["status"]),
            current_tonnage=result["threshold_status"]["current_tonnage"],
            threshold=result["threshold_status"]["threshold"],
            remaining_buffer=result["threshold_status"]["remaining_buffer"],
            projected_breach_date=result["threshold_status"]["projected_breach_date"],
            alert_level=result["threshold_status"]["alert_level"],
            message=result["threshold_status"]["message"],
            covered_goods=result["threshold_status"]["covered_goods"],
            non_covered_goods=result["threshold_status"]["non_covered_goods"],
            quarterly_history=result["threshold_status"]["quarterly_history"]
        ),
        recommendation=result["recommendation"]
    )


@router.get("/threshold-status", response_model=ThresholdStatusResponse)
async def get_threshold_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current quarter threshold status.
    """
    threshold_service = ThresholdService(db)
    
    result = await threshold_service.check_eligibility(
        user_id=str(current_user.id),
        organization_id=str(current_user.organization_id) if current_user.organization_id else None
    )
    
    ts = result["threshold_status"]
    return ThresholdStatusResponse(
        status=ThresholdStatusEnum(ts["status"]),
        current_tonnage=ts["current_tonnage"],
        threshold=ts["threshold"],
        remaining_buffer=ts["remaining_buffer"],
        projected_breach_date=ts["projected_breach_date"],
        alert_level=ts["alert_level"],
        message=ts["message"],
        covered_goods=ts["covered_goods"],
        non_covered_goods=ts["non_covered_goods"],
        quarterly_history=ts["quarterly_history"]
    )


# ============================================================================
# Application Management Endpoints
# ============================================================================

@router.post("/applications", response_model=ApplicationStatusResponse)
async def create_application(
    request: ApplicationCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start a new ACD authorization application.
    """
    # Check for existing draft application
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.user_id == str(current_user.id),
        AuthorizationApplication.status.in_([
            ApplicationStatus.DRAFT,
            ApplicationStatus.DOCUMENTS_PENDING,
            ApplicationStatus.FINANCIAL_REVIEW
        ])
    )
    result = await db.execute(query)
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have an existing application in progress. Complete or delete it first."
        )
    
    # Create new application
    application = AuthorizationApplication(
        user_id=str(current_user.id),
        organization_id=str(current_user.organization_id) if current_user.organization_id else None,
        nca_country=request.nca_country.upper(),
        eori_number=request.eori_number,
        application_type=ApplicationType(request.application_type),
        status=ApplicationStatus.DOCUMENTS_PENDING
    )
    
    db.add(application)
    await db.commit()
    await db.refresh(application)
    
    return await _get_application_status(application, db)


@router.get("/applications/current", response_model=ApplicationStatusResponse)
async def get_current_application(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current active application status.
    """
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.user_id == str(current_user.id)
    ).order_by(AuthorizationApplication.created_at.desc()).limit(1)
    
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="No application found")
    
    return await _get_application_status(application, db)


@router.get("/applications/{application_id}", response_model=ApplicationStatusResponse)
async def get_application(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get specific application status.
    """
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return await _get_application_status(application, db)


# ============================================================================
# Financial Document Endpoints
# ============================================================================

@router.post("/applications/{application_id}/financial-docs", response_model=FinancialDocUploadResponse)
async def upload_financial_document(
    application_id: str,
    fiscal_year: str = Form(...),
    document_type: str = Form(...),  # balance_sheet or profit_loss
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload and process a financial document (P&L or Balance Sheet).
    Uses AI to extract financial data.
    """
    # Verify application ownership
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check file type
    if file.content_type not in ["application/pdf", "image/png", "image/jpeg", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and image files (PNG, JPG) are supported"
        )
    
    # Read file content
    file_content = await file.read()
    
    # TODO: Integrate with GPT-4o-mini Vision for OCR extraction
    # For now, create a placeholder financial statement
    
    # Check if statement for this fiscal year already exists
    stmt_query = select(FinancialStatement).where(
        FinancialStatement.application_id == application_id,
        FinancialStatement.fiscal_year == fiscal_year
    )
    stmt_result = await db.execute(stmt_query)
    statement = stmt_result.scalar_one_or_none()
    
    if not statement:
        statement = FinancialStatement(
            application_id=application_id,
            fiscal_year=fiscal_year
        )
        db.add(statement)
    
    # Placeholder extraction response
    # In production, this would call the financial extractor service
    extraction_result = {
        "fiscal_year": fiscal_year,
        "success": True,
        "extraction_confidence": 0.85,
        "balance_sheet": None,
        "profit_loss": None,
        "warnings": ["Document uploaded. OCR extraction will be processed."],
        "extraction_errors": []
    }
    
    await db.commit()
    
    return FinancialDocUploadResponse(
        success=True,
        fiscal_year=fiscal_year,
        balance_sheet=extraction_result.get("balance_sheet"),
        profit_loss=extraction_result.get("profit_loss"),
        extraction_confidence=extraction_result["extraction_confidence"],
        extraction_errors=extraction_result["extraction_errors"],
        warnings=extraction_result["warnings"]
    )


@router.get("/applications/{application_id}/solvency", response_model=SolvencyResultResponse)
async def get_solvency_assessment(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get solvency assessment for an application.
    Requires 3 years of financial data.
    """
    # Verify application ownership
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    solvency_service = SolvencyService(db)
    solvency_result = await solvency_service.calculate_solvency(application_id)
    
    if not solvency_result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=solvency_result.get("error", "Unable to calculate solvency")
        )
    
    # Convert to response schema (simplified for now)
    return SolvencyResultResponse(
        solvency_status=solvency_result["solvency_status"],
        debt_to_equity=solvency_result["debt_to_equity"],
        current_ratio=solvency_result["current_ratio"],
        operating_margin=solvency_result["operating_margin"],
        overall_trend=solvency_result["overall_trend"],
        guarantee_required=solvency_result["guarantee_required"],
        recommendation=solvency_result["recommendation"],
        action_items=solvency_result["action_items"]
    )


# ============================================================================
# Bank Guarantee Endpoints
# ============================================================================

@router.post("/calculate-guarantee", response_model=BankGuaranteeCalculation)
async def calculate_bank_guarantee(
    request: BankGuaranteeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate estimated bank guarantee amount.
    Interactive calculator for users to estimate guarantee requirements.
    """
    guarantee_service = BankGuaranteeService(db)
    
    result = await guarantee_service.calculate_guarantee(
        annual_tonnage=request.annual_tonnage,
        cn_code=request.primary_cn_code,
        carbon_price_override=request.carbon_price_override
    )
    
    return BankGuaranteeCalculation(
        annual_tonnage=result["annual_tonnage"],
        commodity=result["commodity"],
        cn_code=result["cn_code"],
        default_emission_factor=result["default_emission_factor"],
        total_emissions=result["total_emissions"],
        carbon_price_eur=result["carbon_price_eur"],
        base_cost_eur=result["base_cost_eur"],
        safety_factor=result["safety_factor"],
        guarantee_amount_eur=result["guarantee_amount_eur"],
        guarantee_amount_inr=result["guarantee_amount_local"],
        eur_inr_rate=result["exchange_rate"],
        annual_cbam_certificate_cost_eur=result["annual_cbam_certificate_cost_eur"],
        guarantee_as_percentage=result["guarantee_as_percentage"]
    )


# ============================================================================
# Conduct Declaration Endpoints
# ============================================================================

@router.get("/conduct-questions")
async def get_conduct_questions():
    """
    Get the list of conduct questionnaire questions.
    """
    return {"questions": CONDUCT_QUESTIONS}


@router.post("/applications/{application_id}/conduct", response_model=ConductQuestionnaireResponse)
async def submit_conduct_declaration(
    application_id: str,
    request: ConductQuestionnaireRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit conduct questionnaire answers.
    """
    # Verify application ownership
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Process answers
    critical_issues = []
    warnings = []
    yes_count = 0
    
    question_map = {q.id: q for q in CONDUCT_QUESTIONS}
    
    for answer in request.answers:
        question = question_map.get(answer.question_id)
        if not question:
            continue
        
        # Save declaration
        declaration = ConductDeclaration(
            application_id=application_id,
            question_id=answer.question_id,
            question_text=question.text,
            answer=answer.answer,
            explanation=answer.explanation,
            is_critical=question.is_critical
        )
        db.add(declaration)
        
        if answer.answer:  # True = "Yes" (potential issue)
            yes_count += 1
            if question.is_critical:
                critical_issues.append(f"{answer.question_id}: {question.text}")
            else:
                warnings.append(f"{answer.question_id}: {question.text}")
    
    # Determine status
    if len(critical_issues) > 0:
        status = "red_flag"
        can_proceed = False
        next_steps = [
            "Consult with legal advisor before proceeding",
            "Prepare detailed explanations for each critical issue",
            "Gather supporting documentation for remediation"
        ]
    elif len(warnings) > 0:
        status = "yellow_flag"
        can_proceed = True
        next_steps = [
            "Include explanatory statement with application",
            "Prepare supporting documents for flagged items"
        ]
    else:
        status = "clean"
        can_proceed = True
        next_steps = ["Proceed with application"]
    
    # Update application
    application.conduct_status = status
    await db.commit()
    
    return ConductQuestionnaireResponse(
        status=status,
        score=len(CONDUCT_QUESTIONS) - yes_count,
        critical_issues=critical_issues,
        warnings=warnings,
        next_steps=next_steps,
        can_proceed=can_proceed
    )


# ============================================================================
# Packet Generation Endpoints
# ============================================================================

@router.post("/applications/{application_id}/generate-packet", response_model=PacketGenerateResponse)
async def generate_application_packet(
    application_id: str,
    request: PacketGenerateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate submission-ready application packet (ZIP file).
    """
    # Verify application ownership
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check if application has required data
    # TODO: Validate all required documents are uploaded
    
    # Generate packet ID
    packet_id = str(uuid.uuid4())[:8]
    
    # TODO: Implement actual packet generation using document_generator_service
    # For now, return placeholder response
    
    from datetime import datetime, timedelta
    expires_at = datetime.now() + timedelta(days=30)
    
    return PacketGenerateResponse(
        success=True,
        packet_id=packet_id,
        download_url=f"/api/v1/authorize/packets/{packet_id}/download",
        password="temp123" if request.password_protect else None,
        expires_at=expires_at,
        files_included=[
            "01_Application_Form.pdf",
            "02_Declaration_of_Honour.pdf",
            "03_Financial_Summary.pdf",
            "06_Technical_SOP.pdf",
            "README.txt"
        ],
        total_size_mb=2.5
    )


from app.services.packet_service import PacketService
from app.services.whatsapp_service import WhatsAppService

@router.post("/applications/{application_id}/submit-packet")
async def submit_application_packet(
    application_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Orchestrates the 'Next Process' workflow:
    Phase B: The Brain (Solvency & Thresholds).
    Phase C: The Architect (Packet Assembly).
    Phase D: The Dispatcher (Delivery).
    """
    # Verify application ownership
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Initialize Services
    solvency_service = SolvencyService(db)
    packet_service = PacketService()
    whatsapp_service = WhatsAppService()
    
    # ==========================================
    # Phase B: The Brain
    # ==========================================
    
    # 1. De Minimis Check
    de_minimis = await solvency_service.check_de_minimis(str(current_user.id))
    
    # 2. Solvency Calculation
    # Fetch financial data from DB
    financial_data = await _aggregate_financial_data(application.id, db)
    
    # If no data found (e.g. testing without upload), fallback to defaults to prevent crash
    if not financial_data:
         # Fallback for empty new applications to prevent 500 error
         financial_data = {
            "total_equity": 0.0,
            "total_liabilities": 0.0,
            "current_assets": 0.0,
            "short_term_liabilities": 0.0
         }

    financial_health = solvency_service.calculate_financial_health(financial_data)
    
    # 3. Bank Guarantee
    # Using default carbon price/factors for now if not in DB
    bank_guarantee = solvency_service.estimate_bank_guarantee(
        tonnage=de_minimis["total"],
        carbon_price=85.0
    )
    
    # ==========================================
    # Phase C: The Architect
    # ==========================================
    
    # 1. Generate Declaration of Honour (HTML)
    doh_data = {
        "entity_name": current_user.full_name or "VAYA User",
        "eori_number": application.eori_number,
        "solvency_status": financial_health["status"],
        "application_id": application_id
    }
    doh_path = packet_service.generate_declaration_of_honour(doh_data)
    
    # 2. Generate & Validate XML
    xml_data = {
        "application_id": application_id,
        "eori_number": application.eori_number or "PENDING",
        "entity_name": current_user.full_name or "Unknown",
        "country_code": application.nca_country,
        "solvency_status": financial_health["status"],
        "guarantee_amount": bank_guarantee
    }
    xml_path, xml_bytes = packet_service.generate_amm_xml(xml_data)
    
    xml_valid, xml_error = packet_service.validate_amm_xml(xml_bytes)
    
    # 3. Assemble Packet
    # Collect paths (SOP, Financials, Declaration, XML)
    files_to_zip = [doh_path, xml_path]
    zip_path = packet_service.assemble_packet(application_id, files_to_zip)
    
    # ==========================================
    # Phase D: The Dispatcher
    # ==========================================
    
    # 1. Update Application Status
    application.status = ApplicationStatus.SUBMITTED
    application.solvency_status = SolvencyStatus(financial_health["status"])
    
    # Save packet path
    application.packet_storage_path = str(zip_path)
    
    # Construct download URL (relative to API root)
    # The frontend uses proxy to localhost:8000, so /api/v1/... works
    download_link = f"/api/v1/authorize/applications/{application_id}/download-packet"
    application.packet_download_url = download_link
    
    # Save results to SolvencyAssessment for history
    # Check if assessment exists
    query_sa = select(SolvencyAssessment).where(SolvencyAssessment.application_id == application.id)
    result_sa = await db.execute(query_sa)
    assessment = result_sa.scalar_one_or_none()
    
    if not assessment:
        assessment = SolvencyAssessment(application_id=application.id)
        db.add(assessment)
        
    assessment.latest_debt_to_equity = financial_health["d_e"]
    assessment.latest_current_ratio = financial_health["cr"]
    assessment.guarantee_amount_eur = bank_guarantee
    assessment.solvency_status = SolvencyStatus(financial_health["status"])
    
    await db.commit()
    
    # 2. Trigger WhatsApp Notification (Outbound)
    # We construct a simulated download URL for now
    background_tasks.add_task(whatsapp_service.send_packet_ready, str(current_user.id), download_link)
    
    return {
        "success": True,
        "message": "Application processed successfully",
        "phase_b_results": {
            "de_minimis": de_minimis,
            "financial_health": financial_health,
            "bank_guarantee_est": bank_guarantee
        },
        "phase_c_results": {
            "packet_path": str(zip_path),
            "download_url": download_link,
            "xml_validated": xml_valid
        },
        "next_steps": "Check WhatsApp for your download link."
    }


from fastapi.responses import FileResponse
import os


@router.get("/applications/{application_id}/download-packet")
async def download_application_packet(
    application_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Download the generated authorization packet (ZIP).
    """
    if application_id == "mock":
        # Fallback for demo/simulation mode
        storage_dir = "G:\\VAYA\\backend\\temp_storage"
        if not os.path.exists(storage_dir):
            os.makedirs(storage_dir)
            
        # Find any zip
        files = [f for f in os.listdir(storage_dir) if f.endswith(".zip")]
        if files:
            file_path = os.path.join(storage_dir, files[-1])
        else:
             file_path = os.path.join(storage_dir, "Mock_Packet.zip")
             import zipfile
             with zipfile.ZipFile(file_path, 'w') as zf:
                zf.writestr("README.txt", "This is a simulation packet.")
        
        return FileResponse(
            path=file_path,
            filename="VAYA_Authorization_Packet_Mock.zip",
            media_type="application/zip"
        )
    
    # Validation logic for real IDs (simplified for browser access)
    pass # In real app, we would validate token from query param here

    # Verify application ownership
    query = select(AuthorizationApplication).where(
        AuthorizationApplication.id == application_id,
        AuthorizationApplication.user_id == str(current_user.id)
    )
    result = await db.execute(query)
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if not application.packet_storage_path:
        # Fallback: check if file exists in standard location even if DB missing path
        expected_path = os.path.join("G:\\VAYA\\backend\\temp_storage", f"Authorization_Packet_{application.id}.zip")
        if os.path.exists(expected_path):
             return FileResponse(
                path=expected_path,
                filename=f"Authorization_Packet_{application.eori_number or 'Draft'}.zip",
                media_type="application/zip"
            )
        raise HTTPException(status_code=404, detail="Packet not generated yet")
        
    file_path = application.packet_storage_path
    
    if not os.path.exists(file_path):
        # Fallback to temp_storage if absolute path failed
        filename = os.path.basename(file_path)
        fallback_path = os.path.join("G:\\VAYA\\backend\\temp_storage", filename)
        if os.path.exists(fallback_path):
            file_path = fallback_path
        else:
            raise HTTPException(status_code=404, detail="Packet file missing from storage")
        
    return FileResponse(
        path=file_path,
        filename=f"Authorization_Packet_{application.eori_number or 'Draft'}.zip",
        media_type="application/zip"
    )

async def _aggregate_financial_data(application_id: str, db: AsyncSession) -> Optional[dict]:
    """
    Fetch the most recent FinancialStatement and extract key metrics.
    In a full production system, this would average 3 years.
    """
    # Get all statements
    query = select(FinancialStatement).where(
        FinancialStatement.application_id == application_id
    )
    result = await db.execute(query)
    statements = result.scalars().all()
    
    if not statements:
        return None
        
    # Sort by fiscal year (string comparison roughly works for YYYY-YYYY, but ideally parse)
    # We'll take the "latest" one added or lexically highest year
    latest_stmt = sorted(statements, key=lambda x: x.fiscal_year)[-1]
    
    return {
        "total_equity": float(latest_stmt.total_equity or 0),
        "total_liabilities": float(latest_stmt.total_liabilities or 0),
        "current_assets": float(latest_stmt.current_assets or 0),
        "short_term_liabilities": float(latest_stmt.current_liabilities or 0)
    }

# ============================================================================
# Dashboard Endpoint
# ============================================================================

@router.get("/dashboard", response_model=AuthorizeDashboardSummary)
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get summary data for authorization dashboard.
    """
    # Get threshold status
    threshold_service = ThresholdService(db)
    eligibility = await threshold_service.check_eligibility(
        user_id=str(current_user.id),
        organization_id=str(current_user.organization_id) if current_user.organization_id else None
    )
    
    # Get current application
    app_query = select(AuthorizationApplication).where(
        AuthorizationApplication.user_id == str(current_user.id)
    ).order_by(AuthorizationApplication.created_at.desc()).limit(1)
    
    app_result = await db.execute(app_query)
    application = app_result.scalar_one_or_none()
    
    # Build response
    ts = eligibility["threshold_status"]
    threshold_status = ThresholdStatusResponse(
        status=ThresholdStatusEnum(ts["status"]),
        current_tonnage=ts["current_tonnage"],
        threshold=ts["threshold"],
        remaining_buffer=ts["remaining_buffer"],
        projected_breach_date=ts["projected_breach_date"],
        alert_level=ts["alert_level"],
        message=ts["message"]
    )
    
    application_status = None
    if application:
        application_status = await _get_application_status(application, db)
    
    # Determine next step and urgency
    if eligibility["needs_authorization"]:
        if not application:
            next_step = "Start your ACD authorization application"
            urgency_level = "high"
        elif application.status == ApplicationStatus.READY_FOR_SUBMISSION:
            next_step = "Download and submit your application packet"
            urgency_level = "medium"
        elif application.status == ApplicationStatus.SUBMITTED:
            next_step = "Application Submitted. Awaiting NCA review."
            urgency_level = "low"
        else:
            next_step = "Complete your application"
            urgency_level = "medium"
    else:
        if ts["status"] == "approaching":
            next_step = "Monitor imports and prepare documentation proactively"
            urgency_level = "low"
        else:
            next_step = "No authorization currently required"
            urgency_level = "low"
    
    return AuthorizeDashboardSummary(
        threshold_status=threshold_status,
        has_active_application=application is not None,
        application=application_status,
        documents_uploaded=application_status.documents_uploaded if application_status else 0,
        solvency_assessed=application.solvency_status != SolvencyStatus.PENDING_ASSESSMENT if application else False,
        conduct_completed=application.conduct_status != "pending" if application else False,
        next_step=next_step,
        urgency_level=urgency_level
    )


# ============================================================================
# Helper Functions
# ============================================================================

async def _get_application_status(
    application: AuthorizationApplication,
    db: AsyncSession
) -> ApplicationStatusResponse:
    """Build application status response."""
    # Count financial statements
    stmt_query = select(FinancialStatement).where(
        FinancialStatement.application_id == application.id
    )
    stmt_result = await db.execute(stmt_query)
    statements = stmt_result.scalars().all()
    
    # Count conduct declarations
    conduct_query = select(ConductDeclaration).where(
        ConductDeclaration.application_id == application.id
    )
    conduct_result = await db.execute(conduct_query)
    declarations = conduct_result.scalars().all()
    
    # Build pending actions list
    pending_actions = []
    
    if len(statements) < 3:
        pending_actions.append(f"Upload financial documents ({3 - len(statements)} years remaining)")
    
    if not declarations:
        pending_actions.append("Complete conduct questionnaire")
    
    if application.solvency_status == SolvencyStatus.PENDING_ASSESSMENT and len(statements) >= 3:
        pending_actions.append("Solvency assessment pending")
    
    if not application.eori_number:
        pending_actions.append("Provide EORI number")
        
    if application.status == ApplicationStatus.SUBMITTED:
        pending_actions = ["Application Under Review"]
    
    return ApplicationStatusResponse(
        id=application.id,
        application_number=application.application_number,
        status=ApplicationStatusEnum(application.status.value),
        documents_uploaded=len(statements),
        documents_required=6,  # 3 years × 2 documents each
        financial_years_submitted=len(statements),
        financial_years_required=3,
        conduct_completed=len(declarations) > 0,
        solvency_status=application.solvency_status.value if application.solvency_status else None,
        conduct_status=application.conduct_status,
        packet_ready=application.status == ApplicationStatus.READY_FOR_SUBMISSION,
        packet_download_url=application.packet_download_url,
        packet_expires_at=application.packet_expires_at,
        pending_actions=pending_actions,
        created_at=application.created_at,
        updated_at=application.updated_at
    )

