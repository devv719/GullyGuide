"use client";

import { useAuth } from "@/lib/auth";
import GuideView from "@/components/dashboard/GuideView";

export default function GuideDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return <GuideView user={user} />;
}
