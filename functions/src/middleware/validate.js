const { ApiError } = require("../utils/errors");
const { normalizeUserProfile } = require("../utils/profile");
const { DEFAULT_QUERY_LIMIT, MAX_QUERY_LIMIT } = require("../utils/constants");

function validateEligibilityPayload(req, _res, next) {
  try {
    req.normalizedProfile = normalizeUserProfile(req.body || {});
    next();
  } catch (error) {
    next(error);
  }
}

function parseAdminQueryFilters(req, _res, next) {
  try {
    const limit = Number.parseInt(req.query.limit, 10);
    const parsedLimit = Number.isFinite(limit) ? limit : DEFAULT_QUERY_LIMIT;
    const safeLimit = Math.min(Math.max(parsedLimit, 1), MAX_QUERY_LIMIT);

    const filters = {
      uid: req.query.uid || undefined,
      state: req.query.state
        ? String(req.query.state).trim().toLowerCase()
        : undefined,
      category: req.query.category
        ? String(req.query.category).trim().toLowerCase()
        : undefined,
      schemeId: req.query.schemeId || undefined,
      from: req.query.from || undefined,
      to: req.query.to || undefined,
      cursor: req.query.cursor || undefined,
      limit: safeLimit,
    };

    if (req.query.minScore !== undefined) {
      const minScore = Number(req.query.minScore);
      if (!Number.isFinite(minScore) || minScore < 0 || minScore > 100) {
        throw new ApiError(400, "minScore must be between 0 and 100");
      }
      filters.minScore = minScore;
    }

    req.queryFilters = filters;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateEligibilityPayload,
  parseAdminQueryFilters,
};
