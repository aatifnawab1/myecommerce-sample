"""
WhatsApp Service for Order Confirmation via Twilio
"""
import os
from twilio.rest import Client
from typing import Optional

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
    Returns: dict with success status and message_sid
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')
    if not whatsapp_number:
        return {"success": False, "error": "WhatsApp number not configured"}
    
    from_number = f"whatsapp:{whatsapp_number}"
    to_number = format_phone_for_whatsapp(phone)
    
    # Bilingual message
    if language == 'ar':
        message_body = f"""مرحباً {customer_name}! 🛍️

شكراً لطلبك من Zaylux Store.

رقم الطلب: {order_id}
المبلغ الإجمالي: {total:.2f} ريال

للتأكيد، يرجى الرد بـ:
✅ نعم - لتأكيد الطلب
❌ لا - لإلغاء الطلب

سيتم الدفع عند الاستلام."""
    else:
        message_body = f"""Hello {customer_name}! 🛍️

Thank you for your order from Zaylux Store.

Order ID: {order_id}
Total Amount: {total:.2f} SAR

To confirm, please reply with:
✅ YES - to confirm your order
❌ NO - to cancel your order

Payment will be collected on delivery."""
    
    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
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
    status: str,
    language: str = 'en'
) -> dict:
    """
    Send WhatsApp message confirming the order status change
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')
    if not whatsapp_number:
        return {"success": False, "error": "WhatsApp number not configured"}
    
    from_number = f"whatsapp:{whatsapp_number}"
    to_number = format_phone_for_whatsapp(phone)
    
    if status == "confirmed":
        if language == 'ar':
            message_body = f"""✅ تم تأكيد طلبك!

رقم الطلب: {order_id}

سنقوم بتوصيل طلبك قريباً.
شكراً لتسوقك من Zaylux Store! 🎉"""
        else:
            message_body = f"""✅ Your order has been confirmed!

Order ID: {order_id}

We will deliver your order soon.
Thank you for shopping with Zaylux Store! 🎉"""
    else:  # cancelled
        if language == 'ar':
            message_body = f"""❌ تم إلغاء طلبك.

رقم الطلب: {order_id}

نأمل أن نخدمك في المستقبل.
Zaylux Store"""
        else:
            message_body = f"""❌ Your order has been cancelled.

Order ID: {order_id}

We hope to serve you in the future.
Zaylux Store"""
    
    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        return {
            "success": True,
            "message_sid": message.sid
        }
    except Exception as e:
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
    yes_responses = ['yes', 'y', 'نعم', 'اي', 'ايه', 'اوكي', 'ok', 'okay', 'confirm', 'تأكيد']
    for yes in yes_responses:
        if yes in message_lower:
            return 'confirmed'
    
    # Check for NO responses (English and Arabic)
    no_responses = ['no', 'n', 'لا', 'cancel', 'الغاء', 'إلغاء']
    for no in no_responses:
        if no in message_lower:
            return 'cancelled'
    
    return None
