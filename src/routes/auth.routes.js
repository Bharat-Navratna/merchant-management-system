const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { loginSchema, refreshSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);

module.exports = router;
