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

router.post("/", authenticate, validate(createMerchantSchema), merchantController.createMerchant);
router.get("/", authenticate, validate(listMerchantsSchema), merchantController.listMerchants);
router.get("/:id", authenticate, validate(merchantIdParamSchema), merchantController.getMerchantById);
router.patch("/:id", authenticate, validate(updateMerchantSchema), merchantController.updateMerchant);
router.delete("/:id", authenticate, authorize("ADMIN"), validate(merchantIdParamSchema), merchantController.deleteMerchant);

module.exports = router;
