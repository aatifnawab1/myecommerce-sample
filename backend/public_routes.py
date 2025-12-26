from fastapi import APIRouter, HTTPException, Depends, Form, Request
from fastapi.responses import FileResponse, Response
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from pathlib import Path
from models import (
    Product, NotifyRequestCreate, NotifyRequest,
    Order, OrderCreate, CouponValidate, CouponValidateResponse,
    OrderTrackRequest, OrderTrackResponse
)
from whatsapp_service import (
    send_order_confirmation_request,
    send_confirmation_status_message,
    parse_confirmation_reply,
    format_phone_for_whatsapp
)

public_router = APIRouter(tags=["Public"])

# Dependency to get database
def get_db():
    from server import db
    return db

# Status translations for Arabic
STATUS_TRANSLATIONS = {
    "Pending": "قيد الانتظار",
    "Confirmed": "تم التأكيد",
    "Shipped": "تم الشحن",
    "Delivered": "تم التوصيل",
    "Cancelled": "ملغي"
}

# Helper function to generate public order ID
async def generate_public_order_id(db: AsyncIOMotorDatabase) -> str:
    """Generate a unique public order ID like ZAY-100001"""
    # Get or create the counter document
    counter = await db.counters.find_one_and_update(
        {"_id": "order_counter"},
        {"$inc": {"sequence": 1}},
        upsert=True,
        return_document=True
    )
    sequence = counter.get("sequence", 100001)
    return f"ZAY-{sequence}"

# ==================== FILE SERVING ====================

@public_router.get("/uploads/products/{filename}")
async def serve_product_image(filename: str):
    """Serve uploaded product images"""
    file_path = Path("/app/backend/uploads/products") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(file_path)

# ==================== PRODUCTS ====================

