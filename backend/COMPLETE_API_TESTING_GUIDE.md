# 🧪 Complete API Testing Guide - E-Cart Backend

**Base URL**: `http://localhost:5000/api/v1`

---

## 📋 Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User APIs](#2-user-apis)
3. [Product APIs](#3-product-apis)
4. [Cart APIs](#4-cart-apis)
5. [Order APIs](#5-order-apis)
6. [Payment APIs](#6-payment-apis)
7. [Admin APIs](#7-admin-apis)

---

## 🔑 Authentication

Most endpoints require JWT authentication. After login, include the token in all requests:

```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication APIs

### 1.1 Register User

**POST** `/auth/register`

**Public**: Yes

**Request**:
```json
{
  "email": "customer@example.com",
  "password": "Test@1234",
  "name": "John Doe"
}
```

**Response** (200):
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "customer@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

### 1.2 Login

**POST** `/auth/login`

**Public**: Yes

**Request**:
```json
{
  "email": "customer@example.com",
  "password": "Test@1234"
}
```

**Response** (200):
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "customer@example.com",
      "name": "John Doe",
      "role": "USER"
    }
  }
}
```

---

## 2. User APIs

**Auth Required**: Yes (USER or ADMIN)

### 2.1 Get User Profile

**GET** `/users/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "customer@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2026-02-12T15:30:00.000Z",
      "updatedAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

### 2.2 Update User Profile

**PUT** `/users/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "name": "John Smith",
  "email": "newemail@example.com"
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "newemail@example.com",
      "name": "John Smith",
      "role": "USER"
    }
  }
}
```

### 2.3 Get User Addresses

**GET** `/users/addresses`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "addresses": [
      {
        "id": "uuid-here",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA",
        "isDefault": true
      }
    ]
  }
}
```

### 2.4 Add Address

**POST** `/users/addresses`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "street": "456 Oak Avenue",
  "city": "Los Angeles",
  "state": "CA",
  "zip": "90001",
  "country": "USA",
  "isDefault": false
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "address": {
      "id": "uuid-here",
      "street": "456 Oak Avenue",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90001",
      "country": "USA",
      "isDefault": false
    }
  }
}
```

### 2.5 Delete Address

**DELETE** `/users/addresses/:addressId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Address deleted successfully"
}
```
------------------------------------------------------missing delete/update address-------------------

---

## 3. Product APIs

**Auth Required**: No (Public)

### 3.1 Get All Products

**GET** `/products`

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `search` (optional)
- `categoryId` (optional)
- `minPrice` (optional)
- `maxPrice` (optional)
- `sortBy` (optional: price, name, createdAt)
- `order` (optional: asc, desc)

**Example**:
```
GET /products?page=1&limit=10&search=laptop&minPrice=500&maxPrice=2000&sortBy=price&order=asc
```

**Response** (200):
```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "data": {
    "products": [
      {
        "id": "uuid-here",
        "name": "Gaming Laptop",
        "description": "High-performance gaming laptop",
        "price": "1299.99",
        "stock": 15,
        "imageUrl": "https://example.com/image.jpg",
        "categoryId": "category-uuid",
        "category": {
          "id": "category-uuid",
          "name": "Electronics"
        },
        "createdAt": "2026-02-12T15:30:00.000Z"
      }
    ]
  }
}
```

### 3.2 Get Product by ID

**GET** `/products/:productId`

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "uuid-here",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop with RTX 4060",
      "price": "1299.99",
      "stock": 15,
      "imageUrl": "https://example.com/image.jpg",
      "categoryId": "category-uuid",
      "category": {
        "id": "category-uuid",
        "name": "Electronics"
      },
      "createdAt": "2026-02-12T15:30:00.000Z",
      "updatedAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

### 3.3 Get Products by Category

**GET** `/products/category/:categoryId`

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)

**Response** (200):
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "products": [
      {
        "id": "uuid-here",
        "name": "Gaming Laptop",
        "price": "1299.99",
        "stock": 15
      }
    ]
  }
}
```

### 3.4 Get All Categories

