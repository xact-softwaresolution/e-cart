/**
 * ADMIN MODULE - COMPREHENSIVE API REFERENCE
 * ==========================================
 *
 * All admin endpoints with complete documentation
 * Authentication: JWT Token + ADMIN Role Required
 */

// ============================================
// PRODUCT MANAGEMENT ENDPOINTS
// ============================================

// 1. CREATE PRODUCT
// POST /api/v1/admin/products
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Request Body:
{
  "name": "Laptop Pro 15",
  "description": "High-performance laptop",
  "price": 85000,
  "stock": 50,
  "categoryId": "cat-123",
  "imageUrl": "https://example.com/laptop.jpg"
}

Response (201 Created):
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": "prod-123",
    "name": "Laptop Pro 15",
    "description": "High-performance laptop",
    "price": 85000,
    "stock": 50,
    "imageUrl": "https://example.com/laptop.jpg",
    "category": {
      "id": "cat-123",
      "name": "Electronics"
    },
    "createdAt": "2026-02-12T10:30:00Z",
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
*/

// 2. GET ALL PRODUCTS
// GET /api/v1/admin/products?page=1&limit=20&search=laptop
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- search: "laptop" (optional - searches product name)

Response (200 OK):
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "prod-1",
        "name": "Laptop",
        "price": 85000,
        "stock": 50,
        "category": {...}
      }
    ],
    "total": 250,
    "page": 1,
    "limit": 20,
    "pages": 13
  }
}
*/

// 3. GET PRODUCT BY ID
// GET /api/v1/admin/products/:productId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Example: GET /api/v1/admin/products/prod-123
Response: Single product with full details
*/

// 4. UPDATE PRODUCT
// PATCH /api/v1/admin/products/:productId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Request Body (all optional):
{
  "name": "Laptop Pro 15 Updated",
  "price": 89000,
  "stock": 45,
  "description": "Updated description"
}

Response (200 OK): Updated product details
*/

// 5. DELETE PRODUCT
// DELETE /api/v1/admin/products/:productId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "message": "Product deleted successfully"
}

Note: Cannot delete if product has orders!
Use update to deactivate instead.
*/

// ============================================
// CATEGORY MANAGEMENT ENDPOINTS
// ============================================

// 1. CREATE CATEGORY
// POST /api/v1/admin/categories
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Request Body:
{
  "name": "Electronics"
}

Response (201 Created):
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "id": "cat-123",
    "name": "Electronics"
  }
}
*/

// 2. GET ALL CATEGORIES
// GET /api/v1/admin/categories
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": [
    {
      "id": "cat-1",
      "name": "Electronics",
      "_count": {
        "products": 45
      }
    },
    {
      "id": "cat-2",
      "name": "Fashion",
      "_count": {
        "products": 120
      }
    }
  ]
}
*/

// 3. GET CATEGORY BY ID
// GET /api/v1/admin/categories/:categoryId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response: Category with all products in it
*/

// 4. DELETE CATEGORY
// DELETE /api/v1/admin/categories/:categoryId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "message": "Category deleted successfully"
}

Note: Cannot delete if category has products!
*/

// ============================================
// INVENTORY MANAGEMENT ENDPOINTS
// ============================================

// 1. UPDATE INVENTORY
// PATCH /api/v1/admin/inventory
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Request Body:
{
  "productId": "prod-123",
  "quantity": 10,
  "reason": "RESTOCK"
}

Quantity: 
- Positive: Add stock
- Negative: Remove stock

Reason Options:
- RESTOCK: New stock arrived
- DAMAGE: Damaged items
- LOST: Lost/missing items
- ADJUSTMENT: Manual adjustment

Response (200 OK):
{
  "status": "success",
  "message": "Inventory updated successfully",
  "data": {
    "id": "prod-123",
    "name": "Laptop",
    "stock": 60,
    "category": {...}
  }
}
*/

// 2. GET LOW STOCK PRODUCTS
// GET /api/v1/admin/inventory/low-stock?threshold=10
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Query Parameters:
- threshold: 10 (optional - products with stock <= threshold)

Response (200 OK):
{
  "status": "success",
  "data": {
    "count": 15,
    "products": [
      {
        "id": "prod-1",
        "name": "Product 1",
        "stock": 5,
        "category": {...}
      }
    ]
  }
}
*/

// 3. GET INVENTORY REPORT
// GET /api/v1/admin/inventory/report
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "totalProducts": 250,
    "totalStock": 10000,
    "avgStock": 40,
    "lowStockCount": 15,
    "outOfStock": 3
  }
}
*/

// ============================================
// ORDER MANAGEMENT ENDPOINTS
// ============================================

// 1. GET DASHBOARD ORDERS
// GET /api/v1/admin/orders/dashboard?page=1&limit=20&status=PENDING
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- status: PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED (optional)

