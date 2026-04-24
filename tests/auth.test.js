const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const { query, pool } = require("../src/db");

const existingEmail = "auth_existing_test@yqnpay.com";
const registerEmail = "auth_register_test@yqnpay.com";
const password = "Admin123!";

beforeAll(async () => {
  // Clean up any leftover test data
  await query(
    `DELETE FROM refresh_tokens WHERE operator_id IN (SELECT id FROM operators WHERE email = ANY($1))`,
    [[existingEmail, registerEmail]]
  );
  await query(`DELETE FROM operators WHERE email = ANY($1)`, [[existingEmail, registerEmail]]);

  // Seed one existing operator for duplicate-email and login tests
  const passwordHash = await bcrypt.hash(password, 10);
  await query(
    `INSERT INTO operators (email, password_hash, role) VALUES ($1, $2, 'ADMIN')`,
    [existingEmail, passwordHash]
  );
});

afterAll(async () => {
  await query(
    `DELETE FROM refresh_tokens WHERE operator_id IN (SELECT id FROM operators WHERE email = ANY($1))`,
    [[existingEmail, registerEmail]]
  );
  await query(`DELETE FROM operators WHERE email = ANY($1)`, [[existingEmail, registerEmail]]);
  await pool.end();
});

describe("POST /api/auth/register", () => {
  it("should register a new operator and return 201 with tokens", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: registerEmail, password: "SecurePass1!" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.operator.email).toBe(registerEmail);
    expect(res.body.data.operator.role).toBe("OPERATOR");
  });

  it("should return 409 when email is already in use", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: existingEmail, password: "SecurePass1!" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  it("should return 200 with access and refresh tokens on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: existingEmail, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.operator.email).toBe(existingEmail);
  });

  it("should return 401 when password is wrong", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: existingEmail, password: "WrongPassword999!" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
