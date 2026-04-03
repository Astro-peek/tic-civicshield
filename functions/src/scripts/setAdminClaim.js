const { getFirebaseAdmin } = require("../config/firebaseAdmin");

async function main() {
  const uid = process.argv[2];

  if (!uid) {
    throw new Error("Usage: npm run set-admin -- <firebase_uid>");
  }

  const admin = getFirebaseAdmin();
  await admin.auth().setCustomUserClaims(uid, { admin: true, role: "admin" });

  console.log(`Admin claims set for uid: ${uid}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to set admin claim:", error);
    process.exit(1);
  });
