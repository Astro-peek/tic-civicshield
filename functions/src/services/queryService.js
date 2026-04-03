const { getDb, getFirebaseAdmin } = require("../config/firebaseAdmin");

function toDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function saveQueryRecord({
  uid,
  input,
  results,
  cacheKey,
  requestMeta = {},
}) {
  const db = getDb();
  const admin = getFirebaseAdmin();

  const topSchemeIds = (results?.rankedSchemes || [])
    .slice(0, 5)
    .map((scheme) => scheme.schemeId)
    .filter(Boolean);

  const topScore = Number(results?.rankedSchemes?.[0]?.matchScore || 0);

  const docRef = await db.collection("queries").add({
    uid,
    input,
    results,
    topSchemeIds,
    topScore,
    cacheKey,
    requestMeta,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

async function getQueries(filters = {}) {
  const db = getDb();
  const admin = getFirebaseAdmin();
  const {
    uid,
    state,
    category,
    schemeId,
    from,
    to,
    minScore,
    cursor,
    limit = 20,
  } = filters;

  let query = db.collection("queries");
  const postFilters = [];

  if (uid) {
    query = query.where("uid", "==", uid);
  } else if (schemeId) {
    query = query.where("topSchemeIds", "array-contains", schemeId);
  } else if (state) {
    query = query.where("input.state", "==", state);
  } else if (category) {
    query = query.where("input.category", "==", category);
  }

  if (uid && schemeId) {
    postFilters.push((item) => (item.topSchemeIds || []).includes(schemeId));
  }

  if (uid && state) {
    postFilters.push((item) => item.input?.state === state);
  }

  if (uid && category) {
    postFilters.push((item) => item.input?.category === category);
  }

  if (schemeId && state) {
    postFilters.push((item) => item.input?.state === state);
  }

  if (schemeId && category) {
    postFilters.push((item) => item.input?.category === category);
  }

  if (state && category && !uid && !schemeId) {
    postFilters.push((item) => item.input?.category === category);
  }

  const fromDate = toDate(from);
  if (fromDate) {
    query = query.where(
      "createdAt",
      ">=",
      admin.firestore.Timestamp.fromDate(fromDate),
    );
  }

  const toDateValue = toDate(to);
  if (toDateValue) {
    query = query.where(
      "createdAt",
      "<=",
      admin.firestore.Timestamp.fromDate(toDateValue),
    );
  }

  query = query.orderBy("createdAt", "desc");

  if (cursor) {
    const cursorDoc = await db.collection("queries").doc(cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const fetchLimit = Math.min(Math.max(limit, 1), 100);
  const snapshot = await query.limit(fetchLimit * 3).get();

  let records = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (Number.isFinite(Number(minScore))) {
    const score = Number(minScore);
    records = records.filter((item) => Number(item.topScore || 0) >= score);
  }

  if (postFilters.length > 0) {
    records = records.filter((item) =>
      postFilters.every((filterFn) => filterFn(item)),
    );
  }

  records = records.slice(0, fetchLimit);

  const nextCursor = records.length > 0 ? records[records.length - 1].id : null;

  return {
    records,
    nextCursor,
    fetchedCount: records.length,
  };
}

async function getQueryById(queryId) {
  const db = getDb();
  const doc = await db.collection("queries").doc(queryId).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

async function updateQueryRecord(queryId, data) {
  const db = getDb();
  const admin = getFirebaseAdmin();

  await db
    .collection("queries")
    .doc(queryId)
    .set(
      {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

module.exports = {
  saveQueryRecord,
  getQueries,
  getQueryById,
  updateQueryRecord,
};
