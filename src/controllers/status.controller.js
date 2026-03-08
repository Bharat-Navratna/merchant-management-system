const statusService = require("../services/status.service");
const catchAsync = require("../utils/catchAsync");

const updateMerchantStatus = catchAsync(async (req, res) => {
  const merchant = await statusService.updateMerchantStatus(
    req.validated.params.id,
    req.validated.body,
    req.user
  );

  res.status(200).json({
    success: true,
    data: merchant
  });
});

module.exports = {
  updateMerchantStatus
};
