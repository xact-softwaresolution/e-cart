/**
 * ADMIN MODULE - QUICK START & TESTING GUIDE
 * ==========================================
 */

// ============================================
// PREREQUISITES
// ============================================

/*
✅ Requirements:
- Admin user account (role = 'ADMIN')
- Valid JWT token from login
- Postman or Insomnia for testing

How to create an Admin:
1. Register a user
2. Connect to database
3. Update user role: UPDATE users SET role = 'ADMIN' WHERE email = 'your-email'
4. Login and get JWT token
*/

// ============================================
// STEP-BY-STEP TESTING GUIDE
// ============================================

/*
STEP 1: Login as Admin
──────────────────────
POST http://localhost:5000/api/v1/auth/login
Body:
{
  "email": "admin@example.com",
  "password": "adminpassword123"
}

Response:
{
  "status": "success",
  "data": {
    "user": {
      "id": "admin-user-id",
      "email": "admin@example.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGc..."
  }
}

👉 Copy the token for next requests


STEP 2: Create a Category
─────────────────────────
POST http://localhost:5000/api/v1/admin/categories
Headers: Authorization: Bearer {token}
Body:
{
  "name": "Electronics"
}

Response: Category ID (save for product creation)


STEP 3: Create a Product
────────────────────────
POST http://localhost:5000/api/v1/admin/products
Headers: Authorization: Bearer {token}
Body:
{
  "name": "Laptop Pro 15",
  "description": "High-performance laptop",
  "price": 85000,
  "stock": 100,
  "categoryId": "category-id-from-step-2",
  "imageUrl": "https://example.com/laptop.jpg"
}

Response: Product created with ID


STEP 4: Get All Products
────────────────────────
GET http://localhost:5000/api/v1/admin/products?page=1&limit=10
Headers: Authorization: Bearer {token}


STEP 5: Update Product Stock
────────────────────────────
PATCH http://localhost:5000/api/v1/admin/inventory
Headers: Authorization: Bearer {token}
Body:
{
  "productId": "product-id",
  "quantity": 50,
  "reason": "RESTOCK"
}


STEP 6: Check Low Stock Products
──────────────────────────────────
GET http://localhost:5000/api/v1/admin/inventory/low-stock?threshold=20
Headers: Authorization: Bearer {token}


STEP 7: Get Inventory Report
─────────────────────────────
GET http://localhost:5000/api/v1/admin/inventory/report
Headers: Authorization: Bearer {token}


STEP 8: Get All Users
──────────────────────
GET http://localhost:5000/api/v1/admin/users?page=1&limit=10
Headers: Authorization: Bearer {token}


STEP 9: Get User Details
──────────────────────────
GET http://localhost:5000/api/v1/admin/users/{userId}
Headers: Authorization: Bearer {token}


STEP 10: Get Dashboard Statistics
──────────────────────────────────
GET http://localhost:5000/api/v1/admin/dashboard/stats
Headers: Authorization: Bearer {token}

Response shows complete overview of:
- Orders (total, revenue, status breakdown)
- Users (total, active, inactive)
- Inventory (stock levels, low stock warnings)
*/

// ============================================
// COMMON ADMIN TASKS & COMMANDS
// ============================================

const ADMIN_TASKS = [
  {
    task: "Add New Product",
    endpoint: "POST /api/v1/admin/products",
    body: {
      name: "Product Name",
      description: "Description",
      price: 1000,
      stock: 50,
      categoryId: "cat-id",
      imageUrl: "https://...",
    },
  },
  {
    task: "Update Product Details",
    endpoint: "PATCH /api/v1/admin/products/:productId",
    body: {
      price: 1200,
      stock: 45,
      description: "Updated description",
    },
  },
  {
    task: "Restock Product",
    endpoint: "PATCH /api/v1/admin/inventory",
    body: {
      productId: "prod-id",
      quantity: 30,
      reason: "RESTOCK",
    },
  },
  {
    task: "Create New Category",
    endpoint: "POST /api/v1/admin/categories",
    body: {
      name: "Category Name",
    },
  },
  {
    task: "View Orders Dashboard",
    endpoint: "GET /api/v1/admin/orders/dashboard?status=PENDING",
    filters: "page, limit, status",
  },
  {
    task: "Check Order Metrics",
    endpoint: "GET /api/v1/admin/orders/metrics",
    returns: "Total orders, revenue, order status breakdown",
  },
  {
    task: "View All Users",
    endpoint: "GET /api/v1/admin/users?role=USER",
    filters: "page, limit, role",
  },
  {
    task: "View User Profile & Orders",
    endpoint: "GET /api/v1/admin/users/:userId",
    returns: "User details, last 5 orders, addresses",
  },
  {
    task: "Promote User to Admin",
    endpoint: "PATCH /api/v1/admin/users/:userId/role",
    body: { role: "ADMIN" },
  },
  {
    task: "Get Complete Dashboard Stats",
    endpoint: "GET /api/v1/admin/dashboard/stats",
    returns: "Orders, users, inventory metrics",
  },
  {
    task: "Find Products with Low Stock",
    endpoint: "GET /api/v1/admin/inventory/low-stock?threshold=10",
    returns: "Products with stock <= threshold",
  },
  {
    task: "Get Inventory Report",
    endpoint: "GET /api/v1/admin/inventory/report",
    returns: "Total products, total stock, average stock",
  },
];

