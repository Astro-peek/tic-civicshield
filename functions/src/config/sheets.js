const { google } = require("googleapis");
const env = require("./env");
const { ApiError } = require("../utils/errors");

let cachedSheetsClient = null;

function parseServiceAccountJson() {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new ApiError(
      500,
      "GOOGLE_SERVICE_ACCOUNT_JSON is required for Sheets logging",
    );
  }

  try {
    if (env.GOOGLE_SERVICE_ACCOUNT_JSON.trim().startsWith("{")) {
      return JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
    }

    const decoded = Buffer.from(
      env.GOOGLE_SERVICE_ACCOUNT_JSON,
      "base64",
    ).toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    throw new ApiError(500, "Invalid GOOGLE_SERVICE_ACCOUNT_JSON format", {
      reason: error.message,
    });
  }
}

function getSpreadsheetId() {
  if (!env.SHEETS_SPREADSHEET_ID) {
    throw new ApiError(500, "SHEETS_SPREADSHEET_ID is required");
  }

  return env.SHEETS_SPREADSHEET_ID;
}

function getSheetsClient() {
  if (cachedSheetsClient) {
    return cachedSheetsClient;
  }

  const serviceAccount = parseServiceAccountJson();
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedSheetsClient = google.sheets({ version: "v4", auth });
  return cachedSheetsClient;
}

module.exports = {
  getSheetsClient,
  getSpreadsheetId,
};
