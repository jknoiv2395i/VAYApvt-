"""
Google Gemini AI Service for VAYA

Used for:
- Document OCR and data extraction
- HS code description matching
- User query understanding
"""

import json
from typing import Optional, Dict, Any
import httpx
from app.core.config import settings


class GeminiService:
    """Google Gemini AI integration service."""
    
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
    MODEL = "gemini-1.5-flash"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("Gemini API key not configured")
    
    async def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 2000,
    ) -> str:
        """Generate text using Gemini."""
        url = f"{self.BASE_URL}/{self.MODEL}:generateContent?key={self.api_key}"
        
        contents = [{"parts": [{"text": prompt}]}]
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            }
        }
        
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            if "candidates" in data and len(data["candidates"]) > 0:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            
            return ""
    
    async def extract_invoice_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from invoice text."""
        system_prompt = """You are a data extraction engine specialized in Indian export documents.
Extract ONLY the requested fields. Return valid JSON matching the schema.
If a field is not found, return null. Never hallucinate data."""

        extraction_prompt = f"""Extract the following fields from this commercial invoice:

Fields to extract:
- invoice_number: Invoice or document number
- invoice_date: Date in YYYY-MM-DD format
- supplier_name: Name of the exporter/seller
- buyer_name: Name of the importer/buyer
- hs_code: 8-digit HS code (e.g., 73181500)
- product_description: Product description
- quantity: Numeric quantity
- quantity_unit: Unit of measurement (KGS, NOS, etc.)
- net_weight_kg: Net weight in kilograms
- gross_weight_kg: Gross weight in kilograms
- total_value: Total invoice value (number only)
- currency: Currency code (INR, USD, EUR)
- country_of_origin: Country code (IN, CN, etc.)

Document text:
{text}

Return ONLY valid JSON, no markdown or explanation."""

        result = await self.generate(extraction_prompt, system_prompt)
        
        # Parse JSON response
        try:
            # Clean up response
            result = result.strip()
            if result.startswith("```json"):
                result = result[7:]
            if result.endswith("```"):
                result = result[:-3]
            return json.loads(result.strip())
        except json.JSONDecodeError:
            return {"error": "Failed to parse extraction result", "raw": result}
    
    async def match_hs_code(self, product_description: str) -> Dict[str, Any]:
        """Find matching HS code for a product description."""
        system_prompt = """You are an expert in Indian ITC-HS codes and customs classification.
Given a product description, suggest the most likely HS code(s).
Return JSON with: hs_code, description, confidence (high/medium/low), reasoning."""

        prompt = f"""What is the most likely Indian HS code (8-digit) for this product?

Product: {product_description}

Return JSON with format:
{{
  "suggestions": [
    {{
      "hs_code": "XXXXXXXX",
      "description": "Official HS code description",
      "confidence": "high|medium|low",
      "cbam_category": "iron_steel|aluminium|cement|fertilisers|null",
      "reasoning": "Why this code was chosen"
    }}
  ]
}}

Return ONLY valid JSON."""

        result = await self.generate(prompt, system_prompt)
        
        try:
            result = result.strip()
            if result.startswith("```json"):
                result = result[7:]
            if result.endswith("```"):
                result = result[:-3]
            return json.loads(result.strip())
        except json.JSONDecodeError:
            return {"suggestions": [], "error": "Failed to parse", "raw": result}
    
    async def answer_trade_query(self, query: str) -> str:
        """Answer user questions about trade compliance."""
        system_prompt = """You are VAYA, an AI assistant for Indian exporters navigating EU trade regulations.
You specialize in:
- HS Code classification
- EU CBAM (Carbon Border Adjustment Mechanism)
- EU EUDR (Deforestation Regulation)
- Indian customs and export procedures

Be helpful, concise, and accurate. If unsure, say so."""

        return await self.generate(query, system_prompt, temperature=0.3)


# Singleton instance
_gemini_service: Optional[GeminiService] = None


def get_gemini_service() -> GeminiService:
    """Get or create Gemini service instance."""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
