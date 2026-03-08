const merchantService = require("../services/merchant.service");
const catchAsync = require("../utils/catchAsync");

const createMerchant = catchAsync(async (req, res) => {
  const merchant = await merchantService.createMerchant(req.validated.body, req.user);

  res.status(201).json({
    success: true,
    data: merchant
  });
});

const listMerchants = catchAsync(async (req, res) => {
  const merchants = await merchantService.listMerchants(req.validated.query);

  res.status(200).json({
    success: true,
    data: merchants
  });
});

const getMerchantById = catchAsync(async (req, res) => {
  const merchant = await merchantService.getMerchantById(req.validated.params.id);

  res.status(200).json({
    success: true,
    data: merchant
  });
});

const updateMerchant = catchAsync(async (req, res) => {
  const merchant = await merchantService.updateMerchant(
    req.validated.params.id,
    req.validated.body,
    req.user
  );

  res.status(200).json({
    success: true,
    data: merchant
  });
});

const deleteMerchant = catchAsync(async (req, res) => {
  const result = await merchantService.deleteMerchant(req.validated.params.id);

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  createMerchant,
  listMerchants,
  getMerchantById,
  updateMerchant,
  deleteMerchant
};
