import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import schemes from "./src/data/schemes.js";

const firebaseConfig = {
  projectId: "schemematch-f6fe5",
  authDomain: "schemematch-f6fe5.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`Starting to seed ${schemes.length} schemes...`);
  for (const scheme of schemes) {
    const docRef = doc(db, "schemes", scheme.id.toString());
    await setDoc(docRef, {
      ...scheme,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`Seeded scheme ${scheme.id}: ${scheme.name}`);
  }
  console.log("All schemes seeded successfully.");
}

seed().then(() => process.exit(0)).catch(console.error);
