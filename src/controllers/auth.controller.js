const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const { email, password } = req.validated.body;
  const result = await authService.register({ email, password });

  res.status(201).json({
    success: true,
    data: result
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.validated.body;
  const result = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    data: result
  });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.validated.body;
  await authService.logout({ refreshToken });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.validated.body;
  const result = await authService.refresh({ refreshToken });

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  register,
  login,
  logout,
  refresh
};
