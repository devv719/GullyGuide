"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState, useRef } from "react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { MapPin, Plus, ArrowRight, Trash2, Loader2, Plane, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TripsRoutingHub() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTripName, setNewTripName] = useState("");
  const [newTripBudget, setNewTripBudget] = useState("");
  
  // Autocomplete State
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null); // { name, lat, lng }
  
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "trips"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(t => ({ id: t.id, ...t.data() }));
      setTrips(tripsData);
      setLoadingTrips(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Debounced Nominatim Search
  const handleCitySearch = (e) => {
     const val = e.target.value;
     setCitySearch(val);
     setSelectedCity(null); // invalidate previously selected if they type

     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
     
     if (!val.trim()) {
        setCitySuggestions([]);
        return;
     }

     searchTimeoutRef.current = setTimeout(async () => {
        setIsSearchingCity(true);
        try {
           const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5`);
           const data = await res.json();
           setCitySuggestions(data || []);
        } catch (e) {
           console.error("Geocoding fetch failed", e);
        }
        setIsSearchingCity(false);
     }, 300);
  };

  const selectCityFromDropdown = (place) => {
     setSelectedCity({
        name: place.display_name.split(',')[0],
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
     });
     setCitySearch(place.display_name); // Show full address in input
     setCitySuggestions([]); // Close dropdown
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!newTripName || !newTripBudget) return;
    
    // Fallback if they didn't explicitly click the dropdown but there's text
    let finalCity = selectedCity;
    if (!finalCity && citySearch) {
       // Just grab coordinates of Mumbai as fallback if purely text (or the first guess)
       finalCity = { name: citySearch, lat: 19.0760, lng: 72.8777 };
    } else if (!finalCity) {
       return; // missing city
    }

    setIsSubmitting(true);

    try {
      const tripParams = {
        userId: user.uid,
        name: newTripName,
        cityName: finalCity.name,
        coordinates: {
          lat: finalCity.lat,
          lng: finalCity.lng
        },
        budget: Number(newTripBudget),
        status: "upcoming",
        dailyPlans: [],
        expenses: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "trips"), tripParams);
      
      setIsCreatingTrip(false);
      setNewTripName("");
      setCitySearch("");
      setSelectedCity(null);
      setNewTripBudget("");
      setIsSubmitting(false);

      router.push(`/dashboard/trips/${docRef.id}`);

    } catch (error) {
      console.error("Error creating trip:", error);
      setIsSubmitting(false);
    }
  };

  const deleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this trip itinerary?")) {
      await deleteDoc(doc(db, "trips", tripId));
    }
  };

  if (loading || !user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Trip Manager</h2>
          <p className="text-zinc-500 font-medium text-sm mt-1">Design itineraries, map locations, and track travel budgets.</p>
        </div>
        <button 
          onClick={() => setIsCreatingTrip(true)}
          className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm hover:scale-[0.98] transition-transform flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" /> Create Itinerary
        </button>
      </div>

      {/* Creation Form Inline */}
      <AnimatePresence>
        {isCreatingTrip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.98, height: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 w-full"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                 <Plane className="w-5 h-5 text-primary"/> New Travel Plan
              </h3>
              <form onSubmit={handleCreateTrip} className="flex flex-col md:flex-row gap-4 w-full relative overflow-visible">
                <input 
                  type="text" placeholder="Trip Label (e.g. Mumbai Heritage Walk)" value={newTripName} onChange={e => setNewTripName(e.target.value)} required
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold" 
                />
                
                {/* Autocomplete Container */}
                <div className="w-full md:w-80 relative group">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3.5 text-zinc-400" />
                    <input 
                      type="text" placeholder="Search City..." value={citySearch} onChange={handleCitySearch} required
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold" 
                    />
                    {isSearchingCity && <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3.5 text-zinc-400" />}
                  </div>

                  {citySuggestions.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                        {citySuggestions.map((place, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => selectCityFromDropdown(place)}
                             className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors"
                           >
                             <div className="text-sm font-bold text-zinc-900 dark:text-white truncate">{place.display_name.split(',')[0]}</div>
                             <div className="text-xs text-zinc-500 font-medium truncate mt-0.5">{place.display_name}</div>
                           </div>
                        ))}
                     </div>
                  )}
                </div>

                <input 
                  type="number" placeholder="Budget (₹)" value={newTripBudget} onChange={e => setNewTripBudget(e.target.value)} required
                  className="w-full md:w-36 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold" 
                />
                <div className="flex gap-2 shrink-0">
                  <button type="submit" disabled={isSubmitting || (!selectedCity && !citySearch)} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors text-sm flex items-center justify-center min-w-[100px] disabled:opacity-50">
                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start"}
                  </button>
                  <button type="button" onClick={() => setIsCreatingTrip(false)} className="px-5 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm">Close</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Board */}
      <div>
        {loadingTrips ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse shadow-sm"></div>
            <div className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse shadow-sm"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-16 flex flex-col items-center justify-center text-center border border-zinc-200 dark:border-zinc-800 shadow-sm mt-8">
             <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700">
               <MapPin className="w-6 h-6 text-zinc-400" />
             </div>
             <p className="text-zinc-900 dark:text-white font-extrabold text-lg">No trips planned yet.</p>
             <p className="text-zinc-500 text-sm mt-2 mb-8 font-medium max-w-sm">Create your first itinerary to start mapping locations and tracking daily expenses.</p>
             <button onClick={() => setIsCreatingTrip(true)} className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 hover:scale-[0.98] transition-all font-bold shadow-sm">Build Itinerary</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <motion.div 
                key={trip.id}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/dashboard/trips/${trip.id}`)}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 cursor-pointer transition-all shadow-sm group flex flex-col justify-between h-52 relative overflow-hidden"
              >
                {/* Decorative fade element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${trip.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                       {trip.status}
                     </span>
                     <button onClick={(e) => deleteTrip(trip.id, e)} className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                  </div>
                  <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white truncate mt-2 pb-1">{trip.name}</h4>
                  <p className="text-zinc-500 text-sm flex items-center gap-1.5 capitalize font-medium">
                     {/* Support old standard (trip.city) and new generic Schema (trip.cityName) */}
                     <MapPin className="w-4 h-4 text-zinc-400" /> {trip.cityName || trip.city}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4 relative z-10">
                   <div className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight flex flex-col">
                     <span className="text-zinc-400 font-medium mr-2 text-[10px] uppercase tracking-widest leading-none mb-1">Budget</span>
                     ₹{trip.budget?.toLocaleString() || "0"}
                   </div>
                   <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 group-hover:bg-zinc-900 group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-zinc-900 flex items-center justify-center transition-colors text-zinc-600 dark:text-zinc-400 shadow-sm">
                     <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
