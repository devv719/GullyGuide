"use client";

import { useAuth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Search, Calendar, Settings, Bell, Menu } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";

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

  // Fetch true role from settings collection
  useEffect(() => {
    async function syncUserData() {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setSyncedRole(userDoc.data().role || "tourist");
        } else {
          // Initialize empty profile
          await setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName || "User",
            email: user.email,
            role: role || "tourist",
          });
        }
      }
    }
    syncUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0B0F19]">
        <aside className="w-64 border-r border-[#1F2937] hidden lg:block p-6">
           <Skeleton className="h-10 w-full rounded-xl mb-8" />
           <div className="space-y-4">
             <Skeleton className="h-10 w-full rounded-xl" />
             <Skeleton className="h-10 w-full rounded-xl" />
             <Skeleton className="h-10 w-full rounded-xl" />
           </div>
        </aside>
        <main className="flex-1 lg:ml-64 p-8 flex flex-col gap-6">
           <Skeleton className="h-40 w-full rounded-2xl" />
           <div className="grid md:grid-cols-3 gap-6 mt-6">
             <Skeleton className="h-32 rounded-2xl" />
             <Skeleton className="h-32 rounded-2xl" />
             <Skeleton className="h-32 rounded-2xl" />
           </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const isGuide = syncedRole === "guide";

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore Guides", href: "/guides", icon: Search },
    { name: isGuide ? "Assignments" : "My Trips", href: "/dashboard/trips", icon: Calendar },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-gray-200 selection:bg-[#4F46E5] selection:text-white">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[#0B0F19] text-gray-400 min-h-screen flex-col fixed inset-y-0 left-0 z-50 border-r border-[#1F2937] hidden lg:flex">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#818cf8] flex items-center justify-center font-bold text-white shadow-sm">
            G
          </div>
          <span className="font-bold text-lg text-white tracking-tight">GullyGuide</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-[#4F46E5]/10 text-[#818cf8]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111827]'}`}>
                <Icon className="w-5 h-5" />
                <span className="flex-1">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-[#1F2937] bg-[#111827]">
            <div className="w-9 h-9 bg-[#1F2937] rounded-full flex items-center justify-center font-bold text-gray-300">
              {user.displayName ? user.displayName[0].toUpperCase() : "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm text-gray-200 truncate">{user.displayName || "User"}</p>
              <p className="text-[11px] text-gray-500 truncate uppercase tracking-wider font-semibold">{syncedRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col relative w-full h-screen overflow-y-auto">
        
        {/* Responsive Header */}
        <header className="h-16 border-b border-[#1F2937] flex items-center justify-between px-6 lg:px-8 bg-[#0B0F19]/90 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm font-semibold text-gray-400 tracking-wide uppercase hidden md:block">Mission Control</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden md:flex px-3 py-1 rounded-full text-xs font-semibold items-center gap-2 ${isGuide ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#4F46E5]/10 text-[#818cf8]"}`}>
               {syncedRole.toUpperCase()} ACCOUNT
            </div>

            <button className="w-8 h-8 rounded-full bg-[#111827] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

         {/* Mobile Menu Dropdown */}
         {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-16 left-0 right-0 bg-[#111827] border-b border-[#1F2937] z-50 p-4 space-y-2 font-medium">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === link.href ? 'bg-[#4F46E5]/10 text-[#818cf8]' : 'text-gray-400'}`}>
                <link.icon className="w-5 h-5" /> {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Dynamic Inner Route */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
           {children}
        </div>
        
      </main>
    </div>
  );
}
