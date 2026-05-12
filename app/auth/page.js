"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PublicRoute from "@/components/PublicRoute";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

const mapAuthCodeToMessage = (code) => {
  switch (code) {
    case "auth/user-not-found": return "No account found with this email.";
    case "auth/wrong-password": return "Incorrect password. Try again.";
    case "auth/email-already-in-use": return "An account with this email already exists.";
    case "auth/weak-password": return "Password must be at least 6 characters.";
    case "auth/invalid-email": return "Please enter a valid email address.";
    case "auth/popup-closed-by-user": return "Sign-in cancelled. Try again.";
    case "auth/network-request-failed": return "Connection issue. Check your internet.";
    case "auth/too-many-requests": return "Too many attempts. Wait a moment.";
    default: return "An unexpected error occurred. Please try again.";
  }
};

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoogleSignIn = async () => {
    setError(""); setLoading(true);
    if (typeof navigator !== "undefined" && !navigator.onLine) { setError("You appear to be offline."); setLoading(false); return; }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      let snap;
      try { snap = await getDoc(doc(db, "users", result.user.uid)); } catch { router.push("/dashboard"); return; }
      if (!snap.exists()) {
        try { await setDoc(doc(db, "users", result.user.uid), { uid: result.user.uid, name: result.user.displayName || "", email: result.user.email, photoURL: result.user.photoURL || "", onboardingComplete: false, createdAt: serverTimestamp() }); } catch {}
        router.push("/onboarding");
      } else {
        const profile = snap.data();
        router.push(!profile.onboardingComplete ? "/onboarding" : "/dashboard");
      }
    } catch (err) { setError(mapAuthCodeToMessage(err.code)); } finally { setLoading(false); }
  };

  const handleSignIn = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      let snap;
      try { snap = await getDoc(doc(db, "users", cred.user.uid)); } catch { router.push("/dashboard"); return; }
      if (snap?.exists()) { router.push(!snap.data().onboardingComplete ? "/onboarding" : "/dashboard"); } else { router.push("/onboarding"); }
    } catch (err) { setError(mapAuthCodeToMessage(err.code)); } finally { setLoading(false); }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      try { await setDoc(doc(db, "users", cred.user.uid), { uid: cred.user.uid, name, email, photoURL: "", onboardingComplete: false, createdAt: serverTimestamp() }); } catch {}
      router.push("/onboarding");
    } catch (err) { setError(mapAuthCodeToMessage(err.code)); } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await sendPasswordResetEmail(auth, email); setResetSent(true); } catch (err) { setError(mapAuthCodeToMessage(err.code)); } finally { setLoading(false); }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let s = 0; if (password.length >= 6) s++; if (/[A-Z]/.test(password)) s++; if (/[0-9]/.test(password)) s++;
    return s;
  };

  return (
    <PublicRoute>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* Left: Brand Panel — notebook style */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-postit relative overflow-hidden notebook-lines">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-accent text-white flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d]" style={{ borderRadius: WB }}>
                <Compass className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-heading font-bold text-foreground">GullyGuide</span>
            </div>
            <h1 className="text-5xl font-heading font-bold text-foreground leading-tight mb-6">Explore cities like a local.</h1>
            <p className="text-xl font-body text-foreground/60 max-w-md">Real streets. Real stories. Shared by local student guides who know their city best.</p>
          </div>
          <div className="relative z-10 flex gap-3 flex-wrap">
            {["Student guides", "AI trip planning", "Local experiences"].map((pill) => (
              <div key={pill} className="px-4 py-2 bg-paper/80 border-2 border-foreground font-body text-base text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>{pill}</div>
            ))}
          </div>
          {/* Decorative dashed circles */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 border-[3px] border-dashed border-foreground/10 rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 border-[3px] border-dashed border-accent/15 rounded-full" />
        </div>

        {/* Right: Auth Form */}
        <div className="flex items-center justify-center p-6 bg-background">
          <div className="w-full max-w-[420px] space-y-8">
            <AnimatePresence mode="wait">
              {forgotPassword ? (
                <motion.div key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div>
                    <button onClick={() => { setForgotPassword(false); setResetSent(false); }} className="flex items-center gap-2 text-base font-body text-foreground/60 hover:text-accent mb-6 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back to sign in
                    </button>
                    <h2 className="text-3xl font-heading font-bold">Forgot password?</h2>
                    <p className="font-body text-foreground/50 mt-2">Enter your email and we'll send you a reset link.</p>
                  </div>
                  {resetSent ? (
                    <div className="p-4 bg-postit border-2 border-foreground" style={{ borderRadius: WB }}><p className="text-base font-body text-foreground">Check your inbox — we sent a reset link to <span className="font-bold">{email}</span></p></div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2"><Label htmlFor="reset-email">Email address</Label><Input id="reset-email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                      <Button type="submit" disabled={loading} className="w-full">{loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{loading ? "Sending..." : "Send reset link"}</Button>
                    </form>
                  )}
                  {error && <p className="text-base font-body text-accent font-bold">{error}</p>}
                </motion.div>
              ) : (
                <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="lg:hidden flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-accent text-white flex items-center justify-center border-2 border-foreground" style={{ borderRadius: WB }}><Compass className="w-5 h-5" strokeWidth={2.5} /></div>
                    <span className="text-xl font-heading font-bold text-foreground">GullyGuide</span>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex border-2 border-foreground overflow-hidden" style={{ borderRadius: WB }}>
                    <button onClick={() => setActiveTab("signin")} className={`flex-1 py-3 text-lg font-body text-center transition-colors ${activeTab === "signin" ? "bg-foreground text-paper" : "bg-paper text-foreground hover:bg-muted"}`}>Sign in</button>
                    <button onClick={() => setActiveTab("create")} className={`flex-1 py-3 text-lg font-body text-center transition-colors border-l-2 border-foreground ${activeTab === "create" ? "bg-foreground text-paper" : "bg-paper text-foreground hover:bg-muted"}`}>Create account</button>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full h-12 relative" onClick={handleGoogleSignIn} disabled={loading}>
                      <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </Button>

                    <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-dashed border-foreground/20" /></div><div className="relative flex justify-center text-sm"><span className="bg-background px-3 font-body text-foreground/40">or</span></div></div>

                    <AnimatePresence mode="wait">
                      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                        <form onSubmit={activeTab === "signin" ? handleSignIn : handleCreateAccount} className="space-y-4">
                          {activeTab === "create" && (<div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" placeholder="Rahul Mehra" required value={name} onChange={(e) => setName(e.target.value)} /></div>)}
                          <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="password">Password</Label>
                              {activeTab === "signin" && (<button type="button" onClick={() => setForgotPassword(true)} className="text-sm font-body text-secondary hover:text-accent transition-colors">Forgot password?</button>)}
                            </div>
                            <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-foreground/40 hover:text-foreground transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                            {activeTab === "create" && (
                              <div className="space-y-2 pt-1">
                                <div className="flex gap-1 h-2">
                                  {[1, 2, 3].map((seg) => (<div key={seg} className={`flex-1 border-2 border-foreground ${getPasswordStrength() >= seg ? seg === 1 ? 'bg-accent' : seg === 2 ? 'bg-postit' : 'bg-secondary' : 'bg-muted/30'}`} style={{ borderRadius: WB }} />))}
                                </div>
                              </div>
                            )}
                          </div>
                          {activeTab === "create" && (<div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>)}
                          <Button type="submit" disabled={loading} className="w-full">{loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{activeTab === "signin" ? (loading ? "Signing in..." : "Sign in") : (loading ? "Creating account..." : "Create account")}</Button>
                        </form>
                      </motion.div>
                    </AnimatePresence>

                    <AnimatePresence>{error && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><p className="text-base font-body text-accent font-bold mt-2">{error}</p></motion.div>)}</AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
