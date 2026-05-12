"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { MapPin, UserSquare2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/Skeleton";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function SignupPage() {
  const [role, setRole] = useState("tourist");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignup = async () => {
    setError(""); setLoading(true);
    if (typeof navigator !== "undefined" && !navigator.onLine) { setError("You appear to be offline."); setLoading(false); return; }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      let docSnap;
      try { docSnap = await getDoc(docRef); } catch { router.push("/dashboard"); setLoading(false); return; }
      if (!docSnap.exists()) {
        try {
          await setDoc(docRef, { name: user.displayName, email: user.email, role, createdAt: new Date().toISOString() });
          if (role === 'guide') {
            await setDoc(doc(db, "guides", user.uid), { userId: user.uid, name: user.displayName, verified: false, rating: 0, languages: [], hourlyRate: 300, university: '', bio: '' });
          }
        } catch {}
      }
      router.push("/dashboard");
    } catch (err) {
      const errCode = err?.code || "";
      if (errCode === "auth/configuration-not-found" || errCode === "unavailable") { router.push("/dashboard"); return; }
      if (errCode === "auth/popup-closed-by-user") setError("Sign-up cancelled.");
      else if (errCode === "auth/network-request-failed") setError("Network error.");
      else setError(err?.message?.replace("Firebase:", "").trim() || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-row-reverse bg-background text-foreground">
      {/* Right: Brand */}
      <div className="hidden lg:flex w-1/2 bg-postit p-12 flex-col justify-between relative overflow-hidden notebook-lines">
        <div className="relative z-10 w-full mb-auto mt-20 flex justify-end">
          <div className="w-16 h-16 bg-accent text-white flex items-center justify-center border-[3px] border-foreground shadow-sketch" style={{ borderRadius: WB }}>
            <Compass className="w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>
        <div className="relative z-10 text-right w-full mt-auto mb-20">
          <h1 className="text-6xl md:text-7xl font-heading font-bold leading-[0.95] mb-4">
            Showcase <br/> your city.
          </h1>
          <p className="text-2xl font-body text-foreground/60">Earn while you explore.</p>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 border-[3px] border-dashed border-foreground/10 rounded-full" />
      </div>

      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md relative z-10 bg-paper border-[3px] border-foreground p-10 shadow-sketch-lg" style={{ borderRadius: WB2 }}>
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Compass className="text-accent w-8 h-8" strokeWidth={2.5} />
            <h2 className="text-4xl font-heading font-bold">Register</h2>
          </div>
          <p className="text-center font-body text-foreground/50 mb-8">Pick your role and securely sign in with Google.</p>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button onClick={() => setRole("tourist")}
                className={cn("p-4 border-2 flex flex-col items-center gap-3 transition-all font-heading font-bold text-sm", role === "tourist" ? "border-foreground bg-postit shadow-sketch" : "border-foreground/30 bg-paper hover:border-foreground")}
                style={{ borderRadius: WB }}>
                <MapPin className={cn("w-8 h-8", role === "tourist" ? "text-accent" : "text-foreground/30")} />
                <span>Tourist</span>
              </button>
              <button onClick={() => setRole("guide")}
                className={cn("p-4 border-2 flex flex-col items-center gap-3 transition-all font-heading font-bold text-sm", role === "guide" ? "border-foreground bg-postit shadow-sketch" : "border-foreground/30 bg-paper hover:border-foreground")}
                style={{ borderRadius: WB2 }}>
                <UserSquare2 className={cn("w-8 h-8", role === "guide" ? "text-secondary" : "text-foreground/30")} />
                <span>Local Guide</span>
              </button>
            </div>
            {error && (<div className="p-4 bg-accent/5 text-accent font-body font-bold border-2 border-accent text-center" style={{ borderRadius: WB }}>{error}</div>)}
            <div className="w-full">
              {loading ? (
                <Skeleton className="w-full h-14" />
              ) : (
                <button onClick={handleGoogleSignup}
                  className="w-full py-4 text-lg font-body border-[3px] border-foreground bg-paper hover:bg-muted flex items-center justify-center gap-3 transition-all shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px]"
                  style={{ borderRadius: WB }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign Up with Google
                </button>
              )}
            </div>
          </div>
          <p className="mt-8 text-center text-base font-body text-foreground/40">
            Already have an account?{" "}<Link href="/login" className="text-accent font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
