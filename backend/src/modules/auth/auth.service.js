const prisma = require("../../shared/prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../shared/utils/AppError");

// helper functions for access/refresh tokens
// ensure secrets are provided; otherwise the error you saw is thrown deep in jsonwebtoken
const signAccessToken = (id) => {
  let secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_ACCESS_SECRET (or JWT_SECRET) is not defined", 500);
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

const signRefreshToken = (id) => {
  let secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(
      "JWT_REFRESH_SECRET (or JWT_SECRET) is not defined",
      500,
    );
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "5d",
  });
};

const register = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user exists (including soft-deleted)
  const existingUser = await prisma.user.findFirst({
    where: { email, isDeleted: false },
  });

  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
    },
  });

  // Create empty cart for user
  await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  // generate tokens and persist refresh token to db
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // Remove password before returning
  user.password = undefined;

  return { user, accessToken, refreshToken };
};

const login = async (email, password) => {
  const user = await prisma.user.findFirst({
    where: { email, isDeleted: false },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  // create new tokens and update refresh token in db (rotate)
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  user.password = undefined;

  return { user, accessToken, refreshToken };
};

// verify refresh token and return new access/refresh pair
const refreshTokens = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findFirst({
      where: { id: decoded.id, isDeleted: false },
    });

    if (!user || user.refreshToken !== token) {
      throw new AppError("Invalid refresh token", 401);
    }

    // rotate tokens
    const newAccess = signAccessToken(user.id);
    const newRefresh = signRefreshToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    });

    user.password = undefined;
    user.refreshToken = undefined;
    return { user, accessToken: newAccess, refreshToken: newRefresh };
  } catch (err) {
    throw new AppError("Could not refresh tokens", 401);
  }
};

// clear refresh token on logout
const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      addresses: {
        where: { isDeleted: false },
        select: {
          id: true,
          street: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
          phone: true,
          isDefault: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

module.exports = {
  register,
  login,
  getProfile,
  refreshTokens,
  logout,
};
