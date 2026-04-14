import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Using the provided user config
const firebaseConfig = {
  apiKey: "AIzaSyDUblcX1GUynYpWRwERs6uwSQX_SjwInMM",
  authDomain: "gullyguide-4fbba.firebaseapp.com",
  projectId: "gullyguide-4fbba",
  storageBucket: "gullyguide-4fbba.firebasestorage.app",
  messagingSenderId: "26027155372",
  appId: "1:26027155372:web:0393180579e2062d862409",
  measurementId: "G-GG0CT9YHR2"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
