#!/usr/bin/env python3
"""
Backend API Testing for Zaylux Store - WhatsApp Order Confirmation Feature
Tests the complete WhatsApp order confirmation workflow including webhook handling.
"""

import requests
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any
import time

# Load environment variables
BACKEND_URL = "https://zaylux-launch.preview.emergentagent.com/api"

class ZayluxBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.admin_token = None
        self.test_results = []
        self.test_order_id = None  # Store created order ID for webhook tests
        self.test_public_order_id = None  # Store public order ID
        
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
    
    def test_create_order_with_whatsapp(self) -> bool:
        """Test creating an order with WhatsApp confirmation (Feature 1)"""
        try:
            # Get a test product
            test_product = self.get_test_product()
            if not test_product:
                self.log_test("Create Order with WhatsApp", False, "No test product available")
                return False
            
            # Create order data with realistic Saudi phone number
            quantity = 1
            subtotal = test_product["price"] * quantity
            total = subtotal
            
            order_data = {
                "customer_name": "Ahmed Al-Rashid",
                "phone": "+966501234567",  # Saudi phone number for webhook testing
                "city": "Riyadh",
                "address": "King Fahd Road, Al Olaya District, Building 123, Apt 45",
                "items": [{
                    "product_id": test_product["id"],
                    "name_en": test_product["name_en"],
                    "name_ar": test_product["name_ar"],
                    "price": test_product["price"],
                    "quantity": quantity,
                    "image": test_product["image"]
                }],
                "subtotal": subtotal,
                "discount": 0.0,
                "total": total
            }
            
            response = requests.post(
                f"{self.base_url}/orders",
                json=order_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                order_id = data.get("id")
                public_order_id = data.get("public_order_id")
                confirmation_status = data.get("confirmation_status")
                
                # Store for webhook tests
                self.test_order_id = order_id
                self.test_public_order_id = public_order_id
                
                # Verify order created with pending confirmation status
                if confirmation_status == "pending" and public_order_id and public_order_id.startswith("ZAY-"):
                    self.log_test("Create Order with WhatsApp", True, 
                                f"Order created: {public_order_id}, Status: {confirmation_status}")
                    return True
                else:
                    self.log_test("Create Order with WhatsApp", False, 
                                f"Confirmation status: {confirmation_status}, Public ID: {public_order_id}")
                    return False
            else:
                self.log_test("Create Order with WhatsApp", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Order with WhatsApp", False, f"Exception: {str(e)}")
            return False
    
    def test_whatsapp_webhook_yes_reply(self) -> bool:
        """Test WhatsApp webhook with YES reply (Feature 2)"""
        try:
            if not self.test_order_id:
                self.log_test("WhatsApp Webhook YES Reply", False, "No test order available")
                return False
            
            # Simulate Twilio webhook form data for YES reply
            webhook_data = {
                "From": "whatsapp:+966501234567",
                "Body": "YES"
            }
            
            response = requests.post(
                f"{self.base_url}/whatsapp/webhook",
                data=webhook_data,  # Use form data, not JSON
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                # Check if order was updated
                time.sleep(1)  # Brief delay for database update
                
                order_response = requests.get(
                    f"{self.base_url}/admin/orders/{self.test_order_id}",
                    headers=self.get_admin_headers()
                )
                
                if order_response.status_code == 200:
                    order_data = order_response.json()
                    confirmation_status = order_data.get("confirmation_status")
                    order_status = order_data.get("status")
                    
                    if confirmation_status == "confirmed" and order_status == "Confirmed":
                        self.log_test("WhatsApp Webhook YES Reply", True, 
                                    f"Order updated: confirmation_status={confirmation_status}, status={order_status}")
                        return True
                    else:
                        self.log_test("WhatsApp Webhook YES Reply", False, 
                                    f"Status not updated: confirmation_status={confirmation_status}, status={order_status}")
                        return False
                else:
                    self.log_test("WhatsApp Webhook YES Reply", False, f"Failed to fetch order: {order_response.status_code}")
                    return False
            else:
                self.log_test("WhatsApp Webhook YES Reply", False, f"Webhook failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("WhatsApp Webhook YES Reply", False, f"Exception: {str(e)}")
            return False
    
    def test_create_second_order_for_no_test(self) -> bool:
        """Create a second order for NO reply testing"""
        try:
            # Get a test product
            test_product = self.get_test_product()
            if not test_product:
                return False
            
            # Create order data with different phone number
            quantity = 1
            subtotal = test_product["price"] * quantity
            total = subtotal
            
            order_data = {
                "customer_name": "Fatima Al-Zahra",
                "phone": "+966509876543",  # Different phone number for NO test
                "city": "Jeddah",
                "address": "Prince Sultan Road, Al Hamra District, Building 456, Apt 78",
                "items": [{
                    "product_id": test_product["id"],
                    "name_en": test_product["name_en"],
                    "name_ar": test_product["name_ar"],
                    "price": test_product["price"],
                    "quantity": quantity,
                    "image": test_product["image"]
                }],
                "subtotal": subtotal,
                "discount": 0.0,
                "total": total
            }
            
            response = requests.post(
                f"{self.base_url}/orders",
                json=order_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                # Store the second order ID for NO test
                self.test_order_id_no = data.get("id")
                self.test_public_order_id_no = data.get("public_order_id")
                return True
            return False
                
        except Exception as e:
            return False
    
    def test_whatsapp_webhook_no_reply_arabic(self) -> bool:
        """Test WhatsApp webhook with NO reply in Arabic (Feature 3)"""
        try:
            # Create a second order for this test
            if not self.test_create_second_order_for_no_test():
                self.log_test("WhatsApp Webhook NO Reply (Arabic)", False, "Failed to create test order")
                return False
            
            # Simulate Twilio webhook form data for NO reply in Arabic
            webhook_data = {
                "From": "whatsapp:+966509876543",
                "Body": "لا"  # Arabic "No"
            }
            
            response = requests.post(
                f"{self.base_url}/whatsapp/webhook",
                data=webhook_data,  # Use form data, not JSON
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                # Check if order was updated
                time.sleep(1)  # Brief delay for database update
                
                order_response = requests.get(
                    f"{self.base_url}/admin/orders/{self.test_order_id_no}",
                    headers=self.get_admin_headers()
                )
                
                if order_response.status_code == 200:
                    order_data = order_response.json()
                    confirmation_status = order_data.get("confirmation_status")
                    order_status = order_data.get("status")
                    
                    if confirmation_status == "cancelled" and order_status == "Cancelled":
                        self.log_test("WhatsApp Webhook NO Reply (Arabic)", True, 
                                    f"Order cancelled: confirmation_status={confirmation_status}, status={order_status}")
                        return True
                    else:
                        self.log_test("WhatsApp Webhook NO Reply (Arabic)", False, 
                                    f"Status not updated: confirmation_status={confirmation_status}, status={order_status}")
                        return False
                else:
                    self.log_test("WhatsApp Webhook NO Reply (Arabic)", False, f"Failed to fetch order: {order_response.status_code}")
                    return False
            else:
                self.log_test("WhatsApp Webhook NO Reply (Arabic)", False, f"Webhook failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("WhatsApp Webhook NO Reply (Arabic)", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_orders_with_confirmation_filter(self) -> bool:
        """Test admin orders page with confirmation_status filter (Feature 4)"""
        try:
            # Test getting all orders
            response = requests.get(
                f"{self.base_url}/admin/orders",
                headers=self.get_admin_headers()
            )
            
            if response.status_code != 200:
                self.log_test("Admin Orders Filter", False, f"Failed to get orders: {response.status_code}")
                return False
            
            all_orders = response.json()
            
            # Count orders that actually have confirmation_status field
            orders_with_confirmation = [o for o in all_orders if 'confirmation_status' in o]
            pending_count = len([o for o in orders_with_confirmation if o.get("confirmation_status") == "pending"])
            confirmed_count = len([o for o in orders_with_confirmation if o.get("confirmation_status") == "confirmed"])
            cancelled_count = len([o for o in orders_with_confirmation if o.get("confirmation_status") == "cancelled"])
            
            # Test filter by "pending"
            response = requests.get(
                f"{self.base_url}/admin/orders?confirmation_status=pending",
                headers=self.get_admin_headers()
            )
            
            if response.status_code != 200:
                self.log_test("Admin Orders Filter", False, f"Failed to filter pending: {response.status_code}")
                return False
            
            pending_orders = response.json()
            
            # Test filter by "confirmed"
            response = requests.get(
                f"{self.base_url}/admin/orders?confirmation_status=confirmed",
                headers=self.get_admin_headers()
            )
            
            if response.status_code != 200:
                self.log_test("Admin Orders Filter", False, f"Failed to filter confirmed: {response.status_code}")
                return False
            
            confirmed_orders = response.json()
            
            # Test filter by "cancelled"
            response = requests.get(
                f"{self.base_url}/admin/orders?confirmation_status=cancelled",
                headers=self.get_admin_headers()
            )
            
            if response.status_code != 200:
                self.log_test("Admin Orders Filter", False, f"Failed to filter cancelled: {response.status_code}")
                return False
            
            cancelled_orders = response.json()
            
            # Verify filtering works correctly
            filter_success = (
                len(pending_orders) == pending_count and
                len(confirmed_orders) == confirmed_count and
                len(cancelled_orders) == cancelled_count
            )
            
            if filter_success:
                self.log_test("Admin Orders Filter", True, 
                            f"Filters work correctly: pending={len(pending_orders)}, confirmed={len(confirmed_orders)}, cancelled={len(cancelled_orders)}")
                return True
            else:
                self.log_test("Admin Orders Filter", False, 
                            f"Filter mismatch: expected pending={pending_count}, got={len(pending_orders)}; expected confirmed={confirmed_count}, got={len(confirmed_orders)}; expected cancelled={cancelled_count}, got={len(cancelled_orders)}")
                return False
                
        except Exception as e:
            self.log_test("Admin Orders Filter", False, f"Exception: {str(e)}")
            return False
    
    def test_order_details_confirmation_status(self) -> bool:
        """Test that order details show confirmation status (Feature 5)"""
        try:
            if not self.test_order_id:
                self.log_test("Order Details Confirmation Status", False, "No test order available")
                return False
            
            response = requests.get(
                f"{self.base_url}/admin/orders/{self.test_order_id}",
                headers=self.get_admin_headers()
            )
            
            if response.status_code == 200:
                order_data = response.json()
                confirmation_status = order_data.get("confirmation_status")
                public_order_id = order_data.get("public_order_id")
                
                if confirmation_status and public_order_id:
                    self.log_test("Order Details Confirmation Status", True, 
                                f"Order {public_order_id} has confirmation_status: {confirmation_status}")
                    return True
                else:
                    self.log_test("Order Details Confirmation Status", False, 
                                f"Missing fields: confirmation_status={confirmation_status}, public_order_id={public_order_id}")
                    return False
            else:
                self.log_test("Order Details Confirmation Status", False, f"Failed to get order: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Order Details Confirmation Status", False, f"Exception: {str(e)}")
            return False
    
    def run_whatsapp_tests(self):
        """Run all WhatsApp order confirmation tests"""
        print("=" * 70)
        print("ZAYLUX STORE - WHATSAPP ORDER CONFIRMATION TESTING")
        print("=" * 70)
        
        # Step 1: Admin Login
        if not self.admin_login():
            print("\n❌ CRITICAL: Admin login failed. Cannot proceed with tests.")
            return
        
        # Step 2: Test Order Creation with WhatsApp
        print("\n🔸 Testing Order Creation with WhatsApp...")
        self.test_create_order_with_whatsapp()
        
        # Step 3: Test WhatsApp Webhook YES Reply
        print("\n🔸 Testing WhatsApp Webhook YES Reply...")
        self.test_whatsapp_webhook_yes_reply()
        
        # Step 4: Test WhatsApp Webhook NO Reply (Arabic)
        print("\n🔸 Testing WhatsApp Webhook NO Reply (Arabic)...")
        self.test_whatsapp_webhook_no_reply_arabic()
        
        # Step 5: Test Admin Orders Filter
        print("\n🔸 Testing Admin Orders Filter...")
        self.test_admin_orders_with_confirmation_filter()
        
        # Step 6: Test Order Details Confirmation Status
        print("\n🔸 Testing Order Details Confirmation Status...")
        self.test_order_details_confirmation_status()
        
        # Summary
        print("\n" + "=" * 70)
        print("WHATSAPP ORDER CONFIRMATION TEST SUMMARY")
        print("=" * 70)
        
        passed = sum(1 for result in self.test_results if "✅" in result["status"])
        total = len(self.test_results)
        
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details'] and "❌" in result['status']:
                print(f"   → {result['details']}")
        
        print(f"\nOVERALL: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL WHATSAPP TESTS PASSED - Order confirmation flow is working correctly!")
        else:
            print("⚠️  SOME TESTS FAILED - Review the failures above")
            
        return passed == total

if __name__ == "__main__":
    tester = ZayluxBackendTester()
    success = tester.run_whatsapp_tests()
    
    if not success:
        print("\n" + "=" * 70)
        print("🔍 DEBUGGING INFORMATION")
        print("=" * 70)
        print("If tests are failing, check:")
        print("1. Backend service is running (supervisor status)")
        print("2. MongoDB is accessible")
        print("3. Twilio credentials are configured in backend/.env")
        print("4. Products exist in database for order creation")
        print("5. Admin user exists (admin/admin123)")
        
        # Check backend logs
        print("\n📋 Recent backend logs:")
        import subprocess
        try:
            result = subprocess.run(
                ["tail", "-n", "20", "/var/log/supervisor/backend.err.log"],
                capture_output=True, text=True, timeout=5
            )
            if result.stdout:
                print(result.stdout)
        except:
            print("Could not retrieve backend logs")