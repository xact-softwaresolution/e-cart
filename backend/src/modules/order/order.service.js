const { PrismaClient } = require("@prisma/client");
const AppError = require("../../shared/utils/AppError");

const prisma = new PrismaClient();

/**
 * Create a new order from cart
 */
const createOrder = async (userId, orderData) => {
  const { addressId, cartItems, totalAmount } = orderData;

  // Verify address belongs to user
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError("Address not found or does not belong to you", 404);
  }

  // Check stock availability for all items
  for (const item of cartItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new AppError(`Product ${item.productId} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        400,
      );
    }
  }

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        totalAmount: totalAmount,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        payment: true,
      },
    });

    // Reduce product stock
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear user's cart
    await tx.cart.update({
      where: { userId },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });

    return newOrder;
  });

  return order;
};

/**
 * Get order by ID with full details
 */
const getOrderById = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Verify user owns this order
  if (order.userId !== userId && order.user.id !== userId) {
    throw new AppError("You do not have permission to access this order", 403);
  }

  return order;
};

/**
 * Get all orders for a user with pagination
 */
const getOrdersByUser = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const orders = await prisma.order.findMany({
    where: { userId },
    skip,
    take: limit,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
      payment: {
        select: {
          id: true,
          status: true,
          provider: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.order.count({
    where: { userId },
  });

  return {
    orders,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Get all orders (Admin only)
 */
const getAllOrders = async (page = 1, limit = 20, filterStatus = null) => {
  const skip = (page - 1) * limit;
  const where = filterStatus ? { status: filterStatus } : {};

  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.order.count({ where });

  return {
    orders,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, newStatus) => {
  const validStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(newStatus)) {
    throw new AppError("Invalid order status", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Handle cancellation - restore stock
  if (newStatus === "CANCELLED" && order.status !== "CANCELLED") {
    await prisma.$transaction(async (tx) => {
      // Get order items
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
      });

      // Restore stock for each item
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });
    });
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }

  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
    },
  });
};

/**
 * Get order statistics (Admin)
 */
const getOrderStats = async () => {
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  const statusBreakdown = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const completedOrders =
    statusBreakdown.find((s) => s.status === "DELIVERED")?._count.id || 0;
  const cancelledOrders =
    statusBreakdown.find((s) => s.status === "CANCELLED")?._count.id || 0;

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    completedOrders,
    cancelledOrders,
    statusBreakdown,
  };
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
