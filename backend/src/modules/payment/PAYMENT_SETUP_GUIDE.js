/**
 * PAYMENT MODULE - SETUP & TESTING GUIDE
 * =====================================
 */

// ============================================
// STEP 1: INSTALL DEPENDENCIES
// ============================================

/*
Run this command in the backend directory:

npm install razorpay

The package.json should now have:
{
  "dependencies": {
    ...
    "razorpay": "^2.x.x"
  }
}
*/

// ============================================
// STEP 2: GET RAZORPAY CREDENTIALS
// ============================================

/*
1. Go to https://razorpay.com (Create account if needed)
2. Sign in to dashboard: https://dashboard.razorpay.com
3. Navigate to Settings → API Keys
4. You'll see:
   - Key ID (Publishable Key)
   - Key Secret (Secret Key)
5. Copy both credentials
6. Add to .env file:
   
   RAZORPAY_KEY_ID=your_key_id_here
   RAZORPAY_KEY_SECRET=your_key_secret_here

FOR TESTING (No card required):
- Use Razorpay Test Mode (Sandbox)
- Test Card: 4111 1111 1111 1111
- Any future date, any CVV
- All test payments will succeed
*/

// ============================================
// STEP 3: VERIFY INSTALLATION
// ============================================

/*
Test if payment module is working:

1. Start server:
   npm run dev

2. Check if routes are registered:
   - POST /api/v1/payments/initiate
   - POST /api/v1/payments/verify
   - GET /api/v1/payments
   - GET /api/v1/payments/:paymentId
   - POST /api/v1/payments/:paymentId/refund
   - GET /api/v1/payments/admin/all (admin)
   - GET /api/v1/payments/admin/statistics (admin)

3. If you see "Razorpay SDK not installed" warning, run:
   npm install razorpay
*/

// ============================================
// STEP 4: TEST WITH POSTMAN/INSOMNIA
// ============================================

/*
WORKFLOW:

1. Register & Login (Get JWT Token)
   POST /api/v1/auth/register
   POST /api/v1/auth/login
   → Save the token from response

2. Create a Product
   POST /api/v1/products
   → Save product ID

3. Add to Cart
   POST /api/v1/cart/add
   → Add product to cart

4. Create an Order
   POST /api/v1/orders
   → Save order ID

5. Initiate Payment ⭐
   POST /api/v1/payments/initiate
   Headers: Authorization: Bearer <token>
   Body:
   {
     "orderId": "order-id-from-step-4",
     "amount": 2000,
     "currency": "INR"
   }
   
   → Save razorpay_order_id and key_id

6. Complete Payment in Razorpay
   (The actual payment UI would happen on frontend with Razorpay button)
   
   For testing:
   - Razorpay automatically captures test payments
   - Use test card: 4111 1111 1111 1111

7. Verify Payment ⭐
   POST /api/v1/payments/verify
   Headers: Authorization: Bearer <token>
   Body:
   {
     "orderId": "order-id-from-step-4",
     "razorpay_order_id": "order_XXXX...",
     "razorpay_payment_id": "pay_XXXX...",
     "razorpay_signature": "signature-from-razorpay"
   }
   
   → Payment should be marked COMPLETED
   → Order should be marked PROCESSING

8. View Payment Details
   GET /api/v1/payments/order/{orderId}
   → See payment status, transaction ID, etc.

9. View Payment History
   GET /api/v1/payments?page=1&limit=10
   → See all your payments

10. Request Refund
    POST /api/v1/payments/{paymentId}/refund
    Body: {
      "amount": 2000,
      "reason": "Changed mind"
    }
    → Payment marked REFUNDED
    → Order marked CANCELLED
*/

// ============================================
// STEP 5: INTEGRATION WITH FRONTEND (React)
// ============================================

/*
1. Install Razorpay package:
   npm install razorpay

2. Add script to HTML (in public/index.html):
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

3. Example React Component:

import React, { useState } from 'react';
import axios from 'axios';

function PaymentButton({ orderId, amount, token }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Initiate payment
      const { data } = await axios.post(
        'http://localhost:5000/api/v1/payments/initiate',
        { orderId, amount, currency: 'INR' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Open Razorpay
      const options = {
        key: data.data.keyId,
        order_id: data.data.razorpayOrder.id,
        amount: data.data.razorpayOrder.amount,
        currency: 'INR',
        name: 'E-Cart',
        description: 'Order Payment',
        handler: async (response) => {
          // Step 3: Verify payment
          await axios.post(
            'http://localhost:5000/api/v1/payments/verify',
            { orderId, ...response },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert('Payment Successful!');
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}

export default PaymentButton;
*/

// ============================================
// STEP 6: PRODUCTION SETUP
// ============================================

/*
When deploying to production:

1. Get Live Credentials:
   - Go to Razorpay Dashboard
   - Switch from Test to Live mode
   - Get Live Key ID and Secret
   
2. Add to Environment:
   - Add RAZORPAY_KEY_ID (live key)
   - Add RAZORPAY_KEY_SECRET (live secret)
   
3. Security:
   - Never commit .env to git
   - Use environment variables on hosting platform
   - Razorpay credentials are verified server-side

4. Testing:
   - Test with small amounts first
   - Monitor payment flow
   - Check Razorpay dashboard for transaction details
*/

// ============================================
// STEP 7: TROUBLESHOOTING
// ============================================

/*
Problem: "Razorpay SDK not installed"
Solution: npm install razorpay

Problem: "RAZORPAY_KEY_ID not set"
Solution: Add to .env file:
  RAZORPAY_KEY_ID=your_key_id
  RAZORPAY_KEY_SECRET=your_key_secret

Problem: "Invalid payment signature"
Solution: Check that razorpay_signature is correct from Razorpay response

Problem: Payment status not updating
Solution: 
- Make sure verify endpoint is called after payment
- Check that signature verification passes
- Check Razorpay dashboard for payment status

Problem: Refund not working
Solution:
- Payment must be COMPLETED status
- Use correct paymentId
- Check Razorpay balance for partial refunds

Problem: "You do not have permission to access this payment"
Solution: Make sure you're using correct JWT token for the user
*/

// ============================================
// PAYMENT FLOW DIAGRAM
// ============================================

/*
Frontend                Backend                Razorpay
   |                      |                        |
   |--- Create Order ---→  |                        |
   |                      | Create Order Record    |
   |                      |                        |
   |---- Pay Button ----→  |                        |
   |                      |                        |
   | ← Initiate Payment ← |--- Create Order --→   |
   |  (Get Razorpay       |  ← Order ID          |
   |   Order ID)          |                        |
   |                      |                        |
   |--- Open Payment ---→ (Razorpay Widget)       |
   |                      |                        |
   |--- User Pays -----→ (Credit Card, UPI, etc) |
   |                      |                        |
   | ← Payment Success --- (Razorpay Response)    |
   |  (Payment ID,                                 |
   |   Signature)         |                        |
   |                      |                        |
   |--- Verify Verify ─→  |--- Verify Signature   |
   | (All Details)        |--- Check Payment      |
   |                      |---- Fetch Details --→|
   |                      | ← Payment Info ──────|
   |                      | Store Transaction    |
   |                      | Update Order Status  |
   |                      |                       |
   | ← Success Response   |                       |
   |                      |                       |
*/

module.exports = {
  // Setup guide only
};
