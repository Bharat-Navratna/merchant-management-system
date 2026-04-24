const express = require("express");
const webhookController = require("../controllers/webhook.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { createWebhookSchema, webhookIdParamSchema } = require("../validators/webhook.validator");
const { webhookLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.use(webhookLimiter);

/**
 * @swagger
 * /webhooks:
 *   post:
 *     summary: Register a webhook subscription
 *     description: Creates a new webhook subscription. When a merchant status changes to ACTIVE or SUSPENDED, the API posts a signed JSON payload to the target URL. Requires ADMIN role.
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetUrl, secret]
 *             properties:
 *               targetUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://your-service.com/webhooks/merchant-events
 *               secret:
 *                 type: string
 *                 description: Used to sign payloads with HMAC-SHA256 (X-YQN-Signature header)
 *                 example: my-webhook-secret
 *     responses:
 *       201:
 *         description: Webhook subscription created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/WebhookSubscription'
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
 *         description: Forbidden — ADMIN role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authenticate, authorize("ADMIN"), validate(createWebhookSchema), webhookController.createSubscription);

/**
 * @swagger
 * /webhooks:
 *   get:
 *     summary: List webhook subscriptions
 *     description: Returns all webhook subscriptions. Requires ADMIN role.
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
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
 *                     $ref: '#/components/schemas/WebhookSubscription'
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
 */
router.get("/", authenticate, authorize("ADMIN"), webhookController.listSubscriptions);

/**
 * @swagger
 * /webhooks/{id}:
 *   delete:
 *     summary: Delete a webhook subscription
 *     description: Permanently removes a webhook subscription. Requires ADMIN role.
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription deleted
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
 *                   example: Webhook subscription deleted
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
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authenticate, authorize("ADMIN"), validate(webhookIdParamSchema), webhookController.deleteSubscription);

module.exports = router;
