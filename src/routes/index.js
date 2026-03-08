const express = require("express");
const authRoutes = require("./auth.routes");
const merchantRoutes = require("./merchant.routes");
const documentRoutes = require("./document.routes");
const statusRoutes = require("./status.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

router.use("/auth", authRoutes);
router.use("/merchants", merchantRoutes);
router.use("/merchants", documentRoutes);
router.use("/merchants", statusRoutes);

module.exports = router;