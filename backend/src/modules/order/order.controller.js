const orderService = require("./order.service");
const catchAsync = require("../../shared/utils/catchAsync");

/**
 * Create a new order
 * POST /api/v1/orders
 */
const createOrder = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const result = await orderService.createOrder(userId, req.body);

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: result,
    
  });
  console.log(req.body);

});

/**
 * Get order by ID
 * GET /api/v1/orders/:orderId
 */
const getOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { id: userId } = req.user;

  const order = await orderService.getOrderById(orderId, userId);

  res.status(200).json({
    status: "success",
    data: order,
  });
});

/**
 * Get all orders for logged-in user
 * GET /api/v1/orders
 */
const getUserOrders = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await orderService.getOrdersByUser(userId, page, limit);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get all orders (Admin only)
 * GET /api/v1/orders/admin/all
 */
const getAllOrders = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const status = req.query.status || null;

  const result = await orderService.getAllOrders(page, limit, status);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Update order status (Admin only)
 * PATCH /api/v1/orders/:orderId/status
 */
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderService.updateOrderStatus(orderId, status);

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  });
});

/**
 * Get order statistics (Admin only)
 * GET /api/v1/orders/admin/statistics
 */
const getOrderStats = catchAsync(async (req, res, next) => {
  const stats = await orderService.getOrderStats();

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

module.exports = {
  createOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
