const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid Address ID"),
    cartItems: z
      .array(
        z.object({
          productId: z.string().uuid("Invalid Product ID"),
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
          price: z.number().min(0, "Price must be positive"),
        }),
      )
      .min(1, "Order must have at least one item"),
    totalAmount: z.number().min(0, "Total amount must be positive"),
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
