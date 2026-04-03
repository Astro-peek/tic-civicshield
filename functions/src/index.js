const functions = require("firebase-functions/v2/https");

const env = require("./config/env");
const app = require("./app");

exports.api = functions.onRequest(
  {
    region: env.FUNCTION_REGION,
    memory: "512MiB",
    timeoutSeconds: 60,
    cors: true,
  },
  app,
);
