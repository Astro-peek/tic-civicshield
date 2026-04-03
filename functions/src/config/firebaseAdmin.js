const admin = require("firebase-admin");

let initialized = false;
let dbInstance = null;

function getFirebaseAdmin() {
  if (!initialized) {
    try {
      const serviceAccount = require("../../serviceAccount.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (err) {
      console.warn("No serviceAccount.json found. Falling back to default initialization.");
      admin.initializeApp();
    }
    initialized = true;
  }

  return admin;
}

function getDb() {
  if (!dbInstance) {
    const firebaseAdmin = getFirebaseAdmin();
    dbInstance = firebaseAdmin.firestore();

    dbInstance.settings({
      ignoreUndefinedProperties: true,
    });
  }

  return dbInstance;
}

module.exports = {
  getFirebaseAdmin,
  getDb,
};
