"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Plus, Receipt, Calendar as CalendarIcon, ArrowRight, Plane, Wallet, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TouristView({ user }) {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  // Form State
  const [newTripName, setNewTripName] = useState("");
  const [newTripCity, setNewTripCity] = useState("");
  const [newTripBudget, setNewTripBudget] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "trips"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrips(tripsData);
      setLoadingTrips(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  // Aggregate Metrics
  const { totalTrips, totalSpent, upcomingCount } = useMemo(() => {
    let spent = 0;
    let upcoming = 0;
    trips.forEach(t => {
      if (t.expenses) spent += t.expenses.reduce((acc, curr) => acc + curr.amount, 0);
      if (t.status === 'upcoming' || t.status === 'pending') upcoming += 1;
    });
    return { totalTrips: trips.length, totalSpent: spent, upcomingCount: upcoming };
  }, [trips]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!newTripName || !newTripCity || !newTripBudget) return;

    try {
      await addDoc(collection(db, "trips"), {
        userId: user.uid,
        guideId: null,
        name: newTripName,
        city: newTripCity,
        budget: Number(newTripBudget),
        status: "upcoming",
        dailyPlans: [],
        expenses: [],
        createdAt: serverTimestamp()
      });
      setIsCreatingTrip(false);
      setNewTripName("");
      setNewTripCity("");
      setNewTripBudget("");
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  const deleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this trip?")) {
      await deleteDoc(doc(db, "trips", tripId));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Welcome back, {user.displayName?.split(" ")[0]}</h2>
          <p className="text-zinc-500 font-medium text-sm mt-1">Here's what's happening with your travel plans today.</p>
        </div>
        <button 
          onClick={() => setIsCreatingTrip(true)}
          className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" /> New Trip
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start">
             <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Planned</p>
             <Plane className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-4">{totalTrips}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start">
             <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Upcoming Bookings</p>
             <CalendarIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-4">{upcomingCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start">
             <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Expenses Logged</p>
             <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white mt-4">₹{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Creation Modal / Form Inline */}
      <AnimatePresence>
        {isCreatingTrip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.98, height: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-primary/20 dark:border-primary/30 overflow-hidden shadow-md"
          >
            <div className="p-6 bg-teal-50 dark:bg-teal-900/10">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Start Planning</h3>
              <form onSubmit={handleCreateTrip} className="flex flex-col md:flex-row gap-4 w-full">
                <input 
                  type="text" placeholder="Trip Name (e.g. Kyoto Cherry Blossoms)" value={newTripName} onChange={e => setNewTripName(e.target.value)} required
                  className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" 
                />
                <input 
                  type="text" placeholder="Destination City" value={newTripCity} onChange={e => setNewTripCity(e.target.value)} required
                  className="w-full md:w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" 
                />
                <input 
                  type="number" placeholder="Budget (₹)" value={newTripBudget} onChange={e => setNewTripBudget(e.target.value)} required
                  className="w-full md:w-40 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" 
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors text-sm">Save</button>
                  <button type="button" onClick={() => setIsCreatingTrip(false)} className="px-6 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Board */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">My Trips</h3>
        
        {loadingTrips ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse"></div>
            <div className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900/50">
             <MapPin className="w-12 h-12 text-zinc-400 mb-4" />
             <p className="text-zinc-900 dark:text-white font-bold">No trips planned yet.</p>
             <p className="text-zinc-500 text-sm mt-1 mb-6">Create your first itinerary to start tracking.</p>
             <button onClick={() => setIsCreatingTrip(true)} className="text-primary font-bold hover:underline">Plan a Trip</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <motion.div 
                key={trip.id}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/dashboard/trips/${trip.id}`)}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 cursor-pointer transition-all shadow-sm hover:shadow-lg group flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${trip.status === 'upcoming' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                       {trip.status}
                     </span>
                     <button onClick={(e) => deleteTrip(trip.id, e)} className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white truncate mt-2">{trip.name}</h4>
                  <p className="text-zinc-500 text-sm flex items-center gap-1.5 mt-1 capitalize font-medium">
                    <MapPin className="w-4 h-4 text-zinc-400" /> {trip.city}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
                   <div className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                     <span className="text-zinc-400 font-medium mr-2 text-xs uppercase tracking-widest">Budget</span>
                     ₹{trip.budget?.toLocaleString()}
                   </div>
                   <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors text-zinc-400">
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
