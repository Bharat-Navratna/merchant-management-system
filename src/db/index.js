const { Pool } = require("pg");
const env = require("../config/env");

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password
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