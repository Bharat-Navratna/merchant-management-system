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
  await query(
    `DELETE FROM refresh_tokens WHERE operator_id = $1`,
    [operatorId]
  );
  await query(`DELETE FROM merchants WHERE created_by = $1`, [operatorId]);
  await query(`DELETE FROM operators WHERE id = $1`, [operatorId]);
  await pool.end();
});

describe("POST /api/merchants", () => {
  it("should create a merchant successfully", async () => {
    const response = await request(app)
      .post("/api/merchants")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Merchant",
        category: "Retail",
        city: "Mumbai",
        contactEmail: "test@merchant.com"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    merchantId = response.body.data.id;
  });
});

describe("GET /api/merchants", () => {
  it("should list merchants successfully", async () => {
    const response = await request(app)
      .get("/api/merchants")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("GET /api/merchants/:id", () => {
  it("should get a merchant by id successfully", async () => {
    const response = await request(app)
      .get(`/api/merchants/${merchantId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("PATCH /api/merchants/:id", () => {
  it("should update a merchant successfully", async () => {
    const response = await request(app)
      .patch(`/api/merchants/${merchantId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ city: "Delhi" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("DELETE /api/merchants/:id", () => {
  it("should delete a merchant successfully as admin", async () => {
    const response = await request(app)
      .delete(`/api/merchants/${merchantId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
