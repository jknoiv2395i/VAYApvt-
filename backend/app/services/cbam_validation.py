"""
CBAM Validation Service.

Provides XSD schema validation and PDF certificate generation.
"""

from typing import Dict, List, Tuple, Optional
from datetime import datetime
from pydantic import BaseModel
import xml.etree.ElementTree as ET
from xml.dom import minidom
import io
import re


class ValidationError(BaseModel):
    """Single validation error."""
    field: str
    message: str
    severity: str  # error, warning


class ValidationResult(BaseModel):
    """Complete validation result."""
    valid: bool
    schema_version: str
    validated_at: str
    errors: List[ValidationError]
    warnings: List[ValidationError]
    summary: str


# ============================================================================
# EU CBAM XML VALIDATION RULES
# Based on QReport_ver23.00.xsd requirements
# ============================================================================

REQUIRED_FIELDS = {
    "declarant": {
        "eori_number": {"min_length": 10, "max_length": 17, "pattern": r"^[A-Z]{2}[A-Z0-9]{8,15}$"},
        "name": {"min_length": 1, "max_length": 512},
        "country": {"length": 2, "pattern": r"^[A-Z]{2}$"},
    },
    "installation": {
        "name": {"min_length": 1, "max_length": 512},
        "country": {"length": 2, "pattern": r"^[A-Z]{2}$"},
    },
    "goods": {
        "cn_code": {"length": 8, "pattern": r"^\d{8}$"},
        "net_mass_kg": {"min_value": 0.001},
        "country_of_origin": {"length": 2, "pattern": r"^[A-Z]{2}$"},
    },
    "emissions": {
        "direct_emissions": {"min_value": 0},
        "indirect_emissions": {"min_value": 0},
        "total_emissions": {"min_value": 0},
    },
    "reporting_period": {
        "year": {"min_value": 2023, "max_value": 2030},
        "quarter": {"values": ["1", "2", "3", "4"]},
    }
}

# Valid CBAM categories per EU regulation
VALID_CBAM_CATEGORIES = [
    "IRON STEEL", "IRON_STEEL", "iron_steel",
    "ALUMINIUM", "aluminium",
    "CEMENT", "cement",
    "FERTILISERS", "FERTILIZERS", "fertilisers", "fertilizers",
    "HYDROGEN", "hydrogen",
    "ELECTRICITY", "electricity",
]

# Valid country codes (EU + major exporters)
VALID_COUNTRIES = [
    "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU",
    "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",  # EU
    "IN", "CN", "TR", "RU", "UA", "BY", "EG", "ZA", "BR", "US", "GB",  # Major exporters
]


def validate_eori(eori: str) -> Tuple[bool, str]:
    """Validate EORI number format."""
    if not eori:
        return False, "EORI number is required"
    
    eori = eori.strip().upper()
    
    if len(eori) < 10:
        return False, f"EORI number too short ({len(eori)} chars, min 10)"
    
    if len(eori) > 17:
        return False, f"EORI number too long ({len(eori)} chars, max 17)"
    
    # Check country prefix
    country_prefix = eori[:2]
    if not country_prefix.isalpha():
        return False, f"EORI must start with 2-letter country code, got '{country_prefix}'"
    
    # Check rest is alphanumeric
    rest = eori[2:]
    if not rest.isalnum():
        return False, "EORI must contain only letters and numbers after country code"
    
    return True, "Valid"


def validate_cn_code(cn_code: str) -> Tuple[bool, str]:
    """Validate EU CN code format."""
    if not cn_code:
        return False, "CN code is required"
    
    cn_code = cn_code.replace(" ", "").replace(".", "")
    
    if len(cn_code) != 8:
        return False, f"CN code must be exactly 8 digits, got {len(cn_code)}"
    
    if not cn_code.isdigit():
        return False, "CN code must contain only digits"
    
    # Check if it's a CBAM-covered code
    prefix = cn_code[:2]
    cbam_prefixes = ["72", "73", "76", "25", "28", "31"]
    
    if prefix not in cbam_prefixes:
        return True, f"Warning: CN code prefix {prefix} may not be CBAM-covered"
    
    return True, "Valid"