**GET** `/products/categories`

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "uuid-here",
        "name": "Electronics",
        "_count": {
          "products": 25
        }
      },
      {
        "id": "uuid-here",
        "name": "Clothing",
        "_count": {
          "products": 50
        }
      }
    ]
  }
}
```

---

## 4. Cart APIs

**Auth Required**: Yes (USER or ADMIN)

### 4.1 Get Cart

**GET** `/cart`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "cart": {
      "id": "cart-uuid",
      "userId": "user-uuid",
      "items": [
        {
          "id": "cartitem-uuid",
          "productId": "product-uuid",
          "quantity": 2,
          "product": {
            "id": "product-uuid",
            "name": "Gaming Laptop",
            "price": "1299.99",
            "stock": 15,
            "imageUrl": "https://example.com/image.jpg"
          }
        }
      ],
      "totalItems": 2,
      "totalPrice": "2599.98"
    }
  }
}
```

### 4.2 Add Item to Cart

**POST** `/cart/items`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "productId": "product-uuid",
  "quantity": 2
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "cartItem": {
      "id": "cartitem-uuid",
      "cartId": "cart-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "product": {
        "name": "Gaming Laptop",
        "price": "1299.99"
      }
    }
  }
}
```

### 4.3 Update Cart Item Quantity

**PUT** `/cart/items/:itemId`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "quantity": 3
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "cartItem": {
      "id": "cartitem-uuid",
      "quantity": 3,
      "product": {
        "name": "Gaming Laptop",
        "price": "1299.99"
      }
    }
  }
}
```

### 4.4 Remove Item from Cart

**DELETE** `/cart/items/:itemId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Item removed from cart"
}
```

### 4.5 Clear Cart

**DELETE** `/cart/clear`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Cart cleared successfully"
}
```

---

## 5. Order APIs

**Auth Required**: Yes (USER or ADMIN)

### 5.1 Create Order from Cart

**POST** `/orders`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "addressId": "address-uuid"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order-uuid",
      "userId": "user-uuid",
      "status": "PENDING",
      "totalAmount": "2599.98",
      "paymentStatus": "PENDING",
      "addressId": "address-uuid",
      "items": [
        {
          "id": "orderitem-uuid",
          "productId": "product-uuid",
          "quantity": 2,
          "price": "1299.99",
          "product": {
            "name": "Gaming Laptop"
          }
        }
      ],
      "createdAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

### 5.2 Get User Orders (Order History)

**GET** `/orders`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

**Example**:
```
GET /orders?page=1&limit=10&status=DELIVERED
```

**Response** (200):
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "status": "DELIVERED",
        "totalAmount": "2599.98",
        "paymentStatus": "COMPLETED",
        "createdAt": "2026-02-12T15:30:00.000Z",
        "items": [
          {
            "id": "orderitem-uuid",
            "quantity": 2,
            "price": "1299.99",
            "product": {
              "name": "Gaming Laptop"
            }
          }
        ]
      }
    ]
  }
}
```

### 5.3 Get Order by ID (Invoice Data)

**GET** `/orders/:orderId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order-uuid",
      "userId": "user-uuid",
      "status": "DELIVERED",
      "totalAmount": "2599.98",
      "paymentStatus": "COMPLETED",
      "addressId": "address-uuid",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
      },
      "items": [
        {
          "id": "orderitem-uuid",
          "productId": "product-uuid",
          "quantity": 2,
          "price": "1299.99",
          "product": {
            "id": "product-uuid",
            "name": "Gaming Laptop",
            "imageUrl": "https://example.com/image.jpg"
          }
        }
      ],
      "payment": {
        "id": "payment-uuid",
        "amount": "2599.98",
        "currency": "INR",
        "provider": "RAZORPAY",
        "status": "COMPLETED",
        "transactionId": "pay_xxxxx"
      },
      "createdAt": "2026-02-12T15:30:00.000Z",
      "updatedAt": "2026-02-13T10:30:00.000Z"
    }
  }
}
```

### 5.4 Get Order Items

