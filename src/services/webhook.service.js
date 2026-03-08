const { query } = require("../db");
const AppError = require("../utils/appError");

const createSubscription = async (data) => {
  const { rows } = await query(
    `INSERT INTO webhook_subscriptions (target_url, secret, is_active)
     VALUES ($1, $2, TRUE)
     RETURNING *`,
    [data.targetUrl, data.secret]
  );

  return rows[0];
};

const listSubscriptions = async () => {
  const { rows } = await query(
    `SELECT * FROM webhook_subscriptions ORDER BY created_at DESC`
  );

  return rows;
};

const deleteSubscription = async (id) => {
  const { rowCount } = await query(
    `DELETE FROM webhook_subscriptions WHERE id = $1`,
    [id]
  );

  if (rowCount === 0) {
    throw new AppError("Webhook subscription not found", 404);
  }

  return { message: "Webhook subscription deleted successfully" };
};

module.exports = {
  createSubscription,
  listSubscriptions,
  deleteSubscription
};
