"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ArrowRight, Compass, User, AlertCircle } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorUI, setErrorUI] = useState("");
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Role Selection
  const [role, setRole] = useState(""); // "tourist" | "guide"

  // Tourist Data
  const [touristData, setTouristData] = useState({
    name: "", nationality: "", startDate: "", endDate: "", city: "",
    budget: "", language: "", groupSize: "1", interests: []
  });

  // Guide Data
  const [guideData, setGuideData] = useState({
    name: "", college: "", city: "", languages: "",
    availability: "", pricing: "", bio: "", expertise: []
  });

  // Fetch Firestore doc, if onboardingComplete then push to dashboard
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
       router.push("/login");
       return;
    }

    const fetchData = async () => {
      console.log("fetching user doc...", user.uid);
      try {
        if (user.uid === "mock-123") {
            if (localStorage.getItem("MOCK_ONBOARDED") === "true") {
                 router.push("/dashboard");
            } else {
                 setCheckingExisting(false);
            }
            return;
        }

        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().onboardingComplete) {
          router.push(`/dashboard/${snap.data().role || "tourist"}`);
        } else {
          setCheckingExisting(false);
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        setCheckingExisting(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const toggleTouristInterest = (i) => {
    setTouristData(prev => ({
      ...prev,
      interests: prev.interests.includes(i) ? prev.interests.filter(x => x !== i) : [...prev.interests, i]
    }));
  };

  const toggleGuideExpertise = (e) => {
    setGuideData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(e) ? prev.expertise.filter(x => x !== e) : [...prev.expertise, e]
    }));
  };

  const handleSubmit = async () => {
    console.log("user:", user);
    console.log("saving onboarding...");
    
    setErrorUI("");
    setLoading(true);

    try {
      if (!user) throw new Error("User not logged in");

      if (user.uid === "mock-123") {
         await new Promise(r => setTimeout(r, 1000)); // Simulate delay
         localStorage.setItem("MOCK_ONBOARDED", "true");
         localStorage.setItem("MOCK_DEV_ROLE", role);
         console.log("data saved (mock)");
         setLoading(false);
         router.push(`/dashboard/${role}`);
         return;
      }

      const promises = [
        setDoc(doc(db, "users", user.uid), {
          role,
          name: role === "tourist" ? touristData.name : guideData.name,
          onboardingComplete: true,
          createdAt: serverTimestamp(),
          profile: role === "tourist" ? touristData : guideData
        })
      ];

      if (role === "guide") {
         promises.push(setDoc(doc(db, "guides", user.uid), {
           uid: user.uid,
           name: guideData.name,
           photoURL: user.photoURL || "",
           city: guideData.city,
           bio: guideData.bio || "",
           languages: guideData.languages.split(',').map(s=>s.trim()).filter(Boolean),
           pricePerHour: parseInt(guideData.pricing) || 0,
           experiences: guideData.expertise || [],
           rating: 0,
           totalReviews: 0,
           available: true,
           createdAt: serverTimestamp()
         }));
      }

      await Promise.all(promises);

      console.log("data saved");
      setLoading(false);
      router.push(`/dashboard/${role}`);
    } catch (err) {
      console.error("Onboarding error:", err);
      // fallback important: stop loading and show error instead of infinite spinner
      setLoading(false);
      setErrorUI("Failed to save data. Please check your network and try again.");
    }
  };

  const nextStep = () => {
    if (step === 1 && !role) return;
    
    // Validation logic for steps can be fleshed out, let's keep it simple for now to ensure they fill it
    let totalSteps = role === "tourist" ? 4 : 4;
    
    if (step === totalSteps) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  // UI Renderers
  const renderTouristSteps = () => {
    const isStep2Complete = touristData.name && touristData.nationality && touristData.language;
    const isStep3Complete = touristData.city && touristData.startDate && touristData.endDate && touristData.groupSize;
    const isStep4Complete = touristData.budget && touristData.interests.length > 0;

    if (step === 2) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 dark:text-white">Tell us about yourself</h2>
        <div>
          <label className="text-sm font-bold text-zinc-500">Full Name</label>
          <input type="text" value={touristData.name} onChange={e => setTouristData({...touristData, name: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="text-sm font-bold text-zinc-500">Nationality</label>
          <input type="text" value={touristData.nationality} onChange={e => setTouristData({...touristData, nationality: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Australian" />
        </div>
        <div>
          <label className="text-sm font-bold text-zinc-500">Preferred Language</label>
          <input type="text" value={touristData.language} onChange={e => setTouristData({...touristData, language: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="English, French, etc." />
        </div>
        <button disabled={!isStep2Complete} onClick={nextStep} className="w-full py-4 mt-6 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Continue <ArrowRight size={18} /></button>
      </motion.div>
    );

    if (step === 3) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 dark:text-white">Trip Details</h2>
        <div>
          <label className="text-sm font-bold text-zinc-500">City Visiting</label>
          <input type="text" value={touristData.city} onChange={e => setTouristData({...touristData, city: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Mumbai, Delhi, etc." />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
             <label className="text-sm font-bold text-zinc-500">Start Date</label>
             <input type="date" value={touristData.startDate} onChange={e => setTouristData({...touristData, startDate: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex-1">
             <label className="text-sm font-bold text-zinc-500">End Date</label>
             <input type="date" value={touristData.endDate} onChange={e => setTouristData({...touristData, endDate: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-zinc-500">Group Size</label>
          <input type="number" min={1} value={touristData.groupSize} onChange={e => setTouristData({...touristData, groupSize: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button disabled={!isStep3Complete} onClick={nextStep} className="w-full py-4 mt-6 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Continue <ArrowRight size={18} /></button>
      </motion.div>
    );

    if (step === 4) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 dark:text-white">Preferences</h2>
        <div>
          <label className="text-sm font-bold text-zinc-500">Budget per day (₹)</label>
          <input type="text" value={touristData.budget} onChange={e => setTouristData({...touristData, budget: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 2000" />
        </div>
        <div>
          <label className="text-sm font-bold text-zinc-500">Interests (Select Multiple)</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Food', 'Nightlife', 'Heritage', 'Shopping', 'Local Experiences'].map(interest => (
               <button key={interest} onClick={() => toggleTouristInterest(interest)} className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${touristData.interests.includes(interest) ? 'bg-primary text-white border-primary' : 'bg-transparent text-zinc-600 dark:text-zinc-300 dark:border-zinc-700'}`}>
                 {interest}
               </button>
            ))}
          </div>
        </div>
        <button disabled={!isStep4Complete} onClick={nextStep} className="w-full py-4 mt-6 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Complete Setup <ArrowRight size={18} /></button>
      </motion.div>
    );

    return null;
  };

  const renderGuideSteps = () => {
    const isStep2Complete = guideData.name && guideData.college && guideData.city;
    const isStep3Complete = guideData.languages && guideData.expertise.length > 0;
    const isStep4Complete = guideData.availability && guideData.pricing && guideData.bio;

    if (step === 2) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 dark:text-white">Guide Details</h2>
        <div>
           <label className="text-sm font-bold text-zinc-500">Full Name</label>
           <input type="text" value={guideData.name} onChange={e => setGuideData({...guideData, name: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Rahul Mehra" />
        </div>
        <div>
           <label className="text-sm font-bold text-zinc-500">College / Student Status</label>
           <input type="text" value={guideData.college} onChange={e => setGuideData({...guideData, college: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="B.A. History, Delhi Univ" />
        </div>
        <div>
           <label className="text-sm font-bold text-zinc-500">Your City</label>
           <input type="text" value={guideData.city} onChange={e => setGuideData({...guideData, city: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Delhi" />
        </div>
        <button disabled={!isStep2Complete} onClick={nextStep} className="w-full py-4 mt-6 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Continue <ArrowRight size={18} /></button>
      </motion.div>
    );

    if (step === 3) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 dark:text-white">Your Expertise</h2>
        <div>
           <label className="text-sm font-bold text-zinc-500">Languages Known</label>
           <input type="text" value={guideData.languages} onChange={e => setGuideData({...guideData, languages: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Hindi, English" />
        </div>
        <div>
          <label className="text-sm font-bold text-zinc-500">Areas of Expertise</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Food Tours', 'Heritage Walks', 'Nightlife', 'Hidden Spots', 'Photography', 'Shopping'].map(exp => (
               <button key={exp} onClick={() => toggleGuideExpertise(exp)} className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${guideData.expertise.includes(exp) ? 'bg-primary text-white border-primary' : 'bg-transparent text-zinc-600 dark:text-zinc-300 dark:border-zinc-700'}`}>
                 {exp}
               </button>
            ))}
          </div>
        </div>
        <button disabled={!isStep3Complete} onClick={nextStep} className="w-full py-4 mt-6 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Continue <ArrowRight size={18} /></button>
      </motion.div>
    );

    if (step === 4) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 dark:text-white">Pricing & Bio</h2>
        <div>
           <label className="text-sm font-bold text-zinc-500">Availability (Days + Time slots)</label>
           <input type="text" value={guideData.availability} onChange={e => setGuideData({...guideData, availability: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Weekends, Afternoons" />
        </div>
        <div>
           <label className="text-sm font-bold text-zinc-500">Pricing (Per Hour or Day in ₹)</label>
           <input type="text" value={guideData.pricing} onChange={e => setGuideData({...guideData, pricing: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="₹500 / hr" />
        </div>
        <div>
           <label className="text-sm font-bold text-zinc-500">Short Bio</label>
           <textarea rows={3} value={guideData.bio} onChange={e => setGuideData({...guideData, bio: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-800 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Hi, I'm..." />
        </div>
        <button disabled={!isStep4Complete} onClick={nextStep} className="w-full py-4 mt-6 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Complete Setup <ArrowRight size={18} /></button>
      </motion.div>
    );

    return null;
  };

  if (checkingExisting) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
         <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
         <p className="mt-4 text-zinc-500 font-medium">Checking profile state...</p>
      </div>
    );
  }

  // Calculate Progress correctly based on total steps 4 for both flows
  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-sm overflow-hidden p-8 md:p-12 relative min-h-[500px]">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800">
           <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-primary" transition={{ duration: 0.3 }} />
        </div>

        {errorUI && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-200">
             <AlertCircle size={20} /> <span className="font-bold text-sm">{errorUI}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-10 text-sm font-bold text-zinc-400">
           <span>Step {step} of {totalSteps}</span>
           {step > 1 && !loading && (
             <button onClick={() => setStep(step - 1)} className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
               Back
             </button>
           )}
        </div>

        <div>
          {loading ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-12">
               <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative">
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary" />
                 <Compass className="w-8 h-8 text-primary" />
               </div>
               <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Saving your setup...</h2>
               <p className="text-zinc-500 font-medium">Please wait while we finalize your hub.</p>
             </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-zinc-900 dark:text-white">How will you use GullyGuide?</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div onClick={() => setRole("tourist")} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${role === "tourist" ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"}`}>
                       <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex gap-3 mb-3 shadow-sm border items-center justify-center">
                          <Compass className={`w-6 h-6 ${role === 'tourist' ? 'text-primary' : 'text-zinc-400'}`} />
                       </div>
                       <h3 className="text-xl font-bold mb-2 dark:text-white">Tourist</h3>
                       <p className="text-sm text-zinc-500">I want to plan trips and explore cities like a true local.</p>
                    </div>

                    <div onClick={() => setRole("guide")} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${role === "guide" ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"}`}>
                       <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex gap-3 mb-3 shadow-sm border items-center justify-center">
                          <User className={`w-6 h-6 ${role === 'guide' ? 'text-primary' : 'text-zinc-400'}`} />
                       </div>
                       <h3 className="text-xl font-bold mb-2 dark:text-white">Local Guide</h3>
                       <p className="text-sm text-zinc-500">I am a student wanting to host tours and share my city.</p>
                    </div>
                  </div>
                  <button disabled={!role} onClick={nextStep} className="w-full py-4 mt-8 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-primary/90 flex justify-center items-center gap-2">Continue <ArrowRight size={18} /></button>
                </motion.div>
              )}

              {step > 1 && role === "tourist" && renderTouristSteps()}
              {step > 1 && role === "guide" && renderGuideSteps()}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
