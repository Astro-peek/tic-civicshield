const express = require("express");

const env = require("../config/env");
const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { validateEligibilityPayload } = require("../middleware/validate");
const { buildEligibilityCacheKey } = require("../utils/hash");
const {
  getCachedEligibility,
  setCachedEligibility,
} = require("../services/cacheService");
const { getActiveSchemes } = require("../services/schemeService");
const { evaluateEligibility } = require("../services/eligibilityEngine");
const {
  saveQueryRecord,
  updateQueryRecord,
} = require("../services/queryService");
const { logEligibilityToSheets } = require("../services/sheetsLogger");
const { upsertUserProfile } = require("../services/userService");

const router = express.Router();

function getRequestMeta(req, cacheHit) {
  return {
    cacheHit,
    ip:
      req.headers["x-forwarded-for"]?.split(",")?.[0]?.trim() || req.ip || null,
    userAgent: req.get("user-agent") || null,
  };
}

router.post(
  "/check-eligibility",
  requireAuth,
  validateEligibilityPayload,
  asyncHandler(async (req, res) => {
    const profile = req.normalizedProfile;
    const cacheKey = buildEligibilityCacheKey(profile);

    let results = await getCachedEligibility(cacheKey);
    let cacheHit = Boolean(results);

    if (!results) {
      const schemes = await getActiveSchemes();
      results = evaluateEligibility(profile, schemes);
      cacheHit = false;
      await setCachedEligibility(cacheKey, results);
    }

    const queryId = await saveQueryRecord({
      uid: req.user.uid,
      input: profile,
      results,
      cacheKey,
      requestMeta: getRequestMeta(req, cacheHit),
    });

    await upsertUserProfile({
      uid: req.user.uid,
      email: req.user.email,
      profile,
    });

    let sheets = null;
    let sheetWarning = null;

    try {
      sheets = await logEligibilityToSheets({
        queryId,
        userId: req.user.uid,
        input: profile,
        results,
      });

      await updateQueryRecord(queryId, { sheets });
    } catch (error) {
      if (env.REQUIRE_SHEETS_LOGGING) {
        throw error;
      }

      sheetWarning = `Google Sheets logging failed: ${error.message}`;
      await updateQueryRecord(queryId, { sheetsError: error.message });
      console.error("[SHEETS_LOG_ERROR]", error);
    }

    res.status(200).json({
      success: true,
      queryId,
      cacheHit,
      matchSummary: {
        evaluatedCount: results.evaluatedCount,
        eligibleCount: results.eligibleCount,
      },
      eligibleSchemes: results.eligibleSchemes,
      rankedSchemes: results.rankedSchemes,
      sheets,
      warning: sheetWarning,
    });
  }),
);

module.exports = router;
