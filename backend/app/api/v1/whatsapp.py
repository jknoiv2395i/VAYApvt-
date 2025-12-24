"""
WhatsApp Bot Integration via Twilio

Handles incoming WhatsApp messages for:
- HS code lookup
- Trade compliance questions
- CBAM report status
"""

from fastapi import APIRouter, Form, Request, Response
from typing import Optional
import httpx

from app.core.config import settings
from app.services.gemini_service import get_gemini_service

router = APIRouter()


def send_whatsapp_reply(to: str, message: str) -> bool:
    """Send a WhatsApp message via Twilio."""
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_WHATSAPP_NUMBER]):
        return False
    
    url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    
    # Sync request for simplicity in webhook context
    import requests
    response = requests.post(
        url,
        auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
        data={
            "From": f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
            "To": to,
            "Body": message
        }
    )
    return response.status_code == 201


def format_hs_code_response(suggestions: list) -> str:
    """Format HS code suggestions for WhatsApp."""
    if not suggestions:
        return "❌ No matching HS codes found. Try a different description."
    
    response = "🔍 *HS Code Suggestions*\n\n"
    for i, s in enumerate(suggestions, 1):
        cbam = "⚠️ CBAM" if s.get("cbam_category") else "✅ No CBAM"
        response += f"{i}. *{s['hs_code']}*\n"
        response += f"   {s['description']}\n"
        response += f"   Confidence: {s['confidence']} | {cbam}\n\n"
    
    response += "_Reply with the HS code number for more details_"
    return response


async def handle_hs_lookup(query: str) -> str:
    """Handle HS code lookup request."""
    try:
        service = get_gemini_service()
        result = await service.match_hs_code(query)
        suggestions = result.get("suggestions", [])
        return format_hs_code_response(suggestions)
    except Exception as e:
        return f"⚠️ Error looking up HS code: {str(e)}"


async def handle_trade_question(question: str) -> str:
    """Handle trade compliance question."""
    try:
        service = get_gemini_service()
        answer = await service.answer_trade_query(question)
        return f"💡 *VAYA Assistant*\n\n{answer}"
    except Exception as e:
        return f"⚠️ Error: {str(e)}"


def get_welcome_message() -> str:
    """Return welcome message for new users."""
    return """👋 *Welcome to VAYA!*

I'm your AI assistant for EU trade compliance.

*What I can help with:*
• 🔍 HS Code Lookup - Send product name
• 📋 CBAM Questions - Ask about carbon reporting
• 🌳 EUDR Guidance - Deforestation compliance

*Quick Commands:*
• Send "HS: steel screw" for HS code lookup
• Send "CBAM: what is it?" for CBAM info
• Send "help" for full menu

_Powered by VAYA - Trade Compliance Made Simple_"""


def get_help_message() -> str:
    """Return help menu."""
    return """📚 *VAYA Help Menu*

*HS Code Lookup*
Send: `HS: [product description]`
Example: `HS: galvanized steel sheet`

*Trade Questions*
Send: `Q: [your question]`
Example: `Q: Is cement covered by CBAM?`

*CBAM Information*
Send: `CBAM: [topic]`
Example: `CBAM: reporting requirements`

*Get a Quote*
Send: `quote` to get CBAM report pricing

*Need Human Help?*
Send: `agent` to connect with support

_Visit vaya.trade for full features_"""


async def process_message(body: str, from_number: str) -> str:
    """Process incoming message and return response."""
    body = body.strip()
    body_lower = body.lower()
    
    # Welcome/start
    if body_lower in ["hi", "hello", "start", "hey"]:
        return get_welcome_message()
    
    # Help
    if body_lower in ["help", "menu", "?"]:
        return get_help_message()
    
    # HS Code lookup
    if body_lower.startswith("hs:") or body_lower.startswith("hs "):
        query = body[3:].strip() if body_lower.startswith("hs:") else body[2:].strip()
        return await handle_hs_lookup(query)
    
    # Trade question
    if body_lower.startswith("q:") or body_lower.startswith("question:"):
        question = body.split(":", 1)[1].strip()
        return await handle_trade_question(question)
    
    # CBAM specific
    if body_lower.startswith("cbam:") or body_lower.startswith("cbam "):
        topic = body[5:].strip() if body_lower.startswith("cbam:") else body[4:].strip()
        return await handle_trade_question(f"CBAM (Carbon Border Adjustment Mechanism): {topic}")
    
    # Quote request
    if body_lower in ["quote", "price", "pricing", "cost"]:
        return """💰 *VAYA Pricing*

*CBAM Report Generation*
₹499 per report
• AI-powered invoice extraction
• Automatic emission calculations
• XML file ready for EU portal

*Bulk Packages*
• 10 reports: ₹4,490 (10% off)
• 50 reports: ₹19,960 (20% off)
• Unlimited: Contact sales

*Free Features*
• HS Code Lookup ✓
• Trade Questions ✓
• CBAM Guidance ✓

Reply `start` to generate your first report!"""

    # Agent request
    if body_lower in ["agent", "human", "support", "help me"]:
        return """🙋 *Connect with Support*

Our team is available:
Mon-Fri: 9 AM - 6 PM IST

📧 Email: support@vaya.trade
📞 Phone: +91-XXXXXXXXXX

_Average response time: 2 hours_

Or describe your issue here and we'll get back to you!"""

    # Default: Try to understand as HS code or question
    if len(body) > 3:
        # Assume it's a product for HS lookup
        return await handle_hs_lookup(body)
    
    return "❓ I didn't understand that. Send `help` for available commands."


@router.post("/webhook")
async def whatsapp_webhook(
    request: Request,
    Body: str = Form(""),
    From: str = Form(""),
    To: str = Form(""),
    MessageSid: Optional[str] = Form(None),
):
    """
    Twilio WhatsApp webhook endpoint.
    
    Receives incoming messages and sends automated responses.
    Configure this URL in Twilio Console: https://console.twilio.com
    """
    # Process message
    response_text = await process_message(Body, From)
    
    # Return TwiML response
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{response_text}</Message>
</Response>"""
    
    return Response(content=twiml, media_type="application/xml")


@router.get("/webhook")
async def verify_webhook(request: Request):
    """Verify webhook endpoint for Twilio setup."""
    return {"status": "ok", "message": "VAYA WhatsApp webhook is active"}
