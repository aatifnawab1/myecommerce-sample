"""
WhatsApp Service for Order Confirmation via Twilio
"""
import os
from twilio.rest import Client
from typing import Optional

# Twilio WhatsApp Sandbox number
WHATSAPP_SANDBOX_NUMBER = "whatsapp:+14155238886"

# Initialize Twilio client
def get_twilio_client() -> Optional[Client]:
    """Get Twilio client if credentials are configured"""
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    
    if not account_sid or not auth_token:
        print("Twilio credentials not configured")
        return None
    
    return Client(account_sid, auth_token)

def format_phone_for_whatsapp(phone: str) -> str:
    """Format phone number for WhatsApp (must include country code)"""
    # Remove any spaces, dashes, or parentheses
    phone = ''.join(c for c in phone if c.isdigit() or c == '+')
    
    # Ensure it starts with +
    if not phone.startswith('+'):
        # Assume Saudi Arabia if no country code
        if phone.startswith('0'):
            phone = '+966' + phone[1:]
        elif phone.startswith('966'):
            phone = '+' + phone
        else:
            phone = '+966' + phone
    
    return f"whatsapp:{phone}"

def send_order_confirmation_request(
    phone: str,
    order_id: str,
    customer_name: str,
    total: float,
    language: str = 'en'
) -> dict:
    """
    Send WhatsApp message asking customer to confirm order
    Uses Twilio WhatsApp Sandbox for testing
    Returns: dict with success status and message_sid
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    # Use sandbox number as sender
    from_number = WHATSAPP_SANDBOX_NUMBER
    to_number = format_phone_for_whatsapp(phone)
    
    # Message with clear YES/NO instructions
    # Using simple format that works with WhatsApp sandbox
    message_body = f"""🛍️ *Zaylux Store - Order Confirmation*

Hello {customer_name}!

Your order has been received.

📦 *Order ID:* {order_id}
💰 *Total:* {total:.2f} SAR
💳 *Payment:* Cash on Delivery

━━━━━━━━━━━━━━━━━━━━
*Please confirm your order:*

Reply *YES* to confirm ✅
Reply *NO* to cancel ❌
━━━━━━━━━━━━━━━━━━━━

مرحباً! للتأكيد بالعربي:
رد بـ *نعم* للتأكيد ✅
رد بـ *لا* للإلغاء ❌"""
    
    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        print(f"WhatsApp message sent: SID={message.sid}, Status={message.status}")
        return {
            "success": True,
            "message_sid": message.sid,
            "status": message.status
        }
    except Exception as e:
        print(f"WhatsApp send error: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def send_confirmation_status_message(
    phone: str,
    order_id: str,
    status: str
) -> dict:
    """
    Send WhatsApp message confirming the order status change
    Bilingual message (English + Arabic)
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    from_number = WHATSAPP_SANDBOX_NUMBER
    to_number = format_phone_for_whatsapp(phone)
    
    if status == "confirmed":
        message_body = f"""✅ *ORDER CONFIRMED!*
✅ *تم تأكيد الطلب!*

━━━━━━━━━━━━━━━━━━━━

📦 Order ID: *{order_id}*
رقم الطلب: *{order_id}*

Your order has been confirmed successfully!
We will deliver your order soon.

تم تأكيد طلبك بنجاح!
سيتم توصيل طلبك قريباً.

━━━━━━━━━━━━━━━━━━━━

Thank you for shopping with *Zaylux Store*! 🛍️
شكراً لتسوقك من *Zaylux Store*! 🛍️"""
    else:  # cancelled
        message_body = f"""❌ *ORDER CANCELLED*
❌ *تم إلغاء الطلب*

━━━━━━━━━━━━━━━━━━━━

📦 Order ID: *{order_id}*
رقم الطلب: *{order_id}*

Your order has been cancelled as requested.
تم إلغاء طلبك كما طلبت.

━━━━━━━━━━━━━━━━━━━━

We hope to serve you again soon.
نأمل أن نخدمك مرة أخرى قريباً.

*Zaylux Store* 🛍️"""
    
    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        print(f"Confirmation message sent: SID={message.sid}")
        return {
            "success": True,
            "message_sid": message.sid
        }
    except Exception as e:
        print(f"Failed to send confirmation message: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def send_guidance_message(
    phone: str,
    order_id: str = None
) -> dict:
    """
    Send guidance message when reply is not understood
    Bilingual message (English + Arabic)
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    from_number = WHATSAPP_SANDBOX_NUMBER
    to_number = format_phone_for_whatsapp(phone)
    
    if order_id:
        message_body = f"""⚠️ *We didn't understand your reply*
⚠️ *لم نفهم ردك*

━━━━━━━━━━━━━━━━━━━━

📦 Order ID: *{order_id}*

To confirm or cancel your order, please reply with:

✅ *YES* or *نعم* - to confirm
❌ *NO* or *لا* - to cancel

━━━━━━━━━━━━━━━━━━━━

للتأكيد أو الإلغاء، يرجى الرد بـ:

✅ *نعم* - للتأكيد
❌ *لا* - للإلغاء

*Zaylux Store* 🛍️"""
    else:
        message_body = """⚠️ *No pending order found*
⚠️ *لم يتم العثور على طلب معلق*

━━━━━━━━━━━━━━━━━━━━

We couldn't find a pending order for your phone number.

If you have a question, please contact us.

لم نتمكن من العثور على طلب معلق لرقم هاتفك.

إذا كان لديك سؤال، يرجى التواصل معنا.

*Zaylux Store* 🛍️"""
    
    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        print(f"Guidance message sent: SID={message.sid}")
        return {
            "success": True,
            "message_sid": message.sid
        }
    except Exception as e:
        print(f"Failed to send guidance message: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def parse_confirmation_reply(message_body: str) -> Optional[str]:
    """
    Parse customer reply to determine confirmation status
    Returns: 'confirmed', 'cancelled', or None if unclear
    """
    message_lower = message_body.strip().lower()
    
    # Check for YES responses (English and Arabic)
    yes_responses = ['yes', 'y', 'نعم', 'اي', 'ايه', 'اوكي', 'ok', 'okay', 'confirm', 'تأكيد', 'أكد', 'موافق']
    for yes in yes_responses:
        if yes in message_lower:
            return 'confirmed'
    
    # Check for NO responses (English and Arabic)
    no_responses = ['no', 'n', 'لا', 'cancel', 'الغاء', 'إلغاء', 'لأ', 'كنسل']
    for no in no_responses:
        if no in message_lower:
            return 'cancelled'
    
    return None
