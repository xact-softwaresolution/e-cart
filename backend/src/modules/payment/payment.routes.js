const express = require("express");
const paymentController = require("./payment.controller");
const validate = require("../../shared/middleware/validate");
const { protect, restrictTo } = require("../../shared/middleware/auth");
const {
  initiatePaymentSchema,
  verifyPaymentSchema,
  refundSchema,
  paymentIdParamSchema,
  orderIdParamSchema,
} = require("./payment.validation");

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * Customer Routes
 */

// Initiate payment (create Razorpay order)
router.post(
  "/initiate",
  validate(initiatePaymentSchema),
  paymentController.initiatePayment,
);

// Verify payment (after successful Razorpay payment)
router.post(
  "/verify",
  validate(verifyPaymentSchema),
  paymentController.verifyPayment,
);

// Get all user payments
router.get("/", paymentController.getUserPayments);

// Get payment by order ID (must come before /:paymentId)
router.get(
  "/order/:orderId",
  validate(orderIdParamSchema),
  paymentController.getPaymentByOrder,
);

// Get payment details by payment ID
router.get(
  "/:paymentId",
  validate(paymentIdParamSchema),
  paymentController.getPayment,
);

// Refund payment
router.post(
  "/:paymentId/refund",
  validate(paymentIdParamSchema),
  validate(refundSchema),
  paymentController.refundPayment,
);

/**
 * Admin Routes
 */

// Restrict following routes to admin only
router.use(restrictTo("ADMIN"));

// Get all payments (admin)
router.get("/admin/all", paymentController.getAllPayments);

// Get payment statistics
router.get("/admin/statistics", paymentController.getPaymentStats);

module.exports = router;
