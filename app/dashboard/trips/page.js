"use client";

import { useTrips } from "@/hooks/useTrips";
import { useState, useRef, useCallback, useEffect } from "react";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { MapPin, Plus, ArrowRight, Trash2, Loader2, Plane, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { dropdownVariant, listItemVariant, gridStaggerContainer, gridCardVariant } from "@/lib/animations";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

// ── Hardcoded Indian cities fallback (zero API calls) ──
const INDIAN_CITIES = [
  { display_name: "Mumbai, Maharashtra, India", lat: "19.0760", lon: "72.8777" },
  { display_name: "Delhi, India", lat: "28.6139", lon: "77.2090" },
  { display_name: "Bangalore, Karnataka, India", lat: "12.9716", lon: "77.5946" },
  { display_name: "Goa, India", lat: "15.2993", lon: "74.1240" },
  { display_name: "Jaipur, Rajasthan, India", lat: "26.9124", lon: "75.7873" },
  { display_name: "Hyderabad, Telangana, India", lat: "17.3850", lon: "78.4867" },
  { display_name: "Kolkata, West Bengal, India", lat: "22.5726", lon: "88.3639" },
  { display_name: "Pune, Maharashtra, India", lat: "18.5204", lon: "73.8567" },
  { display_name: "Kochi, Kerala, India", lat: "9.9312", lon: "76.2673" },
  { display_name: "Varanasi, Uttar Pradesh, India", lat: "25.3176", lon: "83.0064" },
  { display_name: "Udaipur, Rajasthan, India", lat: "24.5854", lon: "73.7125" },
  { display_name: "Agra, Uttar Pradesh, India", lat: "27.1767", lon: "78.0081" },
  { display_name: "Shimla, Himachal Pradesh, India", lat: "31.1048", lon: "77.1734" },
  { display_name: "Manali, Himachal Pradesh, India", lat: "32.2396", lon: "77.1887" },
  { display_name: "Rishikesh, Uttarakhand, India", lat: "30.0869", lon: "78.2676" },
  { display_name: "Amritsar, Punjab, India", lat: "31.6340", lon: "74.8723" },
  { display_name: "Mysore, Karnataka, India", lat: "12.2958", lon: "76.6394" },
  { display_name: "Pondicherry, India", lat: "11.9416", lon: "79.8083" },
  { display_name: "Darjeeling, West Bengal, India", lat: "27.0410", lon: "88.2663" },
  { display_name: "Ooty, Tamil Nadu, India", lat: "11.4102", lon: "76.6950" },
];

export default function TripsRoutingHub() {
  const { user } = useAuth();
  const router = useRouter();
  const { trips, loading } = useTrips();
  const [activeTab, setActiveTab] = useState("All");
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [newTripName, setNewTripName] = useState("");
  const [newTripBudget, setNewTripBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchTimeoutRef = useRef(null);
  const searchCacheRef = useRef({});
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) { setCitySuggestions([]); setHighlightedIndex(-1); } };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return <>{text.slice(0, idx)}<span className="text-accent font-bold">{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
  };

  const handleCitySearch = (e) => {
    const val = e.target.value; setCitySearch(val); setSelectedCity(null); setHighlightedIndex(-1);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!val.trim() || val.trim().length < 3) { setCitySuggestions([]); return; }
    const cacheKey = val.trim().toLowerCase();
    if (searchCacheRef.current[cacheKey]) { setCitySuggestions(searchCacheRef.current[cacheKey]); return; }
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingCity(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5`, { headers: { "User-Agent": "GullyGuide/1.0 (student-guide-platform)" } });
        if (res.status === 429) throw new Error("Rate limited");
        const data = await res.json();
        if (data?.length > 0) { searchCacheRef.current[cacheKey] = data; setCitySuggestions(data); }
        else { const local = INDIAN_CITIES.filter(c => c.display_name.toLowerCase().includes(cacheKey)); setCitySuggestions(local); }
      } catch { const local = INDIAN_CITIES.filter(c => c.display_name.toLowerCase().includes(cacheKey)); setCitySuggestions(local); }
      setIsSearchingCity(false);
    }, 400);
  };

  const handleCityKeyDown = (e) => {
    if (citySuggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex(prev => Math.min(prev + 1, citySuggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex(prev => Math.max(prev - 1, 0)); }
    else if (e.key === "Enter" && highlightedIndex >= 0) { e.preventDefault(); selectCityFromDropdown(citySuggestions[highlightedIndex]); }
    else if (e.key === "Escape") { setCitySuggestions([]); setHighlightedIndex(-1); }
  };

  const selectCityFromDropdown = (place) => { setSelectedCity({ name: place.display_name.split(',')[0], lat: parseFloat(place.lat), lng: parseFloat(place.lon) }); setCitySearch(place.display_name.split(',')[0]); setCitySuggestions([]); setHighlightedIndex(-1); };

  const handleCreateTrip = async (e) => {
    e.preventDefault(); setFormError("");
    if (newTripName.length < 3) return setFormError("Title must be at least 3 characters.");
    const sDate = new Date(startDate); const eDate = new Date(endDate);
    if (!startDate || !endDate) return setFormError("Start and End dates are required.");
    if (eDate < sDate) return setFormError("End date cannot be before start date.");
    if (Number(newTripBudget) <= 0) return setFormError("Budget must be greater than 0.");
    let finalCity = selectedCity;
    if (!finalCity && citySearch) { const match = INDIAN_CITIES.find(c => c.display_name.toLowerCase().includes(citySearch.toLowerCase())); finalCity = match ? { name: match.display_name.split(',')[0], lat: parseFloat(match.lat), lng: parseFloat(match.lon) } : { name: citySearch, lat: 19.0760, lng: 72.8777 }; }
    else if (!finalCity) return setFormError("City is required.");
    setIsSubmitting(true);
    try {
      const numDays = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24)) + 1;
      const daysArray = Array.from({ length: numDays }, (_, i) => { const d = new Date(sDate); d.setDate(d.getDate() + i); return { dayNumber: i + 1, date: Timestamp.fromDate(d), places: [] }; });
      const today = new Date(); let status = "planning"; if (today >= sDate && today <= eDate) status = "active"; if (today > eDate) status = "completed";
      const docRef = await addDoc(collection(db, "trips"), { userId: user.uid, title: newTripName, name: newTripName, city: finalCity.name, startDate: Timestamp.fromDate(sDate), endDate: Timestamp.fromDate(eDate), totalBudget: Number(newTripBudget), spentAmount: 0, status, days: daysArray, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      setIsCreatingTrip(false); setNewTripName(""); setCitySearch(""); setSelectedCity(null); setNewTripBudget(""); setStartDate(""); setEndDate(""); setIsSubmitting(false);
      router.push(`/dashboard/trips/${docRef.id}`);
    } catch (error) { console.error(error); setFormError("Error creating trip."); setIsSubmitting(false); }
  };

  const deleteTrip = async (tripId, e) => { e.stopPropagation(); if(confirm("Delete this trip?")) { try { await deleteDoc(doc(db, "trips", tripId)); } catch {} } };
  const filteredTrips = trips.filter(t => activeTab === "All" || t.status?.toLowerCase() === activeTab.toLowerCase());

  if (loading || !user) return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="h-10 bg-muted/60 w-1/3 border-2 border-dashed border-foreground/10" style={{ borderRadius: WB }} />
      <div className="grid md:grid-cols-2 gap-6">{[1,2,3,4].map(i => (<div key={i} className="h-48 bg-muted/30 border-2 border-dashed border-foreground/10" style={{ borderRadius: WB }} />))}</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-dashed border-foreground/20 pb-4">
        <h2 className="text-3xl font-heading font-bold text-foreground">My Trips</h2>
        <button onClick={() => setIsCreatingTrip(true)} className="px-5 py-2.5 bg-accent text-white font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center gap-2" style={{ borderRadius: WB }}>
          <Plus className="w-5 h-5" /> New trip
        </button>
      </div>

      {/* Creation Form */}
      <AnimatePresence>
        {isCreatingTrip && (
          <motion.div initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-paper border-[3px] border-foreground shadow-sketch mb-6 w-full overflow-hidden tape-decoration mt-3" style={{ borderRadius: WB2 }}>
            <div className="p-6">
              <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2"><Plane className="w-5 h-5 text-accent" strokeWidth={2.5}/> Plan a New Trip</h3>
              {formError && <div className="mb-4 text-base font-body font-bold text-accent bg-accent/5 p-3 border-2 border-accent" style={{ borderRadius: WB }}>{formError}</div>}
              <form onSubmit={handleCreateTrip} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Trip title..." value={newTripName} onChange={e => setNewTripName(e.target.value)} required minLength={3} className="w-full bg-background border-2 border-foreground px-4 py-3 text-lg font-body focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-foreground/30" style={{ borderRadius: WB }} />
                <div className="relative" ref={dropdownRef}>
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-foreground/30" strokeWidth={3} />
                  <input ref={inputRef} type="text" placeholder="Search city (min 3 chars)..." value={citySearch} onChange={handleCitySearch} onKeyDown={handleCityKeyDown} required className="w-full bg-background border-2 border-foreground pl-9 pr-4 py-3 text-lg font-body focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-foreground/30" style={{ borderRadius: WB }} />
                  {isSearchingCity && <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3.5 text-foreground/30" />}
                  <AnimatePresence>
                    {citySuggestions.length > 0 && (
                      <motion.div variants={dropdownVariant} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 right-0 mt-2 bg-paper border-2 border-foreground overflow-hidden z-50 shadow-sketch" style={{ borderRadius: WB2 }}>
                        {citySuggestions.map((place, idx) => (
                          <motion.div key={idx} variants={listItemVariant} onClick={() => selectCityFromDropdown(place)}
                            className={`px-4 py-3 cursor-pointer border-b-2 border-dashed border-foreground/10 last:border-0 flex items-center gap-3 transition-colors ${highlightedIndex === idx ? 'bg-postit' : 'hover:bg-muted/30'}`}>
                            <MapPin className="w-3.5 h-3.5 text-foreground/30 shrink-0" strokeWidth={3} />
                            <div className="text-base font-body truncate">{highlightMatch(place.display_name.split(',')[0], citySearch)}<span className="text-foreground/30 text-sm ml-2">{place.display_name.split(',').slice(1, 3).join(',')}</span></div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1"><label className="text-sm font-heading font-bold text-foreground/50 ml-1">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full bg-background border-2 border-foreground px-4 py-3 text-lg font-body mt-1 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" style={{ borderRadius: WB }} /></div>
                  <div className="flex-1"><label className="text-sm font-heading font-bold text-foreground/50 ml-1">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full bg-background border-2 border-foreground px-4 py-3 text-lg font-body mt-1 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" style={{ borderRadius: WB }} /></div>
                </div>
                <div className="flex gap-4 items-end"><div className="flex-1"><label className="text-sm font-heading font-bold text-foreground/50 ml-1">Total Budget</label><input type="number" placeholder="₹ Amount" value={newTripBudget} onChange={e => setNewTripBudget(e.target.value)} required className="w-full bg-background border-2 border-foreground px-4 py-3 text-lg font-body mt-1 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-foreground/30" style={{ borderRadius: WB }} /></div></div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t-2 border-dashed border-foreground/15 pt-4">
                  <button type="button" onClick={() => setIsCreatingTrip(false)} className="px-6 py-2.5 text-foreground/50 font-body text-lg hover:bg-muted transition-colors border-2 border-foreground/20" style={{ borderRadius: WB }}>Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-accent text-white font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center" style={{ borderRadius: WB }}>{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create trip"}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Filters */}
      <div className="flex gap-2 border-b-2 border-dashed border-foreground/20 pb-4">
        {["All", "Planning", "Active", "Completed"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-base font-body transition-all border-2 border-foreground ${activeTab === tab ? 'bg-foreground text-paper' : 'bg-paper text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]'}`}
            style={{ borderRadius: WB }}>{tab}</button>
        ))}
      </div>

      {/* Trip Cards */}
      {trips.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-paper border-2 border-dashed border-foreground/30 p-16 flex flex-col items-center justify-center text-center mt-8" style={{ borderRadius: WB }}>
          <Plane className="w-10 h-10 text-foreground/20 mb-4" />
          <p className="text-foreground font-heading font-bold text-xl">No trips yet. Start planning your first adventure.</p>
          <button onClick={() => setIsCreatingTrip(true)} className="mt-4 bg-foreground text-paper px-5 py-2.5 font-body text-lg border-2 border-foreground shadow-[2px_2px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" style={{ borderRadius: WB }}>Create trip</button>
        </motion.div>
      ) : filteredTrips.length === 0 ? (
        <div className="p-8 text-center text-foreground/40 font-body text-lg">No {activeTab.toLowerCase()} trips found.</div>
      ) : (
        <motion.div variants={gridStaggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
          {filteredTrips.map((trip, i) => {
            const spendRatio = trip.totalBudget ? (trip.spentAmount||0) / trip.totalBudget : 0;
            let budgetColor = "bg-secondary";
            if (spendRatio >= 0.8 && spendRatio < 1) budgetColor = "bg-postit border-foreground";
            if (spendRatio >= 1) budgetColor = "bg-accent";
            const start = trip.startDate?.seconds ? new Date(trip.startDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
            const end = trip.endDate?.seconds ? new Date(trip.endDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
            const statusColor = trip.status === 'planning' ? 'border-secondary text-secondary bg-secondary/5' : (trip.status === 'completed' ? 'border-foreground/30 text-foreground/50 bg-muted/30' : 'border-accent text-accent bg-accent/5');
            return (
              <motion.div key={trip.id} variants={gridCardVariant}
                className={`bg-paper border-2 border-foreground p-6 flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-sketch transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] ${i % 2 === 0 ? 'rotate-[0.3deg] hover:rotate-0' : '-rotate-[0.3deg] hover:rotate-0'}`}
                style={{ borderRadius: i % 2 === 0 ? WB : WB2 }}
                onClick={() => router.push(`/dashboard/trips/${trip.id}`)}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-lg font-heading font-bold text-foreground truncate pb-1 group-hover:text-accent transition-colors">{trip.city?.name || trip.city || trip.title}</h4>
                  <button onClick={(e) => deleteTrip(trip.id, e)} className="text-foreground/20 hover:text-accent transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                </div>
                <p className="text-foreground/50 text-base font-body">{trip.title}</p>
                <p className="text-foreground/30 text-sm font-body mb-3">{start} &ndash; {end}</p>
                <div className={`self-start px-2 py-0.5 text-xs font-body font-bold uppercase border-2 ${statusColor} mb-4`} style={{ borderRadius: WB }}>{trip.status}</div>
                <div className="flex items-center justify-between border-t-2 border-dashed border-foreground/15 pt-3 relative z-10 w-full">
                  <div className="flex-1 mr-6">
                    <div className="w-full bg-muted/30 h-2 overflow-hidden border border-foreground/20" style={{ borderRadius: WB }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(spendRatio * 100, 100)}%` }} transition={{ duration: 0.8, delay: 0.2 }} className={`${budgetColor} h-full`} />
                    </div>
                  </div>
                  <span className="px-4 py-1.5 bg-foreground text-paper font-body text-sm border-2 border-foreground hover:bg-accent transition-colors" style={{ borderRadius: WB }}>View</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
