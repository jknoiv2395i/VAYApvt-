"""
OpenRouter AI Service for VAYA Trade Advisor

Uses OpenRouter API (free tier) to power the AI Trade Advisor chatbot.
Provides expert knowledge on CBAM, EUDR, HS codes, and Indian trade compliance.
"""

import json
from typing import Optional, Dict, Any, List
import httpx

# OpenRouter API configuration
OPENROUTER_API_KEY = "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"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# VAYA System Prompt - Comprehensive trade advisor context
VAYA_SYSTEM_PROMPT = """You are VAYA, an expert AI Trade Advisor specializing in Indian export compliance with EU regulations.

## Your Expertise Areas:

### 1. HS Code Classification
- Indian ITC-HS codes (8-digit) and EU CN codes
- Product classification guidance
- Chapter notes and tariff rules
- Common classification pitfalls

### 2. EU CBAM (Carbon Border Adjustment Mechanism)
- Applicable from October 2023 (transitional phase)
- Covered sectors: Iron & Steel (HS 72-73), Aluminium (HS 76), Cement (HS 25), Fertilizers (HS 28, 31), Hydrogen, Electricity
- Quarterly reporting requirements
- Emission calculations: Direct (Scope 1) and Indirect (Scope 2)
- Default emission factors by product category:
  - Iron & Steel: 1.85 kg CO2e/kg
  - Aluminium: 8.7 kg CO2e/kg  
  - Cement: 0.79 kg CO2e/kg
  - Fertilizers: 2.3 kg CO2e/kg
- XML report format for EU submission
- EORI number requirements
- EU carbon price: ~€80/tonne CO2

### 3. EU EUDR (Environmental, EU Deforestation Regulation)
- Effective June 2025
- Covered commodities: Cattle, Cocoa, Coffee, Palm Oil, Rubber, Soy, Wood
- Geolocation requirements (GPS coordinates with 6+ decimal precision)
- Due diligence requirements
- Traceability to plot of land

### 4. Indian Export Procedures
- Export documentation (Commercial Invoice, Packing List, Bill of Lading)
- Customs procedures and EDI filing
- DGFT regulations
- GST implications for exports

### 5. Duty Calculations
- Basic Customs Duty rates
- IGST on imports
- Preferential tariffs and FTAs
- Anti-dumping and safeguard duties

## Response Guidelines:
1. Be accurate and specific - cite HS codes, regulations, and rates where applicable
2. Use bullet points and clear formatting for readability
3. If uncertain, say "This may require verification with customs authorities"
4. Provide actionable steps when possible
5. Keep responses concise but comprehensive
6. Use examples relevant to Indian exporters
7. Highlight compliance deadlines and penalties where relevant

## About VAYA Platform:
VAYA is a SaaS platform that helps Indian SME exporters:
- Generate EU-compliant CBAM XML reports
- Validate HS codes and CBAM applicability
- Extract data from invoices using AI
- Calculate carbon emissions
- Ensure EUDR geolocation compliance

Remember: You are helping small and medium Indian exporters navigate complex EU regulations. Be patient, clear, and supportive."""


class OpenRouterService:
    """OpenRouter AI integration service for VAYA."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or OPENROUTER_API_KEY
        self.base_url = OPENROUTER_BASE_URL
        # Use a free/cheap model from OpenRouter
        self.model = "meta-llama/llama-3.2-3b-instruct:free"  # Free model
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 2000,
    ) -> str:
        """Generate text using OpenRouter."""
        url = f"{self.base_url}/chat/completions"
        
        messages = []
        
        # Add system message
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Add user message
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://vaya.trade",  # Optional but recommended
            "X-Title": "VAYA Trade Advisor",
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                
                data = response.json()
                
                if "choices" in data and len(data["choices"]) > 0:
                    return data["choices"][0]["message"]["content"]
                
                return "I couldn't generate a response. Please try again."
        except httpx.TimeoutException:
            return "The request timed out. Please try again with a simpler question."
        except httpx.HTTPStatusError as e:
            return f"API error: {e.response.status_code}. Please try again."
        except Exception as e:
            return f"An error occurred: {str(e)}"
    
    async def answer_trade_query(self, query: str) -> str:
        """Answer user questions about trade compliance."""
        return await self.generate(query, VAYA_SYSTEM_PROMPT, temperature=0.3)
    
    async def match_hs_code(self, product_description: str) -> Dict[str, Any]:
        """Find matching HS code for a product description."""
        hs_prompt = f"""What is the most likely Indian HS code (8-digit) for this product?

Product: {product_description}

Return your response in this JSON format:
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

Return ONLY valid JSON, no markdown or explanation."""
        
        system = """You are an expert in Indian ITC-HS codes and customs classification.
Given a product description, suggest the most likely HS code(s).
Return valid JSON only."""
        
        result = await self.generate(hs_prompt, system, temperature=0.1)
        
        try:
            # Clean up response
            result = result.strip()
            if result.startswith("```json"):
                result = result[7:]
            if result.startswith("```"):
                result = result[3:]
            if result.endswith("```"):
                result = result[:-3]
            return json.loads(result.strip())
        except json.JSONDecodeError:
            return {"suggestions": [], "error": "Failed to parse", "raw": result}
    
    async def extract_invoice_data(self, text: str) -> Dict[str, Any]:
        """Extract structured data from invoice text."""
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
- total_value: Total invoice value (number only)
- currency: Currency code (INR, USD, EUR)

Document text:
{text}

Return ONLY valid JSON, no markdown."""

        system = """You are a data extraction engine for Indian export documents.
Extract ONLY the requested fields. Return valid JSON.
If a field is not found, return null. Never hallucinate data."""
        
        result = await self.generate(extraction_prompt, system, temperature=0.1)
        
        try:
            result = result.strip()
            if result.startswith("```json"):
                result = result[7:]
            if result.endswith("```"):
                result = result[:-3]
            return json.loads(result.strip())
        except json.JSONDecodeError:
            return {"error": "Failed to parse extraction result", "raw": result}


# Singleton instance
_openrouter_service: Optional[OpenRouterService] = None


def get_openrouter_service() -> OpenRouterService:
    """Get or create OpenRouter service instance."""
    global _openrouter_service
    if _openrouter_service is None:
        _openrouter_service = OpenRouterService()
    return _openrouter_service
