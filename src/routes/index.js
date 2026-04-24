const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs/swagger");
const authRoutes = require("./auth.routes");
const merchantRoutes = require("./merchant.routes");
const documentRoutes = require("./document.routes");
const statusRoutes = require("./status.routes");
const webhookRoutes = require("./webhook.routes");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use("/auth", authRoutes);

router.use("/merchants", apiLimiter);
router.use("/merchants", merchantRoutes);
router.use("/merchants", documentRoutes);
router.use("/merchants", statusRoutes);

router.use("/webhooks", webhookRoutes);

module.exports = router;
