/**
 * ADMIN MODULE - COMPLETE FEATURE REFERENCE
 * =========================================
 */

// ============================================
// MODULE OVERVIEW
// ============================================

const ADMIN_MODULE_FEATURES = {
  description: "Complete admin panel for E-Cart management",

  sections: [
    {
      name: "Product Management",
      features: [
        "✅ Create products",
        "✅ Read products (with pagination)",
        "✅ Update product details",
        "✅ Delete products (with validation)",
        "✅ Search products",
      ],
    },
    {
      name: "Category Management",
      features: [
        "✅ Create categories",
        "✅ Read all categories",
        "✅ Get category details with products",
        "✅ Delete categories (with validation)",
        "✅ Show product count per category",
      ],
    },
    {
      name: "Inventory Control",
      features: [
        "✅ Update stock (add/remove)",
        "✅ Track inventory changes (reason)",
        "✅ Get low stock alerts",
        "✅ Inventory report (totals, averages)",
        "✅ Out of stock tracking",
      ],
    },
    {
      name: "Order Management",
      features: [
        "✅ View all orders",
        "✅ Filter by status",
        "✅ Get order metrics (total, revenue)",
        "✅ Track order breakdown by status",
        "✅ Calculate average order value",
      ],
    },
    {
      name: "User Management",
      features: [
        "✅ View all users",
        "✅ Filter by role",
        "✅ Get user details with order history",
        "✅ Update user role (promote to admin)",
        "✅ Delete user (with validation)",
        "✅ User metrics (active, inactive)",
      ],
    },
    {
      name: "Analytics Dashboard",
      features: [
        "✅ Order statistics",
        "✅ Revenue tracking",
        "✅ User metrics",
        "✅ Inventory status",
        "✅ Comprehensive dashboard view",
      ],
    },
  ],
};

// ============================================
// DETAILED ENDPOINT SUMMARY
// ============================================

const ENDPOINTS = {
  PRODUCTS: [
    { method: "POST", path: "/admin/products", action: "Create product" },
    {
      method: "GET",
      path: "/admin/products",
      action: "Get all products (paginated)",
    },
    { method: "GET", path: "/admin/products/:id", action: "Get product by ID" },
    { method: "PATCH", path: "/admin/products/:id", action: "Update product" },
    { method: "DELETE", path: "/admin/products/:id", action: "Delete product" },
  ],

  CATEGORIES: [
    { method: "POST", path: "/admin/categories", action: "Create category" },
    { method: "GET", path: "/admin/categories", action: "Get all categories" },
    {
      method: "GET",
      path: "/admin/categories/:id",
      action: "Get category details",
    },
    {
      method: "DELETE",
      path: "/admin/categories/:id",
      action: "Delete category",
    },
  ],

  INVENTORY: [
    { method: "PATCH", path: "/admin/inventory", action: "Update stock" },
    {
      method: "GET",
      path: "/admin/inventory/low-stock",
      action: "Get low stock products",
    },
    {
      method: "GET",
      path: "/admin/inventory/report",
      action: "Get inventory report",
    },
  ],

  ORDERS: [
    {
      method: "GET",
      path: "/admin/orders/dashboard",
      action: "Get orders dashboard",
    },
    {
      method: "GET",
      path: "/admin/orders/metrics",
      action: "Get order metrics",
    },
  ],

  USERS: [
    {
      method: "GET",
      path: "/admin/users",
      action: "Get all users (paginated)",
    },
    { method: "GET", path: "/admin/users/:id", action: "Get user details" },
    {
      method: "PATCH",
      path: "/admin/users/:id/role",
      action: "Update user role",
    },
    { method: "DELETE", path: "/admin/users/:id", action: "Delete user" },
    { method: "GET", path: "/admin/users/metrics", action: "Get user metrics" },
  ],

  DASHBOARD: [
    {
      method: "GET",
      path: "/admin/dashboard/stats",
      action: "Get complete dashboard stats",
    },
  ],
};

