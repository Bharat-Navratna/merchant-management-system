const express = require("express");
const statusController = require("../controllers/status.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { updateMerchantStatusSchema } = require("../validators/status.validator");

const router = express.Router();

/**
 * @swagger
 * /merchants/{id}/status:
 *   patch:
 *     summary: Change merchant status
 *     description: |
 *       Transitions a merchant to a new status following the KYB state machine.
 *
 *       **Valid transitions:**
 *       - `PENDING_KYB` → `ACTIVE` (requires all 3 KYB documents verified)
 *       - `PENDING_KYB` → `SUSPENDED`
 *       - `ACTIVE` → `SUSPENDED`
 *       - `SUSPENDED` → `ACTIVE`
 *
 *       Activating a merchant triggers a `MERCHANT_APPROVED` webhook event.
 *       Suspending a merchant triggers a `MERCHANT_SUSPENDED` webhook event.
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
 *             required: [newStatus]
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [PENDING_KYB, ACTIVE, SUSPENDED]
 *                 example: ACTIVE
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 example: All KYB documents verified successfully
 *     responses:
 *       200:
 *         description: Status updated
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
 *         description: Invalid status transition or KYB documents not verified
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
 *       409:
 *         description: Merchant is already in the requested status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/status", authenticate, validate(updateMerchantStatusSchema), statusController.updateMerchantStatus);

module.exports = router;