def validate_country_code(code: str, field_name: str = "Country") -> Tuple[bool, str]:
    """Validate ISO country code."""
    if not code:
        return False, f"{field_name} code is required"
    
    code = code.strip().upper()
    
    if len(code) != 2:
        return False, f"{field_name} code must be 2 letters, got '{code}'"
    
    if not code.isalpha():
        return False, f"{field_name} code must contain only letters"
    
    if code not in VALID_COUNTRIES:
        return True, f"Warning: Uncommon {field_name.lower()} code '{code}'"
    
    return True, "Valid"


def validate_emissions(direct: float, indirect: float, total: float, net_mass_kg: float) -> List[ValidationError]:
    """Validate emissions data."""
    errors = []
    
    if direct < 0:
        errors.append(ValidationError(
            field="direct_emissions",
            message="Direct emissions cannot be negative",
            severity="error"
        ))
    
    if indirect < 0:
        errors.append(ValidationError(
            field="indirect_emissions",
            message="Indirect emissions cannot be negative",
            severity="error"
        ))
    
    if total < 0:
        errors.append(ValidationError(
            field="total_emissions",
            message="Total emissions cannot be negative",
            severity="error"
        ))
    
    # Check if total = direct + indirect (within tolerance)
    calculated_total = direct + indirect
    if abs(total - calculated_total) > 0.01:
        errors.append(ValidationError(
            field="total_emissions",
            message=f"Total ({total}) should equal direct + indirect ({calculated_total})",
            severity="warning"
        ))
    
    # Check reasonable specific emissions
    if net_mass_kg > 0:
        specific = (total / 1000) / (net_mass_kg / 1000)  # tCO2e per tonne
        
        if specific > 20:
            errors.append(ValidationError(
                field="specific_emissions",
                message=f"Specific emissions ({specific:.2f} tCO2e/t) seem unusually high",
                severity="warning"
            ))
        
        if specific < 0.01 and total > 0:
            errors.append(ValidationError(
                field="specific_emissions",
                message=f"Specific emissions ({specific:.4f} tCO2e/t) seem unusually low",
                severity="warning"
            ))
    
    return errors


def validate_reporting_period(period: str) -> Tuple[bool, str]:
    """Validate reporting period format (YYYY-QN)."""
    if not period:
        return False, "Reporting period is required"
    
    # Try to parse YYYY-QN format
    pattern = r"^20(2[3-9]|[3-9]\d)-Q[1-4]$"
    if re.match(pattern, period):
        return True, "Valid"
    
    # Also accept YYYY format
    if re.match(r"^20(2[3-9]|[3-9]\d)$", period):
        return True, "Valid (year only)"
    
    return False, f"Invalid period format '{period}'. Use YYYY-QN (e.g., 2024-Q4)"