// ============================================
// DATA MODELS & RESPONSES
// ============================================

const RESPONSE_MODELS = {
  product: {
    id: "UUID",
    name: "string",
    description: "string (optional)",
    price: "decimal",
    stock: "integer",
    imageUrl: "string (URL)",
    categoryId: "UUID",
    category: {
      id: "UUID",
      name: "string",
    },
    createdAt: "timestamp",
    updatedAt: "timestamp",
  },

  category: {
    id: "UUID",
    name: "string",
    _count: {
      products: "integer",
    },
  },

  user: {
    id: "UUID",
    email: "string",
    name: "string",
    role: "enum: USER | ADMIN",
    createdAt: "timestamp",
    orders: "Order[]",
    addresses: "Address[]",
    _count: {
      orders: "integer",
      addresses: "integer",
    },
  },

  order: {
    id: "UUID",
    status: "enum: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED",
    totalAmount: "decimal",
    paymentStatus: "enum: PENDING | COMPLETED | FAILED | REFUNDED",
    items: "OrderItem[]",
    payment: "Payment",
    user: "User (partial)",
    createdAt: "timestamp",
  },

  dashboardStats: {
    orders: {
      totalOrders: "integer",
      totalRevenue: "decimal",
      avgOrderValue: "decimal",
      completedOrders: "integer",
      statusBreakdown: "array",
    },
    users: {
      totalUsers: "integer",
      adminCount: "integer",
      customerCount: "integer",
      activeUsers: "integer",
      inactiveUsers: "integer",
    },
    inventory: {
      totalProducts: "integer",
      totalStock: "integer",
      avgStock: "integer",
      lowStockCount: "integer",
      outOfStock: "integer",
    },
  },
};

// ============================================
// FILTERING & PAGINATION
// ============================================

const FILTER_OPTIONS = {
  products: {
    page: { type: "integer", default: 1 },
    limit: { type: "integer", default: 20 },
    search: { type: "string", optional: true },
  },

  orders: {
    page: { type: "integer", default: 1 },
    limit: { type: "integer", default: 20 },
    status: {
      type: "enum",
      values: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      optional: true,
    },
  },

  users: {
    page: { type: "integer", default: 1 },
    limit: { type: "integer", default: 20 },
    role: {
      type: "enum",
      values: ["USER", "ADMIN"],
      optional: true,
    },
  },

  inventory: {
    threshold: {
      type: "integer",
      default: 10,
      description: "Show products with stock <= threshold",
    },
  },
};

// ============================================
// BUSINESS RULES & VALIDATIONS
// ============================================

const BUSINESS_RULES = {
  products: [
    "Cannot delete product if it has orders (shows error)",
    "Price must be >= 0",
    "Stock must be >= 0",
    "Category must exist",
    "Product name is required",
    "Images must be valid URLs",
  ],

  categories: [
    "Cannot have duplicate category names",
    "Cannot delete category with products",
    "Category name must be at least 2 characters",
  ],

  inventory: [
    "Stock can be positive (add) or negative (remove)",
    "Stock cannot go below 0",
    "Reason must be one of: RESTOCK, DAMAGE, LOST, ADJUSTMENT",
    "Cannot use inventory to reduce stock below current level",
  ],

  users: [
    "Cannot delete user with existing orders",
    "Can only promote/demote roles to USER or ADMIN",
    "User pagination shows custom format with _count",
    "Admin can view user order history",
  ],

  orders: [
    "Can filter by status: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED",
    "Order metrics calculated from all orders",
    "Revenue only includes completed payments",
  ],
};

// ============================================
// API FLOW DIAGRAMS
// ============================================

