const prisma = require("../../shared/prisma/client");
const APIFeatures = require("../../shared/utils/apiFeatures");
const AppError = require("../../shared/utils/AppError");

const createProduct = async (productData) => {
  return await prisma.product.create({
    data: productData,
  });
};

const getProducts = async (queryString) => {
  // Build Prisma query options using APIFeatures logic manually for now
  // since APIFeatures class above was designed more for Mongoose style

  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 20;
  const skip = (page - 1) * limit;

  const where = {};

  // Search by name
  if (queryString.search) {
    where.name = { contains: queryString.search, mode: "insensitive" };
  }

  // Filter by category
  if (queryString.category) {
    // If category is ID or Name. Assuming ID for simplicity or join
    // If it's a name, we need to find category first or use relation filter
    // Let's assume input is categoryId
    where.categoryId = queryString.category;
  }

  // Price filter
  if (queryString.minPrice || queryString.maxPrice) {
    where.price = {};
    if (queryString.minPrice)
      where.price.gte = parseFloat(queryString.minPrice);
    if (queryString.maxPrice)
      where.price.lte = parseFloat(queryString.maxPrice);
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.product.count({ where });

  return { products, total, page, limit };
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

const updateProduct = async (id, updateData) => {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    return product;
  } catch (error) {
    // Handle record not found
    if (error.code === "P2025") {
      throw new AppError("Product not found", 404);
    }
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("Product not found", 404);
    }
    throw error;
  }
};

// Category Services
const createCategory = async (name) => {
  return await prisma.category.create({
    data: { name },
  });
};

const getCategories = async () => {
  return await prisma.category.findMany();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createCategory,
  getCategories,
};
