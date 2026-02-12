const cartService = require('./cart.service');
const catchAsync = require('../../shared/utils/catchAsync');

const getCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCart(req.user.id);
  res.status(200).json({
    status: 'success',
    data: cart
  });
});

const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, productId, quantity);
  
  res.status(200).json({
    status: 'success',
    data: cart
  });
});

const updateCartItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  
  const cart = await cartService.updateCartItem(req.user.id, itemId, quantity);

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

const removeCartItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await cartService.removeCartItem(req.user.id, itemId);

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

const clearCart = catchAsync(async (req, res, next) => {
  await cartService.clearCart(req.user.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
