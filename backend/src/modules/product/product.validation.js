const { z } = require('zod');

const productSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().uuid('Invalid Category ID'),
    imageUrl: z.string().url().optional()
  })
});

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters')
  })
});

module.exports = {
  productSchema,
  categorySchema
};
