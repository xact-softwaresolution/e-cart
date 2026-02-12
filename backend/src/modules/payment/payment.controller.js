const paymentService = require("./payment.service");
const catchAsync = require("../../shared/utils/catchAsync");

/**
 * Initiate payment - Get Razorpay order
 * POST /api/v1/payments/initiate
 */
const initiatePayment = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const result = await paymentService.initiatePayment(userId, req.body);

  res.status(201).json({
    status: "success",
    message: "Payment initiated successfully",
    data: result,
  });
});

/**
 * Verify payment
 * POST /api/v1/payments/verify
 */
const verifyPayment = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const result = await paymentService.verifyPayment(userId, req.body);

  res.status(200).json({
    status: "success",
    message: "Payment verified successfully",
    data: result,
  });
});

/**
 * Get payment by ID
 * GET /api/v1/payments/:paymentId
 */
const getPayment = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;
  const { id: userId } = req.user;

  const payment = await paymentService.getPaymentById(paymentId, userId);

  res.status(200).json({
    status: "success",
    data: payment,
  });
});

/**
 * Get payment by order ID
 * GET /api/v1/payments/order/:orderId
 */
const getPaymentByOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { id: userId } = req.user;

  const payment = await paymentService.getPaymentByOrderId(orderId, userId);

  res.status(200).json({
    status: "success",
    data: payment,
  });
});

/**
 * Get all user payments
 * GET /api/v1/payments
 */
const getUserPayments = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await paymentService.getUserPayments(userId, page, limit);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Process refund
 * POST /api/v1/payments/:paymentId/refund
 */
const refundPayment = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;
  const { id: userId } = req.user;
  const { amount, reason } = req.body;

  const result = await paymentService.processRefund(
    paymentId,
    amount,
    reason,
    userId,
  );

  res.status(200).json({
    status: "success",
    message: "Refund processed successfully",
    data: result,
  });
});

/**
 * Get all payments (Admin only)
 * GET /api/v1/payments/admin/all
 */
const getAllPayments = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const status = req.query.status || null;

  const result = await paymentService.getAllPayments(page, limit, status);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get payment statistics (Admin only)
 * GET /api/v1/payments/admin/statistics
 */
const getPaymentStats = catchAsync(async (req, res, next) => {
  const stats = await paymentService.getPaymentStats();

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

module.exports = {
  initiatePayment,
  verifyPayment,
  getPayment,
  getPaymentByOrder,
  getUserPayments,
  refundPayment,
  getAllPayments,
  getPaymentStats,
};
