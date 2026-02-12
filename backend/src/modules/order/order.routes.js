const express = require("express");
const orderController = require("./order.controller");
const validate = require("../../shared/middleware/validate");
const { protect, restrictTo } = require("../../shared/middleware/auth");
const {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
} = require("./order.validation");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * Customer Routes
 */

// Create a new order
router.post("/", validate(createOrderSchema), orderController.createOrder);

// Get all orders for logged-in user
router.get("/", orderController.getUserOrders);

// Get specific order
router.get("/:orderId", validate(orderIdParamSchema), orderController.getOrder);

/**
 * Admin Routes
 */

// Restrict following routes to admin only
router.use(restrictTo("ADMIN"));

// Get all orders (admin)
router.get("/admin/all", orderController.getAllOrders);

// Get order statistics
router.get("/admin/statistics", orderController.getOrderStats);

// Update order status
router.patch(
  "/:orderId/status",
  validate(updateOrderStatusSchema),
  validate(orderIdParamSchema),
  orderController.updateOrderStatus,
);

module.exports = router;
