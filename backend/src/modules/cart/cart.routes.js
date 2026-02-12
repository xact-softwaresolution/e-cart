const express = require('express');
const cartController = require('./cart.controller');
const { protect } = require('../../shared/middleware/auth');
const validate = require('../../shared/middleware/validate');
const { addToCartSchema, updateCartItemSchema } = require('./cart.validation');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router
  .route('/')
  .get(cartController.getCart)
  .post(validate(addToCartSchema), cartController.addToCart)
  .delete(cartController.clearCart);

router
  .route('/:itemId')
  .patch(validate(updateCartItemSchema), cartController.updateCartItem)
  .delete(cartController.removeCartItem);

module.exports = router;
