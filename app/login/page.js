"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Compass, Code } from "lucide-react";
import Skeleton from "@/components/Skeleton";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError(""); setLoading(true);
    if (typeof navigator !== "undefined" && !navigator.onLine) { setError("You appear to be offline."); setLoading(false); return; }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const docRef = doc(db, "users", result.user.uid);
      let docSnap;
      try { docSnap = await getDoc(docRef); } catch { router.push("/dashboard"); return; }
      if (!docSnap.exists()) {
        try { await setDoc(docRef, { name: result.user.displayName, email: result.user.email, role: "tourist", onboardingComplete: false, createdAt: new Date().toISOString() }); } catch {}
        router.push("/onboarding");
      } else {
        const data = docSnap.data();
        router.push(data.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    } catch (err) {
      const errCode = err?.code || "";
      if (errCode === "auth/configuration-not-found" || errCode === "unavailable") { handleDevLogin(); return; }
      if (errCode === "auth/popup-closed-by-user") setError("Sign-in cancelled.");
      else if (errCode === "auth/network-request-failed") setError("Network error.");
      else setError(err?.message?.replace("Firebase:", "").trim() || "An error occurred.");
      setLoading(false);
    }
  };

  const handleDevLogin = () => { localStorage.setItem("MOCK_DEV_USER", "true"); router.push("/onboarding"); };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Left: Brand */}
      <div className="hidden lg:flex w-1/2 bg-postit p-12 flex-col justify-between relative overflow-hidden notebook-lines">
        <div className="relative z-10 w-full mb-auto mt-20">
          <div className="w-16 h-16 bg-accent text-white flex items-center justify-center border-[3px] border-foreground shadow-sketch mb-8" style={{ borderRadius: WB }}>
            <Compass className="w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>
        <div className="relative z-10 w-full mt-auto mb-20 text-left text-foreground">
          <h1 className="text-5xl font-heading font-bold mb-4 leading-tight">Welcome back to the city.</h1>
          <p className="text-xl font-body text-foreground/60 max-w-md">Log in to plan your next adventure or manage your guide bookings.</p>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 border-[3px] border-dashed border-foreground/10 rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 border-[3px] border-dashed border-accent/15 rounded-full" />
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Log in</h2>
            <p className="font-body text-foreground/50">Access your adventures securely.</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-accent/5 text-accent font-body font-bold border-2 border-accent" style={{ borderRadius: WB }}>{error}</div>
            )}
            <div className="w-full space-y-3">
              {loading ? (
                <Skeleton className="w-full h-12" />
              ) : (
                <button onClick={handleGoogleLogin} className="w-full py-3 px-4 font-body text-lg border-2 border-foreground bg-paper text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-3 shadow-sketch hover:shadow-sketch-hover hover:translate-x-[1px] hover:translate-y-[1px]" style={{ borderRadius: WB }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Sign in with Google
                </button>
              )}
              <button onClick={handleDevLogin} className="w-full py-3 px-4 font-body text-lg border-2 border-dashed border-foreground/30 bg-paper text-foreground/50 hover:bg-muted hover:border-foreground transition-colors flex items-center justify-center gap-3" style={{ borderRadius: WB }}>
                <Code className="w-5 h-5" /> Quick Dev Preview
              </button>
            </div>
            <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-dashed border-foreground/20" /></div><div className="relative flex justify-center text-sm"><span className="bg-background px-3 font-body text-foreground/40">Or continue with email</span></div></div>
            <div className="space-y-4">
              <input type="email" placeholder="Email address" className="w-full px-4 py-3 border-2 border-foreground bg-paper focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-lg font-body placeholder:text-foreground/30" style={{ borderRadius: WB }} />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 border-2 border-foreground bg-paper focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-lg font-body placeholder:text-foreground/30" style={{ borderRadius: WB2 }} />
              <button className="w-full py-3 bg-foreground text-paper font-body text-lg border-2 border-foreground shadow-[3px_3px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all" style={{ borderRadius: WB }}>Sign in</button>
            </div>
          </div>
          <p className="mt-8 text-center text-base font-body text-foreground/40">Don't have an account?{" "}<Link href="/signup" className="text-accent hover:underline font-bold">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
