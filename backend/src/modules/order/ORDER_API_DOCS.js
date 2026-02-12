/**
 * ORDER MODULE - API ENDPOINTS & EXAMPLES
 * ========================================
 *
 * Complete guide for testing the Order Module
 */

// ============================================
// 1. CREATE ORDER (Customer)
// ============================================
// POST /api/v1/orders
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>
//   - Content-Type: application/json

/*
Request Body Example:
{
  "addressId": "550e8400-e29b-41d4-a716-446655440000",
  "cartItems": [
    {
      "productId": "660e8400-e29b-41d4-a716-446655440001",
      "quantity": 2,
      "price": 500
    },
    {
      "productId": "660e8400-e29b-41d4-a716-446655440002",
      "quantity": 1,
      "price": 1000
    }
  ],
  "totalAmount": 2000
}

Response (201 Created):
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": "order-id-123",
    "userId": "user-id-123",
    "addressId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "totalAmount": "2000",
    "createdAt": "2026-02-12T10:30:00Z",
    "items": [
      {
        "id": "item-1",
        "productId": "660e8400-e29b-41d4-a716-446655440001",
        "quantity": 2,
        "price": "500",
        "product": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "Product 1",
          "price": "500"
        }
      }
    ],
    "payment": null
  }
}
*/

// ============================================
// 2. GET USER'S ORDERS (Customer)
// ============================================
// GET /api/v1/orders?page=1&limit=10
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order-1",
        "userId": "user-id",
        "status": "PENDING",
        "paymentStatus": "PENDING",
        "totalAmount": "2000",
        "createdAt": "2026-02-12T10:30:00Z",
        "items": [
          {
            "id": "item-1",
            "productId": "prod-1",
            "quantity": 2,
            "product": {
              "id": "prod-1",
              "name": "Product 1",
              "price": "500",
              "imageUrl": "https://..."
            }
          }
        ],
        "payment": {
          "id": "pay-1",
          "status": "PENDING",
          "provider": "RAZORPAY"
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
// 3. GET ORDER DETAILS (Customer)
// ============================================
// GET /api/v1/orders/:orderId
// Headers:
//   - Authorization: Bearer <JWT_TOKEN>

/*
Example URL: GET /api/v1/orders/550e8400-e29b-41d4-a716-446655440000

Response (200 OK):
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-id",
    "status": "SHIPPED",
    "paymentStatus": "COMPLETED",
    "totalAmount": "2000",
    "createdAt": "2026-02-12T10:30:00Z",
    "updatedAt": "2026-02-12T11:45:00Z",
    "items": [
      {
        "id": "item-1",
        "orderId": "550e8400-e29b-41d4-a716-446655440000",
        "productId": "prod-1",
        "quantity": 2,
        "price": "500",
        "product": {
          "id": "prod-1",
          "name": "Laptop",
          "price": "500"
        }
      }
    ],
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "payment": {
      "id": "pay-1",
      "status": "COMPLETED",
      "provider": "RAZORPAY",
      "transactionId": "txn_123456"
    }
  }
}
*/

// ============================================
// 4. GET ALL ORDERS (Admin Only)
// ============================================
// GET /api/v1/orders/admin/all?page=1&limit=20&status=PENDING
// Headers:
//   - Authorization: Bearer <ADMIN_JWT_TOKEN>
// Query Params:
//   - page: 1 (optional)
//   - limit: 20 (optional)
//   - status: PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED (optional)

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order-1",
        "status": "PENDING",
        "totalAmount": "2000",
        "user": {
          "id": "user-1",
          "name": "Customer 1",
          "email": "customer1@example.com"
        },
        "items": [...]
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
*/

// ============================================
// 5. UPDATE ORDER STATUS (Admin Only)
// ============================================
// PATCH /api/v1/orders/:orderId/status
// Headers:
//   - Authorization: Bearer <ADMIN_JWT_TOKEN>
//   - Content-Type: application/json

/*
Request Body:
{
  "status": "SHIPPED"
}

Valid Status Values:
- PENDING (initial)
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

Response (200 OK):
{
  "status": "success",
  "message": "Order status updated successfully",
  "data": {
    "id": "order-1",
    "status": "SHIPPED",
    "totalAmount": "2000",
    "updatedAt": "2026-02-12T12:00:00Z",
    ...
  }
}

Note: If status changes to CANCELLED, product stock is automatically restored!
*/

// ============================================
// 6. GET ORDER STATISTICS (Admin Only)
// ============================================
// GET /api/v1/orders/admin/statistics
// Headers:
//   - Authorization: Bearer <ADMIN_JWT_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "totalOrders": 150,
    "totalRevenue": 50000,
    "completedOrders": 120,
    "cancelledOrders": 5,
    "statusBreakdown": [
      {
        "status": "PENDING",
        "_count": {
          "id": 15
        }
      },
      {
        "status": "PROCESSING",
        "_count": {
          "id": 10
        }
      },
      {
        "status": "SHIPPED",
        "_count": {
          "id": 20
        }
      },
      {
        "status": "DELIVERED",
        "_count": {
          "id": 120
        }
      }
    ]
  }
}
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
      "path": ["body", "cartItems"],
      "message": "Order must have at least one item"
    }
  ]
}

401 Unauthorized:
{
  "status": "error",
  "message": "You are not logged in! Please log in to get access."
}

403 Forbidden:
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}

404 Not Found:
{
  "status": "error",
  "message": "Order not found"
}

400 Bad Request - Insufficient Stock:
{
  "status": "error",
  "message": "Insufficient stock for Product Name. Available: 5"
}
*/

// ============================================
// KEY FEATURES
// ============================================

/*
✅ CUSTOMER FEATURES:
- Create orders (checkout flow)
- View their orders
- View order details
- Automatic cart clearing after order creation
- Stock reservation on order creation

✅ ADMIN FEATURES:
- View all orders
- Filter orders by status
- Update order status
- View order statistics (total revenue, completed orders, etc.)
- Cancel orders (with automatic stock restoration)

✅ BUSINESS LOGIC:
- Validates address ownership
- Checks product stock availability
- Creates transactions (atomic operations)
- Automatic cart clearing
- Stock reduction on order creation
- Stock restoration on cancellation
- Order status workflow
*/

module.exports = {
  // This file is for documentation only
};