// ============================================
// SECURITY & BEST PRACTICES
// ============================================

/*
✅ SECURITY MEASURES IMPLEMENTED:

1. Authentication:
   - JWT token required on all endpoints
   - Token must be valid and not expired
   
2. Authorization:
   - All endpoints check for ADMIN role
   - Non-admins get 403 Forbidden error
   
3. Validation:
   - All inputs validated with Zod
   - Invalid data rejected
   
4. Data Protection:
   - Sensitive operations logged
   - User ownership verified
   
5. Business Logic:
   - Cannot delete products with orders
   - Cannot delete categories with products
   - Cannot delete users with orders


⚠️ BEST PRACTICES:

1. Always include Authorization header
   Authorization: Bearer {valid-jwt-token}

2. Validate data before submission
   - Check required fields
   - Validate format (UUID, numbers, etc.)

3. Check response status codes
   - 200/201 = Success
   - 400 = Bad request (invalid data)
   - 401 = Unauthorized (no token)
   - 403 = Forbidden (not admin)
   - 404 = Not found

4. Handle errors gracefully
   - Log errors for debugging
   - Show user-friendly messages

5. Rate limiting (to be implemented)
   - Prevent spam/abuse
   - Monitor suspicious patterns

6. Audit logs (to be implemented)
   - Track all admin actions
   - Monitor for unauthorized access
*/

// ============================================
// POSTMAN COLLECTION TEMPLATE
// ============================================

/*
Postman Setup:

1. Create Environment:
   - Variable: token = (your jwt token)
   - Variable: baseUrl = http://localhost:5000
   - Variable: admin-id = (admin user id)

2. Create Requests:

GET {{baseUrl}}/api/v1/admin/products
Headers:
  Authorization: Bearer {{token}}

POST {{baseUrl}}/api/v1/admin/products
Headers:
  Authorization: Bearer {{token}}
  Content-Type: application/json
Body:
  {
    "name": "Product",
    "price": 1000,
    "stock": 50,
    "categoryId": "cat-123"
  }

3. Use pre-request scripts to extract IDs:
   var jsonData = pm.response.json();
   pm.environment.set("product-id", jsonData.data.id);

4. Use these variables in subsequent requests:
   {{product-id}}
*/

// ============================================
// COMMON ERRORS & SOLUTIONS
// ============================================

/*
ERROR: "You are not logged in! Please log in to get access."
CAUSE: Missing Authorization header or invalid token
FIX: 
  1. Login to get token
  2. Add header: Authorization: Bearer {token}
  3. Verify token is not expired

ERROR: "You do not have permission to perform this action"
CAUSE: User is not admin
FIX:
  1. Verify user has ADMIN role
  2. Update user role in database
  3. Login again to get new token

ERROR: "Cannot delete product with existing orders"
CAUSE: Product has been ordered
FIX:
  1. Don't delete, update instead
  2. Use PATCH to update product details
  3. Deactivate by setting stock to 0

ERROR: "Invalid Category ID" (validation error)
CAUSE: CategoryId is not valid UUID
FIX:
  1. Verify categoryId format is UUID
  2. Create category first, then use its ID
  3. Check spelling of categoryId

ERROR: "Product not found" (404)
CAUSE: ProductId doesn't exist
FIX:
  1. Verify productId is correct
  2. Get all products first to find ID
  3. Check if product was deleted

ERROR: "Validation failed"
CAUSE: Required field missing or invalid format
FIX:
  1. Check all required fields are present
  2. Verify data types (number, string, boolean)
  3. Validate UUID format for IDs
*/

// ============================================
// ROLE-BASED ACCESS PATTERNS
// ============================================

/*
ADMIN Routes:
├─ Product Management
│  ├─ POST /create
│  ├─ PATCH /update
│  └─ DELETE /delete
│
├─ Category Management
│  ├─ POST /create
│  └─ DELETE /delete
│
├─ Inventory Control
│  ├─ PATCH /update
│  ├─ GET /low-stock
│  └─ GET /report
│
├─ Order Management
│  ├─ GET /dashboard (all orders)
│  └─ GET /metrics (statistics)
│
├─ User Management
│  ├─ GET /all users
│  ├─ GET /user details
│  ├─ PATCH /update role
│  ├─ DELETE /user
│  └─ GET /metrics
│
└─ Dashboard
   └─ GET /stats (complete overview)

CUSTOMER Routes (for reference):
├─ GET /products (browse)
├─ GET /product/:id (details)
├─ POST /cart/add
├─ GET /cart
├─ POST /orders (create)
├─ GET /orders (my orders)
└─ GET /payments (my payments)
*/

module.exports = {
  ADMIN_TASKS,
};
