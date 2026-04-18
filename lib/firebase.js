import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Prioritize environment variables, fallback for local DEV gracefully if omitted
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDUblcX1GUynYpWRwERs6uwSQX_SjwInMM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gullyguide-4fbba.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gullyguide-4fbba",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gullyguide-4fbba.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "26027155372",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:26027155372:web:0393180579e2062d862409",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GG0CT9YHR2"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use experimentalForceLongPolling to combat Vercel/SSR network detachment errors ('client is offline')
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const googleProvider = new GoogleAuthProvider();
export default app;
