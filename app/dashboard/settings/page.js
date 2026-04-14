"use client";

import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("tourist");
  
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
      role: role
    }, { merge: true });

    setSaving(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-500 animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Account Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your identity, role configurations, and security.</p>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-[#1F2937] shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-[#1F2937]">
          <h3 className="text-lg font-bold text-gray-200">Public Profile</h3>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 flex items-center gap-2"><User className="w-4 h-4"/> Display Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-[#0B0F19] border border-[#1F2937] text-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</label>
              <input type="email" value={email} disabled className="w-full bg-[#0B0F19]/50 border border-[#1F2937] text-gray-500 rounded-xl px-4 py-2.5 cursor-not-allowed text-sm" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Managed via Provider</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F2937]">
            <label className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3"><ShieldAlert className="w-4 h-4"/> Account Role</label>
            <div className="flex gap-4">
               <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${role === 'tourist' ? 'border-[#4F46E5] bg-[#4F46E5]/10' : 'border-[#1F2937] bg-[#0B0F19] hover:border-gray-700'}`}>
                 <input type="radio" value="tourist" checked={role === 'tourist'} onChange={()=>setRole('tourist')} className="hidden" />
                 <div className="font-bold text-gray-200 mb-1">Tourist</div>
                 <div className="text-xs text-gray-500">I want to discover places and plan itineraries.</div>
               </label>
               <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${role === 'guide' ? 'border-[#10B981] bg-[#10B981]/10' : 'border-[#1F2937] bg-[#0B0F19] hover:border-gray-700'}`}>
                 <input type="radio" value="guide" checked={role === 'guide'} onChange={()=>setRole('guide')} className="hidden" />
                 <div className="font-bold text-gray-200 mb-1">Local Guide</div>
                 <div className="text-xs text-gray-500">I want to assist tourists and accept bookings.</div>
               </label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <div className="flex items-center gap-3">
              <button disabled={saving} type="submit" className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] disabled:bg-gray-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {toast && <span className="text-[#10B981] text-sm font-medium flex items-center gap-1 animate-in fade-in slide-in-from-left-2"><CheckCircle2 className="w-4 h-4"/> Saved successfully</span>}
            </div>
          </div>
        </form>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-red-900/30 overflow-hidden mt-6">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-1">Session Management</h3>
            <p className="text-gray-500 text-sm">Securely log out of this device.</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-500 font-medium rounded-xl transition-colors flex items-center gap-2 text-sm">
             <LogOut className="w-4 h-4" /> End Session
          </button>
        </div>
      </div>
    
    </div>
  );
}
