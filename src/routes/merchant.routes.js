const express = require("express");
const merchantController = require("../controllers/merchant.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  createMerchantSchema,
  updateMerchantSchema,
  listMerchantsSchema,
  merchantIdParamSchema
} = require("../validators/merchant.validator");

const router = express.Router();

/**
 * @swagger
 * /merchants:
 *   post:
 *     summary: Create a new merchant
 *     description: Creates a merchant record. The merchant starts in PENDING_KYB status and must complete KYB document verification before being activated.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, city, contactEmail]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Acme Retail Ltd
 *               category:
 *                 type: string
 *                 maxLength: 100
 *                 example: Retail
 *               city:
 *                 type: string
 *                 maxLength: 100
 *                 example: Mumbai
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: contact@acme.com
 *               pricingTier:
 *                 type: string
 *                 maxLength: 50
 *                 example: STANDARD
 *     responses:
 *       201:
 *         description: Merchant created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Merchant'
 *       400:
 *         description: Validation error
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
 */
router.post("/", authenticate, validate(createMerchantSchema), merchantController.createMerchant);

/**
 * @swagger
 * /merchants:
 *   get:
 *     summary: List merchants
 *     description: Returns a list of merchants with optional filters. Supports filtering by status, city, category, and a full-text search on name and email.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING_KYB, ACTIVE, SUSPENDED]
 *         description: Filter by merchant status
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by merchant name or contact email
 *     responses:
 *       200:
 *         description: List of merchants
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
 *                     $ref: '#/components/schemas/Merchant'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticate, validate(listMerchantsSchema), merchantController.listMerchants);

/**
 * @swagger
 * /merchants/{id}:
 *   get:
 *     summary: Get a merchant by ID
 *     description: Returns the full merchant record including KYB status and pricing tier.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Merchant found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Merchant'
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
router.get("/:id", authenticate, validate(merchantIdParamSchema), merchantController.getMerchantById);

/**
 * @swagger
 * /merchants/{id}:
 *   patch:
 *     summary: Update a merchant
 *     description: Updates one or more fields of a merchant. At least one field must be provided. Changing pricingTier requires ADMIN role.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               category:
 *                 type: string
 *                 maxLength: 100
 *               city:
 *                 type: string
 *                 maxLength: 100
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               pricingTier:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Merchant updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Merchant'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden — pricing tier change requires ADMIN role
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
router.patch("/:id", authenticate, validate(updateMerchantSchema), merchantController.updateMerchant);

/**
 * @swagger
 * /merchants/{id}:
 *   delete:
 *     summary: Delete a merchant
 *     description: Permanently deletes a merchant and all associated documents, status history, and webhook deliveries. Requires ADMIN role.
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Merchant deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Merchant deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — ADMIN role required
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
router.delete("/:id", authenticate, authorize("ADMIN"), validate(merchantIdParamSchema), merchantController.deleteMerchant);

module.exports = router;
