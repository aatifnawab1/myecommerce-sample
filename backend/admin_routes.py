from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import (
    Admin, AdminLogin, AdminResponse,
    Product, ProductCreate, ProductUpdate,
    NotifyRequest, NotifyRequestCreate,
    Order, OrderCreate, OrderStatusUpdate,
    Customer, Coupon, CouponCreate, CouponValidate, CouponValidateResponse
)
from auth import hash_password, verify_password, create_access_token, decode_access_token

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

# Dependency to get database
def get_db():
    from server import db
    return db

# Dependency to verify admin token
async def verify_admin_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return payload

# ==================== ADMIN AUTHENTICATION ====================

@admin_router.post("/login", response_model=AdminResponse)
async def admin_login(credentials: AdminLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin login endpoint"""
    admin = await db.admins.find_one({"username": credentials.username}, {"_id": 0})
    
    if not admin or not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"admin_id": admin["id"], "username": admin["username"]})
    
    return AdminResponse(
        id=admin["id"],
        username=admin["username"],
        token=token
    )

@admin_router.post("/create-admin")
async def create_admin(username: str, password: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Create a new admin (for initial setup)"""
    existing = await db.admins.find_one({"username": username})
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    admin = Admin(
        username=username,
        password_hash=hash_password(password)
    )
    
    await db.admins.insert_one(admin.model_dump())
    return {"message": "Admin created successfully"}

# ==================== PRODUCT MANAGEMENT ====================

@admin_router.get("/products", response_model=List[Product])
async def get_all_products(
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all products for admin"""
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@admin_router.post("/products", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new product"""
    product = Product(**product_data.model_dump())
    await db.products.insert_one(product.model_dump())
    return product

@admin_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update an existing product"""
    existing_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**updated_product)

@admin_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

# ==================== NOTIFY ME REQUESTS ====================

@admin_router.get("/notify-requests")
async def get_notify_requests(
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all notify requests grouped by product"""
    pipeline = [
        {
            "$group": {
                "_id": "$product_id",
                "count": {"$sum": 1},
                "requests": {"$push": {"phone": "$phone", "name": "$name", "created_at": "$created_at"}}
            }
        }
    ]
    
    results = await db.notify_requests.aggregate(pipeline).to_list(1000)
    
    # Enrich with product details
    for result in results:
        product = await db.products.find_one({"id": result["_id"]}, {"_id": 0, "name_en": 1, "name_ar": 1})
        result["product_name_en"] = product.get("name_en", "Unknown") if product else "Unknown"
        result["product_name_ar"] = product.get("name_ar", "غير معروف") if product else "غير معروف"
    
    return results

@admin_router.get("/notify-requests/{product_id}")
async def get_product_notify_requests(
    product_id: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all notify requests for a specific product"""
    requests = await db.notify_requests.find({"product_id": product_id}, {"_id": 0}).to_list(1000)
    return requests

# ==================== ORDER MANAGEMENT ====================

@admin_router.get("/orders", response_model=List[Order])
async def get_all_orders(
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all orders"""
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@admin_router.get("/orders/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a specific order"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)

@admin_router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update order status"""
    valid_statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status_update.status, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated successfully"}

# ==================== CUSTOMER MANAGEMENT ====================

@admin_router.get("/customers")
async def get_customers(
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all customers with their order statistics"""
    # Get unique customers from orders
    pipeline = [
        {
            "$group": {
                "_id": "$phone",
                "name": {"$first": "$customer_name"},
                "city": {"$first": "$city"},
                "address": {"$first": "$address"},
                "total_orders": {"$sum": 1},
                "cancelled_orders": {
                    "$sum": {"$cond": [{"$eq": ["$status", "Cancelled"]}, 1, 0]}
                },
                "total_spent": {"$sum": "$total"},
                "last_order": {"$max": "$created_at"}
            }
        },
        {"$sort": {"total_orders": -1}}
    ]
    
    customers = await db.orders.aggregate(pipeline).to_list(1000)
    
    # Check if customer is blocked
    for customer in customers:
        blocked_customer = await db.blocked_customers.find_one({"phone": customer["_id"]})
        customer["is_blocked"] = blocked_customer is not None if blocked_customer else False
    
    return customers

@admin_router.post("/customers/{phone}/block")
async def block_customer(
    phone: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Block a customer"""
    await db.blocked_customers.insert_one({"phone": phone, "blocked_at": datetime.utcnow()})
    return {"message": "Customer blocked successfully"}

@admin_router.delete("/customers/{phone}/block")
async def unblock_customer(
    phone: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Unblock a customer"""
    await db.blocked_customers.delete_one({"phone": phone})
    return {"message": "Customer unblocked successfully"}

@admin_router.get("/customers/{phone}/orders")
async def get_customer_orders(
    phone: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all orders for a specific customer"""
    orders = await db.orders.find({"phone": phone}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

# ==================== COUPON MANAGEMENT ====================

@admin_router.get("/coupons", response_model=List[Coupon])
async def get_all_coupons(
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all coupons"""
    coupons = await db.coupons.find({}, {"_id": 0}).to_list(1000)
    return coupons

@admin_router.post("/coupons", response_model=Coupon)
async def create_coupon(
    coupon_data: CouponCreate,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new coupon"""
    # Check if coupon code already exists
    existing = await db.coupons.find_one({"code": coupon_data.code.upper()})
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    
    # Convert to dict and update code to uppercase
    coupon_dict = coupon_data.model_dump()
    coupon_dict["code"] = coupon_dict["code"].upper()
    
    coupon = Coupon(**coupon_dict)
    await db.coupons.insert_one(coupon.model_dump())
    return coupon

@admin_router.put("/coupons/{coupon_id}", response_model=Coupon)
async def update_coupon(
    coupon_id: str,
    coupon_data: CouponCreate,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a coupon"""
    existing_coupon = await db.coupons.find_one({"id": coupon_id}, {"_id": 0})
    if not existing_coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    update_data = coupon_data.model_dump()
    update_data["code"] = update_data["code"].upper()
    
    await db.coupons.update_one({"id": coupon_id}, {"$set": update_data})
    
    updated_coupon = await db.coupons.find_one({"id": coupon_id}, {"_id": 0})
    return Coupon(**updated_coupon)

@admin_router.delete("/coupons/{coupon_id}")
async def delete_coupon(
    coupon_id: str,
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a coupon"""
    result = await db.coupons.delete_one({"id": coupon_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    return {"message": "Coupon deleted successfully"}

# ==================== DASHBOARD STATS ====================

@admin_router.get("/dashboard/stats")
async def get_dashboard_stats(
    admin: dict = Depends(verify_admin_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get dashboard statistics"""
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "Pending"})
    total_customers = len(await db.orders.distinct("phone"))
    
    # Calculate total revenue
    revenue_pipeline = [
        {"$match": {"status": {"$ne": "Cancelled"}}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_customers": total_customers,
        "total_revenue": total_revenue
    }
