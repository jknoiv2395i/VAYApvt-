"""
WhatsApp Service for VAYA Authorize.
Handles OUTBOUND notifications via Twilio.
"""

import os
from twilio.rest import Client
from typing import Optional

# Twilio Configuration (Simulated for this environment if vars missing)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "AC_MOCK_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "mock_token")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "whatsapp:+14155238886") 

class WhatsAppService:
    """Service for sending outbound WhatsApp messages."""
    
    def __init__(self):
        try:
            self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            self.enabled = True
        except Exception:
            print("Twilio client failed to initialize. WhatsApp service disabled.")
            self.enabled = False

    async def send_packet_ready(self, user_id: str, packet_url: str):
        """
        Send a notification that the packet is ready.
        In a real app, user_id would look up the phone number.
        Here we'll mock the destination.
        """
        # Mock phone lookup
        to_number = "whatsapp:+919999999999"  # Replace with user.phone_number
        
        message_body = (
            "✅ *VAYA Authorize Update*\n\n"
            "Your CBAM Authorization Packet is ready! 📄\n\n"
            "It includes:\n"
            "- Declaration of Honour\n"
            "- Financial Solvency Report\n"
            "- XML Data for NCA\n\n"
            f"Download here: {packet_url}\n\n"
            "Please sign the declaration and submit to your National Competent Authority."
        )
        
        if self.enabled and TWILIO_ACCOUNT_SID != "AC_MOCK_SID":
            try:
                message = self.client.messages.create(
                    from_=TWILIO_FROM_NUMBER,
                    body=message_body,
                    to=to_number
                )
                print(f"WhatsApp sent: {message.sid}")
                return True
            except Exception as e:
                print(f"Failed to send WhatsApp: {e}")
                return False
        else:
            # Mock Log
            print(f"([MOCK] WhatsApp to {to_number}): {message_body}")
            return True