const WORKFLOWS = {
  addProduct: `
  1. Create Category (if new)
     POST /admin/categories
     
  2. Create Product
     POST /admin/products
     ├─ References category
     ├─ Sets initial stock
     └─ Stores image URL
     
  3. Verify Stock
     GET /admin/inventory/report
  `,

  manageInventory: `
  1. Check Low Stock
     GET /admin/inventory/low-stock?threshold=10
     
  2. Restock Product
     PATCH /admin/inventory
     ├─ quantity: positive number
     └─ reason: RESTOCK
     
  3. Verify Update
     GET /admin/products/:id
  `,

  monitorOrders: `
  1. View Dashboard
     GET /admin/orders/dashboard?status=PENDING
     
  2. Get Metrics
     GET /admin/orders/metrics
     
  3. (Optional) Update Status
     PATCH /api/v1/orders/:id/status
     (Uses Order module)
  `,

  manageUsers: `
  1. Get All Users
     GET /admin/users?role=USER
     
  2. View User Details
     GET /admin/users/:id
     ├─ Shows order history
     ├─ Shows addresses
     └─ Shows metrics
     
  3. Promote User (if needed)
     PATCH /admin/users/:id/role
  `,

  dailyReview: `
  1. Get Complete Stats
     GET /admin/dashboard/stats
     
  2. Monitor Key Metrics:
     ├─ Orders → revenue, count, status
     ├─ Users → total, active, admin count
     └─ Inventory → low stock, total, average
     
  3. Take Action:
     ├─ Restock low items
     ├─ Process orders
     └─ Address issues
  `,
};

// ============================================
// INTEGRATION WITH OTHER MODULES
// ============================================

const INTEGRATIONS = {
  orderModule: {
    read: [
      "Can view all orders",
      "Can filter by status",
      "Can see order metrics",
    ],
    update: "Can update order status via /api/v1/orders/:id/status",
    dependency: "Admin module depends on order module for order data",
  },

  userModule: {
    read: ["Can view all users", "Can view user details with order history"],
    update: "Can update user role",
    delete: "Can delete users (with validation)",
  },

  productModule: {
    read: "References product data in orders",
    create: "Can create new products",
    update: "Can update product inventory",
    delete: "Can delete products (with validation)",
  },

  paymentModule: {
    read: "Can see payment status in orders",
    note: "Payment changes are made by payment module, not admin",
  },
};

// ============================================
// METRICS & CALCULATIONS
// ============================================

const METRICS_EXPLAINED = {
  orderMetrics: {
    totalOrders: "Count of all orders",
    totalRevenue: "Sum of amounts from COMPLETED payments",
    avgOrderValue: "Total revenue / total orders",
    completedOrders: "Count of DELIVERED orders",
    statusBreakdown: "Count of orders by status",
  },

  userMetrics: {
    totalUsers: "Count of all users",
    adminCount: "Count of users with role = ADMIN",
    customerCount: "Count of users with role = USER",
    activeUsers: "Users who have placed at least one order",
    inactiveUsers: "Users with no orders",
  },

  inventoryMetrics: {
    totalProducts: "Count of all products",
    totalStock: "Sum of stock across all products",
    avgStock: "Total stock / total products",
    lowStockCount: "Products with stock <= threshold",
    outOfStock: "Products with stock = 0",
  },
};

// ============================================
// PERFORMANCE TIPS
// ============================================

const PERFORMANCE_TIPS = [
  "Use pagination (limit results to avoid loading entire table)",
  "Use filters (status, role) to narrow results",
  "Monitor low stock regularly (set up alerts)",
  "Archive old orders (if database grows)",
  "Index frequently queried fields (email, status)",
  "Cache dashboard stats (refresh every 5-10 minutes)",
  "Use search for products (contains search)",
  "Monitor admin activity (add logging later)",
];

module.exports = {
  ADMIN_MODULE_FEATURES,
  ENDPOINTS,
  RESPONSE_MODELS,
  FILTER_OPTIONS,
  BUSINESS_RULES,
  WORKFLOWS,
  INTEGRATIONS,
  METRICS_EXPLAINED,
  PERFORMANCE_TIPS,
};
