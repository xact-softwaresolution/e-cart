const productService = require('./product.service');
const catchAsync = require('../../shared/utils/catchAsync');

const createProduct = catchAsync(async (req, res, next) => {
  const product = await productService.createProduct(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { product }
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const result = await productService.getProducts(req.query);
  
  res.status(200).json({
    status: 'success',
    results: result.products.length,
    total: result.total,
    page: result.page,
    limit: result.limit,
    data: { products: result.products }
  });
});

const getProduct = catchAsync(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProduct(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const category = await productService.createCategory(req.body.name);
  
  res.status(201).json({
    status: 'success',
    data: { category }
  });
});

const getCategories = catchAsync(async (req, res, next) => {
  const categories = await productService.getCategories();
  
  res.status(200).json({
    status: 'success',
    count: categories.length,
    data: { categories }
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  getCategories
};
