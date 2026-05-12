"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Compass, MapPin, Check, ChevronRight, User, Loader2, Upload, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

const CITIES = ["Mumbai", "Delhi", "Goa", "Jaipur", "Bangalore", "Hyderabad", "Kolkata", "Pune", "Kochi", "Varanasi", "Udaipur"];
const LANGUAGES = ["Hindi", "English", "Marathi", "Tamil", "Bengali", "Kannada", "Telugu", "Malayalam", "French", "German"];
const CATEGORIES = [
  { id: "food", label: "Street food", icon: "🍜" }, { id: "heritage", label: "Heritage walks", icon: "🏛️" },
  { id: "night", label: "Night tours", icon: "🌙" }, { id: "photography", label: "Photography spots", icon: "📸" },
  { id: "nature", label: "Nature treks", icon: "🌲" }, { id: "markets", label: "Local markets", icon: "🛍️" },
  { id: "architecture", label: "Architecture", icon: "🏗️" }, { id: "art", label: "Art & culture", icon: "🎨" },
  { id: "hidden", label: "Hidden gems", icon: "💎" }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [role, setRole] = useState("");
  const [touristData, setTouristData] = useState({ name: "", homeCity: "", preferredCities: [], budget: "explorer", style: "explorer" });
  const [guideData, setGuideData] = useState({ name: "", photo: "", city: "", university: "", year: "", idNumber: "", languages: [], categories: [], hourlyRate: 300, bio: "" });

  useEffect(() => {
    if (user?.displayName && !touristData.name) {
      setTouristData(prev => ({ ...prev, name: user.displayName }));
      setGuideData(prev => ({ ...prev, name: user.displayName }));
    }
  }, [user]);

  const totalSteps = role === "tourist" ? 3 : 4;
  const progressPercent = (step / totalSteps) * 100;

  const handleFinish = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      if (role === "tourist") {
        await setDoc(userRef, { uid: user.uid, name: touristData.name, email: user.email, role: "tourist", onboardingComplete: true, touristProfile: touristData, createdAt: serverTimestamp() }, { merge: true });
      } else {
        await setDoc(userRef, { uid: user.uid, name: guideData.name, email: user.email, role: "guide", onboardingComplete: true, guideProfile: guideData, createdAt: serverTimestamp() }, { merge: true });
        await setDoc(doc(db, "guides", user.uid), { uid: user.uid, ...guideData, verified: false, verificationStatus: "pending", phoneVerified: false, rating: 0, totalReviews: 0, submittedAt: serverTimestamp() });
      }
      setIsSuccess(true);
    } catch (err) { console.error("Onboarding error:", err); }
    finally { setLoading(false); }
  };

  const nextStep = () => { if (step === totalSteps) handleFinish(); else setStep(step + 1); };

  if (isSuccess) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-24 h-24 bg-postit border-[3px] border-foreground flex items-center justify-center mb-8 shadow-sketch"
            style={{ borderRadius: WB }}>
            <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Check className="w-12 h-12 text-secondary" strokeWidth={3} />
            </motion.div>
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            {role === "guide" ? "You're on the waitlist!" : `You're all set, ${touristData.name.split(' ')[0]}!`}
          </h1>
          <p className="font-body text-foreground/50 text-lg mb-10 max-w-md">
            {role === "guide" ? "We review guide profiles within 24–48 hours. You'll get an email once approved." : "Your dashboard is ready. Start by exploring guides in your favorite cities."}
          </p>
          <Button onClick={() => router.push("/dashboard")} className="h-14 px-10 text-lg">
            Take me to my dashboard <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <div className="h-16 bg-paper border-b-[3px] border-foreground px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent text-white flex items-center justify-center border-2 border-foreground" style={{ borderRadius: WB }}>
              <Compass className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-foreground">GullyGuide</span>
          </div>
          <div className="text-base font-body text-foreground/40">Step {step} of {totalSteps}</div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-muted/30 border-b-2 border-foreground/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-accent" />
        </div>

        <div className="max-w-[520px] mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-heading font-bold">How will you use GullyGuide?</h1>
                  <p className="font-body text-foreground/50">This helps us personalise your experience</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div onClick={() => setRole("tourist")}
                    className={`p-6 border-2 cursor-pointer transition-all relative group ${role === "tourist" ? "border-foreground bg-postit shadow-sketch" : "border-foreground/30 bg-paper hover:border-foreground"}`}
                    style={{ borderRadius: WB }}>
                    {role === "tourist" && <div className="absolute top-4 right-4 w-6 h-6 bg-accent border-2 border-foreground flex items-center justify-center" style={{ borderRadius: WB }}><Check className="text-white w-4 h-4" /></div>}
                    <Compass className={`w-10 h-10 mb-4 transition-colors ${role === 'tourist' ? 'text-accent' : 'text-foreground/30 group-hover:text-foreground/60'}`} strokeWidth={2} />
                    <h3 className="text-xl font-heading font-bold mb-1">I'm a traveller</h3>
                    <p className="text-base font-body text-foreground/50 mb-4">Explore cities, plan trips, and book local student guides.</p>
                    <div className="flex flex-wrap gap-2">
                      {["AI planning", "Local guides", "Budget tracking"].map(f => (<span key={f} className="text-xs font-body text-foreground/30 bg-muted/50 px-2 py-1 border border-foreground/10" style={{ borderRadius: WB }}>· {f}</span>))}
                    </div>
                  </div>
                  <div onClick={() => setRole("guide")}
                    className={`p-6 border-2 cursor-pointer transition-all relative group ${role === "guide" ? "border-foreground bg-postit shadow-sketch" : "border-foreground/30 bg-paper hover:border-foreground"}`}
                    style={{ borderRadius: WB2 }}>
                    {role === "guide" && <div className="absolute top-4 right-4 w-6 h-6 bg-secondary border-2 border-foreground flex items-center justify-center" style={{ borderRadius: WB }}><Check className="text-white w-4 h-4" /></div>}
                    <MapPin className={`w-10 h-10 mb-4 transition-colors ${role === 'guide' ? 'text-secondary' : 'text-foreground/30 group-hover:text-foreground/60'}`} strokeWidth={2} />
                    <h3 className="text-xl font-heading font-bold mb-1">I'm a student guide</h3>
                    <p className="text-base font-body text-foreground/50 mb-4">Share your city, earn money, and show travellers hidden gems.</p>
                    <div className="flex flex-wrap gap-2">
                      {["Flexible schedule", "Get paid", "Build reputation"].map(f => (<span key={f} className="text-xs font-body text-foreground/30 bg-muted/50 px-2 py-1 border border-foreground/10" style={{ borderRadius: WB }}>· {f}</span>))}
                    </div>
                  </div>
                </div>
                <Button disabled={!role} onClick={nextStep} className="w-full h-12">Continue <ChevronRight className="ml-2 w-4 h-4" /></Button>
              </motion.div>
            )}

            {/* TOURIST STEP 2 */}
            {role === "tourist" && step === 2 && (
              <motion.div key="t2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading font-bold">Tell us about yourself</h2>
                  <div className="space-y-4">
                    <div className="space-y-2 text-center py-4">
                      <div className="w-20 h-20 bg-postit mx-auto flex items-center justify-center text-2xl font-heading font-bold text-foreground border-[3px] border-foreground" style={{ borderRadius: WB }}>
                        {touristData.name ? touristData.name.charAt(0) : <User size={32} />}
                      </div>
                      <Button variant="link" className="text-accent text-sm">Upload photo</Button>
                    </div>
                    <div className="space-y-2"><Label>Your name</Label><Input value={touristData.name} onChange={e => setTouristData({...touristData, name: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Where are you based?</Label><Input placeholder="e.g. London, UK" value={touristData.homeCity} onChange={e => setTouristData({...touristData, homeCity: e.target.value})} /></div>
                  </div>
                  <Button disabled={!touristData.name} onClick={nextStep} className="w-full h-12">Continue <ChevronRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {/* TOURIST STEP 3 */}
            {role === "tourist" && step === 3 && (
              <motion.div key="t3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-8">
                  <h2 className="text-3xl font-heading font-bold">Customise your experience</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Preferred cities to explore</Label>
                      <div className="flex flex-wrap gap-2">
                        {CITIES.map(city => (
                          <button key={city} onClick={() => { const exists = touristData.preferredCities.includes(city); setTouristData({ ...touristData, preferredCities: exists ? touristData.preferredCities.filter(c => c !== city) : [...touristData.preferredCities, city] }); }}
                            className={`px-4 py-2 text-base font-body transition-all border-2 border-foreground ${touristData.preferredCities.includes(city) ? "bg-foreground text-paper" : "bg-paper text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]"}`}
                            style={{ borderRadius: WB }}>{city}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Daily travel budget</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["budget", "explorer", "premium"].map((b) => (
                          <div key={b} onClick={() => setTouristData({...touristData, budget: b})}
                            className={`p-3 border-2 text-center cursor-pointer transition-all ${touristData.budget === b ? "border-foreground bg-postit shadow-sketch" : "border-foreground/30 bg-paper hover:border-foreground"}`}
                            style={{ borderRadius: WB }}>
                            <span className="text-sm font-heading font-bold block mb-1">{b === 'budget' ? 'Under ₹1.5k' : b === 'explorer' ? '₹1.5k–4k' : 'Above ₹4k'}</span>
                            <span className="text-xs text-foreground/40 font-body capitalize">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button disabled={loading} onClick={handleFinish} className="w-full h-12">{loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}Finish setup</Button>
                </div>
              </motion.div>
            )}

            {/* GUIDE STEP 2 */}
            {role === "guide" && step === 2 && (
              <motion.div key="g2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-heading font-bold">Set up your guide profile</h2>
                  <div className="space-y-4">
                    <div className="space-y-2 text-center py-4">
                      <div className="w-24 h-24 bg-postit mx-auto flex items-center justify-center text-3xl font-heading font-bold text-foreground border-[3px] border-dashed border-foreground/30 relative overflow-hidden" style={{ borderRadius: WB }}>
                        {guideData.photo ? <img src={guideData.photo} className="w-full h-full object-cover" /> : <User size={40} />}
                      </div>
                      <Button variant="link" className="text-secondary text-sm">Upload photo *</Button>
                      <p className="text-xs font-body text-foreground/30">Tourists will see this on your profile</p>
                    </div>
                    <div className="space-y-2"><Label>Your name</Label><Input value={guideData.name} onChange={e => setGuideData({...guideData, name: e.target.value})} /></div>
                    <div className="space-y-2">
                      <Label>Which city do you know best? *</Label>
                      <Select onValueChange={v => setGuideData({...guideData, city: v})} defaultValue={guideData.city}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select your city" /></SelectTrigger>
                        <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Where do you study?</Label><Input placeholder="University name" value={guideData.university} onChange={e => setGuideData({...guideData, university: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Year of study</Label><Select onValueChange={v => setGuideData({...guideData, year: v})}><SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{["1st Year","2nd Year","3rd Year","4th Year","5th Year","Postgrad"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <div className="space-y-2"><Label>Student ID number</Label><Input placeholder="For verification only" value={guideData.idNumber} onChange={e => setGuideData({...guideData, idNumber: e.target.value})} /></div>
                  </div>
                  <Button disabled={!guideData.name || !guideData.city} onClick={nextStep} className="w-full h-12">Continue <ChevronRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {/* GUIDE STEP 3 */}
            {role === "guide" && step === 3 && (
              <motion.div key="g3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-8">
                  <h2 className="text-3xl font-heading font-bold">What will you offer?</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Languages you speak</Label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map(lang => (
                          <button key={lang} onClick={() => { const exists = guideData.languages.includes(lang); setGuideData({ ...guideData, languages: exists ? guideData.languages.filter(l => l !== lang) : [...guideData.languages, lang] }); }}
                            className={`px-4 py-2 text-base font-body transition-all border-2 border-foreground ${guideData.languages.includes(lang) ? "bg-foreground text-paper" : "bg-paper text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]"}`}
                            style={{ borderRadius: WB }}>{lang}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Experience categories</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map(cat => (
                          <div key={cat.id} onClick={() => { const exists = guideData.categories.includes(cat.id); setGuideData({ ...guideData, categories: exists ? guideData.categories.filter(c => c !== cat.id) : [...guideData.categories, cat.id] }); }}
                            className={`p-3 border-2 text-center cursor-pointer transition-all ${guideData.categories.includes(cat.id) ? "border-foreground bg-postit shadow-sketch" : "border-foreground/30 bg-paper hover:border-foreground"}`}
                            style={{ borderRadius: WB }}>
                            <span className="text-xl block mb-1">{cat.icon}</span>
                            <span className="text-xs font-body font-bold text-foreground/50 uppercase">{cat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end"><Label>Hourly rate (₹)</Label><span className="text-2xl font-heading font-bold text-secondary">₹{guideData.hourlyRate}</span></div>
                      <input type="range" min="100" max="2000" step="50" value={guideData.hourlyRate} onChange={e => setGuideData({...guideData, hourlyRate: parseInt(e.target.value)})} className="w-full accent-secondary" />
                      <p className="text-xs font-body text-foreground/30">Recommended for new guides: ₹300–₹500/hr</p>
                    </div>
                    <div className="space-y-2"><Label>Short bio</Label><Textarea placeholder="Tell tourists what makes your tours special..." value={guideData.bio} onChange={e => setGuideData({...guideData, bio: e.target.value})} className="h-24" maxLength={200} /><div className="text-xs font-body text-foreground/30 text-right">{guideData.bio.length}/200</div></div>
                  </div>
                  <Button onClick={nextStep} className="w-full h-12">Continue to verification <ChevronRight className="ml-2 w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {/* GUIDE STEP 4 */}
            {role === "guide" && step === 4 && (
              <motion.div key="g4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-heading font-bold">Verify your identity</h2>
                    <p className="text-base font-body text-foreground/40">Verification builds trust and unlocks the verified badge</p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-foreground/30 bg-paper text-center space-y-3" style={{ borderRadius: WB }}>
                      <div className="w-12 h-12 bg-muted/50 mx-auto flex items-center justify-center text-foreground/30 border-2 border-dashed border-foreground/20" style={{ borderRadius: WB }}><Upload size={24} /></div>
                      <div><h4 className="font-heading font-bold text-base">Upload college ID card</h4><p className="text-xs font-body text-foreground/30">JPG, PNG or PDF (Max 5MB)</p></div>
                      <Button variant="outline" size="sm">Choose file</Button>
                      <p className="text-xs font-body text-foreground/30 italic">Optional for now - can complete later</p>
                    </div>
                    <div className="p-6 border-2 border-foreground/30 bg-paper space-y-4" style={{ borderRadius: WB2 }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-postit flex items-center justify-center text-secondary border-2 border-foreground" style={{ borderRadius: WB }}><Phone size={20} /></div>
                        <div><h4 className="font-heading font-bold text-base">Phone number</h4><p className="text-xs font-body text-foreground/30">Used for booking notifications</p></div>
                      </div>
                      <div className="flex gap-2"><div className="flex-[0.3]"><Input value="+91" readOnly className="bg-muted/30" /></div><div className="flex-1"><Input placeholder="Enter mobile number" /></div></div>
                      <Button variant="secondary" className="w-full">Verify later</Button>
                    </div>
                    <div className="p-4 bg-muted/30 flex items-center gap-4 border-2 border-foreground/20" style={{ borderRadius: WB }}>
                      <div className="w-10 h-10 bg-postit overflow-hidden border-2 border-foreground flex items-center justify-center" style={{ borderRadius: WB }}>{guideData.photo ? <img src={guideData.photo} className="w-full h-full object-cover" /> : <User className="p-1 text-foreground/40" />}</div>
                      <div className="flex-1"><p className="text-xs font-heading font-bold text-foreground/40 uppercase">Profile Photo</p><p className="text-sm font-body text-foreground truncate">{guideData.name}</p></div>
                      <Button variant="link" className="text-accent text-xs">Retake</Button>
                    </div>
                  </div>
                  <Button disabled={loading} onClick={handleFinish} className="w-full h-12">{loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}Submit profile for review</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
