const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const AppError = require("../../shared/utils/AppError");

const prisma = new PrismaClient();

// Razorpay integration
let Razorpay;
try {
  Razorpay = require("razorpay");
} catch (error) {
  // Razorpay will be required at module load, but we handle it gracefully
  console.warn(
    "Razorpay SDK not installed. Install with: npm install razorpay",
  );
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Initiate payment - Create Razorpay order
 */
const initiatePayment = async (userId, paymentData) => {
  const { orderId, amount, currency = "INR" } = paymentData;

  // Verify order exists and belongs to user
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.userId !== userId) {
    throw new AppError("You do not have permission to pay for this order", 403);
  }

  if (order.paymentStatus !== "PENDING") {
    throw new AppError("Order payment has already been processed", 400);
  }

  // Check if payment record already exists
  let payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (payment && payment.status === "COMPLETED") {
    throw new AppError("Payment already completed for this order", 400);
  }

  try {
    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (smallest unit)
      currency,
      receipt: `receipt_${orderId}`,
      notes: {
        orderId,
        userId,
        productIds: order.items.map((item) => item.productId).join(","),
      },
    });

    // Update or create payment record
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          orderId,
          amount,
          currency,
          provider: "RAZORPAY",
          status: "PENDING",
          transactionId: razorpayOrder.id,
        },
      });
    } else {
      payment = await prisma.payment.update({
        where: { orderId },
        data: {
          transactionId: razorpayOrder.id,
          status: "PENDING",
        },
      });
    }

    return {
      payment,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new AppError("Failed to initiate payment. Please try again.", 500);
  }
};

/**
 * Verify payment signature
 */
const verifyPaymentSignature = (
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  hmac.update(body);
  const digest = hmac.digest("hex");

  return digest === razorpaySignature;
};

/**
 * Complete payment verification
 */
const verifyPayment = async (userId, paymentData) => {
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = paymentData;

  // Verify signature
  const isSignatureValid = verifyPaymentSignature(
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );

  if (!isSignatureValid) {
    throw new AppError("Invalid payment signature", 400);
  }

  try {
    // Fetch payment details from Razorpay
    const razorpayPayment =
      await razorpayInstance.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.status !== "captured") {
      throw new AppError("Payment was not captured successfully", 400);
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status: "COMPLETED",
        transactionId: razorpay_payment_id,
      },
    });

    // Update order payment status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "COMPLETED",
        status: "PROCESSING", // Auto-move to processing after successful payment
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
        payment: true,
      },
    });

    return {
      payment,
      order,
    };
  } catch (error) {
    console.error("Payment Verification Error:", error);
    throw new AppError(
      "Payment verification failed. Please contact support.",
      500,
    );
  }
};

/**
 * Process refund
 */
const processRefund = async (paymentId, refundAmount, reason, userId) => {
  // Verify payment exists
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payment.order.userId !== userId && payment.status !== "COMPLETED") {
    throw new AppError("Cannot refund this payment", 400);
  }

  if (payment.status === "REFUNDED") {
    throw new AppError("Payment has already been refunded", 400);
  }

  try {
    const refundAmountInPaise = Math.round(
      (refundAmount || payment.amount) * 100,
    );

    // Create refund in Razorpay
    const refund = await razorpayInstance.payments.refund(
      payment.transactionId,
      {
        amount: refundAmountInPaise,
        notes: {
          reason: reason || "Customer requested refund",
        },
      },
    );

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
      },
    });

    // Update order status to CANCELLED
    const order = await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
      },
    });

    return {
      payment: updatedPayment,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
      order,
    };
  } catch (error) {
    console.error("Refund Error:", error);
    throw new AppError("Failed to process refund. Please try again.", 500);
  }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (paymentId, userId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  // Verify user owns this payment
  if (payment.order.user.id !== userId) {
    throw new AppError(
      "You do not have permission to access this payment",
      403,
    );
  }

  return payment;
};

/**
 * Get payment by order ID
 */
const getPaymentByOrderId = async (orderId, userId) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found for this order", 404);
  }

  // Verify user owns this payment
  if (payment.order.user.id !== userId) {
    throw new AppError(
      "You do not have permission to access this payment",
      403,
    );
  }

  return payment;
};

/**
 * Get all payments for user
 */
const getUserPayments = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const payments = await prisma.payment.findMany({
    where: {
      order: {
        userId,
      },
    },
    skip,
    take: limit,
    include: {
      order: {
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.payment.count({
    where: {
      order: {
        userId,
      },
    },
  });

  return {
    payments,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Get all payments (Admin only)
 */
const getAllPayments = async (page = 1, limit = 20, status = null) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const payments = await prisma.payment.findMany({
    where,
    skip,
    take: limit,
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.payment.count({ where });

  return {
    payments,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Get payment statistics (Admin only)
 */
const getPaymentStats = async () => {
  const totalPayments = await prisma.payment.count();

  const completedPayments = await prisma.payment.count({
    where: { status: "COMPLETED" },
  });

  const refundedPayments = await prisma.payment.count({
    where: { status: "REFUNDED" },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true },
  });

  const refundedAmount = await prisma.payment.aggregate({
    where: { status: "REFUNDED" },
    _sum: { amount: true },
  });

  return {
    totalPayments,
    completedPayments,
    refundedPayments,
    totalRevenue: totalRevenue._sum.amount || 0,
    refundedAmount: refundedAmount._sum.amount || 0,
    successRate:
      totalPayments > 0
        ? ((completedPayments / totalPayments) * 100).toFixed(2)
        : 0,
  };
};

module.exports = {
  initiatePayment,
  verifyPayment,
  processRefund,
  getPaymentById,
  getPaymentByOrderId,
  getUserPayments,
  getAllPayments,
  getPaymentStats,
};
