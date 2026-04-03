const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");
const { parseAdminQueryFilters } = require("../middleware/validate");
const { ApiError } = require("../utils/errors");
const { getQueries, getQueryById } = require("../services/queryService");
const { getAnalyticsSummary } = require("../services/analyticsService");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get(
  "/queries",
  parseAdminQueryFilters,
  asyncHandler(async (req, res) => {
    const data = await getQueries(req.queryFilters);
    res.status(200).json({
      success: true,
      ...data,
    });
  }),
);

router.get(
  "/queries/:id",
  asyncHandler(async (req, res) => {
    const queryRecord = await getQueryById(req.params.id);
    if (!queryRecord) {
      throw new ApiError(404, "Query not found");
    }

    res.status(200).json({
      success: true,
      data: queryRecord,
    });
  }),
);

router.get(
  "/analytics/summary",
  asyncHandler(async (req, res) => {
    const days = Number.parseInt(req.query.days, 10);
    const safeDays =
      Number.isFinite(days) && days > 0 && days <= 365 ? days : 30;

    const summary = await getAnalyticsSummary({ days: safeDays });

    res.status(200).json({
      success: true,
      data: summary,
    });
  }),
);

module.exports = router;
