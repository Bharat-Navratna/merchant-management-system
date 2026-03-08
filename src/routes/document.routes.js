const express = require("express");
const documentController = require("../controllers/document.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");

const {
  uploadDocumentSchema,
  verifyDocumentSchema,
  merchantDocumentsParamSchema
} = require("../validators/document.validator");

const router = express.Router();

// upload document
router.post(
  "/:merchantId/documents",
  authenticate,
  validate(uploadDocumentSchema),
  documentController.uploadDocument
);

// list documents
router.get(
  "/:merchantId/documents",
  authenticate,
  validate(merchantDocumentsParamSchema),
  documentController.listDocuments
);

// verify document
router.patch(
  "/:merchantId/documents/:documentId/verify",
  authenticate,
  validate(verifyDocumentSchema),
  documentController.verifyDocument
);

module.exports = router;