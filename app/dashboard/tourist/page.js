"use client";

import { useAuth } from "@/lib/auth";
import TouristView from "@/components/dashboard/TouristView";

export default function TouristDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return <TouristView user={user} />;
}
