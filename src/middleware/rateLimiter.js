const rateLimit = require("express-rate-limit");

const jsonHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many requests, please try again later."
  });
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many webhook requests, please try again later."
    });
  }
});

module.exports = { authLimiter, apiLimiter, webhookLimiter };
