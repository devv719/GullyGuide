"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      if (userProfile && !userProfile.onboardingComplete) {
        router.push("/onboarding");
      } else if (userProfile?.onboardingComplete) {
        router.push("/dashboard");
      }
    }
  }, [currentUser, userProfile, loading, router]);

  if (loading) return null;

  if (currentUser && userProfile?.onboardingComplete) return null;

  return children;
}
