const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { query } = require("../db");
const AppError = require("../utils/appError");
const env = require("../config/env");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const register = async ({ email, password }) => {
  const { rows: existing } = await query(
    `SELECT id FROM operators WHERE email = $1`,
    [email]
  );

  if (existing.length > 0) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await query(
    `INSERT INTO operators (email, password_hash, role)
     VALUES ($1, $2, 'OPERATOR')
     RETURNING id, email, role`,
    [email, passwordHash]
  );

  const operator = rows[0];
  const accessToken = generateAccessToken(operator);
  const refreshToken = generateRefreshToken(operator);
  const tokenHash = hashToken(refreshToken);

  await query(
    `INSERT INTO refresh_tokens (operator_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [operator.id, tokenHash]
  );

  return { operator, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const { rows } = await query(
    `SELECT id, email, password_hash, role, failed_login_attempts, locked_until
     FROM operators
     WHERE email = $1`,
    [email]
  );

  const operator = rows[0];

  if (!operator) {
    throw new AppError("Invalid email or password", 401);
  }

  if (operator.locked_until && new Date(operator.locked_until) > new Date()) {
    throw new AppError("Account is temporarily locked. Please try again later.", 423);
  }

  const isPasswordValid = await bcrypt.compare(password, operator.password_hash);

  if (!isPasswordValid) {
    const attempts = operator.failed_login_attempts + 1;

    if (attempts >= env.loginSecurity.maxAttempts) {
      await query(
        `UPDATE operators
         SET failed_login_attempts = $1,
             locked_until = NOW() + INTERVAL '${env.loginSecurity.lockMinutes} minutes',
             updated_at = NOW()
         WHERE id = $2`,
        [attempts, operator.id]
      );
      throw new AppError("Account is temporarily locked due to too many failed attempts.", 423);
    }

    await query(
      `UPDATE operators
       SET failed_login_attempts = $1, updated_at = NOW()
       WHERE id = $2`,
      [attempts, operator.id]
    );

    throw new AppError("Invalid email or password", 401);
  }

  await query(
    `UPDATE operators
     SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW()
     WHERE id = $1`,
    [operator.id]
  );

  const safeOperator = { id: operator.id, email: operator.email, role: operator.role };
  const accessToken = generateAccessToken(safeOperator);
  const refreshToken = generateRefreshToken(safeOperator);
  const tokenHash = hashToken(refreshToken);

  await query(
    `INSERT INTO refresh_tokens (operator_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [operator.id, tokenHash]
  );

  return {
    operator: safeOperator,
    accessToken,
    refreshToken
  };
};

const logout = async ({ refreshToken }) => {
  const tokenHash = hashToken(refreshToken);
  await query(
    `UPDATE refresh_tokens SET revoked_at = NOW()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
};

const refresh = async ({ refreshToken }) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const tokenHash = hashToken(refreshToken);

  const { rows: tokenRows } = await query(
    `SELECT id, operator_id, expires_at, revoked_at
     FROM refresh_tokens
     WHERE token_hash = $1`,
    [tokenHash]
  );

  const storedToken = tokenRows[0];

  if (!storedToken) {
    throw new AppError("Refresh token not recognized", 401);
  }

  if (storedToken.revoked_at) {
    throw new AppError("Refresh token has been revoked", 401);
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    throw new AppError("Refresh token has expired", 401);
  }

  const { rows: operatorRows } = await query(
    `SELECT id, email, role FROM operators WHERE id = $1`,
    [payload.sub]
  );

  const operator = operatorRows[0];

  if (!operator) {
    throw new AppError("Operator not found", 404);
  }

  await query(
    `UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1`,
    [storedToken.id]
  );

  const newAccessToken = generateAccessToken(operator);
  const newRefreshToken = generateRefreshToken(operator);
  const newTokenHash = hashToken(newRefreshToken);

  await query(
    `INSERT INTO refresh_tokens (operator_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [operator.id, newTokenHash]
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

module.exports = {
  register,
  login,
  logout,
  refresh
};
