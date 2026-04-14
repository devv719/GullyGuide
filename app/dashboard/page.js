"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TouristView from "@/components/dashboard/TouristView";
import GuideView from "@/components/dashboard/GuideView";

export default function DashboardOverviewPage() {
  const { user, loading } = useAuth();
  const [syncedRole, setSyncedRole] = useState("tourist");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
       if (user?.uid) {
         const userDoc = await getDoc(doc(db, "users", user.uid));
         if (userDoc.exists()) setSyncedRole(userDoc.data().role || "tourist");
       }
       setRoleLoading(false);
    }
    fetchRole();
  }, [user]);

  if (loading || roleLoading) return <div className="h-full flex items-center justify-center animate-pulse text-gray-500">Loading Configuration...</div>;
  if (!user) return null;

  return syncedRole === "guide" ? <GuideView user={user} /> : <TouristView user={user} />;
}
