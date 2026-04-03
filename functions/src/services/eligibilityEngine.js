const env = require("../config/env");

function normalizePrimitive(value) {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }

  return value;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getFieldValue(profile, fieldPath) {
  return fieldPath.split(".").reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    return current[key];
  }, profile);
}

const operatorEvaluators = {
  eq: (actual, expected) =>
    normalizePrimitive(actual) === normalizePrimitive(expected),
  neq: (actual, expected) =>
    normalizePrimitive(actual) !== normalizePrimitive(expected),
  gt: (actual, expected) => {
    const a = toNumber(actual);
    const b = toNumber(expected);
    return a !== null && b !== null && a > b;
  },
  gte: (actual, expected) => {
    const a = toNumber(actual);
    const b = toNumber(expected);
    return a !== null && b !== null && a >= b;
  },
  lt: (actual, expected) => {
    const a = toNumber(actual);
    const b = toNumber(expected);
    return a !== null && b !== null && a < b;
  },
  lte: (actual, expected) => {
    const a = toNumber(actual);
    const b = toNumber(expected);
    return a !== null && b !== null && a <= b;
  },
  in: (actual, expected) => {
    if (!Array.isArray(expected)) {
      return false;
    }

    if (Array.isArray(actual)) {
      const expectedSet = new Set(expected.map(normalizePrimitive));
      return actual
        .map(normalizePrimitive)
        .some((item) => expectedSet.has(item));
    }

    return expected
      .map(normalizePrimitive)
      .includes(normalizePrimitive(actual));
  },
  nin: (actual, expected) => {
    if (!Array.isArray(expected)) {
      return true;
    }

    if (Array.isArray(actual)) {
      const expectedSet = new Set(expected.map(normalizePrimitive));
      return !actual
        .map(normalizePrimitive)
        .some((item) => expectedSet.has(item));
    }

    return !expected
      .map(normalizePrimitive)
      .includes(normalizePrimitive(actual));
  },
  between: (actual, expected) => {
    if (!Array.isArray(expected) || expected.length !== 2) {
      return false;
    }

    const value = toNumber(actual);
    const min = toNumber(expected[0]);
    const max = toNumber(expected[1]);

    return (
      value !== null &&
      min !== null &&
      max !== null &&
      value >= min &&
      value <= max
    );
  },
  contains: (actual, expected) => {
    if (Array.isArray(actual)) {
      return actual
        .map(normalizePrimitive)
        .includes(normalizePrimitive(expected));
    }

    if (typeof actual === "string") {
      return actual.toLowerCase().includes(String(expected).toLowerCase());
    }

    return false;
  },
  exists: (actual, expected) => {
    const shouldExist = expected !== false;
    const exists = actual !== null && actual !== undefined;
    return shouldExist ? exists : !exists;
  },
};

function evaluateCondition(profile, condition) {
  const actual = getFieldValue(profile, condition.field);
  const evaluator =
    operatorEvaluators[condition.operator] || operatorEvaluators.eq;
  const matched = evaluator(actual, condition.value);

  return {
    field: condition.field,
    operator: condition.operator,
    expected: condition.value,
    actual,
    matched,
    required: Boolean(condition.required),
    weight: Number.isFinite(Number(condition.weight))
      ? Number(condition.weight)
      : 1,
    explanation:
      condition.explanation ||
      `${condition.field} ${condition.operator} ${JSON.stringify(condition.value)}`,
  };
}

function buildSchemeEvaluation(profile, scheme) {
  const conditionResults = scheme.conditions.map((condition) =>
    evaluateCondition(profile, condition),
  );

  const totalWeight = conditionResults.reduce(
    (sum, condition) => sum + Math.max(condition.weight, 0),
    0,
  );

  const matchedWeight = conditionResults.reduce((sum, condition) => {
    if (!condition.matched) {
      return sum;
    }

    return sum + Math.max(condition.weight, 0);
  }, 0);

  const requiredFailed = conditionResults.filter(
    (condition) => condition.required && !condition.matched,
  );

  const matchScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
  const roundedScore = Number(matchScore.toFixed(2));
  const minimumScore = Number.isFinite(Number(scheme.minimumScore))
    ? Number(scheme.minimumScore)
    : 0;
  const eligible = requiredFailed.length === 0 && roundedScore >= minimumScore;

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    description: scheme.description || "",
    priority: scheme.priority || 0,
    matchScore: roundedScore,
    eligible,
    explanation: {
      minimumScore,
      matchedConditions: conditionResults
        .filter((condition) => condition.matched)
        .map((condition) => condition.explanation),
      failedConditions: conditionResults
        .filter((condition) => !condition.matched)
        .map((condition) => condition.explanation),
      requiredConditionsFailed: requiredFailed.map(
        (condition) => condition.explanation,
      ),
      matchedWeight: Number(matchedWeight.toFixed(2)),
      totalWeight: Number(totalWeight.toFixed(2)),
      totalConditions: conditionResults.length,
    },
  };
}

function rankEvaluations(evaluations) {
  return [...evaluations].sort((left, right) => {
    if (left.eligible !== right.eligible) {
      return left.eligible ? -1 : 1;
    }

    if (left.matchScore !== right.matchScore) {
      return right.matchScore - left.matchScore;
    }

    if (left.priority !== right.priority) {
      return right.priority - left.priority;
    }

    return left.schemeName.localeCompare(right.schemeName);
  });
}

function evaluateEligibility(profile, schemes, options = {}) {
  const maxResults = Number.isFinite(Number(options.maxResults))
    ? Number(options.maxResults)
    : env.MAX_RESULTS;

  const allEvaluations = schemes.map((scheme) =>
    buildSchemeEvaluation(profile, scheme),
  );
  const ranked = rankEvaluations(allEvaluations);
  const eligibleSchemes = ranked
    .filter((scheme) => scheme.eligible)
    .slice(0, maxResults);

  return {
    evaluatedCount: ranked.length,
    eligibleCount: eligibleSchemes.length,
    eligibleSchemes,
    rankedSchemes: ranked.slice(0, maxResults),
  };
}

module.exports = {
  evaluateEligibility,
};
