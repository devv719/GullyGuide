"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import Skeleton from "@/components/Skeleton";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: result.user.displayName,
          email: result.user.email,
          role: "tourist",
          createdAt: new Date().toISOString()
        });
      }
      
      router.push("/dashboard");
    } catch (err) {
       // Developer Mock Fallback if Firebase is not properly configured
       if (err.code === "auth/configuration-not-found" || err.message.includes("configuration-not-found") || err.message.includes("api key")) {
        console.warn("MOCK LOGIN: Bypassing Firebase Auth missing config.");
        router.push("/dashboard");
        return;
      }
      setError(err.message.replace("Firebase:", "").trim());
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#09090b] text-white">
      {/* Left side - Visual/Quote */}
      <div className="hidden lg:flex w-1/2 bg-[#131318] p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-dot-pattern opacity-50"></div>
        <div className="relative z-10 w-full mb-auto mt-20 flex justify-start">
           <div className="w-16 h-16 border-4 border-[#ffdc00] shadow-[0_0_20px_#ffdc00,inset_0_0_20px_rgba(255,220,0,0.5)] rotate-45"></div>
        </div>
        <div className="relative z-10 w-full mt-auto mb-20 text-left">
           <h1 className="text-3d-purple text-6xl md:text-7xl font-black uppercase mb-4 tracking-tighter leading-[0.9]">
             WELCOME <br/>BACK TO
           </h1>
           <h1 className="text-3d-white text-6xl md:text-7xl font-black uppercase tracking-tighter">
             THE CITY.
           </h1>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 neon-border-yellow bg-[#131318] p-10 rounded-[2rem]">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Zap className="text-[#ffdc00] w-8 h-8 drop-shadow-[0_0_10px_#ffdc00]" />
            <h2 className="text-4xl font-black uppercase tracking-tighter">LOG IN</h2>
          </div>

          <p className="text-center font-bold text-slate-400 mb-8">
            Access your adventures securely with Google.
          </p>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-[#ff2a85]/20 text-[#ff2a85] rounded-xl text-xs uppercase font-bold border border-[#ff2a85] text-center shadow-[0_0_10px_rgba(255,42,133,0.3)]">
                {error}
              </div>
            )}
            
            <div className="w-full">
              {loading ? (
                <Skeleton className="w-full h-14 rounded-full border-2 border-border" />
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-4 text-sm font-black uppercase tracking-widest neon-border-pink rounded-full bg-[#09090b] hover:bg-[#ff2a85]/10 flex items-center justify-center gap-3 transition-all"
                >
                  <svg className="w-5 h-5 bg-white rounded-full" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign In with Google
                </button>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#ffdc00] underline underline-offset-4 decoration-2 hover:drop-shadow-[0_0_5px_#ffdc00] transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
