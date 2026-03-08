const express = require("express");
const authRoutes = require("./auth.routes");
const merchantRoutes = require("./merchant.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

router.use("/auth", authRoutes);
router.use("/merchants", merchantRoutes);

module.exports = router;