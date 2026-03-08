const { query } = require("../db");
const { signWebhookPayload } = require("../utils/webhookSignature");
const env = require("../config/env");

const MAX_RETRIES = env.webhook.maxRetries;
const RETRY_INTERVAL_SECONDS = env.webhook.retryIntervalSeconds;

const enqueueWebhookDeliveries = async (eventType, payload) => {
  const { rows: subscriptions } = await query(
    `SELECT id
     FROM webhook_subscriptions
     WHERE is_active = TRUE`
  );

  for (const subscription of subscriptions) {
    await query(
      `INSERT INTO webhook_deliveries
       (subscription_id, event_type, payload, status, attempt_count, next_attempt_at)
       VALUES ($1, $2, $3, 'PENDING', 0, NOW())`,
      [subscription.id, eventType, payload]
    );
  }
};

const processPendingWebhookDeliveries = async () => {
  const { rows: deliveries } = await query(
    `SELECT
        wd.id,
        wd.payload,
        wd.attempt_count,
        ws.target_url,
        ws.secret
     FROM webhook_deliveries wd
     JOIN webhook_subscriptions ws
       ON wd.subscription_id = ws.id
     WHERE wd.status = 'PENDING'
       AND (wd.next_attempt_at IS NULL OR wd.next_attempt_at <= NOW())
       AND ws.is_active = TRUE
     ORDER BY wd.created_at ASC
     LIMIT 10`
  );

  for (const delivery of deliveries) {
    try {
      const signature = signWebhookPayload(delivery.payload, delivery.secret);

      const response = await fetch(delivery.target_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YQN-Signature": signature
        },
        body: JSON.stringify(delivery.payload)
      });

      if (response.ok) {
        await query(
          `UPDATE webhook_deliveries
           SET status = 'SUCCESS',
               attempt_count = attempt_count + 1,
               last_attempt_at = NOW(),
               updated_at = NOW(),
               last_error = NULL
           WHERE id = $1`,
          [delivery.id]
        );
      } else {
        await handleFailure(
          delivery,
          `Non-2xx response: ${response.status}`
        );
      }
    } catch (err) {
      await handleFailure(delivery, err.message);
    }
  }
};

const handleFailure = async (delivery, errorMessage) => {
  const newAttemptCount = delivery.attempt_count + 1;

  if (newAttemptCount >= MAX_RETRIES) {
    await query(
      `UPDATE webhook_deliveries
       SET status = 'FAILED',
           attempt_count = $1,
           last_attempt_at = NOW(),
           updated_at = NOW(),
           last_error = $2
       WHERE id = $3`,
      [newAttemptCount, errorMessage, delivery.id]
    );
  } else {
    await query(
      `UPDATE webhook_deliveries
       SET status = 'PENDING',
           attempt_count = $1,
           last_attempt_at = NOW(),
           next_attempt_at = NOW() + ($2 * INTERVAL '1 second'),
           updated_at = NOW(),
           last_error = $3
       WHERE id = $4`,
      [newAttemptCount, RETRY_INTERVAL_SECONDS, errorMessage, delivery.id]
    );
  }
};

module.exports = {
  enqueueWebhookDeliveries,
  processPendingWebhookDeliveries
};