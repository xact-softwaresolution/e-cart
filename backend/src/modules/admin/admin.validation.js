const { z } = require("zod");

// Product Validation
const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be non-negative"),
    stock: z.number().int().min(0, "Stock must be non-negative"),
    categoryId: z.string().uuid("Invalid Category ID"),
    imageUrl: z.string().url("Invalid image URL").optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    imageUrl: z.string().url().optional(),
  }),
});

// Category Validation
const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
  }),
});

// Inventory Control
const updateInventorySchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid Product ID"),
    quantity: z.number().int().min(-999, "Invalid quantity"),
    reason: z.enum(["RESTOCK", "DAMAGE", "LOST", "ADJUSTMENT"]).optional(),
  }),
});

// Order Management
const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ]),
  }),
});

// User Management
const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["USER", "ADMIN"]),
  }),
});

// Param Validation
const productIdParamSchema = z.object({
  params: z.object({
    productId: z.string().uuid("Invalid Product ID"),
  }),
});

const orderIdParamSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid Order ID"),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid User ID"),
  }),
});

const categoryIdParamSchema = z.object({
  params: z.object({
    categoryId: z.string().uuid("Invalid Category ID"),
  }),
});

module.exports = {
  // Product
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,

  // Category
  createCategorySchema,
  categoryIdParamSchema,

  // Inventory
  updateInventorySchema,

  // Order
  updateOrderStatusSchema,
  orderIdParamSchema,

  // User
  updateUserRoleSchema,
  userIdParamSchema,
};
