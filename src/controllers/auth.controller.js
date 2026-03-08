const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");

const login = catchAsync(async (req, res) => {
  const { email, password } = req.validated.body;
  const result = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    data: result
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
  login,
  refresh
};
