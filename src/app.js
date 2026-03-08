const express = require("express");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;