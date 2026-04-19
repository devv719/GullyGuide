"use client";

import { useAuth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Search, Calendar, Settings, Bell, Menu, Compass } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import CopilotWidget from "@/components/copilot/CopilotChat";
import { LocationProvider } from "@/lib/LocationContext";

export default function DashboardLayout({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [syncedRole, setSyncedRole] = useState(role || "tourist");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch true role and onboarding status
  useEffect(() => {
    async function syncUserData() {
      if (user?.uid === "mock-123") {
        if (!localStorage.getItem("MOCK_ONBOARDED")) {
           router.push("/onboarding");
        } else {
           setSyncedRole(localStorage.getItem("MOCK_DEV_ROLE") || "tourist");
        }
        return;
      }

      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (!data.onboardingComplete) {
               router.push("/onboarding");
            } else {
               setSyncedRole(data.role || "tourist");
            }
          } else {
            // Initialize empty profile
            await setDoc(doc(db, "users", user.uid), {
              name: user.displayName || "User",
              email: user.email,
              role: role || "tourist",
              onboardingComplete: false
            });
            router.push("/onboarding");
          }
        } catch (e) {
            console.error("Error syncing actual user data", e);
        }
      }
    }
    if (user && !loading) {
      syncUserData();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 hidden lg:block p-6">
           <Skeleton className="h-10 w-full rounded-xl mb-8" />
           <div className="space-y-4">
             <Skeleton className="h-10 w-full rounded-xl" />
             <Skeleton className="h-10 w-full rounded-xl" />
             <Skeleton className="h-10 w-full rounded-xl" />
           </div>
        </aside>
        <main className="flex-1 lg:ml-64 p-8 flex flex-col gap-6">
           <Skeleton className="h-20 w-full rounded-2xl" />
           <div className="grid md:grid-cols-3 gap-6 mt-6">
             <Skeleton className="h-32 rounded-2xl" />
             <Skeleton className="h-32 rounded-2xl" />
             <Skeleton className="h-32 rounded-2xl" />
           </div>
        </main>
      </div>
    );
  }

  const isGuide = syncedRole === "guide";

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore Guides", href: "/guides", icon: Search },
    { name: isGuide ? "Assignments" : "My Trips", href: "/dashboard/trips", icon: Calendar },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 relative">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white dark:bg-zinc-950 min-h-screen flex-col fixed inset-y-0 left-0 z-50 border-r border-zinc-200 dark:border-zinc-800 hidden lg:flex">
        <div className="px-6 py-6 flex items-center gap-3">
           <Link href="/" className="flex items-center gap-2 text-primary">
              <Compass className="w-6 h-6" />
              <span className="font-extrabold tracking-tight text-xl text-zinc-900 dark:text-white">
                GullyGuide
              </span>
           </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            // Exceptions for exact matching
            const trulyActive = (link.href === "/dashboard" && pathname !== "/dashboard") ? false : isActive;
            
            return (
              <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${trulyActive ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}>
                <Icon className="w-5 h-5" />
                <span className="flex-1">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300">
              {user.displayName ? user.displayName[0].toUpperCase() : "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{user.displayName || "User"}</p>
              <p className="text-[11px] text-zinc-500 truncate uppercase tracking-wider font-semibold">{syncedRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col relative w-full h-screen overflow-y-auto">
        
        {/* Responsive Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-8 bg-white/90 dark:bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-zinc-600 dark:text-zinc-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-white hidden md:block">
              {navLinks.find(l => l.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden md:flex px-3 py-1 rounded-full text-xs font-bold items-center gap-2 border ${isGuide ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50" : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-900/50"}`}>
               {syncedRole.toUpperCase()} ACCOUNT
            </div>

            <button className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-zinc-50 dark:bg-zinc-900">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

         {/* Mobile Menu Dropdown */}
         {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 z-50 p-4 space-y-2 font-semibold shadow-lg">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === link.href ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                <link.icon className="w-5 h-5" /> {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Dynamic Inner Route */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
           <LocationProvider>
             {children}
           </LocationProvider>
        </div>
      </main>

      {/* Floating AI Co-Pilot Widget */}
      <CopilotWidget />
    </div>
  );
}
