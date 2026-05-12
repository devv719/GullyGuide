"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Skeleton from "@/components/Skeleton";

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/auth");
      } else if (userProfile && !userProfile.onboardingComplete && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
    }
  }, [currentUser, userProfile, loading, router, pathname]);

  if (loading || currentUser === undefined) {
    return (
      <div className="flex h-screen w-full flex-col">
        <div className="h-16 border-b px-8 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex flex-1">
          <div className="w-64 border-r p-4 space-y-4 hidden md:block">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 p-8 space-y-6">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  // If onboarding is required but not complete, and we aren't on /onboarding
  if (userProfile && !userProfile.onboardingComplete && pathname !== "/onboarding") {
    return null;
  }

  return children;
}
