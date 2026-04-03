const { ApiError } = require("../utils/errors");

function requireAdmin(req, _res, next) {
  const claims = req.user?.claims || {};
  const isAdmin = claims.admin === true || claims.role === "admin";

  if (!isAdmin) {
    return next(new ApiError(403, "Admin access required"));
  }

  return next();
}

module.exports = {
  requireAdmin,
};
