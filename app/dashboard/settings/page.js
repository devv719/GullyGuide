"use client";

import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldAlert, LogOut, CheckCircle2, MapPin, Wallet, Compass } from "lucide-react";
import { useLocation } from "@/lib/LocationContext";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { setCurrentCity } = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("tourist");
  const [preferredCity, setPreferredCity] = useState("");
  const [budgetPref, setBudgetPref] = useState("standard");
  const [travelStyle, setTravelStyle] = useState("explore");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.displayName || user.displayName || "");
          setEmail(data.email || user.email || "");
          setRole(data.role || "tourist");
          if (data.profile) {
            setPreferredCity(data.profile.preferredCity || "");
            setBudgetPref(data.profile.budgetPref || "standard");
            setTravelStyle(data.profile.travelStyle || "explore");
          }
        } else {
          setName(user.displayName || "");
          setEmail(user.email || "");
        }
      } catch (e) {
        console.error("[Settings] Error loading profile:", e.message);
        setName(user.displayName || "");
        setEmail(user.email || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        role: role,
        profile: { preferredCity, budgetPref, travelStyle }
      }, { merge: true });
      if (preferredCity) setCurrentCity(preferredCity);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (e) {
      console.error("[Settings] Save error:", e.message);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="h-full flex items-center justify-center text-foreground/40 animate-pulse font-body text-lg">Loading Identity...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground">Configuration</h2>
        <p className="font-body text-foreground/50 text-base mt-1">Manage your identity, role, and personalization.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Profile */}
        <div className="bg-paper border-2 border-foreground overflow-hidden shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] tape-decoration mt-3" style={{ borderRadius: WB2 }}>
          <div className="p-6 border-b-2 border-dashed border-foreground/20">
            <h3 className="text-lg font-heading font-bold text-foreground">Public Profile</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-heading font-bold text-foreground/50 flex items-center gap-2"><User className="w-4 h-4" strokeWidth={2.5}/> Display Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-background border-2 border-foreground text-foreground px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-lg font-body" style={{ borderRadius: WB }} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-heading font-bold text-foreground/50 flex items-center gap-2"><Mail className="w-4 h-4" strokeWidth={2.5}/> Email Address</label>
                <input type="email" value={email} disabled className="w-full bg-muted/30 border-2 border-foreground/30 text-foreground/40 px-4 py-3 cursor-not-allowed text-lg font-body" style={{ borderRadius: WB }} />
              </div>
            </div>
          </div>
        </div>

        {/* Global Personalization */}
        <div className="bg-paper border-2 border-foreground overflow-hidden shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>
          <div className="p-6 border-b-2 border-dashed border-foreground/20">
            <h3 className="text-lg font-heading font-bold text-foreground">Global Personalization</h3>
            <p className="text-sm font-body text-foreground/40 mt-1">Control how GullyGuide defaults location and budgeting.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-heading font-bold text-foreground/50 flex items-center gap-2"><MapPin className="w-4 h-4" strokeWidth={2.5}/> Default Exploration City</label>
              <input type="text" placeholder="e.g. Mumbai, New York" value={preferredCity} onChange={e=>setPreferredCity(e.target.value)} className="w-full max-w-sm bg-background border-2 border-foreground text-foreground px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-lg font-body placeholder:text-foreground/30" style={{ borderRadius: WB }} />
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-foreground/15">
              <div className="space-y-3">
                <label className="text-sm font-heading font-bold text-foreground/50 flex items-center gap-2"><Wallet className="w-4 h-4" strokeWidth={2.5}/> Budget Strategy</label>
                <select value={budgetPref} onChange={e=>setBudgetPref(e.target.value)} className="w-full bg-background border-2 border-foreground text-foreground px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-lg font-body appearance-none" style={{ borderRadius: WB }}>
                  <option value="economy">Economy (Hostels, Trains)</option>
                  <option value="standard">Standard (Hotels, Flights)</option>
                  <option value="luxury">Luxury (Boutique, Private)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-heading font-bold text-foreground/50 flex items-center gap-2"><Compass className="w-4 h-4" strokeWidth={2.5}/> Travel Style</label>
                <select value={travelStyle} onChange={e=>setTravelStyle(e.target.value)} className="w-full bg-background border-2 border-foreground text-foreground px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-lg font-body appearance-none" style={{ borderRadius: WB }}>
                  <option value="explore">Explorer (See Everything)</option>
                  <option value="foodie">Foodie (Culinary Focused)</option>
                  <option value="relax">Relaxation (Slow Pace)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Role Enforcement */}
        <div className="bg-paper border-2 border-foreground overflow-hidden shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB2 }}>
          <div className="p-6 space-y-4">
            <label className="text-sm font-heading font-bold text-foreground/50 flex items-center gap-2"><ShieldAlert className="w-4 h-4" strokeWidth={2.5}/> Account Capabilities</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex-1 border-2 p-5 cursor-pointer transition-all ${role === 'tourist' ? 'border-foreground bg-postit shadow-sketch' : 'border-foreground/30 bg-paper hover:border-foreground'}`} style={{ borderRadius: WB }}>
                <input type="radio" value="tourist" checked={role === 'tourist'} onChange={()=>setRole('tourist')} className="hidden" />
                <div className="font-heading font-bold text-foreground mb-1">Tourist View</div>
                <div className="text-sm font-body text-foreground/40">I want to discover places and plan itineraries.</div>
              </label>
              <label className={`flex-1 border-2 p-5 cursor-pointer transition-all ${role === 'guide' ? 'border-foreground bg-postit shadow-sketch' : 'border-foreground/30 bg-paper hover:border-foreground'}`} style={{ borderRadius: WB2 }}>
                <input type="radio" value="guide" checked={role === 'guide'} onChange={()=>setRole('guide')} className="hidden" />
                <div className="font-heading font-bold text-foreground mb-1">Local Guide</div>
                <div className="text-sm font-body text-foreground/40">I want to assist tourists and accept bookings.</div>
              </label>
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex justify-between items-center bg-paper sticky bottom-0 py-4 border-t-2 border-dashed border-foreground/20">
          <div className="flex items-center gap-3">
            <button disabled={saving} type="submit" className="px-8 py-3 bg-foreground text-paper font-body text-lg border-2 border-foreground shadow-[3px_3px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]" style={{ borderRadius: WB }}>
              {saving ? "Saving..." : "Update Identity"}
            </button>
            {toast && <span className="text-secondary text-base font-body font-bold flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5"/> Synced</span>}
          </div>
          <button type="button" onClick={handleLogout} className="w-12 h-12 flex items-center justify-center bg-accent/10 hover:bg-accent hover:text-white border-2 border-accent text-accent font-body transition-all active:translate-x-[2px] active:translate-y-[2px]" title="End Session" style={{ borderRadius: WB }}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
