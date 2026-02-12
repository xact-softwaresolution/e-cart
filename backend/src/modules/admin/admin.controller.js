const adminService = require("./admin.service");
const catchAsync = require("../../shared/utils/catchAsync");

// ============================================
// PRODUCT MANAGEMENT
// ============================================

const createProduct = catchAsync(async (req, res, next) => {
  const product = await adminService.createProduct(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const search = req.query.search || null;

  const result = await adminService.getAllProducts(page, limit, search);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await adminService.getProductById(productId);

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await adminService.updateProduct(productId, req.body);

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const result = await adminService.deleteProduct(productId);

  res.status(200).json({
    status: "success",
    message: result.message,
  });
});

// ============================================
// CATEGORY MANAGEMENT
// ============================================

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await adminService.createCategory(name);

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await adminService.getAllCategories();

  res.status(200).json({
    status: "success",
    data: categories,
  });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await adminService.getCategoryById(categoryId);

  res.status(200).json({
    status: "success",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const result = await adminService.deleteCategory(categoryId);

  res.status(200).json({
    status: "success",
    message: result.message,
  });
});

// ============================================
// INVENTORY MANAGEMENT
// ============================================

const updateInventory = catchAsync(async (req, res, next) => {
  const { productId, quantity, reason } = req.body;

  const product = await adminService.updateInventory(
    productId,
    quantity,
    reason,
  );

  res.status(200).json({
    status: "success",
    message: "Inventory updated successfully",
    data: product,
  });
});

const getLowStockProducts = catchAsync(async (req, res, next) => {
  const threshold = req.query.threshold || 10;

  const products = await adminService.getLowStockProducts(threshold);

  res.status(200).json({
    status: "success",
    data: {
      count: products.length,
      products,
    },
  });
});

const getInventoryReport = catchAsync(async (req, res, next) => {
  const report = await adminService.getInventoryReport();

  res.status(200).json({
    status: "success",
    data: report,
  });
});

// ============================================
// ORDER MANAGEMENT
// ============================================

const getDashboardOrders = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const status = req.query.status || null;

  const result = await adminService.getDashboardOrders(page, limit, status);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const getOrderMetrics = catchAsync(async (req, res, next) => {
  const metrics = await adminService.getOrderMetrics();

  res.status(200).json({
    status: "success",
    data: metrics,
  });
});

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const role = req.query.role || null;

  const result = await adminService.getAllUsers(page, limit, role);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await adminService.getUserById(userId);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

const updateUserRole = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await adminService.updateUserRole(userId, role);

  res.status(200).json({
    status: "success",
    message: "User role updated successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const result = await adminService.deleteUser(userId);

  res.status(200).json({
    status: "success",
    message: result.message,
  });
});

const getUserMetrics = catchAsync(async (req, res, next) => {
  const metrics = await adminService.getUserMetrics();

  res.status(200).json({
    status: "success",
    data: metrics,
  });
});

// ============================================
// DASHBOARD ANALYTICS
// ============================================

const getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await adminService.getDashboardStats();

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

module.exports = {
  // Product
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,

  // Category
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,

  // Inventory
  updateInventory,
  getLowStockProducts,
  getInventoryReport,

  // Order
  getDashboardOrders,
  getOrderMetrics,

  // User
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserMetrics,

  // Analytics
  getDashboardStats,
};
