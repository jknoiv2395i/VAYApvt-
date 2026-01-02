"""
WhatsApp Bot Integration via Twilio

Handles incoming WhatsApp messages with chunked, friendly responses for:
- HS code lookup
- Trade compliance questions
- CBAM report status

Phone: +91 80 4567 8900
"""

from fastapi import APIRouter, Form, Request, Response
from typing import Optional, List

from app.core.config import settings
from app.services.openrouter_service import get_openrouter_service
from app.services.whatsapp_agent import (
    chunk_message,
    get_welcome_chunks,
    get_help_chunks,
    get_quote_chunks,
    get_agent_chunks,
    get_confused_chunks,
    format_hs_results_chunks,
    format_trade_answer_chunks,
    SUPPORT_NUMBER
)
from app.data.hs_cn_mapping import search_hs_codes

router = APIRouter()


async def handle_hs_lookup(query: str) -> List[str]:
    """Handle HS code lookup - returns chunked messages."""
    try:
        # First try local database
        local_results = search_hs_codes(query, limit=5)
        suggestions = []
        
        for r in local_results:
            suggestions.append({
                "hs_code": r["hs_code"],
                "description": r["description"],
                "confidence": "high" if query.lower() in r["description"].lower() else "medium",
                "cbam_category": r.get("cbam_category")
            })
        
        # Try AI enhancement
        try:
            service = get_openrouter_service()
            result = await service.match_hs_code(query)
            ai_suggestions = result.get("suggestions", [])
            existing_codes = [s["hs_code"] for s in suggestions]
            
            for s in ai_suggestions:
                if s.get("hs_code") and s["hs_code"] not in existing_codes:
                    suggestions.append(s)
        except Exception:
            pass  # AI failed, but we have local results
        
        return format_hs_results_chunks(suggestions)
    except Exception as e:
        return ["Oops, something went wrong 😅", f"Error: {str(e)}", "Try again?"]


async def handle_trade_question(question: str) -> List[str]:
    """Handle trade compliance question - returns chunked messages."""
    try:
        service = get_openrouter_service()
        answer = await service.answer_trade_query(question)
        return format_trade_answer_chunks(answer)
    except Exception as e:
        return [
            "Sorry, having trouble with that question 😅",
            "Try asking something simpler, or type 'agent' for human help!"
        ]


async def process_message(body: str, from_number: str) -> List[str]:
    """
    Process incoming message and return chunked response.
    
    Returns a list of short, friendly messages to send.
    """
    body = body.strip()
    body_lower = body.lower()
    
    # === GREETINGS ===
    if body_lower in ["hi", "hello", "start", "hey", "hii", "hola", "namaste"]:
        return get_welcome_chunks()
    
    # === HELP ===
    if body_lower in ["help", "menu", "?", "options"]:
        return get_help_chunks()
    
    # === HS CODE LOOKUP ===
    if body_lower.startswith("hs:") or body_lower.startswith("hs "):
        query = body[3:].strip() if body_lower.startswith("hs:") else body[2:].strip()
        if query:
            return await handle_hs_lookup(query)
        return ["What product do you need the HS code for?", "Try: HS: steel bolts"]
    
    # === TRADE QUESTIONS ===
    if body_lower.startswith("q:") or body_lower.startswith("question:"):
        question = body.split(":", 1)[1].strip()
        if question:
            return await handle_trade_question(question)
        return ["What's your question?", "Try: Q: What is CBAM?"]
    
    # === CBAM SPECIFIC ===
    if body_lower.startswith("cbam:") or body_lower.startswith("cbam "):
        topic = body[5:].strip() if body_lower.startswith("cbam:") else body[4:].strip()
        if topic:
            return await handle_trade_question(f"About EU CBAM (Carbon Border Adjustment Mechanism): {topic}")
        return ["What about CBAM?", "Try: CBAM: deadlines 2025"]
    
    # === PRICING ===
    if body_lower in ["quote", "price", "pricing", "cost", "rates"]:
        return get_quote_chunks()
    
    # === HUMAN SUPPORT ===
    if body_lower in ["agent", "human", "support", "help me", "talk to someone"]:
        return get_agent_chunks()
    
    # === THANKS ===
    if body_lower in ["thanks", "thank you", "thx", "ty"]:
        return ["Happy to help! 😊", "Anything else you need?"]
    
    # === BYE ===
    if body_lower in ["bye", "goodbye", "see you", "later"]:
        return ["See you! 👋", "Come back anytime you need help with trade compliance!"]
    
    # === DEFAULT: Try as HS lookup if long enough ===
    if len(body) > 3:
        return await handle_hs_lookup(body)
    
    return get_confused_chunks()


def build_twiml_response(messages: List[str]) -> str:
    """Build TwiML response with multiple messages."""
    # For TwiML, we need to combine messages since Twilio
    # only supports one Message per response in webhook mode
    # But we format it nicely with line breaks
    combined = "\n\n".join(messages)
    
    # Escape XML special characters
    combined = combined.replace("&", "&amp;")
    combined = combined.replace("<", "&lt;")
    combined = combined.replace(">", "&gt;")
    
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{combined}</Message>
</Response>'''


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
    
    Receives incoming messages and sends friendly, chunked responses.
    Configure this URL in Twilio Console: https://console.twilio.com
    
    Webhook URL: https://your-domain.com/api/v1/whatsapp/webhook
    """
    # Process message
    response_messages = await process_message(Body, From)
    
    # Build TwiML response
    twiml = build_twiml_response(response_messages)
    
    return Response(content=twiml, media_type="application/xml")


@router.get("/webhook")
async def verify_webhook(request: Request):
    """Verify webhook endpoint for Twilio setup."""
    return {
        "status": "ok", 
        "message": "VAYA WhatsApp bot is active 🚀",
        "phone": SUPPORT_NUMBER,
        "commands": ["HS: [product]", "CBAM: [question]", "help", "quote"]
    }


@router.post("/test")
async def test_message(body: str = Form("")):
    """
    Test endpoint for local development.
    
    Use this to test bot responses without Twilio.
    """
    messages = await process_message(body, "test:+919999999999")
    return {
        "input": body,
        "responses": messages,
        "chunk_count": len(messages)
    }

