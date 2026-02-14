const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid Address ID"),
    // ✅ ULTIMATE SECURITY: Client sends ONLY addressId
    // Server fetches cart items from database
    // This prevents:
    // - Changing quantities
    // - Removing items
    // - Adding fake items
    // - Price manipulation
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(
      ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      {
        errorMap: () => ({ message: "Invalid order status" }),
      },
    ),
  }),
});

const orderIdParamSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid Order ID"),
  }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
};
