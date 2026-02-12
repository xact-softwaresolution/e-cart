/**
 * PAYMENT MODULE - COMPLETE INTEGRATION GUIDE
 * ============================================
 *
 * Shows how Order Module and Payment Module work together
 */

// ============================================
// COMPLETE CHECKOUT FLOW
// ============================================

/*
USER JOURNEY:

1. AUTHENTICATION
   ├─ POST /api/v1/auth/register
   └─ POST /api/v1/auth/login
      → Get JWT Token

2. SHOPPING
   ├─ GET /api/v1/products
   ├─ POST /api/v1/cart/add
   ├─ GET /api/v1/cart
   └─ PATCH /api/v1/cart/items/:itemId

3. CHECKOUT PREPARATION
   ├─ POST /api/v1/users/addresses (Add delivery address)
   └─ GET /api/v1/users/addresses (Get addresses)

4. CREATE ORDER
   POST /api/v1/orders
   Input:
   {
     "addressId": "addr-123",
     "cartItems": [
       {
         "productId": "prod-1",
         "quantity": 2,
         "price": 500
       }
     ],
     "totalAmount": 1000
   }
   
   Output:
   {
     "id": "order-123",
     "userId": "user-123",
     "status": "PENDING",
     "paymentStatus": "PENDING",
     "totalAmount": 1000,
     "items": [...]
   }
   
   Effects:
   ✓ Order created
   ✓ Cart cleared
   ✓ Stock reduced
   ✓ Payment record created

5. INITIATE PAYMENT
   POST /api/v1/payments/initiate
   Input:
   {
     "orderId": "order-123",
     "amount": 1000,
     "currency": "INR"
   }
   
   Output:
   {
     "payment": {...},
     "razorpayOrder": {
       "id": "order_xxxx",
       "amount": 100000 (in paise)
     },
     "keyId": "rzp_test_xxxxx"
   }

6. PROCESS PAYMENT
   (Razorpay Dialog opens on frontend)
   User selects payment method:
   - Credit/Debit Card
   - UPI
   - Wallet
   - Net Banking
   
   Returns:
   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature

7. VERIFY PAYMENT
   POST /api/v1/payments/verify
   Input:
   {
     "orderId": "order-123",
     "razorpay_order_id": "order_xxxx",
     "razorpay_payment_id": "pay_xxxx",
     "razorpay_signature": "signature"
   }
   
   Backend Actions:
   ✓ Validates signature
   ✓ Confirms payment with Razorpay
   ✓ Updates payment status → COMPLETED
   ✓ Updates order status → PROCESSING
   ✓ Triggers order confirmation

8. CONFIRMATION
   User sees:
   - Order confirmation
   - Payment receipt
   - Tracking info
   - Shipping details

9. ONGOING
   ├─ GET /api/v1/orders/{orderId} (Track order)
   ├─ GET /api/v1/payments/order/{orderId} (Payment details)
   └─ PATCH /api/v1/orders/{orderId}/status (Admin updates)
*/

// ============================================
// DATABASE RELATIONSHIPS
// ============================================

/*
User
  ├─ Cart (1:1)
  │  └─ CartItem (1:many)
  │     └─ Product (ref)
  │
  ├─ Address (1:many)
  │
  └─ Order (1:many)
     ├─ OrderItem (1:many)
     │  └─ Product (ref)
     │
     ├─ Payment (1:1)
     │  └─ Razorpay Transaction

When Order is created:
1. Cart items → Order items
2. Payment record created (PENDING)
3. Stock reduced
4. Cart cleared

When Payment verified:
1. Payment record updated (COMPLETED)
2. Order status updated (PROCESSING)
3. Order ready for shipping
*/

// ============================================
// ERROR SCENARIOS & HANDLING
// ============================================

/*
PAYMENT FAILS:
├─ User can retry
├─ Order stays PENDING
├─ Payment status stays PENDING
└─ Stock remains reserved

PAYMENT TIMEOUT:
├─ Razorpay cancels order
├─ Payment marked FAILED
├─ User can create new order
└─ Stock returned to inventory

SIGNATURE MISMATCH:
├─ Payment not verified
├─ Order stays PENDING
├─ User must retry payment
└─ Prevent payment acceptance

USER CANCELS ORDER:
├─ Admin/user calls PATCH /orders/{id}/status
├─ Status changes to CANCELLED
├─ Stock is restored
├─ Payment can be refunded
└─ User receives refund

PARTIAL REFUND:
├─ POST /payments/{id}/refund with amount
├─ Razorpay returns partial amount
├─ Order marked CANCELLED
└─ Difference amount not returned

FULL REFUND:
├─ POST /payments/{id}/refund (no amount)
├─ Razorpay returns full amount
├─ Order marked CANCELLED
└─ User gets full refund
*/

// ============================================
// API SEQUENCE FOR E-CART SYSTEM
// ============================================

