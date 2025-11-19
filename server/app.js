const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { sequelize } = require("./models");
const requestId = require("./middlewares/requestId.middleware");
const errorHandler = require("./middlewares/error.middleware");
const logger = require("./config/logger");

const originBlock = require("./middlewares/originBlock.middleware");
const devAccess = require("./middlewares/devAccess.middleware");
const devDetect = require("./middlewares/devDetect");
require("dotenv").config();

const app = express();

app.use(requestId);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));

app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);

// 🔥 DEV ONLY: require x-dev-access
app.use(devAccess);

// 🔥 PROD ONLY: block unknown origins
app.use(originBlock);

app.use(logger.requestLogger);
app.use("/api/v1", routes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);
//app.use(require("./middlewares/correlationId"));

// Sync DB in dev (for prod use migrations)
if (process.env.NODE_ENV !== "production") {
  sequelize.sync({ alter: true }).then(() => logger.info("DB synced"));
}

module.exports = app;
