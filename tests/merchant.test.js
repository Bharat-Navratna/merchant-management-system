const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const { query, pool } = require("../src/db");

const email = "merchant_admin_test@yqnpay.com";
const password = "Admin123!";
let accessToken;
let operatorId;
let merchantId;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    `DELETE FROM refresh_tokens WHERE operator_id IN (SELECT id FROM operators WHERE email = $1)`,
    [email]
  );
  await query(`DELETE FROM merchants WHERE created_by IN (SELECT id FROM operators WHERE email = $1)`, [email]);
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
  await query(`DELETE FROM refresh_tokens WHERE operator_id = $1`, [operatorId]);
  await query(`DELETE FROM merchants WHERE created_by = $1`, [operatorId]);
  await query(`DELETE FROM operators WHERE id = $1`, [operatorId]);
  await pool.end();
});

describe("POST /api/merchants", () => {
  it("should create a merchant and return 201", async () => {
    const res = await request(app)
      .post("/api/merchants")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Merchant",
        category: "Retail",
        city: "Mumbai",
        contactEmail: "test@merchant.com"
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Merchant");
    expect(res.body.data.status).toBe("PENDING_KYB");
    merchantId = res.body.data.id;
  });
});

describe("GET /api/merchants/:id", () => {
  it("should return 200 with merchant data when JWT is valid", async () => {
    const res = await request(app)
      .get(`/api/merchants/${merchantId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(merchantId);
  });

  it("should return 401 when no JWT is provided", async () => {
    const res = await request(app).get(`/api/merchants/${merchantId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/merchants", () => {
  it("should list merchants successfully", async () => {
    const res = await request(app)
      .get("/api/merchants")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("PATCH /api/merchants/:id", () => {
  it("should update a merchant field and return 200", async () => {
    const res = await request(app)
      .patch(`/api/merchants/${merchantId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ city: "Delhi" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.city).toBe("Delhi");
  });
});

describe("PATCH /api/merchants/:id/status", () => {
  it("should return 400 when attempting an invalid status transition", async () => {
    // PENDING_KYB → ACTIVE without documents should fail
    const res = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ newStatus: "ACTIVE", reason: "Skipping KYB" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 200 when transitioning to a valid status", async () => {
    const res = await request(app)
      .patch(`/api/merchants/${merchantId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ newStatus: "SUSPENDED", reason: "Test suspension" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("SUSPENDED");
  });
});

describe("DELETE /api/merchants/:id", () => {
  it("should delete a merchant successfully as admin", async () => {
    const res = await request(app)
      .delete(`/api/merchants/${merchantId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
