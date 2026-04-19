"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function DashboardOverviewPage() {
  const { user, loading } = useAuth();
  const [roleLoading, setRoleLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRole() {
       if (loading) return;
       
       if (user?.uid) {
         if (user.uid === "mock-123") {
            const role = localStorage.getItem("MOCK_DEV_ROLE") || "tourist";
            router.push(`/dashboard/${role}`);
            return;
         }

         try {
           const userDoc = await getDoc(doc(db, "users", user.uid));
           if (userDoc.exists()) {
              const role = userDoc.data().role || "tourist";
              router.push(`/dashboard/${role}`);
           } else {
              router.push("/onboarding");
           }
         } catch (e) {
           console.error("Dashboard fetch error:", e);
           setRoleLoading(false); // Stop loading if error
         }
       } else {
         setRoleLoading(false);
         router.push("/login"); // Redirect to login if user is not defined and finished loading
       }
    }
    fetchRole();
  }, [user, loading, router]);

  if (loading || roleLoading) return <div className="h-full flex items-center justify-center animate-pulse text-zinc-500 font-medium">Loading Dashboard Route...</div>;
  
  return null;
}
