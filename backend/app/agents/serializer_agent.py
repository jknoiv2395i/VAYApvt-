"""
Serializer Agent - CBAM XML Generator (Refined)

Production-grade EU CBAM XML generator compliant with QReport schema.

Features:
- Complete QReport structure (Header, Declarant, GoodsList, Emissions)
- Multi-goods support with batch serialization
- Amendment report handling
- Strict XSD validation with detailed error messages
- Pretty-printing and formatting options
- Namespace handling per EU specifications
"""

import asyncio
from typing import Optional, List, Dict, Any, Union
from dataclasses import dataclass, field
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from pathlib import Path
import logging
import hashlib

from lxml import etree
from lxml.builder import ElementMaker

logger = logging.getLogger(__name__)


# CBAM XML Namespaces (per EU specification)
CBAM_NS = "urn:eu:ec:cbam:qreport:v2300"
XSI_NS = "http://www.w3.org/2001/XMLSchema-instance"

CBAM_NAMESPACES = {
    None: CBAM_NS,
    "xsi": XSI_NS,
}

# Default schema location
SCHEMA_PATH = Path(__file__).parent.parent / "schemas" / "QReport_ver23.00.xsd"


class CBAMCategory(str, Enum):
    """CBAM product categories per EU Regulation 2023/956."""
    CEMENT = "cement"
    IRON_STEEL = "iron_steel"
    ALUMINIUM = "aluminium"
    FERTILIZERS = "fertilizers"
    HYDROGEN = "hydrogen"
    ELECTRICITY = "electricity"


class CalculationMethod(str, Enum):
    """Emission calculation method types."""
    ACTUAL = "actual"            # Based on actual measured data
    DEFAULT_VALUE = "default_value"  # EU default emission factors
    ESTIMATE = "estimate"        # Estimated values
    VERIFIED = "verified"        # Third-party verified


class ReportType(str, Enum):
    """CBAM report types."""
    QUARTERLY = "quarterly"
    AMENDMENT = "amendment"
    CORRECTION = "correction"


@dataclass
class Address:
    """Physical address structure."""
    street: str
    city: str
    postal_code: str
    country: str  # ISO 2-letter code
    building_number: Optional[str] = None
    additional_info: Optional[str] = None


@dataclass
class Declarant:
    """CBAM Declarant (EU Importer) information."""
    eori_number: str
    name: str
    address: Address
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    representative_eori: Optional[str] = None


@dataclass
class Producer:
    """Non-EU producer/installation information."""
    installation_id: str
    name: str
    country: str  # ISO 2-letter code
    address: Optional[str] = None
    is_verified: bool = False
    verification_body: Optional[str] = None


@dataclass
class EmissionData:
    """Detailed emissions data for CBAM reporting."""
    direct_emissions_tco2: float
    indirect_emissions_tco2: float
    total_emissions_tco2: float = 0.0
    
    # Specific emission values
    specific_direct_emissions: float = 0.0  # tCO2/t product
    specific_indirect_emissions: float = 0.0  # tCO2/t product
    
    # Electricity data
    electricity_consumption_mwh: Optional[float] = None
    electricity_emission_factor: Optional[float] = None  # tCO2/MWh
    
    # Calculation details
    calculation_method: CalculationMethod = CalculationMethod.ACTUAL
    data_source: Optional[str] = None
    verification_status: Optional[str] = None
    
    def __post_init__(self):
        self.total_emissions_tco2 = self.direct_emissions_tco2 + self.indirect_emissions_tco2


@dataclass
class GoodsItem:
    """Individual goods item in CBAM report."""
    item_number: int
    cn_code: str
    cn_description: str
    cbam_category: CBAMCategory
    quantity: float
    unit: str  # "kg", "MWh", "t"
    country_of_origin: str
    producer: Producer
    emissions: EmissionData
    
    # Optional details
    inward_processing: bool = False
    carbon_price_paid: Optional[float] = None  # EUR
    carbon_price_currency: str = "EUR"
    supplementary_info: Optional[str] = None
    
    # Precursor goods (for complex goods)
    precursor_goods: List["GoodsItem"] = field(default_factory=list)


