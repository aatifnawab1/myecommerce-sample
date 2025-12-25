from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

# Admin Models
class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
    token: str

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_ar: str
    description_en: str
    description_ar: str
    category: str  # 'perfume' or 'drone'
    price: float
    original_price: Optional[float] = None
    quantity: int
    images: List[str] = []
    is_visible: bool = True
    rating: float = 0.0
    reviews: int = 0
    specs: Optional[dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name_en: str
    name_ar: str
    description_en: str
    description_ar: str
    category: str
    price: float
    original_price: Optional[float] = None
    quantity: int
    images: List[str] = []
    is_visible: bool = True
    specs: Optional[dict] = None

class ProductUpdate(BaseModel):
    name_en: Optional[str] = None
    name_ar: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    quantity: Optional[int] = None
    images: Optional[List[str]] = None
    is_visible: Optional[bool] = None
    specs: Optional[dict] = None

# Notify Me Models
class NotifyRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    phone: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NotifyRequestCreate(BaseModel):
    product_id: str
    phone: str
    name: Optional[str] = None

# Order Models
class OrderItem(BaseModel):
    product_id: str
    name_en: str
    name_ar: str
    price: float
    quantity: int
    image: str

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    phone: str
    city: str
    address: str
    items: List[OrderItem]
    subtotal: float
    discount: float = 0.0
    total: float
    coupon_code: Optional[str] = None
    payment_method: str = "Cash on Delivery"
    status: str = "Pending"  # Pending, Confirmed, Shipped, Delivered, Cancelled
    customer_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    city: str
    address: str
    items: List[OrderItem]
    subtotal: float
    discount: float = 0.0
    total: float
    coupon_code: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str

# Customer Models
class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    city: str
    address: str
    is_blocked: bool = False
    total_orders: int = 0
    cancelled_orders: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Coupon Models
class Coupon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    discount_percentage: float
    expiry_date: Optional[datetime] = None
    min_order_value: Optional[float] = None
    is_active: bool = True
    usage_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CouponCreate(BaseModel):
    code: str
    discount_percentage: float
    expiry_date: Optional[datetime] = None
    min_order_value: Optional[float] = None
    is_active: bool = True

class CouponValidate(BaseModel):
    code: str
    order_total: float

class CouponValidateResponse(BaseModel):
    valid: bool
    discount_percentage: float = 0.0
    discount_amount: float = 0.0
    message: str = ""