**GET** `/orders/:orderId/items`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "orderitem-uuid",
        "productId": "product-uuid",
        "quantity": 2,
        "price": "1299.99",
        "product": {
          "id": "product-uuid",
          "name": "Gaming Laptop",
          "imageUrl": "https://example.com/image.jpg"
        }
      }
    ]
  }
}
```

### 5.5 Cancel Order

**PATCH** `/orders/:orderId/cancel`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order-uuid",
      "status": "CANCELLED",
      "totalAmount": "2599.98"
    }
  }
}
```

---

## 6. Payment APIs

**Auth Required**: Yes (USER or ADMIN)

### 6.1 Initiate Payment

**POST** `/payments/initiate`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "orderId": "order-uuid"
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "orderId": "order-uuid",
      "amount": "2599.98",
      "currency": "INR",
      "status": "PENDING"
    },
    "razorpayOrder": {
      "id": "order_xxxxx",
      "amount": 259998,
      "currency": "INR",
      "key": "rzp_test_xxxxx"
    }
  }
}
```

### 6.2 Verify Payment

**POST** `/payments/verify`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "orderId": "order-uuid",
      "amount": "2599.98",
      "status": "COMPLETED",
      "transactionId": "pay_xxxxx"
    },
    "order": {
      "id": "order-uuid",
      "status": "PROCESSING",
      "paymentStatus": "COMPLETED"
    }
  }
}
```

### 6.3 Get Payment by Order

**GET** `/payments/order/:orderId`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "orderId": "order-uuid",
      "amount": "2599.98",
      "currency": "INR",
      "provider": "RAZORPAY",
      "transactionId": "pay_xxxxx",
      "status": "COMPLETED",
      "createdAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

### 6.4 Get Payment History

**GET** `/payments/history`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)

**Response** (200):
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "payments": [
      {
        "id": "payment-uuid",
        "orderId": "order-uuid",
        "amount": "2599.98",
        "currency": "INR",
        "status": "COMPLETED",
        "transactionId": "pay_xxxxx",
        "createdAt": "2026-02-12T15:30:00.000Z",
        "order": {
          "id": "order-uuid",
          "status": "DELIVERED"
        }
      }
    ]
  }
}
```

### 6.5 Process Refund (Full)

**POST** `/payments/:paymentId/refund`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "reason": "Customer requested refund"
}
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Full refund processed successfully",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "status": "REFUNDED",
      "amount": "2599.98"
    },
    "refund": {
      "id": "rfnd_xxxxx",
      "amount": 259998,
      "status": "processed"
    }
  }
}
```

### 6.6 Process Partial Refund

**POST** `/payments/:paymentId/refund`

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "amount": 1000.00,
  "reason": "Partial refund for damaged item"
}
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Partial refund of ₹1000.00 processed successfully",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "status": "COMPLETED",
      "amount": "2599.98"
    },
    "refund": {
      "id": "rfnd_xxxxx",
      "amount": 100000,
      "status": "processed"
    }
  }
}
```
-----------------------------------------------------------------------------------------------------

---

## 7. Admin APIs

----------------------------------

**Auth Required**: Yes (ADMIN only)

### 7.1 Product Management

#### 7.1.1 Get All Products (Admin)

**GET** `/admin/products`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional)
- `categoryId` (optional)
- `lowStock` (optional: true/false)

**Response** (200):
```json
{
  "status": "success",
  "results": 15,
  "data": {
    "products": [
      {
        "id": "product-uuid",
        "name": "Gaming Laptop",
        "price": "1299.99",
        "stock": 5,
        "category": {
          "name": "Electronics"
        },
        "_count": {
          "orderItems": 25
        }
      }
    ]
  }
}
```

#### 7.1.2 Create Product

**POST** `/admin/products`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "stock": 100,
  "categoryId": "category-uuid",
  "imageUrl": "https://example.com/mouse.jpg"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "new-product-uuid",
      "name": "Wireless Mouse",
      "description": "Ergonomic wireless mouse",
      "price": "29.99",
      "stock": 100,
      "categoryId": "category-uuid",
      "imageUrl": "https://example.com/mouse.jpg",
      "createdAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

#### 7.1.3 Update Product

**Patch** `/admin/products/:productId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "name": "Updated Product Name",
  "price": 39.99,
  "stock": 150
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "product-uuid",
      "name": "Updated Product Name",
      "price": "39.99",
      "stock": 150
    }
  }
}
```

#### 7.1.4 Delete Product  

**DELETE** `/admin/products/:productId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

