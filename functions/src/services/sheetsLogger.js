const { getSheetsClient, getSpreadsheetId } = require("../config/sheets");

function formatSheetTitle(now = new Date()) {
  const safe = now.toISOString().replace(/[-:.TZ]/g, "");
  return `Query_${safe}`.slice(0, 90);
}

function buildRows(payload) {
  const { queryId, userId, input, results } = payload;
  const rows = [
    ["Query ID", queryId || ""],
    ["User ID", userId || ""],
    ["Timestamp", new Date().toISOString()],
    [],
    ["Input"],
    ["age", input.age],
    ["income", input.income],
    ["state", input.state],
    ["category", input.category],
    ["occupation", input.occupation],
    ["flags", (input.flags || []).join(", ")],
    [],
    ["Ranked Schemes"],
    [
      "rank",
      "schemeId",
      "schemeName",
      "eligible",
      "matchScore",
      "matchedConditions",
      "failedConditions",
    ],
  ];

  (results.rankedSchemes || []).forEach((scheme, index) => {
    rows.push([
      index + 1,
      scheme.schemeId,
      scheme.schemeName,
      scheme.eligible ? "YES" : "NO",
      scheme.matchScore,
      (scheme.explanation?.matchedConditions || []).join(" | "),
      (scheme.explanation?.failedConditions || []).join(" | "),
    ]);
  });

  return rows;
}

async function logEligibilityToSheets(payload) {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  let title = formatSheetTitle();

  let addSheetResponse;

  try {
    addSheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title,
                gridProperties: {
                  rowCount: 200,
                  columnCount: 20,
                },
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    const isDuplicateTitle =
      error?.response?.data?.error?.message?.includes("already exists") ||
      error?.message?.includes("already exists");

    if (!isDuplicateTitle) {
      throw error;
    }

    title = `${title}_${Math.random().toString(36).slice(2, 6)}`.slice(0, 95);
    addSheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title,
                gridProperties: {
                  rowCount: 200,
                  columnCount: 20,
                },
              },
            },
          },
        ],
      },
    });
  }

  const sheetId =
    addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId || null;

  const rows = buildRows(payload);

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        {
          range: `${title}!A1`,
          values: rows,
        },
      ],
    },
  });

  if (sheetId !== null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 8,
              },
            },
          },
        ],
      },
    });
  }

  return {
    sheetTitle: title,
    sheetId,
  };
}

module.exports = {
  logEligibilityToSheets,
};
