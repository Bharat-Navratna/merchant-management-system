const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateAccessToken = (operator) => {
  return jwt.sign(
    { sub: operator.id, email: operator.email, role: operator.role },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );
};

const generateRefreshToken = (operator) => {
  return jwt.sign(
    { sub: operator.id },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.accessSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
