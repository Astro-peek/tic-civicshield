const { getDb, getFirebaseAdmin } = require("../config/firebaseAdmin");

async function upsertUserProfile({ uid, email = null, profile = null }) {
  if (!uid) {
    return;
  }

  const db = getDb();
  const admin = getFirebaseAdmin();
  const ref = db.collection("users").doc(uid);

  await ref.set(
    {
      uid,
      email,
      profile: profile || null,
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

module.exports = {
  upsertUserProfile,
};
