"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Track online/offline status
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      console.log("[Auth] 🟢 Back online");
      setIsOffline(false);
    };
    const handleOffline = () => {
      console.log("[Auth] 🔴 Gone offline");
      setIsOffline(true);
    };

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Still supporting dev mock
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("MOCK_DEV_USER")) {
      console.log("[Auth] 🧪 Using mock dev user");
      setCurrentUser({ uid: "mock-123", displayName: "Aman (Dev)", email: "dev@gully.guide" });
      setUserProfile({ role: localStorage.getItem("MOCK_DEV_ROLE") || "tourist", onboardingComplete: true });
      setLoading(false);
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log("[Auth] 🔑 onAuthStateChanged:", user ? `uid=${user.uid}` : "null");
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    // If mock user, don't try to snapshot firestore
    if (currentUser?.uid === "mock-123") return;
    
    // If currentUser is undefined (initial) or null (logged out), clean up
    if (!currentUser) {
      setUserProfile(null);
      return;
    }

    console.log("[Auth] 📄 Starting onSnapshot for user:", currentUser.uid);

    const unsubSnap = onSnapshot(
      doc(db, "users", currentUser.uid),
      (snap) => {
        if (snap.exists()) {
          const data = { uid: snap.id, ...snap.data() };
          console.log("[Auth] ✅ User profile loaded:", data.role, "onboarding:", data.onboardingComplete);
          setUserProfile(data);
        } else {
          console.log("[Auth] ⚠️ User doc does not exist yet — new user needs onboarding");
          // Don't set userProfile to null here — set a minimal profile so routing works
          setUserProfile({ uid: currentUser.uid, onboardingComplete: false, _docMissing: true });
        }
        setLoading(false);
      },
      (error) => {
        console.error("[Auth] ❌ Firestore snapshot error:", error.code, error.message);
        
        // Handle offline / permission errors gracefully — don't leave the app stuck
        if (error.code === "unavailable" || error.message?.includes("offline")) {
          console.warn("[Auth] 📡 Firestore is offline — attempting getDoc fallback");
          setIsOffline(true);
          
          // Try a one-time getDoc which may serve from cache
          getDoc(doc(db, "users", currentUser.uid))
            .then((snap) => {
              if (snap.exists()) {
                setUserProfile({ uid: snap.id, ...snap.data() });
                console.log("[Auth] ✅ Got cached profile via getDoc");
              } else {
                // Allow the user through with a minimal profile
                setUserProfile({ uid: currentUser.uid, onboardingComplete: false, _docMissing: true });
              }
            })
            .catch((fallbackErr) => {
              console.error("[Auth] ❌ getDoc fallback also failed:", fallbackErr.message);
              // Still allow the user through rather than hanging forever
              setUserProfile({ uid: currentUser.uid, onboardingComplete: false, _offline: true });
            })
            .finally(() => {
              setLoading(false);
            });
          return;
        }
        
        // For any other error, set a minimal profile so the app doesn't hang
        setUserProfile({ uid: currentUser.uid, onboardingComplete: false, _error: true });
        setLoading(false);
      }
    );

    return () => unsubSnap();
  }, [currentUser?.uid]);

  const signOut = async () => {
    try {
      if (currentUser?.uid === "mock-123") {
        localStorage.removeItem("MOCK_DEV_USER");
        localStorage.removeItem("MOCK_DEV_ROLE");
        localStorage.removeItem("MOCK_ONBOARDED");
        window.location.reload();
        return;
      }
      await firebaseSignOut(auth);
      console.log("[Auth] 🚪 Signed out successfully");
    } catch (err) {
      console.error("[Auth] ❌ Sign out error:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, user: currentUser, userProfile, role: userProfile?.role || null, loading, isOffline, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