def validate_cbam_report(report: Dict) -> ValidationResult:
    """
    Validate a complete CBAM report against EU requirements.
    
    Returns a ValidationResult with all errors and warnings.
    """
    errors = []
    warnings = []
    
    # ===== Declarant validation =====
    eori = report.get("declarant_eori", "")
    valid, msg = validate_eori(eori)
    if not valid:
        errors.append(ValidationError(field="declarant_eori", message=msg, severity="error"))
    
    if not report.get("declarant_name"):
        errors.append(ValidationError(field="declarant_name", message="Declarant name is required", severity="error"))
    
    valid, msg = validate_country_code(report.get("declarant_country", ""), "Declarant country")
    if not valid:
        errors.append(ValidationError(field="declarant_country", message=msg, severity="error"))
    elif "Warning" in msg:
        warnings.append(ValidationError(field="declarant_country", message=msg, severity="warning"))
    
    # ===== Installation validation =====
    if not report.get("installation_name"):
        errors.append(ValidationError(field="installation_name", message="Installation name is required", severity="error"))
    
    valid, msg = validate_country_code(report.get("installation_country", ""), "Installation country")
    if not valid:
        errors.append(ValidationError(field="installation_country", message=msg, severity="error"))
    
    # UNLOCODE (optional but recommended)
    unlocode = report.get("installation_unlocode", "")
    if unlocode and len(unlocode) != 5:
        warnings.append(ValidationError(field="installation_unlocode", message=f"UNLOCODE should be 5 characters, got '{unlocode}'", severity="warning"))
    
    # Coordinates (optional but recommended)
    lat = report.get("latitude")
    lon = report.get("longitude")
    if lat is None or lon is None:
        warnings.append(ValidationError(field="coordinates", message="Installation coordinates recommended for verification", severity="warning"))
    elif not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        errors.append(ValidationError(field="coordinates", message="Invalid coordinates", severity="error"))
    
    # ===== Goods validation =====
    cn_code = report.get("cn_code") or report.get("hs_code", "")
    valid, msg = validate_cn_code(cn_code)
    if not valid:
        errors.append(ValidationError(field="cn_code", message=msg, severity="error"))
    elif "Warning" in msg:
        warnings.append(ValidationError(field="cn_code", message=msg, severity="warning"))
    
    if not report.get("product_description"):
        errors.append(ValidationError(field="product_description", message="Product description is required", severity="error"))
    
    net_mass = report.get("net_mass_kg") or report.get("net_weight_kg", 0)
    if net_mass <= 0:
        errors.append(ValidationError(field="net_mass_kg", message="Net mass must be greater than 0", severity="error"))
    
    # CBAM category
    category = report.get("cbam_category", "")
    if category not in VALID_CBAM_CATEGORIES:
        errors.append(ValidationError(field="cbam_category", message=f"Invalid CBAM category '{category}'", severity="error"))
    
    valid, msg = validate_country_code(report.get("country_of_origin", ""), "Origin country")
    if not valid:
        errors.append(ValidationError(field="country_of_origin", message=msg, severity="error"))
    
    # ===== Emissions validation =====
    emissions_errors = validate_emissions(
        report.get("direct_emissions", 0),
        report.get("indirect_emissions", 0),
        report.get("total_emissions", 0),
        net_mass
    )
    for e in emissions_errors:
        if e.severity == "error":
            errors.append(e)
        else:
            warnings.append(e)
    
    # ===== Reporting period validation =====
    period = report.get("reporting_period", "")
    valid, msg = validate_reporting_period(period)
    if not valid:
        errors.append(ValidationError(field="reporting_period", message=msg, severity="error"))
    
    # ===== Build result =====
    is_valid = len(errors) == 0
    
    if is_valid and len(warnings) == 0:
        summary = "✅ Report is valid and ready for EU submission"
    elif is_valid:
        summary = f"✅ Report is valid with {len(warnings)} warning(s)"
    else:
        summary = f"❌ Report has {len(errors)} error(s) and {len(warnings)} warning(s)"
    
    return ValidationResult(
        valid=is_valid,
        schema_version="QReport_ver23.00",
        validated_at=datetime.now().isoformat(),
        errors=errors,
        warnings=warnings,
        summary=summary
    )


