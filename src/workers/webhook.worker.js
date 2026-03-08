const { processPendingWebhookDeliveries } = require("../services/webhookDelivery.service");

const run = async () => {
  try {
    await processPendingWebhookDeliveries();
  } catch (err) {
    console.error("Webhook worker error:", err.message);
  }
};

console.log("Webhook worker started");

// run immediately
run();

// run every 30 seconds
setInterval(run, 30000);