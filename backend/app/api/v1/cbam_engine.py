"""
CBAM Compliance Engine API Router (Refined)

Production-grade REST API for the three vertical ML agents:
1. POST /classify - HS/CN Code classification with emission factors
2. POST /extract - Invoice/Document extraction with PDF parsing
3. POST /generate-xml - CBAM XML generation with full validation
4. POST /process-full - Complete pipeline (classify + calculate + serialize)
5. GET /health - Engine health and status check
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime
import logging

from app.agents import ClassifierAgent, ExtractorAgent, SerializerAgent
from app.agents.classifier_agent import ClassificationResult, ReviewStatus, CBAMCategory as ClassifierCBAMCategory
from app.agents.extractor_agent import ExtractedActivityData, ExtractionBackend
from app.agents.serializer_agent import (
    CBAMReport, Declarant, Producer, GoodsItem, 
    EmissionData, CBAMCategory, Address, CalculationMethod, ValidationResult
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cbam-engine", tags=["CBAM ML Engine"])

# Initialize agents
classifier = ClassifierAgent(use_cache=True)
extractor = ExtractorAgent(backend=ExtractionBackend.REGEX)
serializer = SerializerAgent(pretty_print=True)


# ============== Request/Response Models ==============

class ClassifyRequest(BaseModel):
    """Request for HS/CN code classification."""
    product_description: str = Field(..., min_length=3, max_length=1000, description="Product description in natural language")
    include_alternatives: bool = Field(default=True, description="Include alternative code suggestions")


class ClassifyResponse(BaseModel):
    """Comprehensive classification response."""
    cn_code: str
    cn_code_formatted: str
    cn_description: str
    confidence: float
    review_status: str
    chapter: str
    chapter_description: str
    is_cbam_relevant: bool
    cbam_category: Optional[str] = None
    emission_factor: Optional[Dict[str, float]] = None
    alternatives: Optional[List[Dict[str, Any]]] = None
    matched_keywords: List[str] = []
    notes: List[str] = []


class ExtractResponse(BaseModel):
    """Document extraction response."""
    document_type: Optional[str] = None
    reporting_period_start: Optional[str] = None
    reporting_period_end: Optional[str] = None
    electricity_consumption_kwh: Optional[float] = None
    electricity_consumption_mwh: Optional[float] = None
    gross_weight_kg: Optional[float] = None
    country_of_origin: Optional[str] = None
    producer_name: Optional[str] = None
    producer_address: Optional[str] = None
    installation_id: Optional[str] = None
    product_description: Optional[str] = None
    confidence_scores: Dict[str, float] = {}
    warnings: List[str] = []
    extraction_method: str = "unknown"


class XMLGenerateRequest(BaseModel):
    """Request to generate CBAM XML."""
    report_id: Optional[str] = None  # Auto-generated if not provided
    year: int = Field(..., ge=2024, le=2100)
    quarter: int = Field(..., ge=1, le=4)
    
    # Declarant info
    declarant_eori: str = Field(..., min_length=10, max_length=20)
    declarant_name: str = Field(..., min_length=2)
    declarant_street: str
    declarant_city: str
    declarant_postal: str
    declarant_country: str = Field(..., min_length=2, max_length=2)
    declarant_email: Optional[str] = None
    
    # Goods info
    cn_code: str = Field(..., min_length=8, max_length=10)
    cn_description: str
    cbam_category: str
    quantity_kg: float = Field(..., gt=0)
    country_of_origin: str = Field(..., min_length=2, max_length=2)
    
    # Producer
    producer_id: str
    producer_name: str
    producer_country: str = Field(..., min_length=2, max_length=2)
    producer_address: Optional[str] = None
    producer_verified: bool = False
    
    # Emissions
    direct_emissions: float = Field(..., ge=0)
    indirect_emissions: float = Field(..., ge=0)
    electricity_mwh: Optional[float] = None
    calculation_method: str = "actual"


class XMLGenerateResponse(BaseModel):
    """XML generation response."""
    report_id: str
    is_valid: bool
    validation_errors: List[str] = []
    validation_warnings: List[str] = []
    xml_preview: str = ""
    total_emissions_tco2: float = 0.0


class FullPipelineRequest(BaseModel):
    """Request for full CBAM processing pipeline."""
    product_description: str = Field(..., min_length=3)
    declarant_eori: str = Field(..., min_length=10)
    declarant_name: str
    declarant_country: str = "DE"
    quantity_kg: float = Field(default=1000.0, gt=0)
    country_of_origin: str = "IN"
    
    # Optional emission estimates (if not provided, uses defaults)
    direct_emissions_per_tonne: Optional[float] = None
    indirect_emissions_per_tonne: Optional[float] = None


class FullPipelineResponse(BaseModel):
    """Full pipeline processing response."""
    status: str
    message: Optional[str] = None
    classification: Optional[Dict[str, Any]] = None
    emissions: Optional[Dict[str, float]] = None
    xml: Optional[Dict[str, Any]] = None


# ============== Endpoints ==============

@router.post("/classify", response_model=ClassifyResponse)
async def classify_product(request: ClassifyRequest):
    """
    Classify a product description into an EU CN code.
    
    Uses semantic matching with 100+ CN codes to find the best match.
    Returns confidence score, CBAM category, and default emission factors.
    Flags low-confidence results (< 85%) for human review.
    """
    try:
        result: ClassificationResult = await classifier.classify(request.product_description)
        
        # Build emission factor dict if available
        emission_factor_dict = None
        if result.emission_factor:
            emission_factor_dict = {
                "direct_tco2_per_tonne": result.emission_factor.direct_tco2_per_tonne,
                "indirect_tco2_per_tonne": result.emission_factor.indirect_tco2_per_tonne,
                "electricity_mwh_per_tonne": result.emission_factor.electricity_mwh_per_tonne
            }
        
        # Build alternatives list
        alternatives = None
        if request.include_alternatives and result.alternative_codes:
            alternatives = [
                {"cn_code": code, "description": desc, "confidence": conf}
                for code, desc, conf in result.alternative_codes
            ]
        
        return ClassifyResponse(
            cn_code=result.cn_code,
            cn_code_formatted=result.cn_code_formatted,
            cn_description=result.cn_description,
            confidence=result.confidence,
            review_status=result.review_status.value,
            chapter=result.chapter,
            chapter_description=result.chapter_description,
            is_cbam_relevant=result.is_cbam_relevant,
            cbam_category=result.cbam_category.value if result.cbam_category else None,
            emission_factor=emission_factor_dict,
            alternatives=alternatives,
            matched_keywords=result.matched_keywords,
            notes=result.classification_notes
        )
    
    except Exception as e:
        logger.error(f"Classification error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


@router.post("/extract", response_model=ExtractResponse)
async def extract_document(file: UploadFile = File(...)):
    """
    Extract CBAM activity data from an uploaded PDF document.
    
    Supports:
    - Electricity bills (extracts kWh/MWh consumption)
    - Mill test certificates (weight, origin, producer, installation ID)
    - Commercial invoices (quantities, parties)
    
    Uses regex-based extraction with automatic unit normalization.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        pdf_bytes = await file.read()
        
        if len(pdf_bytes) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
        
        result: ExtractedActivityData = await extractor.extract_from_pdf(pdf_bytes, file.filename)
        
        # Validate extraction
        validation_warnings = extractor.validate_extraction(result)
        all_warnings = validation_warnings + result.extraction_warnings
        
        return ExtractResponse(
            document_type=result.document_type,
            reporting_period_start=result.reporting_period_start.isoformat() if result.reporting_period_start else None,
            reporting_period_end=result.reporting_period_end.isoformat() if result.reporting_period_end else None,
            electricity_consumption_kwh=result.electricity_consumption_kwh,
            electricity_consumption_mwh=result.electricity_consumption_mwh,
            gross_weight_kg=result.gross_weight_kg,
            country_of_origin=result.country_of_origin,
            producer_name=result.producer_name,
            producer_address=result.producer_address,
            installation_id=result.installation_id,
            product_description=result.product_description,
            confidence_scores=result.confidence_scores,
            warnings=all_warnings,
            extraction_method=result.extraction_method
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Extraction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@router.post("/generate-xml", response_model=XMLGenerateResponse)
async def generate_cbam_xml(request: XMLGenerateRequest):
    """
    Generate a CBAM-compliant XML report.
    
    Creates an XML file conforming to the EU QReport_ver23.00 schema.
    Validates against XSD before returning.
    Returns preview and validation status.
    """
    try:
        # Generate report ID if not provided
        report_id = request.report_id or serializer.generate_report_id(
            request.declarant_eori, request.year, request.quarter
        )
        
        # Build address
        address = Address(
            street=request.declarant_street,
            city=request.declarant_city,
            postal_code=request.declarant_postal,
            country=request.declarant_country
        )
        
        # Build declarant
        declarant = Declarant(
            eori_number=request.declarant_eori,
            name=request.declarant_name,
            address=address,
            contact_email=request.declarant_email
        )
        
        # Build producer
        producer = Producer(
            installation_id=request.producer_id,
            name=request.producer_name,
            country=request.producer_country,
            address=request.producer_address,
            is_verified=request.producer_verified
        )
        
        # Map calculation method
        try:
            calc_method = CalculationMethod(request.calculation_method)
        except ValueError:
            calc_method = CalculationMethod.ACTUAL
        
        # Build emissions
        emissions = EmissionData(
            direct_emissions_tco2=request.direct_emissions,
            indirect_emissions_tco2=request.indirect_emissions,
            electricity_consumption_mwh=request.electricity_mwh,
            calculation_method=calc_method
        )
        
        # Map CBAM category
        try:
            cbam_cat = CBAMCategory(request.cbam_category)
        except ValueError:
            cbam_cat = CBAMCategory.IRON_STEEL
        
        # Build goods item
        goods_item = GoodsItem(
            item_number=1,
            cn_code=request.cn_code,
            cn_description=request.cn_description,
            cbam_category=cbam_cat,
            quantity=request.quantity_kg,
            unit="kg",
            country_of_origin=request.country_of_origin,
            producer=producer,
            emissions=emissions
        )
        
        # Build report
        report = CBAMReport(
            report_id=report_id,
            reporting_period_year=request.year,
            reporting_period_quarter=request.quarter,
            declarant=declarant,
            goods=[goods_item],
            submission_date=date.today()
        )
        
        # Generate and validate
        xml_bytes, validation = await serializer.generate_and_validate(report)
        
        return XMLGenerateResponse(
            report_id=report_id,
            is_valid=validation.is_valid,
            validation_errors=validation.errors,
            validation_warnings=validation.warnings,
            xml_preview=xml_bytes[:1000].decode("utf-8", errors="replace"),
            total_emissions_tco2=emissions.total_emissions_tco2
        )
    
    except Exception as e:
        logger.error(f"XML generation error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"XML generation failed: {str(e)}")


@router.post("/generate-xml/download")
async def download_cbam_xml(request: XMLGenerateRequest):
    """
    Generate and download CBAM XML file.
    
    Same as /generate-xml but returns the complete file for download.
    """
    try:
        # Same building logic as generate_cbam_xml
        report_id = request.report_id or serializer.generate_report_id(
            request.declarant_eori, request.year, request.quarter
        )
        
        address = Address(
            street=request.declarant_street,
            city=request.declarant_city,
            postal_code=request.declarant_postal,
            country=request.declarant_country
        )
        
        declarant = Declarant(
            eori_number=request.declarant_eori,
            name=request.declarant_name,
            address=address,
            contact_email=request.declarant_email
        )
        
        producer = Producer(
            installation_id=request.producer_id,
            name=request.producer_name,
            country=request.producer_country,
            address=request.producer_address,
            is_verified=request.producer_verified
        )
        
        try:
            calc_method = CalculationMethod(request.calculation_method)
        except ValueError:
            calc_method = CalculationMethod.ACTUAL
        
        emissions = EmissionData(
            direct_emissions_tco2=request.direct_emissions,
            indirect_emissions_tco2=request.indirect_emissions,
            electricity_consumption_mwh=request.electricity_mwh,
            calculation_method=calc_method
        )
        
        try:
            cbam_cat = CBAMCategory(request.cbam_category)
        except ValueError:
            cbam_cat = CBAMCategory.IRON_STEEL
        
        goods_item = GoodsItem(
            item_number=1,
            cn_code=request.cn_code,
            cn_description=request.cn_description,
            cbam_category=cbam_cat,
            quantity=request.quantity_kg,
            unit="kg",
            country_of_origin=request.country_of_origin,
            producer=producer,
            emissions=emissions
        )
        
        report = CBAMReport(
            report_id=report_id,
            reporting_period_year=request.year,
            reporting_period_quarter=request.quarter,
            declarant=declarant,
            goods=[goods_item],
            submission_date=date.today()
        )
        
        xml_bytes = serializer.generate_xml(report)
        
        filename = f"CBAM_Report_{report_id}.xml"
        return Response(
            content=xml_bytes,
            media_type="application/xml",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    
    except Exception as e:
        logger.error(f"XML download error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"XML download failed: {str(e)}")


@router.post("/process-full", response_model=FullPipelineResponse)
async def full_pipeline(request: FullPipelineRequest):
    """
    Complete CBAM processing pipeline.
    
    1. Classifies product description to CN code
    2. Gets default emission factors or uses provided estimates
    3. Calculates total emissions
    4. Generates CBAM-compliant XML
    
    Returns classification, emissions calculation, and XML preview.
    """
    try:
        # Step 1: Classify product
        classification = await classifier.classify(request.product_description)
        
        # Check if review is needed
        if classification.review_status == ReviewStatus.NEEDS_REVIEW:
            return FullPipelineResponse(
                status="review_required",
                message=f"Classification confidence ({classification.confidence:.1%}) below 85% threshold. Human review recommended.",
                classification={
                    "cn_code": classification.cn_code_formatted,
                    "cn_description": classification.cn_description,
                    "confidence": classification.confidence,
                    "is_cbam": classification.is_cbam_relevant,
                    "cbam_category": classification.cbam_category.value if classification.cbam_category else None
                }
            )
        
        # Step 2: Get emission factors
        if request.direct_emissions_per_tonne is not None:
            direct_factor = request.direct_emissions_per_tonne
            indirect_factor = request.indirect_emissions_per_tonne or 0.3
        elif classification.emission_factor:
            direct_factor = classification.emission_factor.direct_tco2_per_tonne
            indirect_factor = classification.emission_factor.indirect_tco2_per_tonne
        else:
            # Default factors for iron/steel
            direct_factor = 1.9
            indirect_factor = 0.3
        
        # Step 3: Calculate emissions
        quantity_tonnes = request.quantity_kg / 1000
        direct_tco2 = quantity_tonnes * direct_factor
        indirect_tco2 = quantity_tonnes * indirect_factor
        total_tco2 = direct_tco2 + indirect_tco2
        
        # Step 4: Build and generate XML
        address = Address(
            street="[Auto-generated - Please Update]",
            city="[City]",
            postal_code="00000",
            country=request.declarant_country
        )
        
        declarant = Declarant(
            eori_number=request.declarant_eori,
            name=request.declarant_name,
            address=address
        )
        
        producer = Producer(
            installation_id="AUTO-GEN-001",
            name="[Producer Name - Please Update]",
            country=request.country_of_origin
        )
        
        emissions = EmissionData(
            direct_emissions_tco2=direct_tco2,
            indirect_emissions_tco2=indirect_tco2,
            specific_direct_emissions=direct_factor,
            specific_indirect_emissions=indirect_factor,
            calculation_method=CalculationMethod.ESTIMATE
        )
        
        cbam_cat = classification.cbam_category if classification.cbam_category else CBAMCategory.IRON_STEEL
        
        goods_item = GoodsItem(
            item_number=1,
            cn_code=classification.cn_code,
            cn_description=classification.cn_description,
            cbam_category=cbam_cat,
            quantity=request.quantity_kg,
            unit="kg",
            country_of_origin=request.country_of_origin,
            producer=producer,
            emissions=emissions
        )
        
        now = datetime.now()
        report_id = serializer.generate_report_id(request.declarant_eori, now.year, ((now.month - 1) // 3) + 1)
        
        report = CBAMReport(
            report_id=report_id,
            reporting_period_year=now.year,
            reporting_period_quarter=((now.month - 1) // 3) + 1,
            declarant=declarant,
            goods=[goods_item],
            submission_date=date.today()
        )
        
        xml_bytes, validation = await serializer.generate_and_validate(report)
        
        return FullPipelineResponse(
            status="success",
            classification={
                "cn_code": classification.cn_code_formatted,
                "cn_description": classification.cn_description,
                "confidence": classification.confidence,
                "is_cbam": classification.is_cbam_relevant,
                "cbam_category": cbam_cat.value,
                "matched_keywords": classification.matched_keywords
            },
            emissions={
                "quantity_tonnes": round(quantity_tonnes, 3),
                "direct_factor_tco2_per_t": direct_factor,
                "indirect_factor_tco2_per_t": indirect_factor,
                "direct_tco2": round(direct_tco2, 4),
                "indirect_tco2": round(indirect_tco2, 4),
                "total_tco2": round(total_tco2, 4)
            },
            xml={
                "report_id": report_id,
                "is_valid": validation.is_valid,
                "errors": validation.errors,
                "preview": xml_bytes[:1200].decode("utf-8", errors="replace")
            }
        )
    
    except Exception as e:
        logger.error(f"Full pipeline error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")


@router.get("/health")
async def health_check():
    """
    Health check for CBAM Engine.
    
    Returns status of all three agents and their configurations.
    """
    return {
        "status": "healthy",
        "version": "2.0.0",
        "agents": {
            "classifier": {
                "status": "ready",
                "codes_loaded": len(classifier._semantic_map) if hasattr(classifier, '_semantic_map') else "N/A",
                "cache_enabled": classifier.use_cache
            },
            "extractor": {
                "status": "ready",
                "backend": extractor.backend.value
            },
            "serializer": {
                "status": "ready",
                "schema_loaded": serializer._is_loaded,
                "pretty_print": serializer.pretty_print
            }
        },
        "timestamp": datetime.now().isoformat()
    }


@router.post("/classify/batch")
async def classify_batch(products: List[str]):
    """
    Batch classify multiple product descriptions.
    
    Returns list of classification results.
    Limited to 50 products per request.
    """
    if len(products) > 50:
        raise HTTPException(status_code=400, detail="Maximum 50 products per batch")
    
    try:
        results = await classifier.batch_classify(products)
        
        return {
            "count": len(results),
            "results": [
                {
                    "product": products[i],
                    "cn_code": r.cn_code_formatted,
                    "confidence": r.confidence,
                    "is_cbam": r.is_cbam_relevant,
                    "review_needed": r.review_status == ReviewStatus.NEEDS_REVIEW
                }
                for i, r in enumerate(results)
            ]
        }
    
    except Exception as e:
        logger.error(f"Batch classification error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch classification failed: {str(e)}")
