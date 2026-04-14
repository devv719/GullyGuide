"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TouristView from "@/components/dashboard/TouristView";
import GuideView from "@/components/dashboard/GuideView";

// We re-use the view components which encapsulate the grids for now 
// but if desired, this page serves as the dedicated route when they click "Assignments" / "My Trips" from sidebar
export default function TripsRoutingHub() {
  const { user, loading } = useAuth();
  const [syncedRole, setSyncedRole] = useState("tourist");

  useEffect(() => {
    async function fetchRole() {
       if (user?.uid) {
         const userDoc = await getDoc(doc(db, "users", user.uid));
         if (userDoc.exists()) setSyncedRole(userDoc.data().role || "tourist");
       }
    }
    fetchRole();
  }, [user]);

  if (loading || !user) return null;

  return syncedRole === "guide" ? <GuideView user={user} /> : <TouristView user={user} />;
}
