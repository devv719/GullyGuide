"use client";

import Link from "next/link";
import { Menu, X, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";

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
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="relative z-50">
      <header 
        className={cn(
          "fixed top-0 w-full transition-all duration-300 ease-in-out border-b",
          scrolled ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm border-zinc-200 dark:border-zinc-800" : "bg-white dark:bg-zinc-950 border-transparent py-2"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Compass className="w-6 h-6" />
              <span className="font-extrabold tracking-tight text-xl text-zinc-900 dark:text-white">
                GullyGuide
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/guides" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Find Guides
              </Link>
              <Link href="/discover" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Discover
              </Link>
            </div>
              
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 transition-colors mr-4">
                    Dashboard
                  </Link>
                  <button onClick={() => auth.signOut()} className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 transition-colors">
                    Log in
                  </Link>
                  <Link href="/signup" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col gap-2 absolute w-full left-0 shadow-lg">
            <Link href="/guides" className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg" onClick={() => setIsOpen(false)}>
              Find Guides
            </Link>
            <Link href="/discover" className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg" onClick={() => setIsOpen(false)}>
               Discover
            </Link>
            {user ? (
               <Link href="/dashboard" className="p-3 font-bold text-primary hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg" onClick={() => setIsOpen(false)}>
                 Dashboard
               </Link>
            ) : (
              <div className="flex flex-col gap-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Link href="/login" className="p-3 text-center font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg" onClick={() => setIsOpen(false)}>
                  Log in
                </Link>
                <Link href="/signup" className="p-3 text-center font-bold bg-primary text-white rounded-lg" onClick={() => setIsOpen(false)}>
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
