const express = require("express");
const adminController = require("./admin.controller");
const validate = require("../../shared/middleware/validate");
const { protect, restrictTo } = require("../../shared/middleware/auth");
const {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  createCategorySchema,
  categoryIdParamSchema,
  updateInventorySchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  updateUserRoleSchema,
  userIdParamSchema,
} = require("./admin.validation");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo("ADMIN"));

// ============================================
// PRODUCT ROUTES
// ============================================

// Get all products
router.get("/products", adminController.getAllProducts);

// Create product
router.post(
  "/products",
  validate(createProductSchema),
  adminController.createProduct,
);

// Get product by ID
router.get(
  "/products/:productId",
  validate(productIdParamSchema),
  adminController.getProductById,
);

// Update product
router.patch(
  "/products/:productId",
  validate(productIdParamSchema),
  validate(updateProductSchema),
  adminController.updateProduct,
);

// Delete product
router.delete(
  "/products/:productId",
  validate(productIdParamSchema),
  adminController.deleteProduct,
);

// ============================================
// CATEGORY ROUTES
// ============================================

// Get all categories
router.get("/categories", adminController.getAllCategories);

// Create category
router.post(
  "/categories",
  validate(createCategorySchema),
  adminController.createCategory,
);

// Get category by ID
router.get(
  "/categories/:categoryId",
  validate(categoryIdParamSchema),
  adminController.getCategoryById,
);

// Delete category
router.delete(
  "/categories/:categoryId",
  validate(categoryIdParamSchema),
  adminController.deleteCategory,
);

// ============================================
// INVENTORY ROUTES
// ============================================

// Update inventory
router.patch(
  "/inventory",
  validate(updateInventorySchema),
  adminController.updateInventory,
);

// Get low stock products
router.get("/inventory/low-stock", adminController.getLowStockProducts);

// Get inventory report
router.get("/inventory/report", adminController.getInventoryReport);

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================

// Get dashboard orders
router.get("/orders/dashboard", adminController.getDashboardOrders);

// Get order metrics
router.get("/orders/metrics", adminController.getOrderMetrics);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// Get all users
router.get("/users", adminController.getAllUsers);

// Get user metrics
router.get("/users/metrics", adminController.getUserMetrics);

// Get user by ID
router.get(
  "/users/:userId",
  validate(userIdParamSchema),
  adminController.getUserById,
);

// Update user role
router.patch(
  "/users/:userId/role",
  validate(userIdParamSchema),
  validate(updateUserRoleSchema),
  adminController.updateUserRole,
);

// Delete user
router.delete(
  "/users/:userId",
  validate(userIdParamSchema),
  adminController.deleteUser,
);



// ============================================
// DASHBOARD ANALYTICS ROUTES
// ============================================

// Get dashboard statistics
router.get("/dashboard/stats", adminController.getDashboardStats);

module.exports = router;
