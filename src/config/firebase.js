import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQywXqqheDLmHiPlhMuK0XCOMCmBrnlCk",
  authDomain: "schemematch-f6fe5.firebaseapp.com",
  projectId: "schemematch-f6fe5",
  storageBucket: "schemematch-f6fe5.firebasestorage.app",
  messagingSenderId: "549977510934",
  appId: "1:549977510934:web:397bd0cc82aa0203ae1137",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function uploadDocument(file, applicationId) {
  try {
    const storageRef = ref(storage, `applications/${applicationId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (e) {
    return { success: false, url: null, error: e.message };
  }
}

export async function saveApplication(data) {
  try {
    const docRef = await addDoc(collection(db, "applications"), {
      ...data, status: "Pending", createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function saveChatMessage(sessionId, role, text) {
  try {
    await addDoc(collection(db, "chatHistory"), {
      sessionId, role, text, createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Chat save error:", e);
  }
}

export async function fetchApplications() {
  try {
    const q = query(collection(db, "applications"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id, ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })).sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    return [];
  }
}