@public_router.get("/products", response_model=List[Product])
async def get_products(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all visible products with stock status"""
    products = await db.products.find({"is_visible": True}, {"_id": 0}).to_list(1000)
    return products

@public_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a specific product"""
    product = await db.products.find_one({"id": product_id, "is_visible": True}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

# ==================== NOTIFY ME ====================

@public_router.post("/notify-me", response_model=NotifyRequest)
async def create_notify_request(
    request_data: NotifyRequestCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a notify me request for out of stock product"""
    # Verify product exists and is out of stock
    product = await db.products.find_one({"id": request_data.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.get("quantity", 0) > 0:
        raise HTTPException(status_code=400, detail="Product is in stock")
    
    # Check if request already exists
    existing = await db.notify_requests.find_one({
        "product_id": request_data.product_id,
        "phone": request_data.phone
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="You have already requested notification for this product")
    
    notify_request = NotifyRequest(**request_data.model_dump())
    await db.notify_requests.insert_one(notify_request.model_dump())
    
    return notify_request

# ==================== ORDERS ====================

@public_router.post("/orders", response_model=Order)
async def create_order(
    order_data: OrderCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new order"""
    # Check if customer is blocked
    blocked = await db.blocked_customers.find_one({"phone": order_data.phone})
    if blocked:
        raise HTTPException(status_code=403, detail="Your account has been blocked. Please contact support.")
    
    # Verify products are in stock
    for item in order_data.items:
        product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.get("quantity", 0) < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.get('name_en', 'product')}"
            )
    
    # Generate public order ID
    public_order_id = await generate_public_order_id(db)
    
    # Create order with public ID and pending confirmation status
    order_dict = order_data.model_dump()
    order_dict["public_order_id"] = public_order_id
    order_dict["confirmation_status"] = "pending"  # WhatsApp confirmation pending
    order = Order(**order_dict)
    await db.orders.insert_one(order.model_dump())
    
    # Reduce product quantities
    for item in order_data.items:
        await db.products.update_one(
            {"id": item.product_id},
            {"$inc": {"quantity": -item.quantity}}
        )
    
    # Send WhatsApp confirmation request (async, don't block order creation)
    try:
        whatsapp_result = send_order_confirmation_request(
            phone=order.phone,
            order_id=public_order_id,
            customer_name=order.customer_name,
            total=order.total,
            language='en'  # Default to English, can be enhanced to detect language
        )
        if whatsapp_result.get("success"):
            print(f"WhatsApp confirmation sent for order {public_order_id}")
        else:
            print(f"WhatsApp send failed for order {public_order_id}: {whatsapp_result.get('error')}")
    except Exception as e:
        # Don't fail order creation if WhatsApp fails
        print(f"WhatsApp error for order {public_order_id}: {str(e)}")
    
    return order

# ==================== WHATSAPP WEBHOOK ====================

@public_router.post("/whatsapp/webhook")
async def whatsapp_webhook(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Handle incoming WhatsApp messages from Twilio webhook
    Twilio sends form data with message details
    """
    try:
        form_data = await request.form()
        
        # Extract message details from Twilio webhook
        from_number = form_data.get("From", "")  # Format: whatsapp:+966501234567
        message_body = form_data.get("Body", "")
        
        # Clean the phone number (remove 'whatsapp:' prefix)
        phone = from_number.replace("whatsapp:", "").strip()
        
        print(f"Received WhatsApp from {phone}: {message_body}")
        
        if not phone or not message_body:
            return Response(content="", status_code=200)
        
        # Parse the reply
        confirmation_status = parse_confirmation_reply(message_body)
        
        if not confirmation_status:
            # Could not determine intent - ignore or send help message
            print(f"Could not parse reply from {phone}: {message_body}")
            return Response(content="", status_code=200)
        
        # Find the most recent pending order for this phone number
        order = await db.orders.find_one(
            {
                "phone": {"$regex": phone.replace("+", "\\+?")},
                "confirmation_status": "pending"
            },
            {"_id": 0},
            sort=[("created_at", -1)]  # Get most recent
        )
        
        if not order:
            # Try without the + sign
            clean_phone = phone.lstrip('+')
            order = await db.orders.find_one(
                {
                    "phone": {"$regex": f"\\+?{clean_phone}$"},
                    "confirmation_status": "pending"
                },
                {"_id": 0},
                sort=[("created_at", -1)]
            )
        
        if not order:
            print(f"No pending order found for phone: {phone}")
            return Response(content="", status_code=200)
        
        # Update order confirmation status
        new_status = confirmation_status
        order_status = "Confirmed" if confirmation_status == "confirmed" else "Cancelled"
        
        await db.orders.update_one(
            {"id": order["id"]},
            {
                "$set": {
                    "confirmation_status": new_status,
                    "status": order_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        print(f"Order {order['public_order_id']} updated to {new_status}")
        
        # If cancelled, restore product quantities
        if confirmation_status == "cancelled":
            for item in order.get("items", []):
                await db.products.update_one(
                    {"id": item["product_id"]},
                    {"$inc": {"quantity": item["quantity"]}}
                )
            print(f"Stock restored for cancelled order {order['public_order_id']}")
        
        # Send confirmation message to customer
        try:
            send_confirmation_status_message(
                phone=phone,
                order_id=order["public_order_id"],
                status=new_status,
                language='en'
            )
        except Exception as e:
            print(f"Failed to send confirmation message: {str(e)}")
        
        # Return empty response (Twilio expects 200 OK)
        return Response(content="", status_code=200)
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return Response(content="", status_code=200)

# ==================== ORDER TRACKING ====================

@public_router.post("/orders/track", response_model=OrderTrackResponse)
async def track_order(
    track_data: OrderTrackRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Track an order by public order ID and phone number"""
    # Find order by public_order_id and phone
    order = await db.orders.find_one(
        {
            "public_order_id": track_data.order_id.upper(),
            "phone": track_data.phone
        },
        {"_id": 0}
    )
    
    if not order:
        raise HTTPException(
            status_code=404, 
            detail="Order not found. Please check your Order ID and phone number."
        )
    
    # Format the response
    status = order.get("status", "Pending")
    return OrderTrackResponse(
        public_order_id=order["public_order_id"],
        customer_name=order["customer_name"],
        order_date=order["created_at"].isoformat() if isinstance(order["created_at"], datetime) else order["created_at"],
        items=order["items"],
        subtotal=order.get("subtotal", 0),
        discount=order.get("discount", 0),
        total=order.get("total", 0),
        status=status,
        status_ar=STATUS_TRANSLATIONS.get(status, status)
    )

# ==================== COUPONS ====================

@public_router.post("/coupons/validate", response_model=CouponValidateResponse)
async def validate_coupon(
    coupon_data: CouponValidate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Validate a coupon code"""
    coupon = await db.coupons.find_one({"code": coupon_data.code.upper()}, {"_id": 0})
    
    if not coupon:
        return CouponValidateResponse(
            valid=False,
            message="Invalid coupon code"
        )
    
    if not coupon.get("is_active", False):
        return CouponValidateResponse(
            valid=False,
            message="This coupon is no longer active"
        )
    
    # Check expiry date
    if coupon.get("expiry_date"):
        expiry = datetime.fromisoformat(coupon["expiry_date"]) if isinstance(coupon["expiry_date"], str) else coupon["expiry_date"]
        if datetime.utcnow() > expiry:
            return CouponValidateResponse(
                valid=False,
                message="This coupon has expired"
            )
    
    # Check minimum order value
    if coupon.get("min_order_value") and coupon_data.order_total < coupon["min_order_value"]:
        return CouponValidateResponse(
            valid=False,
            message=f"Minimum order value is {coupon['min_order_value']} SAR"
        )
    
    # Calculate discount
    discount_percentage = coupon.get("discount_percentage", 0)
    discount_amount = (coupon_data.order_total * discount_percentage) / 100
    
    # Increment usage count
    await db.coupons.update_one(
        {"code": coupon_data.code.upper()},
        {"$inc": {"usage_count": 1}}
    )
    
    return CouponValidateResponse(
        valid=True,
        discount_percentage=discount_percentage,
        discount_amount=discount_amount,
        message="Coupon applied successfully"
    )
