const crypto = require("crypto");

const signWebhookPayload = (payload, secret) => {
  const payloadString = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadString)
    .digest("hex");

  return signature;
};

module.exports = {
  signWebhookPayload
};