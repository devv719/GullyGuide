"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowRight, MapPin, Search, Backpack, Train, Crown, Compass, User } from "lucide-react";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Jaipur", "Goa", "Bangalore", 
  "Hyderabad", "Kolkata", "Pune", "Kochi", "Varanasi", 
  "Udaipur", "Rishikesh", "Chennai", "Agra", "Amritsar"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // State for user preferences
  const [role, setRole] = useState("");
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const toggleCity = (city) => {
    if (cities.includes(city)) {
      setCities(cities.filter(c => c !== city));
    } else {
      setCities([...cities, city]);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    if (user.uid === "mock-123") {
      localStorage.setItem("MOCK_ONBOARDED", "true");
      localStorage.setItem("MOCK_DEV_ROLE", role || "tourist");
      router.push("/dashboard");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        role,
        preferences: {
          cities,
          budgetRange,
          travelStyle
        },
        onboardingComplete: true
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding details:", error);
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !role) return;
    if (step === 2 && cities.length === 0) return;
    if (step === 3 && !budgetRange) return;
    
    if (step === 4) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  // Filter cities for the tag input
  const filteredCities = INDIAN_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  // Render Step Content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-zinc-900 dark:text-white">How will you use GullyGuide?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                onClick={() => setRole("tourist")}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${role === "tourist" ? "border-primary bg-teal-50 dark:bg-teal-900/20" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"}`}
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Compass className={`w-6 h-6 ${role === "tourist" ? "text-primary" : "text-zinc-400"}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">Tourist</h3>
                <p className="text-sm text-zinc-500">I want to plan trips and explore cities like a true local.</p>
              </div>

              <div 
                onClick={() => setRole("guide")}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${role === "guide" ? "border-primary bg-teal-50 dark:bg-teal-900/20" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"}`}
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <User className={`w-6 h-6 ${role === "guide" ? "text-primary" : "text-zinc-400"}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">Local Guide</h3>
                <p className="text-sm text-zinc-500">I am a student wanting to host tours and share my city.</p>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-zinc-900 dark:text-white">Which cities are you interested in?</h2>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search Indian cities..." 
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1 scrollbar-hide">
              {filteredCities.map(city => (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`px-4 py-2 font-medium rounded-full text-sm transition-all border ${
                    cities.includes(city) 
                      ? "bg-primary text-white border-primary shadow-sm" 
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  {cities.includes(city) && <MapPin className="w-3 h-3 inline mr-1" />}
                  {city}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-zinc-900 dark:text-white">What's your usual travel budget per day?</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "budget", name: "Budget Traveller", price: "Under ₹1,500/day", desc: "Hostel beds, street food, local buses" },
                { id: "explorer", name: "Explorer", price: "₹1,500 - ₹4,000/day", desc: "Mid-range stays, some comforts, cafes" },
                { id: "premium", name: "Premium", price: "Above ₹4,000/day", desc: "Comfort hotels, curated experiences, cabs" }
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setBudgetRange(opt.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${budgetRange === opt.id ? "border-primary bg-teal-50 dark:bg-teal-900/20" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300"}`}
                >
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{opt.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{opt.desc}</p>
                  </div>
                  <div className={`font-bold text-sm px-3 py-1 rounded-full ${budgetRange === opt.id ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {opt.price}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-zinc-900 dark:text-white">What kind of traveller are you?</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: "backpacker", icon: <Backpack className="w-6 h-6"/>, name: "Backpacker", desc: "Off the beaten path, local dhabas, overnight buses." },
                { id: "explorer", icon: <Train className="w-6 h-6"/>, name: "Explorer", desc: "Mix of local and comfortable, open to everything." },
                { id: "luxury", icon: <Crown className="w-6 h-6"/>, name: "Luxury", desc: "Curated experiences, boutique stays, private guides." }
              ].map(style => (
                <div 
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-6 text-center rounded-2xl border-2 cursor-pointer transition-all ${travelStyle === style.id ? "border-primary bg-teal-50 dark:bg-teal-900/20" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300"}`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${travelStyle === style.id ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                    {style.icon}
                  </div>
                  <h3 className="font-bold mb-2 text-zinc-900 dark:text-white">{style.name}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{style.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-sm overflow-hidden p-8 md:p-12 relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800">
          <motion.div 
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            className="h-full bg-primary"
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between items-center mb-10 text-sm font-bold text-zinc-400">
           <span>Step {step} of 4</span>
           {step > 1 && (
             <button onClick={() => setStep(step - 1)} className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
               Back
             </button>
           )}
        </div>

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        <div className="mt-10 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <button 
            onClick={nextStep}
            disabled={
              (step === 1 && !role) || 
              (step === 2 && cities.length === 0) || 
              (step === 3 && !budgetRange) || 
              (step === 4 && (!travelStyle || loading))
            }
            className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? "Saving Profile..." : (step === 4 ? "Complete Setup" : "Continue")}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
}
