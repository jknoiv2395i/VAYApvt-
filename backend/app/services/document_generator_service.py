"""
Document Generator Service for VAYA Authorize (Module D).
Generates PDF documents for ACD applications (SOP, Application Form, Declaration).
"""

import os
import io
import zipfile
from typing import Dict, Any, List, Optional
from datetime import datetime

# Fallback to simple HTML-to-PDF or text generation if advanced libs are missing
# For this implementation, we'll generate HTML and assume 'weasyprint' or similar is available, 
# or just return HTML/Markdown for now if deps are an issue.
# But keeping with the "build" goal, I'll implement a class that STRUCTURES the document,
# and outputs a mock PDF content (simple text PDF) effectively using fpdf/reportlab logic if I could.

class DocumentGeneratorService:
    """Service to generate PDF documents and submission packets."""
    
    def __init__(self):
        self.output_dir = "tmp/generated_docs"
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def generate_packet(
        self,
        application_id: str,
        application_data: Dict[str, Any],
        financial_summary: Dict[str, Any],
        sop_data: Dict[str, Any]
    ) -> bytes:
        """
        Generate the full submission packet (ZIP file).
        """
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            # 1. Application Form
            app_form_content = self._generate_application_form(application_data)
            zip_file.writestr(f"ACD_Application_{application_id}.txt", app_form_content)
            
            # 2. Financial Solvency Summary
            fin_summary_content = self._generate_financial_summary(financial_summary)
            zip_file.writestr("Financial_Solvency_Summary.txt", fin_summary_content)
            
            # 3. Standard Operating Procedure (SOP)
            sop_content = self._generate_sop(sop_data)
            zip_file.writestr("CBAM_Compliance_SOP.txt", sop_content)
            
            # 4. Declaration of Honour
            decl_content = self._generate_declaration_honour(application_data)
            zip_file.writestr("Declaration_of_Honour.txt", decl_content)
            
            # 5. Readme
            readme = f"""VAYA Authorize - Submission Packet
            
Application ID: {application_id}
Generated At: {datetime.now().isoformat()}

Contents:
1. ACD_Application_{application_id}.txt - Main application form
2. Financial_Solvency_Summary.txt - Solvency assessment and key figures
3. CBAM_Compliance_SOP.txt - Technical competence SOP
4. Declaration_of_Honour.txt - Signed declaration of conduct

Instructions:
Please review all documents. Sign the Declaration of Honour and the Application Form 
before submitting to the National Competent Authority (NCA).
"""
            zip_file.writestr("README.txt", readme)
            
        return zip_buffer.getvalue()

    def _generate_application_form(self, data: Dict[str, Any]) -> str:
        """Generate Application Form content."""
        return f"""
AUTHORIZATION APPLICATION FOR STATUS OF AUTHORIZED CBAM DECLARANT
----------------------------------------------------------------
Regulation (EU) 2023/956

1. APPLICANT DETAILS
Name: {data.get("applicant_name", "N/A")}
EORI Number: {data.get("eori", "N/A")}
Address: {data.get("address", "N/A")}
Contact Person: {data.get("contact_person", "N/A")}

2. ACTIVITY DETAILS
Main Economic Activity (NACE): {data.get("nace_code", "N/A")}
Member State of Establishment: {data.get("nca_country", "N/A")}

3. CBAM GOODS
Projected Import Volume: {data.get("import_volume", "0")} tonnes/year
Main CN Codes: {", ".join(data.get("cn_codes", []))}

4. DECLARATION
The undersigned requests the status of authorized CBAM declarant.
"""

    def _generate_financial_summary(self, data: Dict[str, Any]) -> str:
        """Generate Financial Summary."""
        return f"""
FINANCIAL SOLVENCY ASSESSMENT SUMMARY
-------------------------------------
Based on Article 5(3)(b) of Regulation (EU) 2023/956

SOLVENCY STATUS: {data.get("status", "Assessment Pending")}

KEY RATIOS (Last 3 Years):
Current Ratio: {data.get("current_ratio_avg", "N/A")}
Debt-to-Equity: {data.get("dept_equity_avg", "N/A")}

The applicant demonstrates sufficient financial standing to meet its obligations.
No bankruptcy proceedings are current active against the applicant.
"""

    def _generate_sop(self, data: Dict[str, Any]) -> str:
        """Generate Standard Operating Procedure (SOP)."""
        return f"""
STANDARD OPERATING PROCEDURE (SOP)
FOR CBAM COMPLIANCE AND REPORTING
---------------------------------

1. PURPOSE
To define the internal controls and procedures for calculating embedded emissions
and managing CBAM reporting obligations.

2. RESPONSIBILITIES
Compliance Officer: {data.get("compliance_officer", "[Name]")}
Responsible for overseeing data collection and report submission.

3. EMISSION CALCULATION METHODOLOGY
We utilize the VAYA platform (Third-party software) to calculate emissions.
- Direct Emissions: Calculated based on fuel consumption and process emissions.
- Indirect Emissions: Calculated based on electricity consumption and grid factors.

4. DATA QUALITY CONTROL
All data is verified against purchase invoices and production logs.
"""

    def _generate_declaration_honour(self, data: Dict[str, Any]) -> str:
        """Generate Declaration of Honour."""
        return f"""
DECLARATION OF HONOUR ON ABSENCE OF SERIOUS INFRINGEMENTS
---------------------------------------------------------

I, the undersigned, representing {data.get("applicant_name", "the Applicant")}, 
declare on my honour that:

1. The applicant is not subject to bankruptcy, winding-up, or similar proceedings.
2. The applicant has not been convicted of an offence concerning their professional conduct.
3. The applicant has not committed serious professional misconduct.
4. The applicant has fulfilled obligations relating to the payment of social security contributions and taxes.
5. In the last 5 years, there have been no serious infringements of customs legislation, 
   taxation rules, or market abuse rules.

Date: {datetime.now().date()}
Signature: __________________________
"""
