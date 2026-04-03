const env = require("../config/env");
const { getDb } = require("../config/firebaseAdmin");
const { SUPPORTED_OPERATORS } = require("../utils/constants");

const inMemorySchemeCache = {
  expiresAt: 0,
  data: null,
};

function sanitizeCondition(condition = {}) {
  const operator = String(condition.operator || "eq").toLowerCase();
  const field = String(condition.field || "").trim();

  if (!field || !SUPPORTED_OPERATORS.includes(operator)) {
    return null;
  }

  return {
    field,
    operator,
    value: condition.value,
    weight: Number.isFinite(Number(condition.weight))
      ? Number(condition.weight)
      : 1,
    required: Boolean(condition.required),
    explanation:
      typeof condition.explanation === "string" && condition.explanation.trim()
        ? condition.explanation.trim()
        : `${field} ${operator} ${JSON.stringify(condition.value)}`,
  };
}

function sanitizeScheme(doc) {
  const data = doc.data() || {};
  const conditions = Array.isArray(data.conditions)
    ? data.conditions.map(sanitizeCondition).filter(Boolean)
    : [];

  return {
    id: doc.id,
    name: data.name || doc.id,
    description: data.description || "",
    priority: Number.isFinite(Number(data.priority))
      ? Number(data.priority)
      : 0,
    minimumScore: Number.isFinite(Number(data.minimumScore))
      ? Number(data.minimumScore)
      : 0,
    active: data.active !== false,
    conditions,
    metadata: data.metadata || {},
  };
}

async function fetchActiveSchemesFromDb() {
  const db = getDb();
  const snap = await db
    .collection("schemes")
    .where("active", "==", true)
    .orderBy("priority", "desc")
    .get();

  return snap.docs
    .map(sanitizeScheme)
    .filter((scheme) => scheme.conditions.length > 0);
}

async function getActiveSchemes({ forceRefresh = false } = {}) {
  const now = Date.now();
  if (
    !forceRefresh &&
    inMemorySchemeCache.data &&
    inMemorySchemeCache.expiresAt > now
  ) {
    return inMemorySchemeCache.data;
  }

  const schemes = await fetchActiveSchemesFromDb();
  inMemorySchemeCache.data = schemes;
  inMemorySchemeCache.expiresAt = now + env.SCHEME_CACHE_TTL_SECONDS * 1000;

  return schemes;
}

module.exports = {
  getActiveSchemes,
};
