"use client";

import { useTrips } from "@/hooks/useTrips";
import { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { MapPin, Plus, ArrowRight, Trash2, Loader2, Plane, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function TripsRoutingHub() {
  const { user } = useAuth();
  const router = useRouter();
  
  const { trips, loading } = useTrips();
  const [activeTab, setActiveTab] = useState("All");

  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form State
  const [newTripName, setNewTripName] = useState("");
  const [newTripBudget, setNewTripBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Autocomplete State
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  
  const searchTimeoutRef = useRef(null);

  const handleCitySearch = (e) => {
     const val = e.target.value;
     setCitySearch(val);
     setSelectedCity(null);

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
           console.error("fetch failed", e);
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
     setCitySearch(place.display_name);
     setCitySuggestions([]);
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setFormError("");

    if (newTripName.length < 3) return setFormError("Title must be at least 3 characters.");
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (!startDate || !endDate) return setFormError("Start and End dates are required.");
    if (eDate < sDate) return setFormError("End date cannot be before start date.");
    if (Number(newTripBudget) <= 0) return setFormError("Budget must be greater than 0.");
    
    let finalCity = selectedCity;
    if (!finalCity && citySearch) {
       finalCity = { name: citySearch, lat: 19.0760, lng: 72.8777 }; // fallback
    } else if (!finalCity) {
       return setFormError("City is required.");
    }

    setIsSubmitting(true);

    try {
      const numDays = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24)) + 1;
      const daysArray = Array.from({ length: numDays }, (_, i) => {
         const dayDate = new Date(sDate);
         dayDate.setDate(dayDate.getDate() + i);
         return {
           dayNumber: i + 1,
           date: Timestamp.fromDate(dayDate),
           places: []
         };
      });

      const today = new Date();
      let status = "planning";
      if (today >= sDate && today <= eDate) status = "active";
      if (today > eDate) status = "completed";

      const tripParams = {
        userId: user.uid,
        title: newTripName,
        name: newTripName, // backup
        city: finalCity.name,
        startDate: Timestamp.fromDate(sDate),
        endDate: Timestamp.fromDate(eDate),
        totalBudget: Number(newTripBudget),
        spentAmount: 0,
        status: status,
        days: daysArray,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "trips"), tripParams);
      
      setIsCreatingTrip(false);
      // Reset
      setNewTripName(""); setCitySearch(""); setSelectedCity(null);
      setNewTripBudget(""); setStartDate(""); setEndDate("");
      setIsSubmitting(false);

      router.push(`/dashboard/trips/${docRef.id}`);

    } catch (error) {
      console.error(error);
      setFormError("Error creating trip in database.");
      setIsSubmitting(false);
    }
  };

  const deleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this trip?")) {
      await deleteDoc(doc(db, "trips", tripId));
    }
  };

  const filteredTrips = trips.filter(t => activeTab === "All" || t.status?.toLowerCase() === activeTab.toLowerCase());

  if (loading || !user) return <div className="p-8 text-center text-zinc-500 font-medium">Loading Trips...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">My Trips</h2>
        </div>
        <button 
          onClick={() => setIsCreatingTrip(true)}
          className="px-5 py-2.5 bg-[#534AB7] text-white font-bold rounded-xl shadow-sm hover:bg-[#433B9B] transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" /> New trip
        </button>
      </div>

      {/* Creation Modal / Form Inline */}
      <AnimatePresence>
        {isCreatingTrip && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-white dark:bg-zinc-950 rounded-2xl border border-[#534AB7]/30 shadow-md mb-6 w-full overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                 <Plane className="w-5 h-5 text-[#534AB7]"/> Plan a New Trip
              </h3>
              {formError && <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>}
              
              <form onSubmit={handleCreateTrip} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <input 
                  type="text" placeholder="Trip title..." value={newTripName} onChange={e => setNewTripName(e.target.value)} required minLength={3}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold" 
                />
                
                <div className="relative group">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-zinc-400" />
                  <input 
                    type="text" placeholder="City..." value={citySearch} onChange={handleCitySearch} required
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-sm font-bold" 
                  />
                  {isSearchingCity && <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3.5 text-zinc-400" />}
                  {citySuggestions.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                        {citySuggestions.map((place, idx) => (
                           <div key={idx} onClick={() => selectCityFromDropdown(place)} className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                             <div className="text-sm font-bold truncate">{place.display_name.split(',')[0]}</div>
                           </div>
                        ))}
                     </div>
                  )}
                </div>

                <div className="flex gap-4">
                   <div className="flex-1">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Start Date</label>
                     <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                   </div>
                   <div className="flex-1">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">End Date</label>
                     <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                   </div>
                </div>

                <div className="flex gap-4 items-end">
                   <div className="flex-1">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Total Budget</label>
                     <input type="number" placeholder="₹ Amount" value={newTripBudget} onChange={e => setNewTripBudget(e.target.value)} required className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                   </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <button type="button" onClick={() => setIsCreatingTrip(false)} className="px-6 py-2.5 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#534AB7] text-white font-bold rounded-xl flex items-center justify-center disabled:opacity-50">
                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create trip"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
         {["All", "Planning", "Active", "Completed"].map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeTab === tab ? 'bg-[#534AB7] text-white' : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      {trips.length === 0 ? (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl p-16 flex flex-col items-center justify-center text-center border border-zinc-200 dark:border-zinc-800 shadow-sm mt-8">
           <p className="text-zinc-900 dark:text-white font-extrabold text-[15px]">No trips yet. Start planning your first adventure.</p>
           <button onClick={() => setIsCreatingTrip(true)} className="mt-4 bg-[#534AB7] text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-sm">Create trip</button>
        </div>
      ) : filteredTrips.length === 0 ? (
         <div className="p-8 text-center text-zinc-500 font-medium">No {activeTab.toLowerCase()} trips found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTrips.map(trip => {
             const spendRatio = trip.totalBudget ? (trip.spentAmount||0) / trip.totalBudget : 0;
             let budgetColor = "bg-[#1D9E75]";
             if (spendRatio >= 0.8 && spendRatio < 1) budgetColor = "bg-amber-500";
             if (spendRatio >= 1) budgetColor = "bg-red-500";
             
             const start = trip.startDate?.seconds ? new Date(trip.startDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
             const end = trip.endDate?.seconds ? new Date(trip.endDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
             const statusColor = trip.status === 'planning' ? 'bg-[#534AB7]/10 text-[#534AB7]' : (trip.status === 'completed' ? 'bg-zinc-200 text-zinc-600' : 'bg-[#1D9E75]/10 text-[#1D9E75]');

             return (
              <div key={trip.id} className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between h-48 relative overflow-hidden group hover:border-[#534AB7]/30 transition-colors">
                
                <div className="flex justify-between items-start mb-1">
                   <h4 className="text-[16px] font-bold text-zinc-900 dark:text-white truncate pb-1">
                     {trip.city?.name || trip.city || trip.title}
                   </h4>
                   <button onClick={(e) => deleteTrip(trip.id, e)} className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                     <Trash2 className="w-4 h-4"/>
                   </button>
                </div>
                <p className="text-zinc-500 text-[13px] font-medium">{trip.title}</p>
                <p className="text-zinc-400 text-xs font-semibold mb-3">{start} &ndash; {end}</p>
                
                <div className={`self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${statusColor} mb-4`}>
                   {trip.status}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 relative z-10 w-full">
                   <div className="flex-1 mr-6">
                     <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                       <div className={`${budgetColor} h-full`} style={{ width: `${Math.min(spendRatio * 100, 100)}%` }}></div>
                     </div>
                   </div>
                   <Link href={`/dashboard/trips/${trip.id}`} className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-bold text-[11px] uppercase tracking-widest rounded transition-colors hover:bg-zinc-200">
                     View
                   </Link>
                </div>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
