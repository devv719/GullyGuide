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

  // Dashboard, Auth, and Onboarding have their own layouts/headers
  if (pathname.startsWith('/dashboard') || pathname === '/auth' || pathname === '/onboarding') {
    return null;
  }

  return (
    <div className="relative z-50">
      <header 
        className={cn(
          "fixed top-0 w-full transition-all duration-200 border-b-[3px] border-foreground bg-background",
          scrolled ? "shadow-sketch-hover" : "py-1"
        )}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div 
                className="w-10 h-10 bg-accent text-white flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d] group-hover:rotate-12 transition-transform duration-100"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <Compass className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-2xl text-foreground">
                GullyGuide
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/guides" className="text-lg font-body text-foreground hover:text-accent transition-colors relative group">
                Find Guides
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[2px] bg-accent transition-all duration-200" 
                      style={{ textDecorationStyle: "wavy" }} />
              </Link>
              <Link href="/discover" className="text-lg font-body text-foreground hover:text-accent transition-colors relative group">
                Discover
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[2px] bg-accent transition-all duration-200" />
              </Link>
            </div>
              
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-lg font-body text-foreground hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => auth.signOut()} 
                    className="px-5 py-2 border-2 border-foreground font-body text-lg hover:bg-muted transition-colors"
                    style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/auth" className="text-lg font-body text-foreground hover:text-accent transition-colors">
                    Log in
                  </Link>
                  <Link 
                    href="/auth" 
                    className="bg-accent text-white px-6 py-2.5 font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                    style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                  >
                    Get Started ✏️
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground border-2 border-foreground hover:bg-muted transition-colors"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                aria-label="Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div 
            className="md:hidden border-t-2 border-dashed border-foreground/30 bg-background p-4 flex flex-col gap-2 absolute w-full left-0 shadow-sketch"
          >
            <Link href="/guides" className="p-3 font-body text-lg text-foreground hover:bg-postit hover:rotate-1 transition-all" onClick={() => setIsOpen(false)}
              style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}>
              Find Guides
            </Link>
            <Link href="/discover" className="p-3 font-body text-lg text-foreground hover:bg-postit hover:-rotate-1 transition-all" onClick={() => setIsOpen(false)}
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
               Discover
            </Link>
            {user ? (
               <Link href="/dashboard" className="p-3 font-heading font-bold text-lg text-accent hover:bg-accent/10 transition-colors" onClick={() => setIsOpen(false)}
                 style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}>
                 Dashboard
               </Link>
            ) : (
              <div className="flex flex-col gap-3 mt-2 border-t-2 border-dashed border-foreground/20 pt-4">
                <Link href="/auth" className="p-3 text-center font-body text-lg border-2 border-foreground" onClick={() => setIsOpen(false)}
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                  Log in
                </Link>
                <Link href="/auth" className="p-3 text-center font-body text-lg bg-accent text-white border-2 border-foreground shadow-sketch" onClick={() => setIsOpen(false)}
                  style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}>
                  Get Started ✏️
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
