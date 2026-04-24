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

/**
 * @swagger
 * /merchants/{merchantId}/documents:
 *   post:
 *     summary: Upload a KYB document for a merchant
 *     description: Submits one of the three required KYB documents (BUSINESS_REGISTRATION, OWNER_IDENTITY, BANK_ACCOUNT_PROOF). Each document type can only be uploaded once per merchant.
 *     tags: [KYB Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, fileUrl]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [BUSINESS_REGISTRATION, OWNER_IDENTITY, BANK_ACCOUNT_PROOF]
 *                 example: BUSINESS_REGISTRATION
 *               fileUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://storage.example.com/docs/business-reg.pdf
 *     responses:
 *       201:
 *         description: Document uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MerchantDocument'
 *       400:
 *         description: Validation error or duplicate document type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/:merchantId/documents",
  authenticate,
  validate(uploadDocumentSchema),
  documentController.uploadDocument
);

/**
 * @swagger
 * /merchants/{merchantId}/documents:
 *   get:
 *     summary: List documents for a merchant
 *     description: Returns all KYB documents uploaded for the merchant, including their verification status.
 *     tags: [KYB Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MerchantDocument'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:merchantId/documents",
  authenticate,
  validate(merchantDocumentsParamSchema),
  documentController.listDocuments
);

/**
 * @swagger
 * /merchants/{merchantId}/documents/{documentId}/verify:
 *   patch:
 *     summary: Verify a KYB document
 *     description: Marks a document as verified by the current operator. Once all three required documents are verified, the merchant becomes eligible for activation.
 *     tags: [KYB Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MerchantDocument'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:merchantId/documents/:documentId/verify",
  authenticate,
  validate(verifyDocumentSchema),
  documentController.verifyDocument
);

module.exports = router;
