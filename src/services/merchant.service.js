const { query } = require("../db");
const AppError = require("../utils/appError");

const createMerchant = async (data, currentUser) => {
  const { rows } = await query(
    `INSERT INTO merchants (name, category, city, contact_email, pricing_tier, status, created_by)
     VALUES ($1, $2, $3, $4, $5, 'PENDING_KYB', $6)
     RETURNING *`,
    [
      data.name,
      data.category,
      data.city,
      data.contactEmail,
      data.pricingTier || "STANDARD",
      currentUser.id
    ]
  );

  return rows[0];
};

const listMerchants = async (filters) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (filters.status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }

  if (filters.city) {
    conditions.push(`city = $${paramIndex++}`);
    params.push(filters.city);
  }

  if (filters.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(filters.category);
  }

  if (filters.search) {
    conditions.push(`name ILIKE $${paramIndex++}`);
    params.push(`%${filters.search}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const { rows } = await query(
    `SELECT * FROM merchants ${where} ORDER BY created_at DESC`,
    params
  );

  return rows;
};

const getMerchantById = async (id) => {
  const { rows } = await query(`SELECT * FROM merchants WHERE id = $1`, [id]);

  if (rows.length === 0) {
    throw new AppError("Merchant not found", 404);
  }

  return rows[0];
};

const updateMerchant = async (id, data, currentUser) => {
  const existing = await getMerchantById(id);

  if (data.pricingTier && currentUser.role !== "ADMIN") {
    throw new AppError("Only admins can change pricing tier", 403);
  }

  const fieldMap = {
    name: "name",
    category: "category",
    city: "city",
    contactEmail: "contact_email",
    pricingTier: "pricing_tier"
  };

  const setClauses = [];
  const params = [];
  let paramIndex = 1;

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  setClauses.push("updated_at = NOW()");
  params.push(id);

  const { rows } = await query(
    `UPDATE merchants SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    params
  );

  return rows[0];
};

const deleteMerchant = async (id) => {
  const { rowCount } = await query(`DELETE FROM merchants WHERE id = $1`, [id]);

  if (rowCount === 0) {
    throw new AppError("Merchant not found", 404);
  }

  return { message: "Merchant deleted successfully" };
};

module.exports = {
  createMerchant,
  listMerchants,
  getMerchantById,
  updateMerchant,
  deleteMerchant
};
