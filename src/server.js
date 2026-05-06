const app = require("./app");
const env = require("./config/env");
const { pool } = require("./db");

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful.");

    app.listen(env.port, () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database/app initialization error.");
    console.error(error);
    process.exit(1);
  }
};

startServer();