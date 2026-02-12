const authService = require('./auth.service');
const catchAsync = require('../../shared/utils/catchAsync');

const register = catchAsync(async (req, res, next) => {
  const result = await authService.register(req.body);
  
  res.status(201).json({
    status: 'success',
    data: result
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  // TODO: Implement getProfile fetching user from req.user (middleware needed)
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});

module.exports = {
  register,
  login,
  getProfile
};
