const { getDb } = require("../config/firebaseAdmin");

function addCount(map, key, by = 1) {
  if (!key) {
    return;
  }

  map.set(key, (map.get(key) || 0) + by);
}

function mapToTopArray(map, limit = 10) {
  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function buildDailyTrend(records) {
  const daily = new Map();

  records.forEach((record) => {
    const timestamp = record.createdAt?.toDate?.() || new Date();
    const key = timestamp.toISOString().slice(0, 10);
    daily.set(key, (daily.get(key) || 0) + 1);
  });

  return [...daily.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([date, count]) => ({ date, count }));
}

async function getAnalyticsSummary({ days = 30 } = {}) {
  const db = getDb();
  const now = Date.now();
  const start = new Date(now - days * 24 * 60 * 60 * 1000);

  const snapshot = await db
    .collection("queries")
    .where("createdAt", ">=", start)
    .orderBy("createdAt", "desc")
    .limit(1000)
    .get();

  const records = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const schemeCounts = new Map();
  const stateCounts = new Map();
  const categoryCounts = new Map();
  const occupationCounts = new Map();

  records.forEach((record) => {
    addCount(schemeCounts, record.topSchemeIds?.[0]);
    addCount(stateCounts, record.input?.state);
    addCount(categoryCounts, record.input?.category);
    addCount(occupationCounts, record.input?.occupation);
  });

  return {
    totalQueries: records.length,
    rangeDays: days,
    topSchemes: mapToTopArray(schemeCounts),
    topStates: mapToTopArray(stateCounts),
    topCategories: mapToTopArray(categoryCounts),
    topOccupations: mapToTopArray(occupationCounts),
    dailyTrend: buildDailyTrend(records),
  };
}

module.exports = {
  getAnalyticsSummary,
};