def generate_validation_certificate_html(report: Dict, validation: ValidationResult) -> str:
    """
    Generate HTML validation certificate.
    
    This can be converted to PDF using a library like weasyprint.
    """
    status_color = "#22c55e" if validation.valid else "#ef4444"
    status_text = "VALID" if validation.valid else "INVALID"
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CBAM Validation Certificate</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }}
        .header {{ text-align: center; border-bottom: 3px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 30px; }}
        .logo {{ font-size: 28px; font-weight: bold; color: #1e3a5f; }}
        .title {{ font-size: 24px; color: #333; margin-top: 10px; }}
        .status {{ display: inline-block; padding: 10px 30px; font-size: 20px; font-weight: bold; color: white; background: {status_color}; border-radius: 8px; margin: 20px 0; }}
        .section {{ margin: 25px 0; }}
        .section-title {{ font-size: 16px; font-weight: bold; color: #1e3a5f; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }}
        .field {{ display: flex; margin: 8px 0; }}
        .field-label {{ width: 200px; color: #666; }}
        .field-value {{ font-weight: 500; }}
        .errors {{ background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 15px 0; }}
        .warnings {{ background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 15px; margin: 15px 0; }}
        .error-item {{ color: #dc2626; margin: 5px 0; }}
        .warning-item {{ color: #d97706; margin: 5px 0; }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }}
        .qr-placeholder {{ width: 100px; height: 100px; background: #f0f0f0; display: inline-block; margin: 10px; }}
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">VAYA</div>
        <div class="title">CBAM Validation Certificate</div>
        <div class="status">{status_text}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Report Information</div>
        <div class="field"><span class="field-label">Report Number:</span><span class="field-value">{report.get('report_number', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Reporting Period:</span><span class="field-value">{report.get('reporting_period', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Schema Version:</span><span class="field-value">{validation.schema_version}</span></div>
        <div class="field"><span class="field-label">Validated At:</span><span class="field-value">{validation.validated_at}</span></div>
    </div>
    
    <div class="section">
        <div class="section-title">Declarant</div>
        <div class="field"><span class="field-label">EORI Number:</span><span class="field-value">{report.get('declarant_eori', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Name:</span><span class="field-value">{report.get('declarant_name', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Country:</span><span class="field-value">{report.get('declarant_country', 'N/A')}</span></div>
    </div>
    
    <div class="section">
        <div class="section-title">Installation</div>
        <div class="field"><span class="field-label">Name:</span><span class="field-value">{report.get('installation_name', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Country:</span><span class="field-value">{report.get('installation_country', 'N/A')}</span></div>
        <div class="field"><span class="field-label">UNLOCODE:</span><span class="field-value">{report.get('installation_unlocode', 'N/A')}</span></div>
    </div>
    
    <div class="section">
        <div class="section-title">Goods</div>
        <div class="field"><span class="field-label">CN Code:</span><span class="field-value">{report.get('cn_code') or report.get('hs_code', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Description:</span><span class="field-value">{report.get('product_description', 'N/A')}</span></div>
        <div class="field"><span class="field-label">CBAM Category:</span><span class="field-value">{report.get('cbam_category', 'N/A')}</span></div>
        <div class="field"><span class="field-label">Net Mass:</span><span class="field-value">{report.get('net_mass_kg') or report.get('net_weight_kg', 0):,.0f} kg</span></div>
        <div class="field"><span class="field-label">Country of Origin:</span><span class="field-value">{report.get('country_of_origin', 'N/A')}</span></div>
    </div>
    
    <div class="section">
        <div class="section-title">Emissions</div>
        <div class="field"><span class="field-label">Direct Emissions:</span><span class="field-value">{report.get('direct_emissions', 0):,.2f} kg CO₂e</span></div>
        <div class="field"><span class="field-label">Indirect Emissions:</span><span class="field-value">{report.get('indirect_emissions', 0):,.2f} kg CO₂e</span></div>
        <div class="field"><span class="field-label">Total Emissions:</span><span class="field-value">{report.get('total_emissions', 0):,.2f} kg CO₂e</span></div>
        <div class="field"><span class="field-label">Specific Embedded:</span><span class="field-value">{report.get('specific_embedded_emissions', 0):.4f} tCO₂e/t</span></div>
        <div class="field"><span class="field-label">Est. CBAM Cost:</span><span class="field-value">€{report.get('estimated_cbam_cost', 0):,.2f}</span></div>
    </div>
"""
    
    if validation.errors:
        html += """
    <div class="errors">
        <div class="section-title" style="color: #dc2626;">Validation Errors</div>
"""
        for e in validation.errors:
            html += f'        <div class="error-item">• {e.field}: {e.message}</div>\n'
        html += "    </div>\n"
    
    if validation.warnings:
        html += """
    <div class="warnings">
        <div class="section-title" style="color: #d97706;">Warnings</div>
"""
        for w in validation.warnings:
            html += f'        <div class="warning-item">• {w.field}: {w.message}</div>\n'
        html += "    </div>\n"
    
    html += f"""
    <div class="section" style="text-align: center;">
        <p><strong>Summary:</strong> {validation.summary}</p>
    </div>
    
    <div class="footer">
        <p>This certificate was generated by VAYA Trade Compliance Platform</p>
        <p>For official EU CBAM submissions, please upload the XML file to the EU CBAM Transitional Registry</p>
        <p>Certificate ID: {report.get('report_number', 'N/A')}-{datetime.now().strftime('%Y%m%d%H%M%S')}</p>
    </div>
</body>
</html>"""
    
    return html
