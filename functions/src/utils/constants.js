const SUPPORTED_OPERATORS = Object.freeze([
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "nin",
  "between",
  "contains",
  "exists",
]);

const DEFAULT_QUERY_LIMIT = 20;
const MAX_QUERY_LIMIT = 100;

module.exports = {
  SUPPORTED_OPERATORS,
  DEFAULT_QUERY_LIMIT,
  MAX_QUERY_LIMIT,
};
