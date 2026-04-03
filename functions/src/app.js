const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "schematch-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/", eligibilityRoutes);
app.use("/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
