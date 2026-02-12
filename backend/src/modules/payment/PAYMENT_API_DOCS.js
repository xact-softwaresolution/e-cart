/**
 * PAYMENT MODULE - API ENDPOINTS & EXAMPLES
 * ==========================================
 *
 * Complete guide for testing the Payment Module
 * Razorpay Integration for Payment Gateway
 */

// ============================================
// SETUP: Add to .env file
// ============================================
/*
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

To get credentials:
1. Go to https://dashboard.razorpay.com
2. Navigate to Settings → API Keys
3. Generate API Key and Secret
4. Add them to .env
*/

// ============================================
// INSTALL: Add Razorpay SDK
// ============================================
// npm install razorpay

// ============================================
// 1. INITIATE PAYMENT (Create Razorpay Order)
// ============================================
// POST /api/v1/payments/initiate
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>
//   - Content-Type: application/json

/*
Request Body:
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 2000,
  "currency": "INR"
}

Response (201 Created):
{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "payment": {
      "id": "payment-id-123",
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 2000,
      "currency": "INR",
      "provider": "RAZORPAY",
      "status": "PENDING",
      "transactionId": "order_1234567890abcd",
      "createdAt": "2026-02-12T10:30:00Z"
    },
    "razorpayOrder": {
      "id": "order_1234567890abcd",
      "amount": 200000,
      "currency": "INR"
    },
    "keyId": "rzp_test_xxxxxxxxxxxxx"
  }
}

Frontend Flow:
1. Use razorpayOrder.id to initiate Razorpay payment dialog
2. User completes payment on Razorpay
3. On success, receive:
   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature
4. Send these to verify endpoint
*/

// ============================================
// 2. VERIFY PAYMENT (Confirm Payment)
// ============================================
// POST /api/v1/payments/verify
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>
//   - Content-Type: application/json

/*
Request Body:
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "razorpay_order_id": "order_1234567890abcd",
  "razorpay_payment_id": "pay_1234567890abcd",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}

Response (200 OK):
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": "payment-id-123",
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 2000,
      "currency": "INR",
      "provider": "RAZORPAY",
      "transactionId": "pay_1234567890abcd",
      "status": "COMPLETED",
      "createdAt": "2026-02-12T10:30:00Z"
    },
    "order": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PROCESSING",
      "paymentStatus": "COMPLETED",
      "totalAmount": "2000",
      "createdAt": "2026-02-12T10:30:00Z",
      "items": [...]
    }
  }
}

Features:
- ✅ Signature verification (security check)
- ✅ Payment status validation
- ✅ Order status auto-update to PROCESSING
- ✅ Transaction ID storage
*/

// ============================================
// 3. GET PAYMENT DETAILS
// ============================================
// GET /api/v1/payments/:paymentId
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>

/*
Example URL: GET /api/v1/payments/payment-id-123

Response (200 OK):
{
  "status": "success",
  "data": {
    "id": "payment-id-123",
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 2000,
    "currency": "INR",
    "provider": "RAZORPAY",
    "transactionId": "pay_1234567890abcd",
    "status": "COMPLETED",
    "createdAt": "2026-02-12T10:30:00Z",
    "order": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PROCESSING",
      "totalAmount": "2000",
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [...]
    }
  }
}
*/

// ============================================
// 4. GET PAYMENT BY ORDER ID
// ============================================
// GET /api/v1/payments/order/:orderId
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>

/*
Example URL: GET /api/v1/payments/order/550e8400-e29b-41d4-a716-446655440000

Response (200 OK): Same as Get Payment Details
*/

// ============================================
// 5. GET USER'S PAYMENTS
// ============================================
// GET /api/v1/payments?page=1&limit=10
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>

/*
Query Parameters:
- page: 1 (optional)
- limit: 10 (optional)

Response (200 OK):
{
  "status": "success",
  "data": {
    "payments": [
      {
        "id": "payment-1",
        "orderId": "order-1",
        "amount": 2000,
        "currency": "INR",
        "provider": "RAZORPAY",
        "status": "COMPLETED",
        "createdAt": "2026-02-12T10:30:00Z",
        "order": {
          "id": "order-1",
          "status": "DELIVERED",
          "totalAmount": "2000",
          "createdAt": "2026-02-12T10:30:00Z"
        }
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
*/

// ============================================
// 6. PROCESS REFUND
// ============================================
// POST /api/v1/payments/:paymentId/refund
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>
//   - Content-Type: application/json

