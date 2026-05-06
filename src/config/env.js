const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN"
];

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const hasDiscreteDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_PORT &&
    process.env.DB_NAME &&
    process.env.DB_USER &&
    process.env.DB_PASSWORD
);

if (!hasDatabaseUrl && !hasDiscreteDbConfig) {
  throw new Error(
    "Missing database configuration. Provide DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD."
  );
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "",
  databaseUrl: process.env.DATABASE_URL || "",
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  },
  loginSecurity: {
    maxAttempts: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
    lockMinutes: Number(process.env.LOGIN_LOCK_MINUTES || 15)
  },
  webhook: {
    maxRetries: Number(process.env.WEBHOOK_MAX_RETRIES || 3),
    retryIntervalSeconds: Number(process.env.WEBHOOK_RETRY_INTERVAL_SECONDS || 60),
    workerIntervalMs: Number(process.env.WEBHOOK_WORKER_INTERVAL_MS || 30000),
    signingSecret: process.env.WEBHOOK_SECRET || ""
  }
};