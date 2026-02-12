const userService = require('./user.service');
const catchAsync = require('../../shared/utils/catchAsync');

const getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  const updatedUser = await userService.updateProfile(req.user.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

const addAddress = catchAsync(async (req, res, next) => {
  const address = await userService.addAddress(req.user.id, req.body);
  
  res.status(201).json({
    status: 'success',
    data: { address }
  });
});

const getMyAddresses = catchAsync(async (req, res, next) => {
  const addresses = await userService.getAddresses(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: { addresses }
  });
});

module.exports = {
  getMe,
  updateMe,
  addAddress,
  getMyAddresses
};
