const webhookService = require("../services/webhook.service");
const catchAsync = require("../utils/catchAsync");

const createSubscription = catchAsync(async (req, res) => {
  const subscription = await webhookService.createSubscription(req.validated.body);

  res.status(201).json({
    success: true,
    data: subscription
  });
});

const listSubscriptions = catchAsync(async (req, res) => {
  const subscriptions = await webhookService.listSubscriptions();

  res.status(200).json({
    success: true,
    data: subscriptions
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await webhookService.deleteSubscription(req.validated.params.id);

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  createSubscription,
  listSubscriptions,
  deleteSubscription
};
