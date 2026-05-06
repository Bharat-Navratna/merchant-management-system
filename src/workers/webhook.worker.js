const { processPendingWebhookDeliveries } = require("../services/webhookDelivery.service");
const env = require("../config/env");

const run = async () => {
  try {
    await processPendingWebhookDeliveries();
  } catch (err) {
    console.error("Webhook worker error:", err.message);
  }
};

console.log(`Webhook worker started. Polling every ${env.webhook.workerIntervalMs}ms`);

// run immediately
run();

setInterval(run, env.webhook.workerIntervalMs);