const authService = require("./auth.service");
const catchAsync = require("../../shared/utils/catchAsync");
const AppError = require("../../shared/utils/AppError");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // cross‑site requests from frontend require None when deployed; use Lax in dev
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

const register = catchAsync(async (req, res, next) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body,
  );

  // set cookies
  res
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

  res.status(201).json({
    status: "success",
    data: { user },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password,
  );

  res
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  // ✅ User is attached by protect middleware
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const refresh = catchAsync(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return next(new AppError("No refresh token provided", 401));
  }

  const { user, accessToken, refreshToken } =
    await authService.refreshTokens(token);

  res
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

  res.status(200).json({ status: "success", data: { user } });
});

const logout = catchAsync(async (req, res, next) => {
  // user should already be attached by protect
  const id = req.user?.id;
  if (id) {
    await authService.logout(id);
  }

  res
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS);

  res.status(200).json({ status: "success" });
});

module.exports = {
  register,
  login,
  getProfile,
  refresh,
  logout,
};
