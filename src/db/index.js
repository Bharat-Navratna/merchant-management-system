const { Pool } = require("pg");
const env = require("../config/env");

const baseConfig = env.databaseUrl
  ? { connectionString: env.databaseUrl }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password
    };

const sslConfig =
  env.nodeEnv === "production"
    ? {
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {};

const pool = new Pool({
  ...baseConfig,
  ...sslConfig
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

const query = (text, params) => pool.query(text, params);
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient
};