/*
STEP 1: User Registration & Login
────────────────────────────────────

POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}

Save token for all future requests!


STEP 2: Browse Products
──────────────────────

GET /api/v1/products?page=1&limit=20&category=electronics

Response:
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "prod-1",
        "name": "Laptop",
        "price": 50000,
        "stock": 10,
        "imageUrl": "..."
      }
    ]
  }
}


STEP 3: Add to Cart
──────────────────

POST /api/v1/cart/add
Headers: Authorization: Bearer {token}
{
  "productId": "prod-1",
  "quantity": 1
}

Response:
{
  "status": "success",
  "data": {
    "id": "cart-123",
    "items": [
      {
        "id": "item-1",
        "product": { "id": "prod-1", "name": "Laptop", "price": 50000 },
        "quantity": 1
      }
    ],
    "totalAmount": 50000
  }
}


STEP 4: Add Delivery Address
──────────────────────────────

POST /api/v1/users/addresses
Headers: Authorization: Bearer {token}
{
  "street": "123 Main St",
  "city": "Delhi",
  "state": "DL",
  "zip": "110001",
  "country": "India",
  "isDefault": true
}

Response:
{
  "status": "success",
  "data": {
    "id": "addr-123",
    "userId": "user-123",
    "street": "123 Main St",
    ...
  }
}


STEP 5: Create Order
────────────────────

POST /api/v1/orders
Headers: Authorization: Bearer {token}
{
  "addressId": "addr-123",
  "cartItems": [
    {
      "productId": "prod-1",
      "quantity": 1,
      "price": 50000
    }
  ],
  "totalAmount": 50000
}

Response:
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": "order-123",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "totalAmount": 50000,
    "items": [...]
  }
}


STEP 6: Initiate Payment
─────────────────────────

POST /api/v1/payments/initiate
Headers: Authorization: Bearer {token}
{
  "orderId": "order-123",
  "amount": 50000,
  "currency": "INR"
}

Response:
{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "razorpayOrder": {
      "id": "order_IlqN8mR2k6zWNs",
      "amount": 5000000,
      "currency": "INR"
    },
    "keyId": "rzp_test_xxxxx"
  }
}


STEP 7: Complete Razorpay Payment
──────────────────────────────────

(Frontend handles Razorpay popup)

User enters card details:
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: Auto-confirmed (test mode)

Razorpay returns:
{
  "razorpay_order_id": "order_IlqN8mR2k6zWNs",
  "razorpay_payment_id": "pay_IlqN8tqj5rsnHd",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}


STEP 8: Verify Payment
──────────────────────

POST /api/v1/payments/verify
Headers: Authorization: Bearer {token}
{
  "orderId": "order-123",
  "razorpay_order_id": "order_IlqN8mR2k6zWNs",
  "razorpay_payment_id": "pay_IlqN8tqj5rsnHd",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}

Response:
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": "pay-record-123",
      "orderId": "order-123",
      "status": "COMPLETED",
      "transactionId": "pay_IlqN8tqj5rsnHd"
    },
    "order": {
      "id": "order-123",
      "status": "PROCESSING",
      "paymentStatus": "COMPLETED"
    }
  }
}


STEP 9: Get Order Details & Track
───────────────────────────────────

GET /api/v1/orders/{orderId}
Headers: Authorization: Bearer {token}

Response shows:
- Current order status
- Shipping address
- Items ordered
- Payment details
- Delivery timeline


STEP 10 (Optional): Request Refund
──────────────────────────────────

POST /api/v1/payments/{paymentId}/refund
Headers: Authorization: Bearer {token}
{
  "amount": 50000,
  "reason": "Changed mind"
}

Response:
{
  "status": "success",
  "message": "Refund processed successfully",
  "data": {
    "refund": {
      "id": "rfnd_...",
      "amount": 50000,
      "status": "processed"
    }
  }
}
*/

// ============================================
// SECURITY MEASURES
// ============================================

/*
✅ PAYMENT SECURITY:
1. Signature Verification
   - Every payment verified with HMAC-SHA256
   - Uses secret key (never exposed to frontend)
   - Prevents tampered payments

2. JWT Authentication
   - All endpoints require valid JWT token
   - Token includes user ID
   - Ensures user owns the payment

3. Server-side Validation
   - Amount verified against order
   - Address verified
   - Stock verified
   - Payment processed server-side (not client)

4. Razorpay Security
   - Razorpay handles payment details
   - No card data on your server
   - PCI-DSS compliant
   - Encrypted transmission

5. Environment Security
   - Keys stored in .env (not in code)
   - Secret key never exposed to frontend
   - Only Key ID sent to frontend

6. Transaction Atomicity
   - Stock updates within transaction
   - Cart cleared atomically
   - Order and payment linked

7. HTTPS Required
   - All production APIs use HTTPS
   - Prevents man-in-the-middle attacks

8. Rate Limiting (To add)
   - Prevent payment spam
   - Prevent refund abuse
*/

// ============================================
// POST-PAYMENT WORKFLOWS
// ============================================

/*
AFTER SUCCESSFUL PAYMENT:

1. Order Processing
   ├─ Admin receives notification
   ├─ Order moves to warehouse
   ├─ Items packed
   └─ Shipping label generated

2. User Notifications (To implement)
   ├─ Order confirmation email
   ├─ Payment receipt
   ├─ Shipping notification
   ├─ Delivery notification
   └─ Post-delivery followup

3. Analytics
   ├─ Track revenue
   ├─ Monitor payment methods
   ├─ Identify trends
   └─ Report to admin

4. Inventory Management
   ├─ Stock reduced on order
   ├─ Low stock alerts
   ├─ Reorder suggestions
   └─ Demand forecasting

5. Customer Support
   ├─ Track refunds
   ├─ Monitor disputes
   ├─ Handle complaints
   └─ RTO management (Returns)
*/

module.exports = {
  // Integration guide only
};
