"use client";

import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldAlert, LogOut, CheckCircle2, MapPin, Wallet, Compass } from "lucide-react";
import { useLocation } from "@/lib/LocationContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { setCurrentCity } = useLocation();
  
  // Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("tourist");
  
  // Personalization
  const [preferredCity, setPreferredCity] = useState("");
  const [budgetPref, setBudgetPref] = useState("standard");
  const [travelStyle, setTravelStyle] = useState("explore");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
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
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    
    await setDoc(doc(db, "users", user.uid), {
      displayName: name,
      role: role,
      profile: {
        preferredCity,
        budgetPref,
        travelStyle
      }
    }, { merge: true });

    // Sync Global Context
    if (preferredCity) setCurrentCity(preferredCity);

    setSaving(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse font-bold">Loading Identity...</div>;

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Configuration</h2>
        <p className="text-zinc-500 font-medium text-sm mt-1">Manage your identity, role configurations, and personalization.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
          
        {/* Core Profile */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-zinc-200 dark:border-[#1F2937] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-[#1F2937]">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Public Profile</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><User className="w-4 h-4"/> Display Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] text-zinc-900 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</label>
                <input type="email" value={email} disabled className="w-full bg-zinc-100 dark:bg-[#0B0F19]/50 border border-zinc-200 dark:border-[#1F2937] text-zinc-500 rounded-xl px-4 py-3 cursor-not-allowed text-sm font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Personalization */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-zinc-200 dark:border-[#1F2937] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-[#1F2937]">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Global Personalization</h3>
            <p className="text-sm font-medium text-zinc-500 mt-1">Control how GullyGuide defaults location and budgeting.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> Default Exploration City</label>
               <input type="text" placeholder="e.g. Mumbai, New York" value={preferredCity} onChange={e=>setPreferredCity(e.target.value)} className="w-full max-w-sm bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] text-zinc-900 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-bold" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-[#1F2937]">
                <div className="space-y-3">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Wallet className="w-4 h-4"/> Budget Strategy</label>
                   <select value={budgetPref} onChange={e=>setBudgetPref(e.target.value)} className="w-full bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] text-zinc-900 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-bold appearance-none">
                      <option value="economy">Economy (Hostels, Trains)</option>
                      <option value="standard">Standard (Hotels, Flights)</option>
                      <option value="luxury">Luxury (Boutique, Private)</option>
                   </select>
                </div>
                
                <div className="space-y-3">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Compass className="w-4 h-4"/> Travel Style</label>
                   <select value={travelStyle} onChange={e=>setTravelStyle(e.target.value)} className="w-full bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] text-zinc-900 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-bold appearance-none">
                      <option value="explore">Explorer (See Everything)</option>
                      <option value="foodie">Foodie (Culinary Focused)</option>
                      <option value="relax">Relaxation (Slow Pace)</option>
                   </select>
                </div>
            </div>
          </div>
        </div>

        {/* Role Enforcement */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-zinc-200 dark:border-[#1F2937] shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
             <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Account Capabilities</label>
             <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex-1 border rounded-xl p-5 cursor-pointer transition-all ${role === 'tourist' ? 'border-primary bg-primary/5 shadow-sm' : 'border-zinc-200 dark:border-[#1F2937] bg-zinc-50 dark:bg-[#0B0F19] hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
                  <input type="radio" value="tourist" checked={role === 'tourist'} onChange={()=>setRole('tourist')} className="hidden" />
                  <div className="font-extrabold text-zinc-900 dark:text-gray-200 mb-1">Tourist View</div>
                  <div className="text-xs font-medium text-zinc-500">I want to discover places and plan itineraries.</div>
                </label>
                <label className={`flex-1 border rounded-xl p-5 cursor-pointer transition-all ${role === 'guide' ? 'border-primary bg-primary/5 shadow-sm' : 'border-zinc-200 dark:border-[#1F2937] bg-zinc-50 dark:bg-[#0B0F19] hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
                  <input type="radio" value="guide" checked={role === 'guide'} onChange={()=>setRole('guide')} className="hidden" />
                  <div className="font-extrabold text-zinc-900 dark:text-gray-200 mb-1">Local Guide</div>
                  <div className="text-xs font-medium text-zinc-500">I want to assist tourists and accept bookings.</div>
                </label>
             </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex justify-between items-center bg-white dark:bg-zinc-950 sticky bottom-0 py-4 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button disabled={saving} type="submit" className="px-8 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center min-w-[140px]">
              {saving ? "Saving..." : "Update Identity"}
            </button>
            {toast && <span className="text-primary text-sm font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2"><CheckCircle2 className="w-5 h-5"/> Synced</span>}
          </div>
          
          <button type="button" onClick={handleLogout} className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-200 dark:border-red-500/30 text-red-600 font-medium rounded-xl transition-colors active:scale-95" title="End Session">
             <LogOut className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
}
