const bcrypt = require("bcrypt");
const { pool } = require("../src/db");

async function seedAdmin() {
  const email = "admin@yqnpay.com";
  const password = "Admin123!";
  const role = "ADMIN";
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  await pool.query(
    `INSERT INTO operators (email, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (email)
     DO UPDATE SET password_hash = $2, updated_at = NOW()`,
    [email, passwordHash, role]
  );

  console.log("Admin operator seeded successfully.");
  console.log("Email:", email);
  console.log("Hash length:", passwordHash.length);
  await pool.end();
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
