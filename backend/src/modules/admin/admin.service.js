const { PrismaClient } = require("@prisma/client");
const AppError = require("../../shared/utils/AppError");

const prisma = new PrismaClient();

// ============================================
// PRODUCT MANAGEMENT
// ============================================

const createProduct = async (productData) => {
  return await prisma.product.create({
    data: productData,
    include: { category: true },
  });
};

const getAllProducts = async (page = 1, limit = 20, search = null) => {
  const skip = (page - 1) * limit;
  const where = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.product.count({ where });

  return { products, total, page, limit, pages: Math.ceil(total / limit) };
};

const getProductById = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

const updateProduct = async (productId, updateData) => {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { category: true },
    });
    return product;
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("Product not found", 404);
    }
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    // Check if product has orders
    const orderCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderCount > 0) {
      throw new AppError(
        "Cannot delete product with existing orders. Deactivate instead.",
        400,
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return { message: "Product deleted successfully" };
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("Product not found", 404);
    }
    throw error;
  }
};

// ============================================
// CATEGORY MANAGEMENT
// ============================================

const createCategory = async (name) => {
  try {
    return await prisma.category.create({
      data: { name },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("Category already exists", 400);
    }
    throw error;
  }
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};

const getCategoryById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { products: true },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (category._count.products > 0) {
      throw new AppError(
        "Cannot delete category with products. Move products first.",
        400,
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: "Category deleted successfully" };
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("Category not found", 404);
    }
    throw error;
  }
};

// ============================================
// INVENTORY MANAGEMENT
// ============================================

const updateInventory = async (productId, quantity, reason = "ADJUSTMENT") => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const newStock = product.stock + quantity;

  if (newStock < 0) {
    throw new AppError("Insufficient stock for this operation", 400);
  }

  return await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
    include: { category: true },
  });
};

const getLowStockProducts = async (threshold = 10) => {
  return await prisma.product.findMany({
    where: {
      stock: { lte: threshold },
    },
    include: { category: true },
    orderBy: { stock: "asc" },
  });
};

const getInventoryReport = async () => {
  const totalProducts = await prisma.product.count();

  const totalStock = await prisma.product.aggregate({
    _sum: { stock: true },
  });

  const lowStockCount = await prisma.product.count({
    where: { stock: { lte: 10 } },
  });

  const outOfStock = await prisma.product.count({
    where: { stock: 0 },
  });

  const avgStock =
    totalProducts > 0
      ? Math.round((totalStock._sum.stock || 0) / totalProducts)
      : 0;

  return {
    totalProducts,
    totalStock: totalStock._sum.stock || 0,
    avgStock,
    lowStockCount,
    outOfStock,
  };
};

// ============================================
// ORDER MANAGEMENT
// ============================================

const getDashboardOrders = async (page = 1, limit = 20, status = null) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.order.count({ where });

  return { orders, total, page, limit, pages: Math.ceil(total / limit) };
};

const getOrderMetrics = async () => {
  const totalOrders = await prisma.order.count();

  const statusBreakdown = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
  });

  const avgOrderValue =
    totalOrders > 0
      ? Number((totalRevenue._sum.totalAmount || 0) / totalOrders).toFixed(2)
      : 0;

  const completedOrders =
    statusBreakdown.find((s) => s.status === "DELIVERED")?._count.id || 0;

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    avgOrderValue,
    completedOrders,
    statusBreakdown,
  };
};

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = async (page = 1, limit = 20, role = null) => {
  const skip = (page - 1) * limit;
  const where = role ? { role } : {};

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true, addresses: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.user.count({ where });

  return { users, total, page, limit, pages: Math.ceil(total / limit) };
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        take: 5,
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
      addresses: true,
      _count: {
        select: { orders: true, addresses: true },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateUserRole = async (userId, newRole) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return user;
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("User not found", 404);
    }
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    // Check if user has orders
    const orderCount = await prisma.order.count({
      where: { userId },
    });

    if (orderCount > 0) {
      throw new AppError(
        "Cannot delete user with existing orders. Deactivate account instead.",
        400,
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("User not found", 404);
    }
    throw error;
  }
};

const getUserMetrics = async () => {
  const totalUsers = await prisma.user.count();

  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  const customerCount = await prisma.user.count({
    where: { role: "USER" },
  });

  const activeUsers = await prisma.user.count({
    where: {
      orders: {
        some: {},
      },
    },
  });

  return {
    totalUsers,
    adminCount,
    customerCount,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
  };
};

// ============================================
// DASHBOARD ANALYTICS
// ============================================

const getDashboardStats = async () => {
  const orderMetrics = await getOrderMetrics();
  const userMetrics = await getUserMetrics();
  const inventoryMetrics = await getInventoryReport();

  return {
    orders: orderMetrics,
    users: userMetrics,
    inventory: inventoryMetrics,
  };
};

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
