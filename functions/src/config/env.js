const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

const env = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FUNCTION_REGION: process.env.FUNCTION_REGION || "asia-south1",
  SHEETS_SPREADSHEET_ID: process.env.SHEETS_SPREADSHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  CACHE_TTL_SECONDS: toInt(process.env.CACHE_TTL_SECONDS, 600),
  SCHEME_CACHE_TTL_SECONDS: toInt(process.env.SCHEME_CACHE_TTL_SECONDS, 300),
  MAX_RESULTS: toInt(process.env.MAX_RESULTS, 20),
  REQUIRE_SHEETS_LOGGING: toBool(process.env.REQUIRE_SHEETS_LOGGING, true),
  LOCAL_PORT: toInt(process.env.LOCAL_PORT, 5001),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  NODE_ENV: process.env.NODE_ENV || "development",
};

module.exports = env;