Response (200 OK):
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order-1",
        "status": "PROCESSING",
        "totalAmount": 2000,
        "user": {
          "id": "user-1",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "items": [
          {
            "id": "item-1",
            "quantity": 2,
            "product": {
              "id": "prod-1",
              "name": "Laptop",
              "price": 1000
            }
          }
        ],
        "payment": {
          "id": "pay-1",
          "status": "COMPLETED"
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

// 2. GET ORDER METRICS
// GET /api/v1/admin/orders/metrics
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "totalOrders": 500,
    "totalRevenue": 2500000,
    "avgOrderValue": 5000,
    "completedOrders": 450,
    "statusBreakdown": [
      {
        "status": "DELIVERED",
        "_count": { "id": 450 }
      },
      {
        "status": "CANCELLED",
        "_count": { "id": 20 }
      }
    ]
  }
}
*/

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

// 1. GET ALL USERS
// GET /api/v1/admin/users?page=1&limit=20&role=USER
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- role: USER|ADMIN (optional)

Response (200 OK):
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user-1",
        "email": "john@example.com",
        "name": "John Doe",
        "role": "USER",
        "createdAt": "2026-02-12T10:30:00Z",
        "_count": {
          "orders": 5,
          "addresses": 2
        }
      }
    ],
    "total": 1000,
    "page": 1,
    "limit": 20,
    "pages": 50
  }
}
*/

// 2. GET USER BY ID
// GET /api/v1/admin/users/:userId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "id": "user-1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "addresses": [...],
    "orders": [
      {
        "id": "order-1",
        "status": "DELIVERED",
        "totalAmount": 2000,
        "items": [...]
      }
    ],
    "_count": {
      "orders": 5,
      "addresses": 2
    }
  }
}

Includes:
- User details
- Last 5 orders
- All addresses
- Order & address count
*/

// 3. UPDATE USER ROLE
// PATCH /api/v1/admin/users/:userId/role
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Request Body:
{
  "role": "ADMIN"
}

Valid Roles: USER | ADMIN

Response (200 OK):
{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "id": "user-1",
    "email": "john@example.com",
    "role": "ADMIN"
  }
}
*/

// 4. DELETE USER
// DELETE /api/v1/admin/users/:userId
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "message": "User deleted successfully"
}

Note: Cannot delete user with existing orders!
Deactivate account instead.
*/

// 5. GET USER METRICS
// GET /api/v1/admin/users/metrics
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "totalUsers": 1000,
    "adminCount": 5,
    "customerCount": 995,
    "activeUsers": 750,
    "inactiveUsers": 250
  }
}
*/

// ============================================
// DASHBOARD ANALYTICS
// ============================================

// GET COMPREHENSIVE DASHBOARD STATS
// GET /api/v1/admin/dashboard/stats
// Headers: Authorization: Bearer <ADMIN_TOKEN>

/*
Response (200 OK):
{
  "status": "success",
  "data": {
    "orders": {
      "totalOrders": 500,
      "totalRevenue": 2500000,
      "avgOrderValue": 5000,
      "completedOrders": 450,
      "statusBreakdown": [...]
    },
    "users": {
      "totalUsers": 1000,
      "adminCount": 5,
      "customerCount": 995,
      "activeUsers": 750,
      "inactiveUsers": 250
    },
    "inventory": {
      "totalProducts": 250,
      "totalStock": 10000,
      "avgStock": 40,
      "lowStockCount": 15,
      "outOfStock": 3
    }
  }
}
*/

// ============================================
// ERROR RESPONSES
// ============================================

/*
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
  "message": "Product not found" / "User not found" / etc.
}

400 Bad Request:
{
  "status": "error",
  "message": "Cannot delete product with existing orders. Deactivate instead."
}

409 Conflict:
{
  "status": "error",
  "message": "Category already exists"
}
*/

// ============================================
// EXAMPLE ADMIN WORKFLOWS
// ============================================

/*
WORKFLOW 1: Add New Product
──────────────────────────
1. Create category (if needed)
   POST /api/v1/admin/categories
   
2. Create product
   POST /api/v1/admin/products
   
3. Check initial stock
   GET /api/v1/admin/inventory/report


WORKFLOW 2: Manage Inventory
──────────────────────────
1. Get low stock products
   GET /api/v1/admin/inventory/low-stock
   
2. Update inventory (restock)
   PATCH /api/v1/admin/inventory
   
3. Verify updates
   GET /api/v1/admin/products/:productId


WORKFLOW 3: Monitor Orders
──────────────────────────
1. Get dashboard orders
   GET /api/v1/admin/orders/dashboard
   
2. Check order metrics
   GET /api/v1/admin/orders/metrics
   
3. Update order status (using order module)
   PATCH /api/v1/orders/:orderId/status


WORKFLOW 4: User Management
──────────────────────────
1. Get all users
   GET /api/v1/admin/users
   
2. View user details
   GET /api/v1/admin/users/:userId
   
3. Promote to admin
   PATCH /api/v1/admin/users/:userId/role
   
4. Monitor user metrics
   GET /api/v1/admin/users/metrics


WORKFLOW 5: Daily Dashboard Review
──────────────────────────
1. Get complete dashboard stats
   GET /api/v1/admin/dashboard/stats
   
2. Monitor key metrics:
   - Orders: Total revenue, order count, status breakdown
   - Users: Total users, active users, admin count
   - Inventory: Low stock items, out of stock items
*/

module.exports = {
  // Documentation only
};
