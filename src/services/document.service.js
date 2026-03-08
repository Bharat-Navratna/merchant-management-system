const { query } = require("../db");
const AppError = require("../utils/appError");

const uploadDocument = async (merchantId, data, operator) => {
  // check merchant exists
  const { rows: merchantRows } = await query(
    `SELECT id FROM merchants WHERE id = $1`,
    [merchantId]
  );

  if (merchantRows.length === 0) {
    throw new AppError("Merchant not found", 404);
  }

  // insert document
  const { rows } = await query(
    `INSERT INTO merchant_documents
     (merchant_id, document_type, document_reference, is_uploaded, is_verified)
     VALUES ($1, $2, $3, TRUE, FALSE)
     RETURNING *`,
    [merchantId, data.type, data.fileUrl]
  );

  return rows[0];
};

const listDocuments = async (merchantId) => {
  const { rows } = await query(
    `SELECT *
     FROM merchant_documents
     WHERE merchant_id = $1
     ORDER BY created_at`,
    [merchantId]
  );

  return rows;
};

const verifyDocument = async (merchantId, documentId, operator) => {
  // ensure document exists
  const { rows: docRows } = await query(
    `SELECT *
     FROM merchant_documents
     WHERE id = $1 AND merchant_id = $2`,
    [documentId, merchantId]
  );

  if (docRows.length === 0) {
    throw new AppError("Document not found for this merchant", 404);
  }

  // verify document
  const { rows } = await query(
    `UPDATE merchant_documents
     SET is_verified = TRUE,
         verified_by = $1,
         verified_at = NOW(),
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [operator.id, documentId]
  );

  return rows[0];
};

module.exports = {
  uploadDocument,
  listDocuments,
  verifyDocument
};