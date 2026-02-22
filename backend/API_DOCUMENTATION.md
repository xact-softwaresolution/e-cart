# E-commerce Backend API Documentation

Welcome to the E-commerce Backend API documentation. This API is built using Node.js, Express, and Prisma, providing a robust set of endpoints for a startup-level MVP.

## 📌 Base URL

```
http://localhost:5000/api/v1
```

(Default local development)

## 🔐 Authentication

Most endpoints require a JWT token passed in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📂 Modules

1. [Authentication](#-1-authentication-auth)
2. [User Profile & Addresses](#-2-user-profile--addresses-users)
3. [Products & Categories](#-3-products--categories-products)
4. [Shopping Cart](#-4-shopping-cart-cart)
5. [Orders](#-5-orders-orders)
6. [Payments (Razorpay)](#-6-payments-razorpay-payments)
7. [Admin Management](#-7-admin-management-admin)

---

## 👤 1. Authentication (`/auth`)

### **POST** `/auth/register`

Create a new customer account.

- **Auth**: Not required
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**: `{ "status": "success", "token": "...", "data": { "user": { ... } } }`

### **POST** `/auth/login`

Authenticate and receive a JWT token.

- **Auth**: Not required
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ "status": "success", "token": "...", "data": { "user": { ... } } }`

### **GET** `/auth/profile`

Get the authenticated user's profile info.

- **Auth**: Required ✅

---

## 👥 2. User Profile & Addresses (`/users`)

### **GET** `/users/me`

Retrieve full current user details.

- **Auth**: Required ✅
- **Response**: User object with all details

### **PATCH** `/users/me`

Update user name or email.

- **Auth**: Required ✅
- **Body**: `{ "name": "John Doe", "email": "newemail@example.com" }`

### **GET** `/users/addresses`

Get all addresses for the authenticated user.

- **Auth**: Required ✅
- **Response**: Array of address objects

### **POST** `/users/addresses`

Add a new shipping address.

- **Auth**: Required ✅
- **Body**:
  ```json
  {
    "street": "123 Main St",
    "city": "Bangalore",
    "state": "KA",
    "zip": "560001",
    "country": "India",
    "isDefault": true
  }
  ```

---

## 🛍 3. Products & Categories (`/products`)

### **GET** `/products`

List all products with pagination and search.

- **Auth**: Not required
- **Query Params**:
  - `page` (number) - Page number for pagination
  - `limit` (number) - Items per page
  - `search` (string) - Search by product name/description
- **Response**: Array of product objects

### **GET** `/products/:id`

Get detailed information about a specific product.

- **Auth**: Not required
- **Params**: `id` - Product ID
- **Response**: Single product object with full details

### **GET** `/products/categories`

List all available product categories.

- **Auth**: Not required
- **Response**: Array of category objects

### **POST** `/products/categories`

Create a new product category (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Body**: `{ "name": "Electronics", "description": "Electronic items" }`
- **Response**: Created category object

### **POST** `/products`

Create a new product (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 999,
    "quantity": 50,
    "categoryId": "...",
    "image": "file"
  }
  ```
- **Response**: Created product object

### **PATCH** `/products/:id`

Update product details (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Params**: `id` - Product ID
- **Content-Type**: `multipart/form-data` (optional)
- **Body**: Any updatable fields (name, description, price, quantity, image)
- **Response**: Updated product object

### **DELETE** `/products/:id`

Delete a product (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Params**: `id` - Product ID
- **Response**: Confirmation message

---

## 🛒 4. Shopping Cart (`/cart`)

### **GET** `/cart`

View all items in the user's cart.

- **Auth**: Required ✅
- **Response**: Object with cart items and total price

### **POST** `/cart`

Add an item to the cart.

- **Auth**: Required ✅
- **Body**:
  ```json
  {
    "productId": "...",
    "quantity": 1
  }
  ```
- **Response**: Updated cart object

### **PATCH** `/cart/:itemId`

Update item quantity in cart.

- **Auth**: Required ✅
- **Params**: `itemId` - Cart item ID
- **Body**: `{ "quantity": 3 }`
- **Response**: Updated cart item

### **DELETE** `/cart/:itemId`

Remove a specific item from cart.

- **Auth**: Required ✅
- **Params**: `itemId` - Cart item ID
- **Response**: Updated cart object

### **DELETE** `/cart`

Clear the entire cart.

- **Auth**: Required ✅
- **Response**: Confirmation message

---

## 📦 5. Orders (`/orders`)

### **POST** `/orders`

Checkout and create an order from the current cart.

- **Auth**: Required ✅
- **Body**: `{ "addressId": "..." }`
- **Note**: Prices and totals are calculated server-side
- **Response**: Created order object with order ID

### **GET** `/orders`

List all orders for the authenticated user.

- **Auth**: Required ✅
- **Response**: Array of order objects

### **GET** `/orders/:orderId`

Get full details of a specific order.

- **Auth**: Required ✅
- **Params**: `orderId` - Order ID
- **Response**: Order object with items, tracking status, and payment info

### **GET** `/orders/admin/all` ⭐ ADMIN

Get all orders in the system (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Response**: Array of all orders with advanced filters support

### **GET** `/orders/admin/statistics` ⭐ ADMIN

Get order statistics and metrics (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Response**: Order statistics (total orders, revenue, average order value, etc.)

### **PATCH** `/orders/:orderId/status` ⭐ ADMIN

Update order status (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Params**: `orderId` - Order ID
- **Body**: `{ "status": "SHIPPED" | "DELIVERED" | "CANCELLED" }`
- **Response**: Updated order object

---

## 💳 6. Payments (Razorpay) (`/payments`)

### **POST** `/payments/initiate`

Create a Razorpay order for payment.

- **Auth**: Required ✅
- **Body**: `{ "orderId": "..." }`
- **Response**: Razorpay order details with order ID and amount

### **POST** `/payments/verify`

Verify the payment signature from Razorpay.

- **Auth**: Required ✅
- **Body**:
  ```json
  {
    "orderId": "...",
    "razorpay_order_id": "order_...",
    "razorpay_payment_id": "pay_...",
    "razorpay_signature": "..."
  }
  ```
- **Response**: Payment verification status and updated payment object

### **GET** `/payments`

Get all payments for the authenticated user.

- **Auth**: Required ✅
- **Response**: Array of payment objects for current user

### **GET** `/payments/order/:orderId`

Get payment details by order ID.

- **Auth**: Required ✅
- **Params**: `orderId` - Order ID
- **Response**: Payment object associated with the order

### **GET** `/payments/:paymentId`

Get payment details by payment ID.

- **Auth**: Required ✅
- **Params**: `paymentId` - Payment ID
- **Response**: Single payment object with full details

### **POST** `/payments/:paymentId/refund`

Request a refund for a payment.

- **Auth**: Required ✅
- **Params**: `paymentId` - Payment ID
- **Body**: `{ "amount": 5000, "reason": "Customer requested" }`
- **Response**: Refund confirmation object

### **GET** `/payments/admin/all` ⭐ ADMIN

Get all payments in the system (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Response**: Array of all payment objects

### **GET** `/payments/admin/statistics` ⭐ ADMIN

Get payment statistics (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Response**: Payment metrics (total revenue, successful payments, refunds, etc.)

---

## 🧑‍💼 7. Admin Management (`/admin`)

All routes require **ADMIN** role. Base path: `/api/v1/admin`

### Product Management

#### **GET** `/admin/products`

Get all products in the system.

- **Auth**: Required (ADMIN) ✅
- **Response**: Array of all products

#### **POST** `/admin/products`

Create a new product (Admin only).

- **Auth**: Required (ADMIN) ✅
- **Body**: `{ "name": "...", "description": "...", "price": 999, "quantity": 50, "categoryId": "..." }`
- **Response**: Created product object

#### **GET** `/admin/products/:productId`

Get specific product details.

- **Auth**: Required (ADMIN) ✅
- **Params**: `productId` - Product ID
- **Response**: Product object

#### **PATCH** `/admin/products/:productId`

Update product details.

- **Auth**: Required (ADMIN) ✅
- **Params**: `productId` - Product ID
- **Body**: Any updatable fields
- **Response**: Updated product object

#### **DELETE** `/admin/products/:productId`

Delete a product.

- **Auth**: Required (ADMIN) ✅
- **Params**: `productId` - Product ID
- **Response**: Confirmation message

### Category Management

#### **GET** `/admin/categories`

Get all product categories.

- **Auth**: Required (ADMIN) ✅
- **Response**: Array of categories

#### **POST** `/admin/categories`

Create a new category.

- **Auth**: Required (ADMIN) ✅
- **Body**: `{ "name": "Category Name", "description": "..." }`
- **Response**: Created category object

#### **GET** `/admin/categories/:categoryId`

Get specific category details.

- **Auth**: Required (ADMIN) ✅
- **Params**: `categoryId` - Category ID
- **Response**: Category object

#### **DELETE** `/admin/categories/:categoryId`

Delete a category.

- **Auth**: Required (ADMIN) ✅
- **Params**: `categoryId` - Category ID
- **Response**: Confirmation message

### Inventory Management

#### **PATCH** `/admin/inventory`

Update product inventory/stock levels.

- **Auth**: Required (ADMIN) ✅
- **Body**:
  ```json
  {
    "productId": "...",
    "quantity": 10,
    "reason": "RESTOCK | DAMAGE | RETURN"
  }
  ```
- **Response**: Updated inventory object

#### **GET** `/admin/inventory/low-stock`

Get products with low stock levels.

- **Auth**: Required (ADMIN) ✅
- **Response**: Array of low-stock products

#### **GET** `/admin/inventory/report`

Get detailed inventory report.

- **Auth**: Required (ADMIN) ✅
- **Response**: Inventory statistics and report

### Order Management

#### **GET** `/admin/orders/dashboard`

Get dashboard view of all orders.

- **Auth**: Required (ADMIN) ✅
- **Response**: Orders with advanced filters support

#### **GET** `/admin/orders/metrics`

Get order metrics and KPIs.

- **Auth**: Required (ADMIN) ✅
- **Response**: Order statistics (count, revenue, trends, etc.)

### User Management

#### **GET** `/admin/users`

Get all users in the system.

- **Auth**: Required (ADMIN) ✅
- **Response**: Array of user objects

#### **GET** `/admin/users/metrics`

Get user metrics and statistics.

- **Auth**: Required (ADMIN) ✅
- **Response**: User statistics (total users, active users, retention, etc.)

#### **GET** `/admin/users/:userId`

Get specific user details.

- **Auth**: Required (ADMIN) ✅
- **Params**: `userId` - User ID
- **Response**: User object with full details

#### **PATCH** `/admin/users/:userId/role`

Update user role (e.g., promote to admin).

- **Auth**: Required (ADMIN) ✅
- **Params**: `userId` - User ID
- **Body**: `{ "role": "ADMIN" | "USER" }`
- **Response**: Updated user object

#### **DELETE** `/admin/users/:userId`

Delete/deactivate a user.

- **Auth**: Required (ADMIN) ✅
- **Params**: `userId` - User ID
- **Response**: Confirmation message

### Dashboard Analytics

#### **GET** `/admin/dashboard/stats`

Get global dashboard statistics.

- **Auth**: Required (ADMIN) ✅
- **Response**:
  ```json
  {
    "totalRevenue": 50000,
    "totalUsers": 150,
    "totalOrders": 200,
    "inventoryHealth": "80%",
    "recentOrders": [...],
    "topProducts": [...]
  }
  ```

---

## 🌐 Health Check

### **GET** `/health`

Check API server health status.

- **Auth**: Not required
- **Response**: `{ "status": "ok", "timestamp": "..." }`

---

## Status Codes Reference

| Code | Meaning                                       |
| ---- | --------------------------------------------- |
| 200  | OK - Request successful                       |
| 201  | Created - Resource created successfully       |
| 400  | Bad Request - Invalid input                   |
| 401  | Unauthorized - Missing/invalid authentication |
| 403  | Forbidden - Insufficient permissions          |
| 404  | Not Found - Resource not found                |
| 500  | Server Error - Internal server error          |

---

## Error Response Format

All error responses follow this format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description",
  "data": null
}
```

---

## Notes

- ✅ indicates authentication is required
- ⭐ indicates admin-only endpoint
- Timestamps are in ISO 8601 format
- Images should be sent as multipart/form-data
- All monetary values are in the smallest currency unit (e.g., paise for INR)
