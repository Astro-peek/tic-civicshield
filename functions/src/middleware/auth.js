const { getFirebaseAdmin } = require("../config/firebaseAdmin");
const { ApiError } = require("../utils/errors");

async function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization || "";
  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }

  try {
    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      claims: decoded,
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Authentication failed", { reason: error.message }));
  }
}

module.exports = {
  requireAuth,
};