/*
Request Body:
{
  "amount": 2000,
  "reason": "Customer requested refund"
}

Note: If amount is not provided, full refund is processed

Response (200 OK):
{
  "status": "success",
  "message": "Refund processed successfully",
  "data": {
    "payment": {
      "id": "payment-id-123",
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "REFUNDED",
      "amount": 2000
    },
    "refund": {
      "id": "rfnd_1234567890abcd",
      "amount": 2000,
      "status": "processed"
    },
    "order": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "CANCELLED",
      "paymentStatus": "REFUNDED"
    }
  }
}

Features on Refund:
- ✅ Full or partial refund support
- ✅ Razorpay integration
- ✅ Order auto-cancelled
- ✅ Stock restoration (handled by order service)
*/

// ============================================
// 7. GET ALL PAYMENTS (Admin Only)
// ============================================
// GET /api/v1/payments/admin/all?page=1&limit=20&status=COMPLETED
// Headers:
//   - Authorization: Bearer <ADMIN_JWT_TOKEN>

/*
Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- status: PENDING|COMPLETED|FAILED|REFUNDED (optional)

Response (200 OK):
{
  "status": "success",
  "data": {
    "payments": [
      {
        "id": "payment-1",
        "amount": 2000,
        "currency": "INR",
        "status": "COMPLETED",
        "createdAt": "2026-02-12T10:30:00Z",
        "order": {
          "user": {
            "id": "user-1",
            "name": "Customer 1",
            "email": "customer1@example.com"
          }
        }
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
*/

// ============================================
// 8. GET PAYMENT STATISTICS (Admin Only)
// ============================================
// GET /api/v1/payments/admin/statistics
// Headers:
//   - Authorization: Bearer <ADMIN_JWT_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "totalPayments": 150,
    "completedPayments": 138,
    "refundedPayments": 5,
    "totalRevenue": 500000,
    "refundedAmount": 25000,
    "successRate": "92.00"
  }
}

Metrics:
- totalPayments: Total payment records
- completedPayments: Successful payments
- refundedPayments: Refunded payment count
- totalRevenue: Total money received
- refundedAmount: Total refunded
- successRate: Success percentage (completed/total)
*/

// ============================================
// ERROR RESPONSES
// ============================================

/*
400 Bad Request - Validation Error:
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": ["body", "orderId"],
      "message": "Invalid Order ID"
    }
  ]
}

401 Unauthorized:
{
  "status": "error",
  "message": "You are not logged in! Please log in to get access."
}

403 Forbidden - Permission Denied:
{
  "status": "error",
  "message": "You do not have permission to access this payment"
}

404 Not Found:
{
  "status": "error",
  "message": "Payment not found"
}

400 Already Processed:
{
  "status": "error",
  "message": "Payment has already been refunded"
}

500 Payment Gateway Error:
{
  "status": "error",
  "message": "Failed to initiate payment. Please try again."
}
*/

// ============================================
// FRONTEND IMPLEMENTATION EXAMPLE
// ============================================

/*
// 1. Initiate Payment
async function checkout() {
  const response = await fetch('/api/v1/payments/initiate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 2000,
      currency: 'INR'
    })
  });

  const { data } = await response.json();

  // 2. Open Razorpay Payment Dialog
  const options = {
    key: data.keyId,
    order_id: data.razorpayOrder.id,
    amount: data.razorpayOrder.amount,
    currency: data.razorpayOrder.currency,
    name: "E-Cart",
    description: "Order Payment",
    handler: function(response) {
      // 3. Verify Payment
      verifyPayment({
        orderId: '550e8400-e29b-41d4-a716-446655440000',
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com"
    }
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
}

// Verify Payment
async function verifyPayment(paymentData) {
  const response = await fetch('/api/v1/payments/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });

  if (response.ok) {
    // Payment successful
    alert('Payment Successful!');
    // Redirect to order confirmation
  } else {
    alert('Payment Failed');
  }
}
*/

// ============================================
// KEY FEATURES
// ============================================

/*
✅ CUSTOMER FEATURES:
- Initiate payment (create Razorpay order)
- Verify payment (signature validation)
- View payment history
- Request refund
- Track payment status

✅ ADMIN FEATURES:
- View all payments
- Filter by status
- View payment statistics
- Processing rate metrics
- Revenue tracking

✅ SECURITY:
- Signature verification (HMAC SHA256)
- JWT authentication
- Authorization checks
- Encrypted credentials

✅ RAZORPAY INTEGRATION:
- Order creation
- Payment capture
- Refund processing
- Transaction tracking
- Currency support (INR, USD, etc.)

✅ DATABASE OPERATIONS:
- Atomic transactions
- Payment status tracking
- Order integration
- Stock management
*/

module.exports = {
  // This file is for documentation only
};
