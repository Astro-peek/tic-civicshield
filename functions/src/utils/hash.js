const crypto = require("crypto");

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const keys = Object.keys(value).sort();
  const entries = keys.map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  );
  return `{${entries.join(",")}}`;
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function buildEligibilityCacheKey(profile) {
  return `eligibility_${sha256(stableStringify(profile))}`;
}

module.exports = {
  stableStringify,
  sha256,
  buildEligibilityCacheKey,
};
