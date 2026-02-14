const prisma = require("../../shared/prisma/client");
const AppError = require("../../shared/utils/AppError");

const getCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          product: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  // Calculate total
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return { ...cart, totalAmount };
};

const addToCart = async (userId, productId, quantity) => {
  // 1. Get user cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 2. Check product availability
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Not enough stock. Only ${product.stock} left.`, 400);
  }

  // 3. Check if item exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError(`Not enough stock. Only ${product.stock} left.`, 400);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    // Add new item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getCart(userId);
};

const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404);

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!item || item.cartId !== cart.id) {
    throw new AppError("Item not found in your cart", 404);
  }

  if (item.product.stock < quantity) {
    throw new AppError(
      `Not enough stock. Only ${item.product.stock} left.`,
      400,
    );
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getCart(userId);
};

const removeCartItem = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404);

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.cartId !== cart.id) {
    throw new AppError("Item not found in your cart", 404);
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return { message: "Cart cleared" };
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
