const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const { query, pool } = require("../src/db");

const email = "kyb_admin_test@yqnpay.com";
const password = "Admin123!";
let accessToken;
let operatorId;
let merchantId;
let businessRegDocId;
let ownerIdentityDocId;
let bankProofDocId;

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
});

afterAll(async () => {
  await query(`DELETE FROM webhook_deliveries`);
  await query(`DELETE FROM webhook_subscriptions`);
  if (merchantId) {
    await query(`DELETE FROM merchant_documents WHERE merchant_id = $1`, [merchantId]);
    await query(`DELETE FROM merchant_status_history WHERE merchant_id = $1`, [merchantId]);
    await query(`DELETE FROM merchants WHERE id = $1`, [merchantId]);
  }
  await query(`DELETE FROM refresh_tokens WHERE operator_id = $1`, [operatorId]);
  await query(`DELETE FROM operators WHERE id = $1`, [operatorId]);
  await pool.end();
});

describe("KYB Status Transition Flow", () => {
  it("should create a merchant for KYB testing", async () => {
    const response = await request(app)
      .post("/api/merchants")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "KYB Test Merchant",
        category: "Finance",
        city: "Mumbai",
        contactEmail: "kyb@merchant.com"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    merchantId = response.body.data.id;
  });

  it("should upload BUSINESS_REGISTRATION document", async () => {
    const response = await request(app)
      .post(`/api/merchants/${merchantId}/documents`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "BUSINESS_REGISTRATION",
        fileUrl: "https://example.com/business.pdf"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    businessRegDocId = response.body.data.id;
  });

  it("should upload OWNER_IDENTITY document", async () => {
    const response = await request(app)
      .post(`/api/merchants/${merchantId}/documents`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "OWNER_IDENTITY",
        fileUrl: "https://example.com/owner.pdf"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    ownerIdentityDocId = response.body.data.id;
  });

  it("should fail to activate merchant before all 3 documents are verified", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        newStatus: "ACTIVE",
        reason: "KYB approval attempt"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should verify BUSINESS_REGISTRATION document", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}/documents/${businessRegDocId}/verify`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should verify OWNER_IDENTITY document", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}/documents/${ownerIdentityDocId}/verify`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should upload and verify BANK_ACCOUNT_PROOF document", async () => {
    const uploadRes = await request(app)
      .post(`/api/merchants/${merchantId}/documents`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "BANK_ACCOUNT_PROOF",
        fileUrl: "https://example.com/bank.pdf"
      });

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.success).toBe(true);
    bankProofDocId = uploadRes.body.data.id;

    const verifyRes = await request(app)
      .patch(`/api/merchants/${merchantId}/documents/${bankProofDocId}/verify`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
  });

  it("should activate merchant after all required documents are verified", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        newStatus: "ACTIVE",
        reason: "KYB approved"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ACTIVE");
  });

  it("should suspend an active merchant", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        newStatus: "SUSPENDED",
        reason: "Compliance review"
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("SUSPENDED");
  });

  it("should reject invalid transition from SUSPENDED to PENDING_KYB", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        newStatus: "PENDING_KYB",
        reason: "Reset"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
