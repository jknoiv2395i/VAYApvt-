"""
WhatsApp Agent Service for VAYA

Provides chunked messaging for better UX - sends responses in small,
digestible pieces rather than walls of text.

Style: Friendly, frank, conversational with emojis.
"""

import asyncio
from typing import List, Optional
import httpx

from app.core.config import settings


# Message chunking settings
MAX_CHUNK_SIZE = 300  # Max chars per message
TYPING_DELAY = 1.5    # Seconds between messages
# Note: This number must be registered with WhatsApp Business API to work
SUPPORT_NUMBER = "+91 80456 78900"


def chunk_message(text: str, max_chars: int = MAX_CHUNK_SIZE) -> List[str]:
    """
    Split a long message into smaller chunks for WhatsApp.
    
    Tries to split at natural break points (newlines, periods, commas).
    """
    if len(text) <= max_chars:
        return [text]
    
    chunks = []
    remaining = text.strip()
    
    while remaining:
        if len(remaining) <= max_chars:
            chunks.append(remaining)
            break
        
        # Find best split point
        chunk = remaining[:max_chars]
        
        # Try to split at newline first
        newline_pos = chunk.rfind('\n')
        if newline_pos > max_chars // 2:
            split_at = newline_pos
        else:
            # Try period
            period_pos = chunk.rfind('. ')
            if period_pos > max_chars // 3:
                split_at = period_pos + 1
            else:
                # Try comma
                comma_pos = chunk.rfind(', ')
                if comma_pos > max_chars // 3:
                    split_at = comma_pos + 1
                else:
                    # Just split at space
                    space_pos = chunk.rfind(' ')
                    split_at = space_pos if space_pos > 0 else max_chars
        
        chunks.append(remaining[:split_at].strip())
        remaining = remaining[split_at:].strip()
    
    return chunks


def make_friendly(messages: List[str]) -> List[str]:
    """Add conversational touches to messages."""
    # Just ensure messages are clean and friendly
    return [msg.strip() for msg in messages if msg.strip()]


async def send_chunked_messages(to: str, messages: List[str], delay: float = TYPING_DELAY) -> bool:
    """
    Send multiple WhatsApp messages with delays to simulate typing.
    
    Args:
        to: WhatsApp number (format: whatsapp:+919999999999)
        messages: List of message chunks to send
        delay: Seconds to wait between messages
    
    Returns:
        True if all messages sent successfully
    """
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_WHATSAPP_NUMBER]):
        print("Twilio not configured - messages would be:", messages)
        return False
    
    url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    
    success = True
    async with httpx.AsyncClient() as client:
        for i, message in enumerate(messages):
            if i > 0:
                await asyncio.sleep(delay)
            
            try:
                response = await client.post(
                    url,
                    auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                    data={
                        "From": f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
                        "To": to,
                        "Body": message
                    }
                )
                if response.status_code != 201:
                    success = False
            except Exception as e:
                print(f"Failed to send WhatsApp message: {e}")
                success = False
    
    return success


# === FRIENDLY MESSAGE TEMPLATES ===

def get_welcome_chunks() -> List[str]:
    """Welcome message as friendly chunks."""
    return [
        "Hey! 👋 Welcome to VAYA",
        "I'm here to help with EU trade compliance - HS codes, CBAM, all that fun stuff 😅",
        "Quick tips:\n🔍 \"HS: steel screw\" → get the code\n📋 \"CBAM: deadline?\" → carbon rules\n💡 Or just ask me anything!",
        "What can I help you with today?"
    ]


def get_help_chunks() -> List[str]:
    """Help menu as friendly chunks."""
    return [
        "Here's what I can do 🛠️",
        "🔍 *HS Code Lookup*\nJust type: HS: [product]\nLike: HS: galvanized steel sheet",
        "📋 *Trade Questions*\nType: Q: [question]\nLike: Q: Is cement covered by CBAM?",
        "💰 Type 'quote' for pricing\n🙋 Type 'agent' for human support",
        "Go ahead, try something!"
    ]


def format_hs_results_chunks(suggestions: list) -> List[str]:
    """Format HS code results as chunks."""
    if not suggestions:
        return ["Hmm, couldn't find a match 🤔", "Try describing the product differently?"]
    
    chunks = ["Found some matches! 🔍"]
    
    for i, s in enumerate(suggestions[:3], 1):
        cbam = "⚠️ CBAM covered" if s.get("cbam_category") else "✅ No CBAM"
        chunks.append(f"{i}. *{s['hs_code']}*\n{s['description']}\n{cbam}")
    
    if len(suggestions) > 3:
        chunks.append(f"...and {len(suggestions) - 3} more options")
    
    chunks.append("Need details on any of these? Just send the HS code!")
    return chunks


def get_quote_chunks() -> List[str]:
    """Pricing info as chunks."""
    return [
        "Let's talk pricing 💰",
        "*CBAM Report Generation*\n₹499 per report\n• AI invoice extraction\n• Auto emission calc\n• Ready-to-submit XML",
        "*Bulk deals:*\n10 reports → ₹4,490 (10% off)\n50 reports → ₹19,960 (20% off)",
        "HS Code lookup & questions are FREE btw 😊",
        "Ready to start? Just upload an invoice!"
    ]


def get_agent_chunks() -> List[str]:
    """Human support request as chunks."""
    return [
        "Need a human? Got it! 🙋",
        f"You can reach us at:\n📞 {SUPPORT_NUMBER}\n📧 support@vaya.trade",
        "We're around Mon-Fri, 9 AM - 6 PM IST",
        "Or just describe your issue here and I'll flag it for the team 👍"
    ]


def format_trade_answer_chunks(answer: str) -> List[str]:
    """Split a trade answer into chunks."""
    # Add intro
    chunks = ["Here's what I found 💡"]
    
    # Chunk the answer
    answer_chunks = chunk_message(answer, MAX_CHUNK_SIZE - 20)
    chunks.extend(answer_chunks)
    
    # Add friendly closer
    chunks.append("Does that help? Ask if you need more details!")
    
    return chunks


def get_confused_chunks() -> List[str]:
    """When we don't understand."""
    return [
        "Hmm, not sure I got that 🤔",
        "Try:\n• 'HS: [product]' for codes\n• 'CBAM: [question]' for carbon stuff\n• 'help' for all options"
    ]
