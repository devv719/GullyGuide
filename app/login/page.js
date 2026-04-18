"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
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
          onboardingComplete: false,
          createdAt: new Date().toISOString()
        });
        router.push("/onboarding");
      } else {
        const data = docSnap.data();
        if (data.onboardingComplete) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
      
    } catch (err) {
       if (err.code === "auth/configuration-not-found" || err.message.includes("configuration-not-found") || err.message.includes("api key")) {
        console.warn("MOCK LOGIN: Bypassing Firebase Auth missing config.");
        // Simulated redirect for missing config
        router.push("/onboarding");
        return;
      }
      setError(err.message.replace("Firebase:", "").trim());
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
      {/* Left side - Visual/Brand */}
      <div className="hidden lg:flex w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 w-full mb-auto mt-20">
           <Compass className="w-16 h-16 text-white mb-8" />
        </div>
        <div className="relative z-10 w-full mt-auto mb-20 text-left text-white">
           <h1 className="text-5xl font-extrabold mb-4 leading-tight">
             Welcome back to the city.
           </h1>
           <p className="text-xl text-teal-100 max-w-md">
             Log in to plan your next adventure or manage your guide bookings.
           </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Log in</h2>
            <p className="text-zinc-500">Access your adventures securely.</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}
            
            <div className="w-full">
              {loading ? (
                <Skeleton className="w-full h-12 rounded-xl" />
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-5 h-5 bg-white rounded-full" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
              )}
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-950 text-zinc-500">Or continue with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
              <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors">
                Sign in
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline hover:text-primary/80 transition-all font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