### 7.2 Category Management

#### 7.2.1 Get All Categories (Admin)

**GET** `/admin/categories`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "category-uuid",
        "name": "Electronics",
        "_count": {
          "products": 25
        }
      }
    ]
  }
}
```

#### 7.2.2 Create Category

**POST** `/admin/categories`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "name": "Home Appliances"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "category": {
      "id": "new-category-uuid",
      "name": "Home Appliances"
    }
  }
}
```

#### 7.2.3 Update Category

**PUT** `/admin/categories/:categoryId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "name": "Updated Category Name"
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "category": {
      "id": "category-uuid",
      "name": "Updated Category Name"
    }
  }
}
```

#### 7.2.4 Delete Category

**DELETE** `/admin/categories/:categoryId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

### 7.3 Inventory Management

#### 7.3.1 Get Inventory

**GET** `/admin/inventory`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20)
- `lowStock` (optional: true)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "inventory": [
      {
        "id": "product-uuid",
        "name": "Gaming Laptop",
        "stock": 5,
        "price": "1299.99",
        "category": {
          "name": "Electronics"
        }
      }
    ]
  }
}
```

#### 7.3.2 Update Stock

**PUT** `/admin/inventory/:productId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "stock": 50
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "product-uuid",
      "name": "Gaming Laptop",
      "stock": 50
    }
  }
}
```

#### 7.3.3 Get Low Stock Items

**GET** `/admin/inventory/low-stock`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `threshold` (default: 10)

**Response** (200):
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "lowStockItems": [
      {
        "id": "product-uuid",
        "name": "Gaming Laptop",
        "stock": 5,
        "price": "1299.99"
      }
    ]
  }
}
```

### 7.4 Order Management

#### 7.4.1 Get All Orders (Admin)

**GET** `/admin/orders`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `paymentStatus` (optional: PENDING, COMPLETED, FAILED, REFUNDED)

**Response** (200):
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "status": "PROCESSING",
        "totalAmount": "2599.98",
        "paymentStatus": "COMPLETED",
        "user": {
          "name": "John Doe",
          "email": "customer@example.com"
        },
        "createdAt": "2026-02-12T15:30:00.000Z"
      }
    ]
  }
}
```

#### 7.4.2 Get Order Details (Admin)

**GET** `/admin/orders/:orderId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order-uuid",
      "status": "PROCESSING",
      "totalAmount": "2599.98",
      "paymentStatus": "COMPLETED",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "customer@example.com"
      },
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
      },
      "items": [
        {
          "id": "orderitem-uuid",
          "quantity": 2,
          "price": "1299.99",
          "product": {
            "name": "Gaming Laptop"
          }
        }
      ],
      "payment": {
        "status": "COMPLETED",
        "transactionId": "pay_xxxxx"
      },
      "createdAt": "2026-02-12T15:30:00.000Z"
    }
  }
}
```

#### 7.4.3 Update Order Status

**PATCH** `/admin/orders/:orderId/status`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "status": "SHIPPED"
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order-uuid",
      "status": "SHIPPED",
      "totalAmount": "2599.98"
    }
  }
}
```

### 7.5 User Management

#### 7.5.1 Get All Users

**GET** `/admin/users`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20)
- `role` (optional: USER, ADMIN)

**Response** (200):
```json
{
  "status": "success",
  "results": 50,
  "data": {
    "users": [
      {
        "id": "user-uuid",
        "email": "customer@example.com",
        "name": "John Doe",
        "role": "USER",
        "createdAt": "2026-02-12T15:30:00.000Z",
        "_count": {
          "orders": 5
        }
      }
    ]
  }
}
```

#### 7.5.2 Get User Details

**GET** `/admin/users/:userId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "customer@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2026-02-12T15:30:00.000Z",
      "orders": [
        {
          "id": "order-uuid",
          "status": "DELIVERED",
          "totalAmount": "2599.98"
        }
      ],
      "addresses": [
        {
          "street": "123 Main St",
          "city": "New York"
        }
      ]
    }
  }
}
```

#### 7.5.3 Update User Role

**PATCH** `/admin/users/:userId/role`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request**:
```json
{
  "role": "ADMIN"
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "customer@example.com",
      "name": "John Doe",
      "role": "ADMIN"
    }
  }
}
```

#### 7.5.4 Delete User

**DELETE** `/admin/users/:userId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

