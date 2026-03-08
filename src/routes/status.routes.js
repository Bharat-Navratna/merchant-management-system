const express = require("express");
const statusController = require("../controllers/status.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { updateMerchantStatusSchema } = require("../validators/status.validator");

const router = express.Router();

router.patch("/:id/status", authenticate, validate(updateMerchantStatusSchema), statusController.updateMerchantStatus);

module.exports = router;
