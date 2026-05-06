module.exports = (err, req, res, next) => {
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
  const isProduction = process.env.NODE_ENV === "production";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const response = {
    success: false,
    message
  };

  if (!isProduction && process.env.NODE_ENV !== "test") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
