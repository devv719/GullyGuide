"use client";

import { useAuth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, LayoutDashboard, Search, Calendar, Settings, Bell, Menu, Compass, MessageSquare, UserSquare2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import CopilotWidget from "@/components/copilot/CopilotChat";
import { LocationProvider } from "@/lib/LocationContext";
import { motion, AnimatePresence } from "framer-motion";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";

export default function DashboardLayout({ children }) {
  const { user, userProfile, role, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const syncedRole = role || "tourist";
  const isGuide = syncedRole === "guide";

  const navLinks = isGuide ? [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar, badge: 2 },
    { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    { name: "My Profile", href: "/dashboard/profile", icon: UserSquare2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ] : [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore guides", href: "/dashboard/explore", icon: Search },
    { name: "My trips", href: "/dashboard/trips", icon: Calendar },
    { name: "Messages", href: "/dashboard/chat", icon: MessageSquare, badge: 3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background text-foreground overflow-hidden relative">

        {/* Sidebar - Desktop */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? "72px" : "256px" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-paper flex-col fixed inset-y-0 left-0 z-50 border-r-[3px] border-foreground hidden lg:flex h-full"
        >
          <div className="px-4 py-5 flex items-center justify-between">
            <AnimatePresence mode="popLayout">
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent text-white flex items-center justify-center border-2 border-foreground" style={{ borderRadius: WB }}>
                      <Compass className="w-4 h-4" strokeWidth={3} />
                    </div>
                    <span className="font-heading font-bold text-xl text-foreground">GullyGuide</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            {sidebarCollapsed && (
              <div className="w-full flex justify-center">
                <div className="w-8 h-8 bg-accent text-white flex items-center justify-center border-2 border-foreground" style={{ borderRadius: WB }}>
                  <Compass className="w-4 h-4" strokeWidth={3} />
                </div>
              </div>
            )}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-7 w-6 h-6 bg-paper border-2 border-foreground flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer z-50"
              style={{ borderRadius: "50%" }}>
              {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4 text-base font-body overflow-y-auto no-scrollbar">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== "/dashboard");
              const Icon = link.icon;
              return (
                <Link key={link.name} href={link.href}
                  className={`relative flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-3 gap-3'} py-3 transition-all ${isActive ? 'text-foreground font-bold' : 'text-foreground/50 hover:text-foreground hover:bg-muted/50'}`}
                  style={{ borderRadius: WB }}>
                  {isActive && (
                    <motion.div layoutId="activeTabBadge"
                      className="absolute inset-0 bg-postit border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]"
                      style={{ borderRadius: WB }}
                      initial={false} transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-accent' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  {!sidebarCollapsed && <span className="relative z-10 flex-1 whitespace-nowrap overflow-hidden">{link.name}</span>}
                  {link.badge && !sidebarCollapsed && (
                    <span className="relative z-10 bg-accent text-white text-xs font-bold px-1.5 py-0.5 flex items-center justify-center min-w-[20px] border-2 border-foreground" style={{ borderRadius: WB }}>{link.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t-2 border-dashed border-foreground/20">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 px-3 py-3 border-2 border-foreground bg-muted/30" style={{ borderRadius: WB }}>
                <div className="w-9 h-9 bg-postit border-2 border-foreground flex items-center justify-center font-heading font-bold text-foreground uppercase" style={{ borderRadius: WB }}>
                  {user?.displayName ? user.displayName[0] : "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-heading font-bold text-sm text-foreground truncate">{user?.displayName || "User"}</p>
                  <p className="text-xs font-body text-accent font-bold uppercase">{syncedRole}</p>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 mx-auto bg-postit border-2 border-foreground flex items-center justify-center font-heading font-bold text-foreground uppercase" style={{ borderRadius: WB }}>
                {user?.displayName ? user.displayName[0] : "U"}
              </div>
            )}
            <Button variant="ghost" className={`w-full mt-2 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-3'} text-foreground/50 hover:text-accent border-transparent`} onClick={signOut}>
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="text-sm font-body">Sign out</span>}
            </Button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full h-screen overflow-y-auto z-10 transition-all duration-200"
          style={{ marginLeft: sidebarCollapsed ? '72px' : '256px' }}>

          {/* Top Bar */}
          <header className="h-16 border-b-[3px] border-foreground flex items-center justify-between px-6 lg:px-8 bg-paper sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" strokeWidth={2.5} />}
              </button>
              <h1 className="text-base font-heading font-bold text-foreground hidden md:block">
                {navLinks.find(l => pathname.includes(l.href) && l.href !== "/dashboard")?.name || "Overview"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex px-3 py-1 text-xs font-body font-bold uppercase items-center gap-2 border-2 border-foreground bg-postit" style={{ borderRadius: WB }}>
                {syncedRole} ACCOUNT
              </div>
              <button className="w-9 h-9 border-2 border-foreground flex items-center justify-center text-foreground hover:bg-muted transition-colors bg-paper relative" style={{ borderRadius: WB }}>
                <Bell className="w-4 h-4" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-paper"></span>
              </button>
            </div>
          </header>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute top-16 left-0 right-0 bg-paper border-b-[3px] border-foreground z-50 p-4 space-y-2 font-body shadow-sketch-lg">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${pathname === link.href ? 'bg-postit border-2 border-foreground text-foreground font-bold' : 'text-foreground/50 hover:text-foreground hover:bg-muted/50'}`}
                    style={{ borderRadius: WB }}>
                    <link.icon className="w-5 h-5" strokeWidth={2.5} /> {link.name}
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <LocationProvider>{children}</LocationProvider>
          </div>
        </main>

        <CopilotWidget />
      </div>
    </ProtectedRoute>
  );
}
