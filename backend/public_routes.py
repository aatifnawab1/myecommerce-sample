from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from pathlib import Path
from models import (
    Product, NotifyRequestCreate, NotifyRequest,
    Order, OrderCreate, CouponValidate, CouponValidateResponse
)

public_router = APIRouter(tags=["Public"])

# Dependency to get database
def get_db():
    from server import db
    return db

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
    
    # Create order
    order = Order(**order_data.model_dump())
    await db.orders.insert_one(order.model_dump())
    
    # Reduce product quantities
    for item in order_data.items:
        await db.products.update_one(
            {"id": item.product_id},
            {"$inc": {"quantity": -item.quantity}}
        )
    
    return order

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
