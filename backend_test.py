#!/usr/bin/env python3
"""
Backend API Testing for Zaylux Store - Coupon Creation and Application Flow
Tests the complete coupon workflow from creation to application during checkout.
"""

import requests
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any

# Load environment variables
BACKEND_URL = "https://saudi-ecomm.preview.emergentagent.com/api"

class ZayluxBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.admin_token = None
        self.test_results = []
        self.coupon_code = "SAVE15"  # Default, will be updated in create_coupon
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "status": status,
            "details": details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def admin_login(self) -> bool:
        """Test admin login and get token"""
        try:
            response = requests.post(
                f"{self.base_url}/admin/login",
                json={"username": "admin", "password": "admin123"},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("token")
                self.log_test("Admin Login", True, f"Token received: {self.admin_token[:20]}...")
                return True
            else:
                self.log_test("Admin Login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Login", False, f"Exception: {str(e)}")
            return False
    
    def get_admin_headers(self) -> Dict[str, str]:
        """Get headers with admin token"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.admin_token}"
        }
    
    def test_create_coupon(self) -> str:
        """Test coupon creation via admin API"""
        try:
            # Use a timestamp to make the coupon code unique
            import time
            timestamp = str(int(time.time()))[-4:]  # Last 4 digits of timestamp
            coupon_code = f"SAVE15{timestamp}"
            
            coupon_data = {
                "code": coupon_code,
                "discount_percentage": 15.0,
                "min_order_value": 100.0,
                "is_active": True,
                "expiry_date": (datetime.utcnow() + timedelta(days=30)).isoformat()
            }
            
            response = requests.post(
                f"{self.base_url}/admin/coupons",
                json=coupon_data,
                headers=self.get_admin_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                coupon_id = data.get("id")
                self.coupon_code = coupon_code  # Store for later tests
                self.log_test("Create Coupon", True, f"Coupon created with ID: {coupon_id}, Code: {coupon_code}")
                return coupon_id
            else:
                self.log_test("Create Coupon", False, f"Status: {response.status_code}, Response: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Create Coupon", False, f"Exception: {str(e)}")
            return None
    
    def test_get_coupons(self) -> bool:
        """Test retrieving all coupons"""
        try:
            response = requests.get(
                f"{self.base_url}/admin/coupons",
                headers=self.get_admin_headers()
            )
            
            if response.status_code == 200:
                coupons = response.json()
                coupon_found = any(coupon.get("code") == self.coupon_code for coupon in coupons)
                
                if coupon_found:
                    self.log_test("Get Coupons", True, f"Found {len(coupons)} coupons, {self.coupon_code} coupon exists")
                    return True
                else:
                    self.log_test("Get Coupons", False, f"{self.coupon_code} coupon not found in list")
                    return False
            else:
                self.log_test("Get Coupons", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Coupons", False, f"Exception: {str(e)}")
            return False
    
    def test_validate_coupon_valid(self) -> bool:
        """Test coupon validation with valid coupon and sufficient order total"""
        try:
            validation_data = {
                "code": self.coupon_code,
                "order_total": 150.0  # Above minimum order value of 100
            }
            
            response = requests.post(
                f"{self.base_url}/coupons/validate",
                json=validation_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                is_valid = data.get("valid", False)
                discount_percentage = data.get("discount_percentage", 0)
                discount_amount = data.get("discount_amount", 0)
                
                expected_discount = 150.0 * 0.15  # 15% of 150 = 22.5
                
                if is_valid and discount_percentage == 15.0 and abs(discount_amount - expected_discount) < 0.01:
                    self.log_test("Validate Coupon (Valid)", True, 
                                f"Discount: {discount_percentage}%, Amount: {discount_amount} SAR")
                    return True
                else:
                    self.log_test("Validate Coupon (Valid)", False, 
                                f"Valid: {is_valid}, Discount: {discount_percentage}%, Amount: {discount_amount}")
                    return False
            else:
                self.log_test("Validate Coupon (Valid)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Validate Coupon (Valid)", False, f"Exception: {str(e)}")
            return False
    
    def test_validate_coupon_insufficient_order(self) -> bool:
        """Test coupon validation with order total below minimum"""
        try:
            validation_data = {
                "code": self.coupon_code,
                "order_total": 50.0  # Below minimum order value of 100
            }
            
            response = requests.post(
                f"{self.base_url}/coupons/validate",
                json=validation_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                is_valid = data.get("valid", True)  # Should be False
                message = data.get("message", "")
                
                if not is_valid and "Minimum order value" in message:
                    self.log_test("Validate Coupon (Insufficient Order)", True, f"Correctly rejected: {message}")
                    return True
                else:
                    self.log_test("Validate Coupon (Insufficient Order)", False, 
                                f"Valid: {is_valid}, Message: {message}")
                    return False
            else:
                self.log_test("Validate Coupon (Insufficient Order)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Validate Coupon (Insufficient Order)", False, f"Exception: {str(e)}")
            return False
    
    def test_validate_coupon_invalid_code(self) -> bool:
        """Test coupon validation with invalid coupon code"""
        try:
            validation_data = {
                "code": "INVALID123",
                "order_total": 150.0
            }
            
            response = requests.post(
                f"{self.base_url}/coupons/validate",
                json=validation_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                is_valid = data.get("valid", True)  # Should be False
                message = data.get("message", "")
                
                if not is_valid and "Invalid coupon code" in message:
                    self.log_test("Validate Coupon (Invalid Code)", True, f"Correctly rejected: {message}")
                    return True
                else:
                    self.log_test("Validate Coupon (Invalid Code)", False, 
                                f"Valid: {is_valid}, Message: {message}")
                    return False
            else:
                self.log_test("Validate Coupon (Invalid Code)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Validate Coupon (Invalid Code)", False, f"Exception: {str(e)}")
            return False
    
    def get_test_product(self) -> Dict[str, Any]:
        """Get a test product for order creation"""
        try:
            response = requests.get(f"{self.base_url}/products")
            
            if response.status_code == 200:
                products = response.json()
                # Find a product with sufficient stock
                for product in products:
                    if product.get("quantity", 0) > 0:
                        return {
                            "id": product["id"],
                            "name_en": product["name_en"],
                            "name_ar": product["name_ar"],
                            "price": product["price"],
                            "image": product["images"][0] if product["images"] else ""
                        }
            return None
            
        except Exception as e:
            print(f"Error getting test product: {str(e)}")
            return None
    
    def test_create_order_with_coupon(self) -> bool:
        """Test creating an order with coupon applied"""
        try:
            # Get a test product
            test_product = self.get_test_product()
            if not test_product:
                self.log_test("Create Order with Coupon", False, "No test product available")
                return False
            
            # Calculate order totals
            quantity = 2
            subtotal = test_product["price"] * quantity
            discount_percentage = 15.0
            discount_amount = subtotal * (discount_percentage / 100)
            total = subtotal - discount_amount
            
            order_data = {
                "customer_name": "Test Customer",
                "phone": "+966501234567",
                "city": "Riyadh",
                "address": "Test Address 123",
                "items": [{
                    "product_id": test_product["id"],
                    "name_en": test_product["name_en"],
                    "name_ar": test_product["name_ar"],
                    "price": test_product["price"],
                    "quantity": quantity,
                    "image": test_product["image"]
                }],
                "subtotal": subtotal,
                "discount": discount_amount,
                "total": total,
                "coupon_code": self.coupon_code
            }
            
            response = requests.post(
                f"{self.base_url}/orders",
                json=order_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                order_id = data.get("id")
                applied_coupon = data.get("coupon_code")
                order_discount = data.get("discount", 0)
                
                if applied_coupon == self.coupon_code and abs(order_discount - discount_amount) < 0.01:
                    self.log_test("Create Order with Coupon", True, 
                                f"Order created with ID: {order_id}, Discount: {order_discount} SAR")
                    return True
                else:
                    self.log_test("Create Order with Coupon", False, 
                                f"Coupon: {applied_coupon}, Discount: {order_discount}")
                    return False
            else:
                self.log_test("Create Order with Coupon", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Order with Coupon", False, f"Exception: {str(e)}")
            return False
    
    def test_coupon_usage_increment(self) -> bool:
        """Test that coupon usage count is incremented after validation"""
        try:
            # Get current usage count
            response = requests.get(
                f"{self.base_url}/admin/coupons",
                headers=self.get_admin_headers()
            )
            
            if response.status_code != 200:
                self.log_test("Coupon Usage Increment", False, "Failed to get coupons")
                return False
            
            coupons = response.json()
            save15_coupon = next((c for c in coupons if c.get("code") == "SAVE15"), None)
            
            if not save15_coupon:
                self.log_test("Coupon Usage Increment", False, "SAVE15 coupon not found")
                return False
            
            initial_usage = save15_coupon.get("usage_count", 0)
            
            # Validate coupon to increment usage
            validation_data = {
                "code": "SAVE15",
                "order_total": 150.0
            }
            
            requests.post(
                f"{self.base_url}/coupons/validate",
                json=validation_data,
                headers={"Content-Type": "application/json"}
            )
            
            # Check usage count again
            response = requests.get(
                f"{self.base_url}/admin/coupons",
                headers=self.get_admin_headers()
            )
            
            if response.status_code == 200:
                coupons = response.json()
                save15_coupon = next((c for c in coupons if c.get("code") == "SAVE15"), None)
                
                if save15_coupon:
                    new_usage = save15_coupon.get("usage_count", 0)
                    
                    if new_usage > initial_usage:
                        self.log_test("Coupon Usage Increment", True, 
                                    f"Usage count increased from {initial_usage} to {new_usage}")
                        return True
                    else:
                        self.log_test("Coupon Usage Increment", False, 
                                    f"Usage count not incremented: {initial_usage} -> {new_usage}")
                        return False
                else:
                    self.log_test("Coupon Usage Increment", False, "SAVE15 coupon not found after validation")
                    return False
            else:
                self.log_test("Coupon Usage Increment", False, "Failed to get coupons after validation")
                return False
                
        except Exception as e:
            self.log_test("Coupon Usage Increment", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all coupon-related tests"""
        print("=" * 60)
        print("ZAYLUX STORE - COUPON FLOW BACKEND TESTING")
        print("=" * 60)
        
        # Step 1: Admin Login
        if not self.admin_login():
            print("\n❌ CRITICAL: Admin login failed. Cannot proceed with coupon tests.")
            return
        
        # Step 2: Create Coupon
        coupon_id = self.test_create_coupon()
        if not coupon_id:
            print("\n❌ CRITICAL: Coupon creation failed. Cannot proceed with validation tests.")
            return
        
        # Step 3: Verify Coupon in List
        self.test_get_coupons()
        
        # Step 4: Test Coupon Validation (Valid Case)
        self.test_validate_coupon_valid()
        
        # Step 5: Test Coupon Validation (Insufficient Order)
        self.test_validate_coupon_insufficient_order()
        
        # Step 6: Test Coupon Validation (Invalid Code)
        self.test_validate_coupon_invalid_code()
        
        # Step 7: Test Order Creation with Coupon
        self.test_create_order_with_coupon()
        
        # Step 8: Test Usage Count Increment
        self.test_coupon_usage_increment()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if "✅" in result["status"])
        total = len(self.test_results)
        
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
        
        print(f"\nOVERALL: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED - Coupon flow is working correctly!")
        else:
            print("⚠️  SOME TESTS FAILED - Review the failures above")

if __name__ == "__main__":
    tester = ZayluxBackendTester()
    tester.run_all_tests()