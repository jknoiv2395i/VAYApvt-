"""
TRACES NT Gateway Service

Handles the preparation and submission of Due Diligence Statements (DDS)
to the EU TRACES NT system for EUDR compliance.

TRACES NT (Trade Control and Expert System - New Technology) is the EU's
online platform for managing imports/exports of live animals, food, and
products subject to sanitary controls.

For EUDR, operators must submit a DDS before placing commodities on the
EU market or exporting them from the EU.
"""

from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum
from typing import List, Dict, Optional, Any
from xml.etree import ElementTree as ET
from xml.dom import minidom
import hashlib
import uuid


class DDSStatus(str, Enum):
    """Status of a Due Diligence Statement."""
    DRAFT = "draft"
    PENDING = "pending"
    SUBMITTED = "submitted"
    VALIDATED = "validated"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class CommodityType(str, Enum):
    """EUDR regulated commodities."""
    CATTLE = "cattle"
    COCOA = "cocoa"
    COFFEE = "coffee"
    PALM_OIL = "palm_oil"
    RUBBER = "rubber"
    SOYA = "soya"
    WOOD = "wood"


class OperatorRole(str, Enum):
    """Role of the operator in the supply chain."""
    IMPORTER = "importer"
    EXPORTER = "exporter"
    PRODUCER = "producer"
    TRADER = "trader"


@dataclass
class GeoLocation:
    """Geographic coordinates for a plot."""
    latitude: float
    longitude: float
    polygon_wkt: Optional[str] = None  # Well-Known Text format
    area_hectares: Optional[float] = None


@dataclass
class ProductBatch:
    """A batch of product in the supply chain."""
    batch_id: str
    product_description: str
    cn_code: str  # EU Combined Nomenclature code
    hs_code: str  # Harmonized System code
    quantity_kg: float
    origin_country: str  # ISO 2-letter code
    production_date: Optional[date] = None
    geolocation: Optional[GeoLocation] = None


@dataclass
class Operator:
    """An operator in the EUDR supply chain."""
    name: str
    address: str
    country: str  # ISO 2-letter code
    eori_number: Optional[str] = None  # EU Economic Operator Registration
    vat_number: Optional[str] = None
    role: OperatorRole = OperatorRole.IMPORTER


@dataclass
class DDSSubmission:
    """A complete Due Diligence Statement for TRACES submission."""
    reference_number: str
    statement_date: date
    operator: Operator
    commodity_type: CommodityType
    product_batches: List[ProductBatch]
    
    # Risk assessment
    risk_assessment_performed: bool = True
    risk_level: str = "low"
    deforestation_risk_score: float = 0.0
    
    # Compliance declarations
    deforestation_free: bool = True
    legally_produced: bool = True
    
    # Status
    status: DDSStatus = DDSStatus.DRAFT
    
    # Metadata
    created_at: datetime = field(default_factory=datetime.now)
    traces_reference: Optional[str] = None


