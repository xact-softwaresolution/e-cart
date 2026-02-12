const { z } = require('zod');

const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid Product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema
};
