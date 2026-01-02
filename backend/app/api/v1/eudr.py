"""
EUDR API Endpoints

REST API endpoints for EU Deforestation Regulation compliance:
- Geometry validation
- Deforestation risk analysis
- TRACES NT submission
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Optional, List
from datetime import date

from app.services.eudr_validator import get_eudr_validator
from app.services.deforestation_analyzer import (
    get_deforestation_analyzer,
    RiskLevel,
    DeforestationAnalysisResult,
)
from app.services.traces_gateway import get_traces_gateway

router = APIRouter()


# === Request/Response Models ===

class GeometryValidationRequest(BaseModel):
    """Request body for geometry validation."""
    geometry: dict = Field(
        ...,
        description="GeoJSON Geometry object (Point, Polygon, or MultiPolygon)",
        examples=[{
            "type": "Polygon",
            "coordinates": [[[77.5, 12.9], [77.6, 12.9], [77.6, 13.0], [77.5, 13.0], [77.5, 12.9]]]
        }]
    )
    auto_fix: bool = Field(
        default=True,
        description="Automatically fix correctable issues (winding order, precision)"
    )


class ValidationErrorDetail(BaseModel):
    """A single validation error."""
    code: str
    message: str
    severity: str
    location: str
    remediation: str


class GeometryValidationResponse(BaseModel):
    """Response from geometry validation."""
    is_valid: bool = Field(..., description="Whether the geometry passes all EUDR checks")
    errors: list[ValidationErrorDetail] = Field(default=[], description="List of validation errors")
    warnings: list[ValidationErrorDetail] = Field(default=[], description="List of warnings (non-blocking)")
    fixes_applied: list[str] = Field(default=[], description="List of automatic fixes that were applied")
    corrected_geometry: Optional[dict] = Field(None, description="Corrected GeoJSON geometry (if auto_fix=True)")
    area_hectares: Optional[float] = Field(None, description="Calculated area in hectares")
    plot_size_category: Optional[str] = Field(None, description="'small' (≤4ha, point OK) or 'large' (>4ha, polygon required)")


# === Endpoints ===

@router.post("/validate-geometry", response_model=GeometryValidationResponse)
async def validate_geometry(request: GeometryValidationRequest):
    """
    Validate a GeoJSON geometry for EUDR/TRACES compliance.
    
    This endpoint checks the geometry against all EUDR requirements:
    - **CRS**: Must be WGS84 (EPSG:4326), coordinates in valid range
    - **Winding Order**: Exterior rings must be counter-clockwise (RFC 7946)
    - **No Holes**: Interior rings are prohibited by TRACES
    - **Topology**: Must be valid (no self-intersections)
    - **Precision**: Minimum 6 decimal places (~11cm accuracy)
    - **Closure**: First coordinate must equal last coordinate
    
    **Auto-fix**: When enabled, correctable issues (winding order, precision) are
    automatically fixed. The corrected geometry is returned for use.
    
    **Returns**:
    - `is_valid`: True if geometry passes all checks
    - `errors`: List of blocking errors
    - `warnings`: List of non-blocking warnings
    - `fixes_applied`: List of automatic fixes applied
    - `corrected_geometry`: The fixed geometry (if valid)
    - `area_hectares`: Calculated plot area
    - `plot_size_category`: 'small' (≤4ha) or 'large' (>4ha)
    """
    try:
        validator = get_eudr_validator()
        result = validator.validate(request.geometry, auto_fix=request.auto_fix)
        
        # Calculate area if geometry is valid
        area_hectares = None
        plot_size_category = None
        
        if result.corrected_geometry:
            try:
                area_hectares = validator.calculate_area_hectares(result.corrected_geometry)
                area_hectares = round(area_hectares, 4)
                plot_size_category = "small" if area_hectares <= 4.0 else "large"
            except Exception:
                pass  # Area calculation is non-critical
        
        # Convert result to response
        response_data = result.to_dict()
        response_data["area_hectares"] = area_hectares
        response_data["plot_size_category"] = plot_size_category
        
        return GeometryValidationResponse(**response_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process geometry: {str(e)}"
        )


@router.get("/validation-rules")
async def get_validation_rules():
    """
    Get the list of EUDR validation rules and requirements.
    
    Returns a summary of all validation checks performed by the geometry validator.
    Useful for documentation and UI help text.
    """
    return {
        "eudr_version": "EU Regulation 2023/1115",
        "enforcement_date": "2025-12-30",
        "cut_off_date": "2020-12-31",
        "geojson_standard": "RFC 7946",
        "crs_required": "WGS84 (EPSG:4326)",
        "validation_rules": [
            {
                "code": "EUDR-TOPO-001",
                "name": "Topology Validity",
                "description": "Geometry must be valid with no self-intersections"
            },
            {
                "code": "EUDR-CRS-001",
                "name": "Coordinate Bounds",
                "description": "Longitude must be -180 to 180, Latitude must be -90 to 90"
            },
            {
                "code": "EUDR-HOLE-001",
                "name": "No Interior Rings",
                "description": "TRACES prohibits polygons with holes (interior rings)"
            },
            {
                "code": "EUDR-PREC-001",
                "name": "Coordinate Precision",
                "description": "Minimum 6 decimal places required (~11cm accuracy)"
            },
            {
                "code": "EUDR-VERT-001",
                "name": "Minimum Vertices",
                "description": "Polygons require at least 4 points (3 unique + closure)"
            }
        ],
        "plot_size_thresholds": {
            "small_plot": "≤ 4 hectares (point acceptable)",
            "large_plot": "> 4 hectares (polygon required)"
        },
        "auto_fixes": [
            "winding_order_corrected",
            "topology_repaired",
            "coordinates_rounded",
            "polygon_closed"
        ]
    }


# === Deforestation Analysis Models ===

class DeforestationAnalysisRequest(BaseModel):
    """Request body for deforestation analysis."""
    geometry: dict = Field(
        ...,
        description="GeoJSON Geometry object (Polygon or MultiPolygon)",
        examples=[{
            "type": "Polygon",
            "coordinates": [[[77.5, 12.9], [77.6, 12.9], [77.6, 13.0], [77.5, 13.0], [77.5, 12.9]]]
        }]
    )
    commodity: Optional[str] = Field(
        None,
        description="EUDR commodity type: cattle, cocoa, coffee, palm_oil, rubber, soya, wood"
    )
    country_code: Optional[str] = Field(
        None,
        description="ISO 3166-1 alpha-2 country code (e.g., 'BR' for Brazil)"
    )


class ForestCoverResponse(BaseModel):
    """Forest cover statistics."""
    tree_cover_2020: float
    tree_cover_current: float
    tree_cover_loss_ha: float
    tree_cover_gain_ha: float
    forest_type: str
    biome: str


class AlertResponse(BaseModel):
    """Deforestation alert."""
    alert_type: str
    date_detected: str
    confidence: float
    area_affected_ha: float
    location: dict
    source: str
    description: str
    remediation: Optional[str] = None


class DeforestationAnalysisResponse(BaseModel):
    """Response from deforestation analysis."""
    is_compliant: bool = Field(..., description="Whether plot meets EUDR requirements")
    risk_level: str = Field(..., description="low, medium, high, or critical")
    risk_score: float = Field(..., description="Risk score from 0-100")
    forest_cover: Optional[ForestCoverResponse] = None
    alerts: List[AlertResponse] = Field(default=[], description="Detected alerts")
    summary: str = Field(..., description="Human-readable summary")
    recommendations: List[str] = Field(default=[], description="Actionable recommendations")
    analysis_date: str = Field(..., description="Date of analysis")
    data_sources: List[str] = Field(default=[], description="Data sources used")
    cutoff_date: str = Field(default="2020-12-31", description="EUDR cutoff date")


@router.post("/analyze-deforestation", response_model=DeforestationAnalysisResponse)
async def analyze_deforestation(request: DeforestationAnalysisRequest):
    """
    Analyze a plot for deforestation risk under EUDR.
    
    This endpoint performs satellite-based analysis to detect:
    - **Tree Cover Loss**: Changes since December 2020 baseline
    - **Forest Disturbance Alerts**: Recent clearing activity
    - **Land Use Change**: Conversion from forest to agriculture
    
    **Risk Scoring** considers:
    - Magnitude of tree cover loss
    - Severity and number of alerts
    - Commodity type (palm oil = higher risk factor)
    - Geographic location (Amazon, Indonesia = higher risk)
    
    **Returns**:
    - `is_compliant`: True if risk_level is 'low' or 'medium'
    - `risk_level`: low, medium, high, or critical
    - `risk_score`: Numeric score 0-100
    - `forest_cover`: Baseline and current forest statistics
    - `alerts`: List of detected deforestation alerts
    - `recommendations`: Actionable next steps
    """
    try:
        analyzer = get_deforestation_analyzer()
        result = await analyzer.analyze(
            geometry=request.geometry,
            commodity=request.commodity,
            country_code=request.country_code,
        )
        
        # Convert to response format
        forest_cover_response = None
        if result.forest_cover:
            forest_cover_response = ForestCoverResponse(
                tree_cover_2020=result.forest_cover.tree_cover_2020,
                tree_cover_current=result.forest_cover.tree_cover_current,
                tree_cover_loss_ha=result.forest_cover.tree_cover_loss_ha,
                tree_cover_gain_ha=result.forest_cover.tree_cover_gain_ha,
                forest_type=result.forest_cover.forest_type,
                biome=result.forest_cover.biome,
            )
        
        alerts_response = [
            AlertResponse(
                alert_type=alert.alert_type.value,
                date_detected=alert.date_detected.isoformat(),
                confidence=alert.confidence,
                area_affected_ha=alert.area_affected_ha,
                location=alert.location,
                source=alert.source,
                description=alert.description,
                remediation=alert.remediation,
            )
            for alert in result.alerts
        ]
        
        return DeforestationAnalysisResponse(
            is_compliant=result.is_compliant,
            risk_level=result.risk_level.value,
            risk_score=result.risk_score,
            forest_cover=forest_cover_response,
            alerts=alerts_response,
            summary=result.summary,
            recommendations=result.recommendations,
            analysis_date=result.analysis_date.isoformat(),
            data_sources=result.data_sources,
            cutoff_date=result.cutoff_date.isoformat(),
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to analyze plot: {str(e)}"
        )


@router.get("/commodities")
async def get_eudr_commodities():
    """
    Get list of EUDR-regulated commodities and their risk factors.
    """
    return {
        "commodities": [
            {"code": "cattle", "name": "Cattle", "risk_factor": 1.5},
            {"code": "cocoa", "name": "Cocoa", "risk_factor": 1.3},
            {"code": "coffee", "name": "Coffee", "risk_factor": 1.2},
            {"code": "palm_oil", "name": "Palm Oil", "risk_factor": 1.8},
            {"code": "rubber", "name": "Rubber", "risk_factor": 1.4},
            {"code": "soya", "name": "Soya", "risk_factor": 1.3},
            {"code": "wood", "name": "Wood", "risk_factor": 1.1},
        ],
        "cutoff_date": "2020-12-31",
        "enforcement_date": "2025-12-30",
    }


# === TRACES NT Gateway Models ===

class OperatorInfo(BaseModel):
    """Operator information for DDS."""
    name: str = Field(..., description="Company name")
    address: str = Field(..., description="Business address")
    country: str = Field(..., description="ISO 2-letter country code")
    eori_number: Optional[str] = Field(None, description="EU EORI number")
    vat_number: Optional[str] = Field(None, description="VAT registration number")
    role: str = Field("importer", description="Role: importer, exporter, producer, trader")


class GeolocationInfo(BaseModel):
    """Geolocation for a product batch."""
    latitude: float
    longitude: float
    polygon_wkt: Optional[str] = None
    area_hectares: Optional[float] = None


class ProductBatchInfo(BaseModel):
    """Product batch information."""
    batch_id: Optional[str] = None
    description: str = Field(..., description="Product description")
    cn_code: str = Field(..., description="EU CN code (8 digits)")
    hs_code: str = Field(..., description="HS code")
    quantity_kg: float = Field(..., description="Quantity in kilograms")
    origin_country: str = Field(..., description="ISO 2-letter origin country")
    production_date: Optional[str] = None
    geolocation: Optional[GeolocationInfo] = None


class RiskAssessmentInfo(BaseModel):
    """Risk assessment results."""
    is_compliant: bool = True
    risk_level: str = "low"
    risk_score: float = 0.0


class PrepareDDSRequest(BaseModel):
    """Request to prepare a Due Diligence Statement."""
    operator: OperatorInfo
    commodity: str = Field(..., description="EUDR commodity type")
    batches: List[ProductBatchInfo]
    risk_assessment: RiskAssessmentInfo


class DDSSummaryResponse(BaseModel):
    """Summary of a prepared DDS."""
    reference_number: str
    statement_date: str
    status: str
    operator_name: str
    operator_country: str
    commodity: str
    batch_count: int
    total_quantity_kg: float
    risk_level: str
    is_compliant: bool


class SubmitDDSRequest(BaseModel):
    """Request to submit a DDS to TRACES."""
    reference_number: str
    dry_run: bool = Field(True, description="If true, simulate submission without actual API call")


class SubmitDDSResponse(BaseModel):
    """Response from DDS submission."""
    success: bool
    mode: str
    reference_number: str
    traces_reference: Optional[str] = None
    checksum: Optional[str] = None
    submitted_at: Optional[str] = None
    message: str
    xml_preview: Optional[str] = None


@router.post("/prepare-dds", response_model=DDSSummaryResponse)
async def prepare_dds(request: PrepareDDSRequest):
    """
    Prepare a Due Diligence Statement for TRACES NT submission.
    
    This endpoint creates a DDS with all required information for
    EUDR compliance. The DDS is stored and can be submitted later.
    
    **Required Information**:
    - Operator details (name, address, EORI)
    - Product batches with geolocation
    - Risk assessment results
    
    **Returns**: DDS reference number and summary
    """
    try:
        gateway = get_traces_gateway()
        
        # Convert request to gateway format
        operator_dict = request.operator.model_dump()
        batches_list = [b.model_dump() for b in request.batches]
        risk_dict = request.risk_assessment.model_dump()
        
        # Prepare DDS
        dds = gateway.prepare_dds(
            operator=operator_dict,
            commodity=request.commodity,
            batches=batches_list,
            risk_assessment=risk_dict,
        )
        
        # Return summary
        summary = gateway.get_submission_summary(dds)
        
        return DDSSummaryResponse(
            reference_number=summary["reference_number"],
            statement_date=summary["statement_date"],
            status=summary["status"],
            operator_name=summary["operator"]["name"],
            operator_country=summary["operator"]["country"],
            commodity=summary["commodity"],
            batch_count=summary["batch_count"],
            total_quantity_kg=summary["total_quantity_kg"],
            risk_level=summary["risk_level"],
            is_compliant=summary["is_compliant"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to prepare DDS: {str(e)}"
        )


@router.post("/submit-to-traces", response_model=SubmitDDSResponse)
async def submit_to_traces(request: SubmitDDSRequest):
    """
    Submit a prepared DDS to TRACES NT.
    
    Currently operates in dry-run mode, simulating the submission
    without actually connecting to the EU TRACES API.
    
    **Production Requirements** (future):
    - EU Login / ECAS authentication
    - Digital signature with qualified certificate
    - TRACES NT API access credentials
    
    **Returns**: Submission result with TRACES reference number
    """
    try:
        gateway = get_traces_gateway()
        
        # Get the DDS
        dds = gateway.get_submission(request.reference_number)
        if not dds:
            raise HTTPException(
                status_code=404,
                detail=f"DDS not found: {request.reference_number}"
            )
        
        # Submit
        result = await gateway.submit_to_traces(dds, dry_run=request.dry_run)
        
        return SubmitDDSResponse(
            success=result.get("success", False),
            mode=result.get("mode", "unknown"),
            reference_number=result.get("reference_number", ""),
            traces_reference=result.get("traces_reference"),
            checksum=result.get("checksum"),
            submitted_at=result.get("submitted_at"),
            message=result.get("message", ""),
            xml_preview=result.get("xml_preview"),
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to submit DDS: {str(e)}"
        )


@router.get("/dds/{reference_number}")
async def get_dds(reference_number: str):
    """
    Get details of a prepared DDS by reference number.
    """
    gateway = get_traces_gateway()
    dds = gateway.get_submission(reference_number)
    
    if not dds:
        raise HTTPException(
            status_code=404,
            detail=f"DDS not found: {reference_number}"
        )
    
    return gateway.get_submission_summary(dds)


@router.get("/dds/{reference_number}/xml")
async def get_dds_xml(reference_number: str):
    """
    Get the XML representation of a DDS for preview or download.
    """
    gateway = get_traces_gateway()
    dds = gateway.get_submission(reference_number)
    
    if not dds:
        raise HTTPException(
            status_code=404,
            detail=f"DDS not found: {reference_number}"
        )
    
    xml_content = gateway.build_xml(dds)
    
    return {
        "reference_number": reference_number,
        "content_type": "application/xml",
        "xml": xml_content,
    }
