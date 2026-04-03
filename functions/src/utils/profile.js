const { ApiError } = require("./errors");

function normalizeText(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${fieldName} must be a non-empty string`);
  }

  return value.trim().toLowerCase();
}

function normalizeFlags(flags) {
  if (!flags) {
    return [];
  }

  if (Array.isArray(flags)) {
    return [
      ...new Set(
        flags.filter(Boolean).map((flag) => String(flag).trim().toLowerCase()),
      ),
    ];
  }

  if (typeof flags === "object") {
    return Object.keys(flags)
      .filter((key) => Boolean(flags[key]))
      .map((key) => key.trim().toLowerCase());
  }

  throw new ApiError(400, "flags must be an array or object");
}

function normalizeUserProfile(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new ApiError(400, "Request body must be a valid object");
  }

  const age = Number(payload.age);
  const income = Number(payload.income);

  if (!Number.isFinite(age) || age < 0 || age > 125) {
    throw new ApiError(400, "age must be a valid number between 0 and 125");
  }

  if (!Number.isFinite(income) || income < 0) {
    throw new ApiError(400, "income must be a valid non-negative number");
  }

  return {
    age,
    income,
    state: normalizeText(payload.state, "state"),
    category: normalizeText(payload.category, "category"),
    occupation: normalizeText(payload.occupation, "occupation"),
    flags: normalizeFlags(payload.flags),
  };
}

module.exports = {
  normalizeUserProfile,
  normalizeFlags,
  normalizeText,
};
