const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const { query, pool } = require("../src/db");

// Mock the delivery service so no real HTTP calls are made to webhook URLs
jest.mock("../src/services/webhookDelivery.service", () => ({
  enqueueWebhookDeliveries: jest.fn().mockResolvedValue(undefined),
  processPendingWebhookDeliveries: jest.fn().mockResolvedValue(undefined)
}));

const { enqueueWebhookDeliveries } = require("../src/services/webhookDelivery.service");

const email = "webhook_admin_test@yqnpay.com";
const password = "Admin123!";
let accessToken;
let operatorId;
let merchantId;
let subscriptionId;

// Set up a fully-verified merchant so we can trigger status changes
const setupVerifiedMerchant = async () => {
  const createRes = await request(app)
    .post("/api/merchants")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "Webhook Test Merchant",
      category: "Finance",
      city: "Bangalore",
      contactEmail: "webhook@merchant.com"
    });

  const mid = createRes.body.data.id;

  const docTypes = ["BUSINESS_REGISTRATION", "OWNER_IDENTITY", "BANK_ACCOUNT_PROOF"];
  for (const type of docTypes) {
    const uploadRes = await request(app)
      .post(`/api/merchants/${mid}/documents`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ type, fileUrl: `https://example.com/${type.toLowerCase()}.pdf` });

    await request(app)
      .patch(`/api/merchants/${mid}/documents/${uploadRes.body.data.id}/verify`)
      .set("Authorization", `Bearer ${accessToken}`);
  }

  return mid;
};

beforeAll(async () => {
  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    `DELETE FROM refresh_tokens WHERE operator_id IN (SELECT id FROM operators WHERE email = $1)`,
    [email]
  );
  await query(
    `DELETE FROM merchant_documents WHERE merchant_id IN (SELECT id FROM merchants WHERE created_by IN (SELECT id FROM operators WHERE email = $1))`,
    [email]
  );
  await query(
    `DELETE FROM merchant_status_history WHERE merchant_id IN (SELECT id FROM merchants WHERE created_by IN (SELECT id FROM operators WHERE email = $1))`,
    [email]
  );
  await query(
    `DELETE FROM merchants WHERE created_by IN (SELECT id FROM operators WHERE email = $1)`,
    [email]
  );
  await query(`DELETE FROM operators WHERE email = $1`, [email]);

  const { rows } = await query(
    `INSERT INTO operators (email, password_hash, role) VALUES ($1, $2, 'ADMIN') RETURNING id`,
    [email, passwordHash]
  );
  operatorId = rows[0].id;

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  accessToken = loginRes.body.data.accessToken;
  merchantId = await setupVerifiedMerchant();
});

afterAll(async () => {
  if (subscriptionId) {
    await query(`DELETE FROM webhook_subscriptions WHERE id = $1`, [subscriptionId]);
  }
  if (merchantId) {
    await query(`DELETE FROM merchant_documents WHERE merchant_id = $1`, [merchantId]);
    await query(`DELETE FROM merchant_status_history WHERE merchant_id = $1`, [merchantId]);
    await query(`DELETE FROM merchants WHERE id = $1`, [merchantId]);
  }
  await query(`DELETE FROM refresh_tokens WHERE operator_id = $1`, [operatorId]);
  await query(`DELETE FROM operators WHERE id = $1`, [operatorId]);
  await pool.end();
});

describe("POST /api/webhooks", () => {
  it("should register a webhook URL and return 201", async () => {
    const res = await request(app)
      .post("/api/webhooks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        targetUrl: "https://example.com/webhook-receiver",
        secret: "test-secret-key"
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.target_url).toBe("https://example.com/webhook-receiver");
    expect(res.body.data.is_active).toBe(true);
    subscriptionId = res.body.data.id;
  });
});

describe("Webhook dispatch on status change", () => {
  it("should call enqueueWebhookDeliveries with MERCHANT_APPROVED when merchant is activated", async () => {
    enqueueWebhookDeliveries.mockClear();

    const res = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ newStatus: "ACTIVE", reason: "KYB complete" });

    expect(res.status).toBe(200);
    expect(enqueueWebhookDeliveries).toHaveBeenCalledTimes(1);
    expect(enqueueWebhookDeliveries).toHaveBeenCalledWith(
      "MERCHANT_APPROVED",
      expect.objectContaining({
        merchantId: merchantId,
        status: "ACTIVE",
        eventType: "MERCHANT_APPROVED"
      })
    );
  });

  it("should call enqueueWebhookDeliveries with MERCHANT_SUSPENDED when merchant is suspended", async () => {
    enqueueWebhookDeliveries.mockClear();

    const res = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ newStatus: "SUSPENDED", reason: "Compliance check" });

    expect(res.status).toBe(200);
    expect(enqueueWebhookDeliveries).toHaveBeenCalledTimes(1);
    expect(enqueueWebhookDeliveries).toHaveBeenCalledWith(
      "MERCHANT_SUSPENDED",
      expect.objectContaining({
        merchantId: merchantId,
        status: "SUSPENDED",
        eventType: "MERCHANT_SUSPENDED"
      })
    );
  });
});
