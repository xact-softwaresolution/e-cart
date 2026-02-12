const { PrismaClient } = require('@prisma/client');
const AppError = require('../../shared/utils/AppError');

const prisma = new PrismaClient();

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.password = undefined;
  return user;
};

const updateProfile = async (userId, updateData) => {
  // Prevent password update via this route
  if (updateData.password || updateData.role) {
    throw new AppError('This route is not for password or role updates.', 400);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });

  user.password = undefined;
  return user;
};

const addAddress = async (userId, addressData) => {
  // If set to default, unset other defaults
  if (addressData.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.create({
    data: {
      ...addressData,
      userId
    }
  });

  return address;
};

const getAddresses = async (userId) => {
  return await prisma.address.findMany({
    where: { userId }
  });
};

module.exports = {
  getUserById,
  updateProfile,
  addAddress,
  getAddresses
};
