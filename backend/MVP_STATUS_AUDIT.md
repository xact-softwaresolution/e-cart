# Backend MVP Status Audit

## Verdict
The backend is **partially complete for MVP**, but **not fully complete** for the high-priority items you listed.

## 1) Order Module

### ✅ Implemented
- Order creation with stock validation and transactional stock decrement/cart clear.
- Order status updates (includes `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- User order history retrieval with pagination.
- Admin order listing and order statistics.

### ⚠️ Gaps / Risks
- Status workflow is not strictly enforced as a state machine (`PENDING → PROCESSING → SHIPPED → DELIVERED` can be skipped by admin update endpoint logic).
- Invoice data exists only implicitly through order + order items; no dedicated invoice number/tax breakdown PDF/invoice endpoint.
- Order creation trusts client-provided `cartItems` and `totalAmount` payload instead of deriving all amounts from server-side cart/product prices.

## 2) Payment Module

### ✅ Implemented
- Razorpay order initiation.
- Signature verification + payment capture verification.
- Payment status storage (`PENDING`, `COMPLETED`, `REFUNDED`) and order payment-status update.
- Refund endpoint + payment/order status changes.

### ⚠️ Gaps / Risks
- `initiatePayment` reads `order.items` for notes but the queried order does not include `items`, which can break initiation at runtime.
- Refund permission check is logically weak (`user` and `status` condition combined in a way that allows invalid attempts depending on state).
- No Stripe path despite requirement saying Razorpay/Stripe.
- No webhook-based asynchronous reconciliation for failed/partial/out-of-band payment events.

## 3) Admin Module

### ✅ Implemented
- Product CRUD operations.
- Order dashboard/listing and metrics.
- User management (list/detail/role update/delete guard).
- Inventory controls (adjust stock, low-stock list, inventory report).

### ⚠️ Gaps / Risks
- “Dashboard” is API-level only (no backend-rendered dashboard concerns, which is fine if frontend will consume).
- No audit trail tables/events for admin-sensitive actions (role changes, stock adjustments, refunds).

## Suggested Next Steps (Priority)
1. Enforce strict order state transitions in service layer.
2. Fix `initiatePayment` order-item loading bug and harden refund authorization logic.
3. Add webhook endpoint(s) for payment provider reconciliation.
4. Add server-calculated totals (derive from cart + product prices only).
5. Add invoice model/endpoint fields (invoice number, tax, discount, billing snapshot).
6. Optionally add Stripe provider abstraction if global support is required.
