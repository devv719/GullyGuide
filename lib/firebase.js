import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";

// Validate environment variables — log warnings for any missing ones
const requiredEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (typeof window !== "undefined") {
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      console.warn(`[Firebase] ⚠️ Missing env var: ${key} — using hardcoded fallback`);
    }
  });
}

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

console.log("[Firebase] ✅ App initialized, projectId:", firebaseConfig.projectId);

export const auth = getAuth(app);

// Set persistence — handle async safely, don't block module loading
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("[Firebase] ⚠️ Could not set persistence:", err.message);
});

// Use getFirestore if app is already initialized (prevents duplicate initializeFirestore error),
// otherwise use initializeFirestore with long polling to combat "client is offline" errors.
let db;
try {
  if (!getApps().length || getApps().length === 1) {
    // First time — initialize with long polling config
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  }
} catch (e) {
  // initializeFirestore throws if already initialized — fall back to getFirestore
  console.warn("[Firebase] ⚠️ Firestore already initialized, using getFirestore fallback");
  db = getFirestore(app);
}

// Final fallback safety net
if (!db) {
  db = getFirestore(app);
}

export { db };

export const googleProvider = new GoogleAuthProvider();
export default app;
