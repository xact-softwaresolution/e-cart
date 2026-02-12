const { z } = require("zod");

const initiatePaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid Order ID"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    currency: z.string().default("INR").optional(),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid Order ID"),
    razorpay_order_id: z.string().min(1, "Razorpay Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Razorpay Payment ID is required"),
    razorpay_signature: z.string().min(1, "Razorpay Signature is required"),
  }),
});

const refundSchema = z.object({
  body: z.object({
    paymentId: z.string().uuid("Invalid Payment ID"),
    amount: z
      .number()
      .min(1, "Refund amount must be greater than 0")
      .optional(),
    reason: z.string().optional(),
  }),
});

const paymentIdParamSchema = z.object({
  params: z.object({
    paymentId: z.string().uuid("Invalid Payment ID"),
  }),
});

const orderIdParamSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid Order ID"),
  }),
});

module.exports = {
  initiatePaymentSchema,
  verifyPaymentSchema,
  refundSchema,
  paymentIdParamSchema,
  orderIdParamSchema,
};
