const { getClient } = require("../db");
const AppError = require("../utils/appError");
const { enqueueWebhookDeliveries } = require("./webhookDelivery.service");

const ALLOWED_TRANSITIONS = {
  PENDING_KYB: ["ACTIVE", "SUSPENDED"],
  ACTIVE: ["SUSPENDED"],
  SUSPENDED: ["ACTIVE"]
};

const updateMerchantStatus = async (id, data, currentUser) => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const merchantResult = await client.query(
      `SELECT id, name, status
       FROM merchants
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    const merchant = merchantResult.rows[0];

    if (!merchant) {
      throw new AppError("Merchant not found", 404);
    }

    const oldStatus = merchant.status;
    const { newStatus, reason } = data;

    if (oldStatus === newStatus) {
      throw new AppError("Merchant is already in this status", 409);
    }

    const allowedTransitions = ALLOWED_TRANSITIONS[oldStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from ${oldStatus} to ${newStatus}`,
        400
      );
    }

    if (newStatus === "ACTIVE") {
      const docsResult = await client.query(
        `SELECT COUNT(*)::int AS verified_count
         FROM merchant_documents
         WHERE merchant_id = $1
           AND is_verified = TRUE
           AND document_type IN (
             'BUSINESS_REGISTRATION',
             'OWNER_IDENTITY',
             'BANK_ACCOUNT_PROOF'
           )`,
        [id]
      );

      const verifiedCount = docsResult.rows[0].verified_count;

      if (verifiedCount !== 3) {
        throw new AppError(
          "Merchant cannot be activated until all required KYB documents are verified",
          400
        );
      }
    }

    const updateResult = await client.query(
      `UPDATE merchants
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [newStatus, id]
    );

    const updatedMerchant = updateResult.rows[0];

    await client.query(
      `INSERT INTO merchant_status_history
       (merchant_id, old_status, new_status, changed_by, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, oldStatus, newStatus, currentUser.id, reason || null]
    );

    if (newStatus === "ACTIVE" || newStatus === "SUSPENDED") {
      const eventType =
        newStatus === "ACTIVE" ? "MERCHANT_APPROVED" : "MERCHANT_SUSPENDED";

      await enqueueWebhookDeliveries(eventType, {
        merchantId: updatedMerchant.id,
        name: updatedMerchant.name,
        status: updatedMerchant.status,
        eventType,
        changedBy: currentUser.id,
        reason: reason || null,
        occurredAt: new Date().toISOString()
      });
    }

    await client.query("COMMIT");

    return updatedMerchant;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  updateMerchantStatus
};