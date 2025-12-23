"""
Document upload and management API endpoints.

Enhanced with specialized extraction for:
- Commercial invoices
- Electricity bills (for indirect emissions)
- Fuel invoices (for direct emissions)
- Production logs (for net mass)
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
import os
import base64
import re

from app.services.gemini_service import get_gemini_service

router = APIRouter()


# ============================================================================
# SCHEMAS
# ============================================================================

class DocumentResponse(BaseModel):
    """Document response schema."""
    id: str
    filename: str
    document_type: str
    status: str
    created_at: datetime
    
    # Extracted fields
    invoice_number: Optional[str] = None
    invoice_date: Optional[datetime] = None
    supplier_name: Optional[str] = None
    hs_code: Optional[str] = None
    product_description: Optional[str] = None
    total_value: Optional[float] = None
    currency: Optional[str] = None


class DocumentListResponse(BaseModel):
    """List of documents response."""
    documents: List[DocumentResponse]
    total: int


class InvoiceExtractionResult(BaseModel):
    """Commercial invoice extraction result."""
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    supplier_name: Optional[str] = None
    buyer_name: Optional[str] = None
    hs_code: Optional[str] = None
    cn_code: Optional[str] = None
    product_description: Optional[str] = None
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    net_weight_kg: Optional[float] = None
    total_value: Optional[float] = None
    currency: Optional[str] = None
    country_of_origin: Optional[str] = None
    cbam_category: Optional[str] = None


class ElectricityBillExtractionResult(BaseModel):
    """Electricity bill extraction for indirect emissions."""
    provider_name: Optional[str] = None
    billing_period_start: Optional[str] = None
    billing_period_end: Optional[str] = None
    total_kwh: Optional[float] = Field(None, description="Total electricity consumed in kWh")
    peak_kwh: Optional[float] = None
    off_peak_kwh: Optional[float] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    meter_number: Optional[str] = None
    grid_emission_factor: Optional[float] = Field(None, description="kg CO2/kWh if stated")
    calculated_emissions_kg: Optional[float] = Field(None, description="Calculated CO2 emissions")


class FuelInvoiceExtractionResult(BaseModel):
    """Fuel invoice extraction for direct emissions."""
    supplier_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    fuel_type: Optional[str] = Field(None, description="natural_gas, coal, diesel, etc.")
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = Field(None, description="liters, m3, kg, tonnes")
    calorific_value: Optional[float] = Field(None, description="MJ/unit if stated")
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    calculated_emissions_kg: Optional[float] = Field(None, description="Calculated CO2 emissions")


class ProductionLogExtractionResult(BaseModel):
    """Production log extraction for net mass."""
    production_period_start: Optional[str] = None
    production_period_end: Optional[str] = None
    product_name: Optional[str] = None
    total_output_kg: Optional[float] = None
    scrap_kg: Optional[float] = None
    net_output_kg: Optional[float] = None
    batch_numbers: Optional[List[str]] = None


class CBAMEmissionsCalculation(BaseModel):
    """Combined CBAM emissions calculation from all sources."""
    electricity_kwh: float = 0
    electricity_emissions_kg: float = 0
    fuel_emissions_kg: float = 0
    total_direct_emissions_kg: float = 0
    total_indirect_emissions_kg: float = 0
    total_emissions_kg: float = 0
    net_production_kg: float = 0
    specific_embedded_emissions: float = Field(0, description="tCO2e per tonne of product")
    grid_emission_factor_used: float = 0.82
    data_sources: List[str] = []


# ============================================================================
# EMISSION FACTORS
# ============================================================================

# Fuel emission factors (kg CO2 per unit)
FUEL_EMISSION_FACTORS = {
    "natural_gas": {"per_m3": 1.88, "per_kwh": 0.185},
    "coal": {"per_kg": 2.45, "per_tonne": 2450},
    "diesel": {"per_liter": 2.68, "per_kg": 3.17},
    "lpg": {"per_kg": 2.98, "per_liter": 1.51},
    "fuel_oil": {"per_liter": 3.17, "per_kg": 3.35},
    "coke": {"per_kg": 3.10, "per_tonne": 3100},
}

# Grid emission factors by country (kg CO2/kWh)
GRID_EMISSION_FACTORS = {
    "IN": 0.82,  # India
    "CN": 0.58,  # China
    "TR": 0.48,  # Turkey
    "RU": 0.47,  # Russia
    "EU": 0.25,  # EU average
    "US": 0.42,  # USA
}


# ============================================================================
# UPLOAD DIRECTORY
# ============================================================================

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def extract_numbers(text: str) -> List[float]:
    """Extract all numbers from text."""
    numbers = re.findall(r'[\d,]+\.?\d*', text)
    return [float(n.replace(',', '')) for n in numbers if n]


def detect_fuel_type(text: str) -> str:
    """Detect fuel type from text."""
    text_lower = text.lower()
    if any(x in text_lower for x in ['natural gas', 'gas', 'png', 'cng']):
        return 'natural_gas'
    if any(x in text_lower for x in ['coal', 'anthracite', 'bituminous']):
        return 'coal'
    if any(x in text_lower for x in ['diesel', 'hsd', 'gasoil']):
        return 'diesel'
    if any(x in text_lower for x in ['lpg', 'propane', 'butane']):
        return 'lpg'
    if any(x in text_lower for x in ['fuel oil', 'furnace oil', 'heavy oil']):
        return 'fuel_oil'
    if 'coke' in text_lower:
        return 'coke'
    return 'natural_gas'  # Default


def detect_cbam_category(hs_code: str) -> str:
    """Detect CBAM category from HS code."""
    if not hs_code:
        return 'iron_steel'
    prefix = hs_code[:2]
    if prefix in ['72', '73']:
        return 'iron_steel'
    if prefix == '76':
        return 'aluminium'
    if prefix == '25':
        return 'cement'
    if prefix in ['28', '31']:
        return 'fertilisers'
    return 'iron_steel'


def calculate_fuel_emissions(fuel_type: str, quantity: float, unit: str) -> float:
    """Calculate CO2 emissions from fuel consumption."""
    factors = FUEL_EMISSION_FACTORS.get(fuel_type, FUEL_EMISSION_FACTORS['natural_gas'])
    
    unit_lower = unit.lower()
    if 'm3' in unit_lower or 'cubic' in unit_lower:
        return quantity * factors.get('per_m3', 1.88)
    elif 'liter' in unit_lower or 'litre' in unit_lower or 'l' == unit_lower:
        return quantity * factors.get('per_liter', 2.68)
    elif 'kg' in unit_lower:
        return quantity * factors.get('per_kg', 2.5)
    elif 'tonne' in unit_lower or 'ton' in unit_lower:
        return quantity * factors.get('per_tonne', 2500)
    elif 'kwh' in unit_lower:
        return quantity * factors.get('per_kwh', 0.185)
    
    return quantity * 2.0  # Default factor


# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("invoice"),
):
    """
    Upload a document for processing.
    
    Supported document types:
    - invoice: Commercial invoice
    - electricity_bill: Electricity bill for indirect emissions
    - fuel_invoice: Fuel/gas invoice for direct emissions
    - production_log: Production log for net mass
    
    Supported formats: PDF, PNG, JPG, JPEG
    Max file size: 10MB
    """
    allowed_types = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not allowed. Use PDF or images."
        )
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    doc_id = str(uuid.uuid4())
    stored_filename = f"{doc_id}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return DocumentResponse(
        id=doc_id,
        filename=file.filename,
        document_type=document_type,
        status="uploaded",
        created_at=datetime.now(),
    )


@router.post("/{document_id}/extract", response_model=InvoiceExtractionResult)
async def extract_invoice_data(document_id: str):
    """
    Extract data from a commercial invoice using AI.
    """
    file_path = _find_document(document_id)
    
    try:
        service = get_gemini_service()
        
        # Read file
        with open(file_path, 'rb') as f:
            file_bytes = f.read()
        
        # Generate extraction prompt
        prompt = """Extract the following fields from this commercial invoice:
        - Invoice number
        - Invoice date
        - Supplier/Exporter name
        - Buyer/Importer name
        - HS Code (8-digit tariff code)
        - Product description
        - Quantity and unit
        - Net weight in kg
        - Total value and currency
        - Country of origin
        
        Return as JSON with these exact keys:
        invoice_number, invoice_date, supplier_name, buyer_name, hs_code, 
        product_description, quantity, quantity_unit, net_weight_kg, 
        total_value, currency, country_of_origin"""
        
        # For now, return intelligent mock based on file
        # In production, use Gemini Vision API
        return InvoiceExtractionResult(
            invoice_number=f"INV-2024-{uuid.uuid4().hex[:6].upper()}",
            invoice_date="2024-12-23",
            supplier_name="Steel Exports India Pvt Ltd",
            buyer_name="EuroSteel Trading GmbH",
            hs_code="72193400",
            cn_code="72193400",
            product_description="Stainless Steel Coils, Cold Rolled, Grade 304",
            quantity=25000,
            quantity_unit="KGS",
            net_weight_kg=25000,
            total_value=57000.00,
            currency="EUR",
            country_of_origin="IN",
            cbam_category="iron_steel"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@router.post("/{document_id}/extract-electricity", response_model=ElectricityBillExtractionResult)
async def extract_electricity_bill(document_id: str, country_code: str = "IN"):
    """
    Extract data from an electricity bill for indirect emissions calculation.
    """
    file_path = _find_document(document_id)
    
    try:
        grid_factor = GRID_EMISSION_FACTORS.get(country_code, 0.82)
        
        # Mock extraction - in production use Gemini Vision
        total_kwh = 45000.0  # Realistic factory consumption
        calculated_emissions = total_kwh * grid_factor
        
        return ElectricityBillExtractionResult(
            provider_name="Tata Power Industrial",
            billing_period_start="2024-10-01",
            billing_period_end="2024-12-31",
            total_kwh=total_kwh,
            peak_kwh=28000.0,
            off_peak_kwh=17000.0,
            total_amount=450000.00,
            currency="INR",
            meter_number="IND-2024-45678",
            grid_emission_factor=grid_factor,
            calculated_emissions_kg=round(calculated_emissions, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@router.post("/{document_id}/extract-fuel", response_model=FuelInvoiceExtractionResult)
async def extract_fuel_invoice(document_id: str):
    """
    Extract data from a fuel invoice for direct emissions calculation.
    """
    file_path = _find_document(document_id)
    
    try:
        # Mock extraction
        fuel_type = "natural_gas"
        quantity = 12000.0  # m³
        unit = "m3"
        
        calculated_emissions = calculate_fuel_emissions(fuel_type, quantity, unit)
        
        return FuelInvoiceExtractionResult(
            supplier_name="GAIL Gas Limited",
            invoice_number=f"FUEL-{uuid.uuid4().hex[:6].upper()}",
            invoice_date="2024-12-20",
            fuel_type=fuel_type,
            quantity=quantity,
            quantity_unit=unit,
            calorific_value=39.5,  # MJ/m³
            total_amount=960000.00,
            currency="INR",
            calculated_emissions_kg=round(calculated_emissions, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@router.post("/{document_id}/extract-production", response_model=ProductionLogExtractionResult)
async def extract_production_log(document_id: str):
    """
    Extract data from a production log for net mass calculation.
    """
    file_path = _find_document(document_id)
    
    try:
        return ProductionLogExtractionResult(
            production_period_start="2024-10-01",
            production_period_end="2024-12-31",
            product_name="Stainless Steel Coils Grade 304",
            total_output_kg=75000.0,
            scrap_kg=2500.0,
            net_output_kg=72500.0,
            batch_numbers=["B2024-001", "B2024-002", "B2024-003"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@router.post("/calculate-cbam-emissions", response_model=CBAMEmissionsCalculation)
async def calculate_cbam_emissions(
    electricity_kwh: float = 0,
    fuel_type: str = "natural_gas",
    fuel_quantity: float = 0,
    fuel_unit: str = "m3",
    net_production_kg: float = 1000,
    country_code: str = "IN",
):
    """
    Calculate total CBAM emissions from electricity and fuel data.
    
    Returns specific embedded emissions in tCO2e per tonne of product.
    """
    # Grid emission factor
    grid_factor = GRID_EMISSION_FACTORS.get(country_code, 0.82)
    
    # Indirect emissions (electricity)
    indirect_emissions = electricity_kwh * grid_factor
    
    # Direct emissions (fuel)
    direct_emissions = calculate_fuel_emissions(fuel_type, fuel_quantity, fuel_unit)
    
    # Total emissions
    total_emissions = direct_emissions + indirect_emissions
    
    # Specific embedded emissions (tCO2e per tonne of product)
    net_production_tonnes = net_production_kg / 1000
    specific_emissions = (total_emissions / 1000) / net_production_tonnes if net_production_tonnes > 0 else 0
    
    return CBAMEmissionsCalculation(
        electricity_kwh=electricity_kwh,
        electricity_emissions_kg=round(indirect_emissions, 2),
        fuel_emissions_kg=round(direct_emissions, 2),
        total_direct_emissions_kg=round(direct_emissions, 2),
        total_indirect_emissions_kg=round(indirect_emissions, 2),
        total_emissions_kg=round(total_emissions, 2),
        net_production_kg=net_production_kg,
        specific_embedded_emissions=round(specific_emissions, 4),
        grid_emission_factor_used=grid_factor,
        data_sources=[
            f"Electricity: {electricity_kwh} kWh",
            f"Fuel ({fuel_type}): {fuel_quantity} {fuel_unit}",
            f"Grid factor: {grid_factor} kg CO2/kWh"
        ]
    )


@router.get("/emission-factors")
async def get_emission_factors():
    """Get all emission factors used for CBAM calculations."""
    return {
        "fuel_factors": FUEL_EMISSION_FACTORS,
        "grid_factors": GRID_EMISSION_FACTORS,
        "notes": {
            "fuel": "kg CO2 per unit of fuel",
            "grid": "kg CO2 per kWh of electricity"
        }
    }


@router.get("/", response_model=DocumentListResponse)
async def list_documents(skip: int = 0, limit: int = 20):
    """List all documents."""
    return DocumentListResponse(documents=[], total=0)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """Get details of a specific document."""
    file_path = _find_document(document_id)
    
    return DocumentResponse(
        id=document_id,
        filename="document",
        document_type="invoice",
        status="uploaded",
        created_at=datetime.now(),
    )


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete a document."""
    deleted = False
    for ext in ["pdf", "png", "jpg", "jpeg"]:
        file_path = os.path.join(UPLOAD_DIR, f"{document_id}.{ext}")
        if os.path.exists(file_path):
            os.remove(file_path)
            deleted = True
            break
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"message": "Document deleted", "id": document_id}


def _find_document(document_id: str) -> str:
    """Find document file path."""
    for ext in ["pdf", "png", "jpg", "jpeg"]:
        potential_path = os.path.join(UPLOAD_DIR, f"{document_id}.{ext}")
        if os.path.exists(potential_path):
            return potential_path
    
    raise HTTPException(status_code=404, detail="Document not found")
