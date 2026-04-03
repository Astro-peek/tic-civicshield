const env = require("../config/env");
const { getDb, getFirebaseAdmin } = require("../config/firebaseAdmin");

const CACHE_COLLECTION = "query_cache";

async function getCachedEligibility(cacheKey) {
  const db = getDb();
  const doc = await db.collection(CACHE_COLLECTION).doc(cacheKey).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();
  const expiresAtMillis = data.expiresAt?.toMillis?.() || 0;
  if (expiresAtMillis && expiresAtMillis <= Date.now()) {
    db.collection(CACHE_COLLECTION)
      .doc(cacheKey)
      .delete()
      .catch(() => null);
    return null;
  }

  return data.payload || null;
}

async function setCachedEligibility(
  cacheKey,
  payload,
  ttlSeconds = env.CACHE_TTL_SECONDS,
) {
  const db = getDb();
  const admin = getFirebaseAdmin();
  const now = Date.now();

  await db
    .collection(CACHE_COLLECTION)
    .doc(cacheKey)
    .set({
      payload,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromMillis(now + ttlSeconds * 1000),
    });
}

module.exports = {
  getCachedEligibility,
  setCachedEligibility,
};