class TRACESGateway:
    """
    Gateway for TRACES NT submissions.
    
    This service prepares and manages Due Diligence Statements (DDS)
    for EUDR compliance. In production, it would connect to the
    TRACES NT API for actual submissions.
    """
    
    # TRACES NT XML namespaces
    NAMESPACES = {
        "dds": "urn:eu:ec:sante:traces:dds:v1",
        "common": "urn:eu:ec:sante:traces:common:v1",
        "geo": "urn:eu:ec:sante:traces:geo:v1",
    }
    
    # EU TRACES API endpoints (mock)
    TRACES_API_BASE = "https://webgate.ec.europa.eu/tracesnt/api/v1"
    
    def __init__(self):
        """Initialize the TRACES gateway."""
        self.pending_submissions: Dict[str, DDSSubmission] = {}
    
    def generate_reference_number(self) -> str:
        """Generate a unique DDS reference number."""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = uuid.uuid4().hex[:8].upper()
        return f"DDS-{timestamp}-{unique_id}"
    
    def prepare_dds(
        self,
        operator: Dict[str, Any],
        commodity: str,
        batches: List[Dict[str, Any]],
        risk_assessment: Dict[str, Any],
    ) -> DDSSubmission:
        """
        Prepare a Due Diligence Statement for submission.
        
        Args:
            operator: Operator details (name, address, EORI, etc.)
            commodity: EUDR commodity type
            batches: List of product batches with geolocation
            risk_assessment: Results from deforestation analysis
            
        Returns:
            Prepared DDSSubmission object
        """
        # Create operator
        op = Operator(
            name=operator.get("name", ""),
            address=operator.get("address", ""),
            country=operator.get("country", ""),
            eori_number=operator.get("eori_number"),
            vat_number=operator.get("vat_number"),
            role=OperatorRole(operator.get("role", "importer")),
        )
        
        # Create product batches
        product_batches = []
        for batch in batches:
            geo = None
            if batch.get("geolocation"):
                geo_data = batch["geolocation"]
                geo = GeoLocation(
                    latitude=geo_data.get("latitude", 0),
                    longitude=geo_data.get("longitude", 0),
                    polygon_wkt=geo_data.get("polygon_wkt"),
                    area_hectares=geo_data.get("area_hectares"),
                )
            
            product_batches.append(ProductBatch(
                batch_id=batch.get("batch_id", str(uuid.uuid4())),
                product_description=batch.get("description", ""),
                cn_code=batch.get("cn_code", ""),
                hs_code=batch.get("hs_code", ""),
                quantity_kg=batch.get("quantity_kg", 0),
                origin_country=batch.get("origin_country", ""),
                production_date=batch.get("production_date"),
                geolocation=geo,
            ))
        
        # Create submission
        dds = DDSSubmission(
            reference_number=self.generate_reference_number(),
            statement_date=date.today(),
            operator=op,
            commodity_type=CommodityType(commodity.lower()),
            product_batches=product_batches,
            risk_level=risk_assessment.get("risk_level", "low"),
            deforestation_risk_score=risk_assessment.get("risk_score", 0),
            deforestation_free=risk_assessment.get("is_compliant", True),
            legally_produced=True,
        )
        
        # Store for later submission
        self.pending_submissions[dds.reference_number] = dds
        
        return dds
    
    def build_xml(self, dds: DDSSubmission) -> str:
        """
        Build TRACES-compliant XML for a DDS.
        
        Args:
            dds: The DDSSubmission to convert
            
        Returns:
            XML string formatted for TRACES NT
        """
        # Root element
        root = ET.Element("DueDiligenceStatement")
        root.set("xmlns", self.NAMESPACES["dds"])
        root.set("version", "1.0")
        
        # Reference and dates
        ET.SubElement(root, "ReferenceNumber").text = dds.reference_number
        ET.SubElement(root, "StatementDate").text = dds.statement_date.isoformat()
        ET.SubElement(root, "Status").text = dds.status.value
        
        # Operator information
        operator_elem = ET.SubElement(root, "Operator")
        ET.SubElement(operator_elem, "Name").text = dds.operator.name
        ET.SubElement(operator_elem, "Address").text = dds.operator.address
        ET.SubElement(operator_elem, "Country").text = dds.operator.country
        ET.SubElement(operator_elem, "Role").text = dds.operator.role.value
        if dds.operator.eori_number:
            ET.SubElement(operator_elem, "EORINumber").text = dds.operator.eori_number
        if dds.operator.vat_number:
            ET.SubElement(operator_elem, "VATNumber").text = dds.operator.vat_number
        
        # Commodity information
        ET.SubElement(root, "CommodityType").text = dds.commodity_type.value
        
        # Product batches
        batches_elem = ET.SubElement(root, "ProductBatches")
        for batch in dds.product_batches:
            batch_elem = ET.SubElement(batches_elem, "Batch")
            ET.SubElement(batch_elem, "BatchID").text = batch.batch_id
            ET.SubElement(batch_elem, "Description").text = batch.product_description
            ET.SubElement(batch_elem, "CNCode").text = batch.cn_code
            ET.SubElement(batch_elem, "HSCode").text = batch.hs_code
            ET.SubElement(batch_elem, "QuantityKg").text = str(batch.quantity_kg)
            ET.SubElement(batch_elem, "OriginCountry").text = batch.origin_country
            
            if batch.production_date:
                ET.SubElement(batch_elem, "ProductionDate").text = batch.production_date.isoformat()
            
            if batch.geolocation:
                geo_elem = ET.SubElement(batch_elem, "Geolocation")
                ET.SubElement(geo_elem, "Latitude").text = str(batch.geolocation.latitude)
                ET.SubElement(geo_elem, "Longitude").text = str(batch.geolocation.longitude)
                if batch.geolocation.polygon_wkt:
                    ET.SubElement(geo_elem, "PolygonWKT").text = batch.geolocation.polygon_wkt
                if batch.geolocation.area_hectares:
                    ET.SubElement(geo_elem, "AreaHectares").text = str(batch.geolocation.area_hectares)
        
        # Risk assessment
        risk_elem = ET.SubElement(root, "RiskAssessment")
        ET.SubElement(risk_elem, "Performed").text = str(dds.risk_assessment_performed).lower()
        ET.SubElement(risk_elem, "RiskLevel").text = dds.risk_level
        ET.SubElement(risk_elem, "RiskScore").text = str(dds.deforestation_risk_score)
        
        # Compliance declarations
        declarations_elem = ET.SubElement(root, "Declarations")
        ET.SubElement(declarations_elem, "DeforestationFree").text = str(dds.deforestation_free).lower()
        ET.SubElement(declarations_elem, "LegallyProduced").text = str(dds.legally_produced).lower()
        
        # Pretty print XML
        xml_str = ET.tostring(root, encoding="unicode")
        dom = minidom.parseString(xml_str)
        return dom.toprettyxml(indent="  ")
    
    def calculate_checksum(self, xml_content: str) -> str:
        """Calculate SHA-256 checksum of XML content."""
        return hashlib.sha256(xml_content.encode()).hexdigest()
    
    async def submit_to_traces(
        self, 
        dds: DDSSubmission,
        dry_run: bool = True
    ) -> Dict[str, Any]:
        """
        Submit a DDS to TRACES NT.
        
        In production, this would make an actual API call to TRACES.
        Currently simulates the submission for development purposes.
        
        Args:
            dds: The DDS to submit
            dry_run: If True, simulate submission without actual API call
            
        Returns:
            Submission result with TRACES reference
        """
        # Build XML
        xml_content = self.build_xml(dds)
        checksum = self.calculate_checksum(xml_content)
        
        if dry_run:
            # Simulate successful submission
            traces_ref = f"TRACES-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:12].upper()}"
            
            # Update DDS status
            dds.status = DDSStatus.SUBMITTED
            dds.traces_reference = traces_ref
            
            return {
                "success": True,
                "mode": "dry_run",
                "reference_number": dds.reference_number,
                "traces_reference": traces_ref,
                "checksum": checksum,
                "xml_preview": xml_content[:500] + "...",
                "submitted_at": datetime.now().isoformat(),
                "message": "DDS prepared for submission (dry run mode)"
            }
        
        # In production, this would:
        # 1. Authenticate with EU login / ECAS
        # 2. POST to TRACES NT API
        # 3. Handle response and store reference
        
        return {
            "success": False,
            "error": "Production submission not yet implemented",
            "message": "Use dry_run=True for development testing"
        }
    
    def get_submission(self, reference: str) -> Optional[DDSSubmission]:
        """Get a pending submission by reference number."""
        return self.pending_submissions.get(reference)
    
    def get_submission_summary(self, dds: DDSSubmission) -> Dict[str, Any]:
        """Get a summary of a DDS for display."""
        return {
            "reference_number": dds.reference_number,
            "statement_date": dds.statement_date.isoformat(),
            "status": dds.status.value,
            "operator": {
                "name": dds.operator.name,
                "country": dds.operator.country,
                "role": dds.operator.role.value,
            },
            "commodity": dds.commodity_type.value,
            "batch_count": len(dds.product_batches),
            "total_quantity_kg": sum(b.quantity_kg for b in dds.product_batches),
            "risk_level": dds.risk_level,
            "is_compliant": dds.deforestation_free and dds.legally_produced,
            "traces_reference": dds.traces_reference,
        }


# Singleton instance
_gateway: Optional[TRACESGateway] = None

def get_traces_gateway() -> TRACESGateway:
    """Get the singleton TRACES gateway instance."""
    global _gateway
    if _gateway is None:
        _gateway = TRACESGateway()
    return _gateway