### 7.6 Dashboard & Analytics

#### 7.6.1 Get Dashboard Metrics

**GET** `/admin/dashboard`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "dashboard": {
      "totalRevenue": "125999.50",
      "totalOrders": 150,
      "totalUsers": 250,
      "totalProducts": 75,
      "recentOrders": [
        {
          "id": "order-uuid",
          "status": "PENDING",
          "totalAmount": "1299.99",
          "user": {
            "name": "John Doe"
          },
          "createdAt": "2026-02-12T15:30:00.000Z"
        }
      ],
      "topProducts": [
        {
          "id": "product-uuid",
          "name": "Gaming Laptop",
          "totalSold": 25,
          "revenue": "32499.75"
        }
      ],
      "lowStockProducts": [
        {
          "id": "product-uuid",
          "name": "Wireless Mouse",
          "stock": 3
        }
      ]
    }
  }
}
```

#### 7.6.2 Get Sales Analytics

**GET** `/admin/analytics/sales`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `startDate` (optional: YYYY-MM-DD)
- `endDate` (optional: YYYY-MM-DD)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "analytics": {
      "totalSales": "125999.50",
      "totalOrders": 150,
      "averageOrderValue": "839.99",
      "salesByStatus": {
        "DELIVERED": 120,
        "PROCESSING": 20,
        "PENDING": 10
      },
      "dailySales": [
        {
          "date": "2026-02-12",
          "sales": "5999.95",
          "orders": 5
        }
      ]
    }
  }
}
```

#### 7.6.3 Get Payment Statistics

**GET** `/admin/analytics/payments`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "statistics": {
      "totalRevenue": "125999.50",
      "completedPayments": 120,
      "pendingPayments": 10,
      "failedPayments": 5,
      "refundedAmount": "2599.98",
      "paymentsByStatus": {
        "COMPLETED": 120,
        "PENDING": 10,
        "FAILED": 5,
        "REFUNDED": 2
      }
    }
  }
}
```

---

## 🧪 Testing Workflow

### Complete Checkout Flow

```bash
# 1. Register User
POST /auth/register
{
  "email": "test@example.com",
  "password": "Test@1234",
  "name": "Test User"
}

# 2. Login (Save the token)
POST /auth/login
{
  "email": "test@example.com",
  "password": "Test@1234"
}

# 3. Browse Products
GET /products?page=1&limit=10

# 4. Add Product to Cart
POST /cart/items
Authorization: Bearer <token>
{
  "productId": "product-uuid",
  "quantity": 2
}

# 5. View Cart
GET /cart
Authorization: Bearer <token>

# 6. Add Shipping Address
POST /users/addresses
Authorization: Bearer <token>
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA"
}

# 7. Create Order
POST /orders
Authorization: Bearer <token>
{
  "addressId": "address-uuid-from-step-6"
}

# 8. Initiate Payment
POST /payments/initiate
Authorization: Bearer <token>
{
  "orderId": "order-uuid-from-step-7"
}

# 9. Verify Payment (after Razorpay payment)
POST /payments/verify
Authorization: Bearer <token>
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}

# 10. Check Order Status
GET /orders/order-uuid-from-step-7
Authorization: Bearer <token>
```

---

## 📝 Notes

- All prices are in decimal format (e.g., "1299.99")
- All IDs are UUIDs
- Razorpay amounts are in paise (multiply by 100)
- Default pagination: page=1, limit=10
- All timestamps are in ISO 8601 format
- All endpoints return consistent error format:

```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400
}
```

---

## ✅ Testing Tools

- **Postman**: Import endpoints and create collections
- **Insomnia**: REST client alternative
- **cURL**: Command-line testing
- **Thunder Client** (VS Code extension)

---

**🎉 Happy Testing!**
