"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dashboard has its own sidebar navigation
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="relative">
      <header 
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out text-white",
          scrolled ? "bg-[#09090b]/90 backdrop-blur-md shadow-lg" : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-black tracking-tighter text-3xl">
                <span className="text-white">GULLY</span>
                <span className="text-[#ff2a85] drop-shadow-[0_0_8px_#ff2a85]">GUIDE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="/guides" className="font-black text-xs tracking-widest uppercase hover:text-neon-pink transition-colors">
                FEATURES
              </Link>
              <Link href="/" className="font-black text-xs tracking-widest uppercase hover:text-neon-pink transition-colors">
                HOW IT WORKS
              </Link>
            </div>
              
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="font-black text-xs tracking-widest uppercase hover:text-neon-pink transition-colors mr-4">
                    DASHBOARD
                  </Link>
                  <button onClick={() => auth.signOut()} className="neon-border-pink rounded-full px-6 py-2.5 font-black text-sm uppercase text-white hover:bg-neon-pink/10 transition-all shadow-[0_0_15px_rgba(255,42,133,0.3)]">
                    LOG OUT
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link href="/login" className="font-black text-xs tracking-widest uppercase hover:text-neon-pink transition-colors">
                    LOG IN
                  </Link>
                  <Link href="/signup" className="neon-border-pink rounded-full px-6 py-2.5 font-black text-sm uppercase text-white hover:bg-neon-pink/10 transition-all shadow-[0_0_15px_rgba(255,42,133,0.3)]">
                    GET STARTED
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 neon-border-pink rounded-xl bg-transparent"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* The neon glowing line matching the screenshot - opacity tied to scroll */}
        <div className={cn("neon-line-pink absolute bottom-0 left-0 transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-30")}></div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#09090b] p-4 flex flex-col gap-4 absolute w-full top-20 left-0 z-50">
            <Link href="/guides" className="font-black p-4 uppercase tracking-widest border-b border-slate-800 text-center" onClick={() => setIsOpen(false)}>
              FEATURES
            </Link>
            <Link href="/" className="font-black p-4 uppercase tracking-widest border-b border-slate-800 text-center" onClick={() => setIsOpen(false)}>
               HOW IT WORKS
            </Link>
            {user ? (
               <Link href="/dashboard" className="font-black p-4 uppercase tracking-widest text-center text-neon-pink" onClick={() => setIsOpen(false)}>
                 DASHBOARD
               </Link>
            ) : (
              <div className="flex flex-col gap-4 mt-4 px-4">
                <Link href="/login" className="font-black p-4 text-center uppercase border border-slate-800 rounded-2xl" onClick={() => setIsOpen(false)}>
                  LOG IN
                </Link>
                <Link href="/signup" className="neon-border-pink px-4 py-4 text-center font-black rounded-2xl shadow-lg shadow-neon-pink/50 uppercase" onClick={() => setIsOpen(false)}>
                  GET STARTED FREE
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
