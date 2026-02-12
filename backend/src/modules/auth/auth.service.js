const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../../shared/utils/AppError');

const prisma = new PrismaClient();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d'
  });
};

const register = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER'
    }
  });

  // Create empty cart for user
  await prisma.cart.create({
    data: {
      userId: user.id
    }
  });

  const token = signToken(user.id);

  // Remove password from output
  user.password = undefined;

  return { user, token };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user.id);
  user.password = undefined;

  return { user, token };
};

module.exports = {
  register,
  login
};
