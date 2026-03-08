const express = require("express");
const webhookController = require("../controllers/webhook.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { createWebhookSchema, webhookIdParamSchema } = require("../validators/webhook.validator");

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), validate(createWebhookSchema), webhookController.createSubscription);
router.get("/", authenticate, authorize("ADMIN"), webhookController.listSubscriptions);
router.delete("/:id", authenticate, authorize("ADMIN"), validate(webhookIdParamSchema), webhookController.deleteSubscription);

module.exports = router;
