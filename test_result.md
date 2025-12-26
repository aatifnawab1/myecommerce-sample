# Test Result Document

## Current Test: Active Coupons Display Feature

### Test Objectives
1. Test /api/coupons/active endpoint returns only active, non-expired coupons
2. Test Landing Page shows "Available Offers" section
3. Test Checkout page shows available coupons with Apply button
4. Test clicking Apply auto-fills and applies the coupon
5. Test bilingual support (EN/AR)
6. Test discount calculation is correct

### Backend API
- GET /api/coupons/active - Returns active, non-expired coupons

### Frontend Pages Updated
- Home.js - Added "Available Offers" section
- Checkout.js - Added available coupons list with Apply buttons

### Incorporate User Feedback
- Verify coupon codes display correctly in both languages
- Verify minimum order requirement is enforced
- Verify discount is calculated correctly

