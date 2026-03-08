const fs = require("fs");
const path = require("path");
const { pool } = require("../src/db");

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "..", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    console.log(`Running ${file}...`);
    await pool.query(sql);
    console.log(`  Done.`);
  }

  console.log("All migrations completed successfully.");
  await pool.end();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
