const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const { query, pool } = require("../src/db");

const email = "admin_test@yqnpay.com";
const password = "Admin123!";

beforeAll(async () => {
  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    `DELETE FROM refresh_tokens WHERE operator_id IN (SELECT id FROM operators WHERE email = $1)`,
    [email]
  );
  await query(`DELETE FROM operators WHERE email = $1`, [email]);
  await query(
    `INSERT INTO operators (email, password_hash, role) VALUES ($1, $2, 'ADMIN')`,
    [email, passwordHash]
  );
});

afterAll(async () => {
  await query(
    `DELETE FROM refresh_tokens WHERE operator_id IN (SELECT id FROM operators WHERE email = $1)`,
    [email]
  );
  await query(`DELETE FROM operators WHERE email = $1`, [email]);
  await pool.end();
});

describe("POST /api/auth/login", () => {
  it("should login successfully with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it("should reject invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "WrongPassword123!" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
