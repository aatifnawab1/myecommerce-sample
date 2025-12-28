"""
WhatsApp Service for Order Confirmation via Twilio
Using approved WhatsApp Business Templates with Content SIDs
"""
import os
import re
import json
from twilio.rest import Client
from typing import Optional

def get_whatsapp_number() -> str:
    """Get the configured WhatsApp Business number"""
    number = os.environ.get('TWILIO_WHATSAPP_NUMBER', '+17656763235')
    return f"whatsapp:{number}"

def get_twilio_client() -> Optional[Client]:
    """Get Twilio client if credentials are configured"""
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    
    if not account_sid or not auth_token:
        print("Twilio credentials not configured")
        return None
    
    return Client(account_sid, auth_token)

def normalize_saudi_phone(phone: str) -> str:
    """
    Normalize Saudi phone number to international format +966XXXXXXXXX
    
    Handles all these formats:
    - +966506744374 -> +966506744374
    - 966506744374  -> +966506744374
    - 0506744374    -> +966506744374
    - 506744374     -> +966506744374
    - 00966506744374 -> +966506744374
    - +966 50 674 4374 -> +966506744374
    """
    if not phone:
        return ""
    
    # Remove all non-digit characters except +
    phone = re.sub(r'[^\d+]', '', phone)
    
    # Remove leading + for processing
    has_plus = phone.startswith('+')
    if has_plus:
        phone = phone[1:]
    
    # Remove leading zeros (00966 -> 966)
    phone = phone.lstrip('0')
    
    if phone.startswith('966'):
        phone = '+' + phone
    elif len(phone) == 9 and phone.startswith('5'):
        phone = '+966' + phone
    elif len(phone) == 10 and phone.startswith('05'):
        phone = '+966' + phone[1:]
    else:
        if len(phone) >= 9:
            last_9 = phone[-9:]
            if last_9.startswith('5'):
                phone = '+966' + last_9
            else:
                phone = '+' + phone
        else:
            phone = '+966' + phone
    
    print(f"Normalized phone: {phone}")
    return phone

def format_phone_for_whatsapp(phone: str) -> str:
    """Format phone number for WhatsApp (must include country code)"""
    normalized = normalize_saudi_phone(phone)
    return f"whatsapp:{normalized}"

def send_order_confirmation_request(
    phone: str,
    order_id: str,
    customer_name: str,
    total: float,
    language: str = 'en'
) -> dict:
    """
    Send WhatsApp order confirmation using approved templates
    Sends both English and Arabic templates for bilingual support
    Returns: dict with success status and message_sid
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    from_number = get_whatsapp_number()
    to_number = format_phone_for_whatsapp(phone)
    
    # Get template Content SIDs from environment
    english_template_sid = os.environ.get('TWILIO_TEMPLATE_EN_SID', 'HX6de804e0a397caa801d148024be97c5d')
    arabic_template_sid = os.environ.get('TWILIO_TEMPLATE_AR_SID', 'HX8a4d4842ef5fd8c68446cd1d23b158da')
    
    # Prepare content variables - ensure order_id is a clean string
    content_vars = json.dumps({"1": str(order_id)})
    
    print(f"=== WhatsApp Template Debug ===")
    print(f"From: {from_number}")
    print(f"To: {to_number}")
    print(f"Order ID: {order_id}")
    print(f"Content Variables: {content_vars}")
    print(f"English Template SID: {english_template_sid}")
    print(f"Arabic Template SID: {arabic_template_sid}")
    
    results = []
    
    # Send English template: order_confirmation_cod_en
    try:
        english_message = client.messages.create(
            from_=from_number,
            to=to_number,
            content_sid=english_template_sid,
            content_variables=content_vars
        )
        print(f"English template sent: SID={english_message.sid}, Status={english_message.status}")
        results.append({"lang": "en", "success": True, "sid": english_message.sid})
    except Exception as e:
        print(f"English template error: {str(e)}")
        results.append({"lang": "en", "success": False, "error": str(e)})
    
    # Send Arabic template: order_conformation_cod
    try:
        arabic_message = client.messages.create(
            from_=from_number,
            to=to_number,
            content_sid=arabic_template_sid,
            content_variables=content_vars
        )
        print(f"Arabic template sent: SID={arabic_message.sid}, Status={arabic_message.status}")
        results.append({"lang": "ar", "success": True, "sid": arabic_message.sid})
    except Exception as e:
        print(f"Arabic template error: {str(e)}")
        results.append({"lang": "ar", "success": False, "error": str(e)})
    
    # Return success if at least one message was sent
    success_count = sum(1 for r in results if r.get("success"))
    return {
        "success": success_count > 0,
        "results": results,
        "message_sid": results[0].get("sid") if results and results[0].get("success") else None
    }

def send_confirmation_status_message(
    phone: str,
    order_id: str,
    status: str
) -> dict:
    """
    Send WhatsApp message confirming the order status change
    Bilingual message (English + Arabic)
    This is sent within 24h window so free-form messages work
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    from_number = get_whatsapp_number()
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
    This is sent within 24h window so free-form messages work
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}
    
    from_number = get_whatsapp_number()
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
