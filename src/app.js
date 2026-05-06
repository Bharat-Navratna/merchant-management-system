const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const env = require("./config/env");

const routes = require("./routes");
const swaggerSpec = require("./docs/swagger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (env.nodeEnv !== "production" && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