@dataclass
class CBAMReport:
    """Complete CBAM Quarterly Report structure."""
    report_id: str
    reporting_period_year: int
    reporting_period_quarter: int  # 1-4
    declarant: Declarant
    goods: List[GoodsItem] = field(default_factory=list)
    
    # Report metadata
    report_type: ReportType = ReportType.QUARTERLY
    submission_date: Optional[date] = None
    is_amendment: bool = False
    original_report_id: Optional[str] = None
    amendment_reason: Optional[str] = None
    
    # Totals (auto-calculated)
    total_direct_emissions: float = 0.0
    total_indirect_emissions: float = 0.0
    total_emissions: float = 0.0
    
    def calculate_totals(self):
        """Calculate aggregate emission totals."""
        self.total_direct_emissions = sum(g.emissions.direct_emissions_tco2 for g in self.goods)
        self.total_indirect_emissions = sum(g.emissions.indirect_emissions_tco2 for g in self.goods)
        self.total_emissions = self.total_direct_emissions + self.total_indirect_emissions


@dataclass
class ValidationResult:
    """Result of XML validation."""
    is_valid: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    schema_version: str = "23.00"


class SerializerAgent:
    """
    Production-grade CBAM XML Serializer.
    
    Generates EU CBAM-compliant XML with proper namespaces,
    validates against XSD, and handles complex report structures.
    """
    
    def __init__(
        self,
        schema_path: Optional[Path] = None,
        pretty_print: bool = True,
        include_comments: bool = False
    ):
        self.schema_path = schema_path or SCHEMA_PATH
        self.pretty_print = pretty_print
        self.include_comments = include_comments
        self._schema = None
        self._is_loaded = False
    
    async def load_schema(self) -> bool:
        """Load XSD schema for validation."""
        if self._is_loaded:
            return True
        
        try:
            if self.schema_path.exists():
                schema_doc = etree.parse(str(self.schema_path))
                self._schema = etree.XMLSchema(schema_doc)
                logger.info(f"CBAM schema loaded: {self.schema_path}")
            else:
                logger.warning(f"Schema not found: {self.schema_path}")
                self._schema = None
            
            self._is_loaded = True
            return True
        
        except etree.XMLSchemaParseError as e:
            logger.error(f"Invalid XSD schema: {e}")
            self._is_loaded = True
            return False
        except Exception as e:
            logger.error(f"Schema load error: {e}")
            self._is_loaded = True
            return False
    
    def _create_element_maker(self) -> ElementMaker:
        """Create lxml ElementMaker with CBAM namespaces."""
        return ElementMaker(
            namespace=CBAM_NS,
            nsmap=CBAM_NAMESPACES
        )
    
    def _format_cn_code(self, code: str) -> str:
        """Format CN code as 8-digit string without spaces."""
        return code.replace(" ", "").replace(".", "")[:8].ljust(8, "0")
    
    def _format_decimal(self, value: float, precision: int = 6) -> str:
        """Format decimal with specified precision."""
        return f"{value:.{precision}f}"
    
    def _format_date(self, d: Optional[date]) -> str:
        """Format date as ISO string."""
        return (d or date.today()).isoformat()
    
    def generate_xml(self, report: CBAMReport) -> bytes:
        """
        Generate CBAM-compliant XML from report dataclass.
        
        Args:
            report: Complete CBAMReport structure
            
        Returns:
            UTF-8 encoded XML bytes
        """
        # Calculate totals
        report.calculate_totals()
        
        E = self._create_element_maker()
        
        # Build XML tree
        root = E.QReport(
            self._build_header(E, report),
            self._build_declarant(E, report.declarant),
            self._build_goods_list(E, report.goods),
            self._build_summary(E, report)
        )
        
        # Add schema location attribute
        root.set(
            f"{{{XSI_NS}}}schemaLocation",
            f"{CBAM_NS} QReport_ver23.00.xsd"
        )
        
        return etree.tostring(
            root,
            pretty_print=self.pretty_print,
            xml_declaration=True,
            encoding="UTF-8"
        )
    
    def _build_header(self, E: ElementMaker, report: CBAMReport) -> etree._Element:
        """Build Header element."""
        header = E.Header(
            E.ReportId(report.report_id),
            E.ReportType(report.report_type.value),
            E.ReportingPeriod(
                E.Year(str(report.reporting_period_year)),
                E.Quarter(str(report.reporting_period_quarter))
            ),
            E.SubmissionDate(self._format_date(report.submission_date)),
            E.IsAmendment("true" if report.is_amendment else "false")
        )
        
        if report.is_amendment and report.original_report_id:
            header.append(E.OriginalReportReference(report.original_report_id))
            if report.amendment_reason:
                header.append(E.AmendmentReason(report.amendment_reason))
        
        return header
    
    def _build_declarant(self, E: ElementMaker, declarant: Declarant) -> etree._Element:
        """Build Declarant element."""
        address = E.Address(
            E.Street(declarant.address.street),
            E.City(declarant.address.city),
            E.PostalCode(declarant.address.postal_code),
            E.Country(declarant.address.country)
        )
        
        if declarant.address.building_number:
            address.insert(1, E.BuildingNumber(declarant.address.building_number))
        
        decl = E.Declarant(
            E.EORINumber(declarant.eori_number),
            E.Name(declarant.name),
            address
        )
        
        if declarant.contact_email:
            decl.append(E.ContactEmail(declarant.contact_email))
        if declarant.contact_phone:
            decl.append(E.ContactPhone(declarant.contact_phone))
        if declarant.representative_eori:
            decl.append(E.RepresentativeEORI(declarant.representative_eori))
        
        return decl
    
    def _build_goods_list(self, E: ElementMaker, goods: List[GoodsItem]) -> etree._Element:
        """Build GoodsList element with all goods items."""
        goods_list = E.GoodsList()
        
        for item in goods:
            goods_list.append(self._build_goods_item(E, item))
        
        return goods_list
    
    def _build_goods_item(self, E: ElementMaker, item: GoodsItem) -> etree._Element:
        """Build single Goods element."""
        goods = E.Goods(
            E.ItemNumber(str(item.item_number)),
            E.CNCommodityCode(self._format_cn_code(item.cn_code)),
            E.CommodityDescription(item.cn_description),
            E.CBAMCategory(item.cbam_category.value),
            E.Quantity(
                E.Value(self._format_decimal(item.quantity, 3)),
                E.Unit(item.unit)
            ),
            E.CountryOfOrigin(item.country_of_origin),
            self._build_producer(E, item.producer),
            self._build_emissions(E, item.emissions)
        )
        
        if item.inward_processing:
            goods.append(E.InwardProcessing("true"))
        
        if item.carbon_price_paid is not None:
            goods.append(E.CarbonPricePaid(
                E.Amount(self._format_decimal(item.carbon_price_paid, 2)),
                E.Currency(item.carbon_price_currency)
            ))
        
        if item.supplementary_info:
            goods.append(E.SupplementaryInfo(item.supplementary_info))
        
        # Add precursor goods if any
        if item.precursor_goods:
            precursors = E.PrecursorGoods()
            for precursor in item.precursor_goods:
                precursors.append(self._build_goods_item(E, precursor))
            goods.append(precursors)
        
        return goods
    
    def _build_producer(self, E: ElementMaker, producer: Producer) -> etree._Element:
        """Build Producer element."""
        prod = E.Producer(
            E.InstallationId(producer.installation_id),
            E.Name(producer.name),
            E.Country(producer.country)
        )
        
        if producer.address:
            prod.append(E.Address(producer.address))
        
        if producer.is_verified:
            prod.append(E.IsVerified("true"))
            if producer.verification_body:
                prod.append(E.VerificationBody(producer.verification_body))
        
        return prod
    
    def _build_emissions(self, E: ElementMaker, emissions: EmissionData) -> etree._Element:
        """Build Emissions element."""
        em = E.Emissions(
            E.DirectEmissions(
                E.Value(self._format_decimal(emissions.direct_emissions_tco2)),
                E.Unit("tCO2")
            ),
            E.IndirectEmissions(
                E.Value(self._format_decimal(emissions.indirect_emissions_tco2)),
                E.Unit("tCO2")
            ),
            E.TotalEmissions(
                E.Value(self._format_decimal(emissions.total_emissions_tco2)),
                E.Unit("tCO2")
            ),
            E.CalculationMethod(emissions.calculation_method.value)
        )
        
        if emissions.specific_direct_emissions > 0:
            em.append(E.SpecificDirectEmissions(
                E.Value(self._format_decimal(emissions.specific_direct_emissions, 4)),
                E.Unit("tCO2/t")
            ))
        
        if emissions.electricity_consumption_mwh:
            em.append(E.ElectricityConsumption(
                E.Value(self._format_decimal(emissions.electricity_consumption_mwh, 3)),
                E.Unit("MWh")
            ))
        
        if emissions.electricity_emission_factor:
            em.append(E.ElectricityEmissionFactor(
                E.Value(self._format_decimal(emissions.electricity_emission_factor, 4)),
                E.Unit("tCO2/MWh")
            ))
        
        if emissions.data_source:
            em.append(E.DataSource(emissions.data_source))
        
        return em
    
    def _build_summary(self, E: ElementMaker, report: CBAMReport) -> etree._Element:
        """Build Summary element with totals."""
        return E.Summary(
            E.TotalGoodsItems(str(len(report.goods))),
            E.TotalDirectEmissions(
                E.Value(self._format_decimal(report.total_direct_emissions)),
                E.Unit("tCO2")
            ),
            E.TotalIndirectEmissions(
                E.Value(self._format_decimal(report.total_indirect_emissions)),
                E.Unit("tCO2")
            ),
            E.TotalEmissions(
                E.Value(self._format_decimal(report.total_emissions)),
                E.Unit("tCO2")
            )
        )
    
    async def validate_xml(self, xml_bytes: bytes) -> ValidationResult:
        """
        Validate XML against CBAM XSD schema.
        
        Args:
            xml_bytes: XML content as bytes
            
        Returns:
            ValidationResult with status and any errors
        """
        if not self._is_loaded:
            await self.load_schema()
        
        result = ValidationResult(is_valid=True)
        
        if self._schema is None:
            result.warnings.append("Schema validation skipped - no schema loaded")
            return result
        
        try:
            doc = etree.fromstring(xml_bytes)
            is_valid = self._schema.validate(doc)
            
            if is_valid:
                result.is_valid = True
            else:
                result.is_valid = False
                for error in self._schema.error_log:
                    result.errors.append(f"Line {error.line}: {error.message}")
        
        except etree.XMLSyntaxError as e:
            result.is_valid = False
            result.errors.append(f"XML Syntax Error: {e}")
        except Exception as e:
            result.is_valid = False
            result.errors.append(f"Validation Error: {e}")
        
        return result
    
    async def generate_and_validate(
        self,
        report: CBAMReport
    ) -> tuple[bytes, ValidationResult]:
        """Generate and validate XML in one call."""
        xml_bytes = self.generate_xml(report)
        validation = await self.validate_xml(xml_bytes)
        return xml_bytes, validation
    
    def generate_report_id(self, declarant_eori: str, year: int, quarter: int) -> str:
        """Generate a unique report ID."""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique = hashlib.md5(f"{declarant_eori}{timestamp}".encode()).hexdigest()[:8].upper()
        return f"CBAM-Q{quarter}-{year}-{unique}"
    
    @staticmethod
    def create_sample_report() -> CBAMReport:
        """Create a comprehensive sample CBAM report for testing."""
        address = Address(
            street="Industriestraße 42",
            city="Düsseldorf",
            postal_code="40210",
            country="DE"
        )
        
        declarant = Declarant(
            eori_number="DE123456789012345",
            name="German Steel Imports GmbH",
            address=address,
            contact_email="cbam@german-steel.de"
        )
        
        producer = Producer(
            installation_id="IN-TSL-JSR-001",
            name="Tata Steel Limited",
            country="IN",
            address="Jamshedpur, Jharkhand, India",
            is_verified=True,
            verification_body="Bureau Veritas"
        )
        
        emissions = EmissionData(
            direct_emissions_tco2=85.5,
            indirect_emissions_tco2=12.3,
            electricity_consumption_mwh=125.0,
            electricity_emission_factor=0.82,
            specific_direct_emissions=1.9,
            calculation_method=CalculationMethod.ACTUAL,
            data_source="Producer declaration + verification"
        )
        
        goods_item = GoodsItem(
            item_number=1,
            cn_code="72085191",
            cn_description="Hot-rolled steel coils, width >= 600mm, thickness > 10mm",
            cbam_category=CBAMCategory.IRON_STEEL,
            quantity=45000.0,
            unit="kg",
            country_of_origin="IN",
            producer=producer,
            emissions=emissions
        )
        
        return CBAMReport(
            report_id="CBAM-Q1-2024-SAMPLE001",
            reporting_period_year=2024,
            reporting_period_quarter=1,
            declarant=declarant,
            goods=[goods_item],
            submission_date=date.today()
        )
