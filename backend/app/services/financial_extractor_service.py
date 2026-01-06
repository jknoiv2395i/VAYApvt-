"""
Financial Extractor Service for VAYA Authorize (Module D).
Extracts structured financial data from Balance Sheets and P&L Statements.
Uses AI Vision models (via OpenRouter) to process PDFs and Images.
"""

import base64
import json
import io
from typing import Dict, Any, Optional, List
from fastapi import UploadFile

from app.services.openrouter_service import get_openrouter_service

# User-defined System Prompt for Extraction
SYSTEM_PROMPT = """
Role: You are the VAYA Data Auditor. Your mission is to extract high-fidelity financial data from messy, multi-year financial statements for EU CBAM compliance.

Goal: Extract the following values for 2023, 2024, and 2025.

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "fiscal_years": [
    {
      "year": 2025,
      "currency": "INR",
      "net_profit": 0.0,
      "total_assets": 0.0,
      "total_liabilities": 0.0,
      "total_equity": 0.0,
      "turnover": 0.0,
      "current_assets": 0.0,
      "short_term_liabilities": 0.0
    }
  ],
  "metadata": {
    "entity_name": "String",
    "is_audited": true/false
  }
}

Extraction Rules:
1. If a value is missing, return null. Do not guess.
2. Normalize "Total Equity" as (Share Capital + Reserves & Surplus).
3. Normalize "Total Liabilities" as (Long-term + Short-term Borrowings/Payables).
4. Do NOT output markdown code blocks. Just the raw JSON.
"""

class FinancialExtractorService:
    """Service for extracting financial data from documents using AI."""
    
    def __init__(self):
        self.ai_service = get_openrouter_service()
        # Use a vision-capable model
        self.vision_model = "google/gemini-flash-1.5"  # Cost-effective, good vision
    
    async def extract_from_file(
        self,
        file_content: bytes,
        content_type: str,
        document_type: str = "financials" # Generalized
    ) -> Dict[str, Any]:
        """
        Extract financial data from a file (PDF or Image).
        """
        # Prepare content for AI model
        if content_type == "application/pdf":
            try:
                # Try PyPDF2 for text extraction
                import PyPDF2
                pdf_file = io.BytesIO(file_content)
                reader = PyPDF2.PdfReader(pdf_file)
                text_content = ""
                for page in reader.pages[:4]: # Read first 4 pages
                    text_content += page.extract_text() + "\n"
                
                if len(text_content.strip()) > 50:
                    return await self._extract_from_text(text_content)
            except ImportError:
                pass
                
            return {
                "success": False,
                "error": "PDF processing requires pypdf. Please upload image for now."
            }
            
        elif content_type.startswith("image/"):
            # Image processing via Vison LLM
            base64_image = base64.b64encode(file_content).decode('utf-8')
            return await self._extract_from_image(base64_image, content_type)
            
        else:
            return {
                "success": False,
                "error": f"Unsupported file type: {content_type}"
            }

    async def _extract_from_text(self, text: str) -> Dict[str, Any]:
        """Extract data from raw text using standard LLM."""
        full_prompt = f"Analyze this financial document text:\n\n{text[:15000]}"
        
        # Use the existing AI service's generation
        response = await self.ai_service.generate(
            prompt=full_prompt,
            system_prompt=SYSTEM_PROMPT,
            temperature=0.0
        )
        
        return self._parse_json_response(response)

    async def _extract_from_image(self, base64_image: str, mime_type: str) -> Dict[str, Any]:
        """Extract data from image using Vision LLM."""
        
        import httpx
        
        url = f"{self.ai_service.base_url}/chat/completions"
        
        payload = {
            "model": self.vision_model,
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract the financial data from this image according to the rules."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "temperature": 0.0
        }
        
        headers = {
            "Authorization": f"Bearer {self.ai_service.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://vaya.trade",
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                if "choices" in data and len(data["choices"]) > 0:
                    content = data["choices"][0]["message"]["content"]
                    return self._parse_json_response(content)
                
                return {"success": False, "error": "No response from vision model"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}

    def _parse_json_response(self, content: str) -> Dict[str, Any]:
        """Clean and parse JSON from LLM response."""
        try:
            # Strip key markdown
            clean_content = content.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_content)
            
            return {
                "success": True,
                "data": data
            }
        except json.JSONDecodeError:
            return {
                "success": False,
                "error": "Failed to parse JSON",
                "raw_response": content
            }
