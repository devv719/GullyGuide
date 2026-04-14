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
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user.displayName?.split(" ")[0]}</h2>
          <p className="text-gray-400 text-sm mt-1">Here's what's happening with your travel plans today.</p>
        </div>
        <button 
          onClick={() => setIsCreatingTrip(true)}
          className="px-5 py-2.5 bg-[#4F46E5] text-white font-medium rounded-xl shadow-sm hover:bg-[#4338ca] transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" /> New Trip
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-[#111827] rounded-2xl p-6 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <p className="text-gray-400 font-medium text-sm">Total Planned</p>
             <Plane className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white mt-4">{totalTrips}</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-6 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <p className="text-gray-400 font-medium text-sm">Upcoming Bookings</p>
             <CalendarIcon className="w-5 h-5 text-[#10B981]" />
          </div>
          <p className="text-3xl font-bold text-white mt-4">{upcomingCount}</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-6 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <p className="text-gray-400 font-medium text-sm">Total Expenses Logged</p>
             <Wallet className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <p className="text-3xl font-bold text-white mt-4">₹{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Creation Modal / Form Inline */}
      <AnimatePresence>
        {isCreatingTrip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.98, height: 0 }}
            className="bg-[#111827] rounded-2xl border border-[#1F2937] overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Start Planning</h3>
              <form onSubmit={handleCreateTrip} className="flex flex-col md:flex-row gap-4 w-full">
                <input 
                  type="text" placeholder="Trip Name (e.g. Kyoto Cherry Blossoms)" value={newTripName} onChange={e => setNewTripName(e.target.value)} required
                  className="flex-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-4 py-2.5 text-gray-200 placeholder:text-gray-600 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all text-sm" 
                />
                <input 
                  type="text" placeholder="Destination City" value={newTripCity} onChange={e => setNewTripCity(e.target.value)} required
                  className="w-full md:w-48 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-4 py-2.5 text-gray-200 placeholder:text-gray-600 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all text-sm" 
                />
                <input 
                  type="number" placeholder="Budget (₹)" value={newTripBudget} onChange={e => setNewTripBudget(e.target.value)} required
                  className="w-full md:w-40 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-4 py-2.5 text-gray-200 placeholder:text-gray-600 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all text-sm" 
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2.5 bg-[#10B981] text-white font-medium rounded-xl shadow-sm hover:bg-[#059669] transition-colors text-sm">Save</button>
                  <button type="button" onClick={() => setIsCreatingTrip(false)} className="px-6 py-2.5 bg-[#1F2937] text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-colors text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Board */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">My Trips</h3>
        
        {loadingTrips ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-32 bg-[#111827] rounded-2xl border border-[#1F2937] animate-pulse"></div>
            <div className="h-32 bg-[#111827] rounded-2xl border border-[#1F2937] animate-pulse"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="border border-dashed border-[#1F2937] rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-[#111827]/50">
             <MapPin className="w-12 h-12 text-gray-600 mb-3" />
             <p className="text-gray-400 font-medium">No trips planned yet.</p>
             <p className="text-gray-500 text-sm mt-1 mb-4">Create your first itinerary to start tracking.</p>
             <button onClick={() => setIsCreatingTrip(true)} className="text-[#4F46E5] font-semibold text-sm hover:underline">Plan a Trip</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <motion.div 
                key={trip.id}
                whileHover={{ y: -2 }}
                onClick={() => router.push(`/dashboard/trips/${trip.id}`)}
                className="bg-[#111827] rounded-2xl p-5 border border-[#1F2937] hover:border-[#4F46E5] cursor-pointer transition-all shadow-sm hover:shadow-md group flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${trip.status === 'upcoming' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#1F2937] text-gray-400'}`}>
                       {trip.status}
                     </span>
                     <button onClick={(e) => deleteTrip(trip.id, e)} className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                  </div>
                  <h4 className="text-lg font-bold text-gray-100 truncate">{trip.name}</h4>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1 capitalize font-medium">
                    <MapPin className="w-4 h-4 text-gray-500" /> {trip.city}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-[#1F2937] pt-3 mt-4">
                   <div className="text-sm font-semibold text-gray-300">
                     <span className="text-gray-500 font-normal mr-2">Budget</span>
                     ₹{trip.budget?.toLocaleString()}
                   </div>
                   <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#4F46E5] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
