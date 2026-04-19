"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Compass, Navigation, Plane, Wallet, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "@/lib/LocationContext";
import { useRouter } from "next/navigation";

export default function TouristView({ user }) {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  
  const { currentCity, requestLiveLocation, loadingLocation, locationPermission } = useLocation();

  useEffect(() => {
    if (!user?.uid) return;
    const fetchTrips = async () => {
      try {
        const q = query(collection(db, "trips"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrips(tripsData);
      } catch (err) {
        console.error(err);
      }
      setLoadingTrips(false);
    };
    fetchTrips();
  }, [user.uid]);

  const { totalTrips, totalSpent, upcomingCount, lastActiveTrip } = useMemo(() => {
    let spent = 0;
    let upcoming = 0;
    let lastMatched = null;

    trips.forEach(t => {
      if (t.expenses) spent += t.expenses.reduce((acc, curr) => acc + curr.amount, 0);
      if (t.status === 'upcoming' || t.status === 'pending') {
         upcoming += 1;
         if (!lastMatched) lastMatched = t;
      }
    });
    
    // Sort logic could enhance this, but for now fallback to the first upcoming found
    if (!lastMatched && trips.length > 0) lastMatched = trips[0];

    return { totalTrips: trips.length, totalSpent: spent, upcomingCount: upcoming, lastActiveTrip: lastMatched };
  }, [trips]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Dynamic Header & Location */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Welcome back, {user.displayName?.split(" ")[0]}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-sm">
               <MapPin className="w-4 h-4 text-primary" />
               Exploring {currentCity || "Unknown"}
            </span>
            
            {locationPermission !== "granted" && (
                <button 
                  onClick={requestLiveLocation} 
                  disabled={loadingLocation}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors ml-2 disabled:opacity-50"
                >
                  {loadingLocation ? <Loader2 className="w-3 h-3 animate-spin"/> : <Navigation className="w-3 h-3"/>}
                  Use live location
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Aggregate Metrics (Clean Style) */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900/80 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-tight">Total<br/>Planned</p>
             <Plane className="w-6 h-6 text-indigo-500 opacity-80" />
          </div>
          <p className="text-4xl font-extrabold text-zinc-900 dark:text-white mt-6">{loadingTrips ? "-" : totalTrips}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900/80 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-tight">Upcoming<br/>Bookings</p>
             <Compass className="w-6 h-6 text-teal-500 opacity-80" />
          </div>
          <p className="text-4xl font-extrabold text-zinc-900 dark:text-white mt-6">{loadingTrips ? "-" : upcomingCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900/80 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-tight">Total<br/>Spent</p>
             <Wallet className="w-6 h-6 text-amber-500 opacity-80" />
          </div>
          <p className="text-4xl font-extrabold text-zinc-900 dark:text-white mt-6 tabular-nums">₹{loadingTrips ? "-" : totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Smart Card Section */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-8 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">Insights & Actions</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
        {/* Continue Trip Card */}
        <div 
          onClick={() => lastActiveTrip ? router.push(`/dashboard/trips/${lastActiveTrip.id}`) : router.push("/dashboard/trips")}
          className="bg-primary hover:bg-primary/90 text-white rounded-2xl p-6 shadow-md transition-all cursor-pointer flex flex-col justify-between h-48 active:scale-[0.98]"
        >
           <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md">
               {lastActiveTrip ? "Resume Planning" : "Start Fresh"}
             </span>
           </div>
           <div>
             <h4 className="text-xl font-extrabold truncate mb-1">{lastActiveTrip ? lastActiveTrip.name : "Plan a New Trip"}</h4>
             <p className="text-sm font-medium opacity-80">{lastActiveTrip ? `Editing ${lastActiveTrip.city}` : "Discover new destinations."}</p>
             <div className="mt-4 w-10 h-10 bg-white/20 rounded-full flex justify-center items-center backdrop-blur-sm">
                <ArrowRight className="w-5 h-5 text-white" />
             </div>
           </div>
        </div>

        {/* Explore Nearby Context Card */}
        <div 
          onClick={() => router.push("/discover")}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl p-6 shadow-md transition-all cursor-pointer flex flex-col justify-between h-48 active:scale-[0.98]"
        >
           <div className="flex justify-between items-start mb-2">
             <span className="text-xs font-bold uppercase tracking-widest opacity-70">
               Explore
             </span>
           </div>
           <div>
             <h4 className="text-xl font-extrabold mb-1">Experiences in {currentCity}</h4>
             <p className="text-sm font-medium opacity-80">Check out what locals are recommending near you.</p>
             <div className="mt-4 flex -space-x-2">
               <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center font-bold text-[10px] text-zinc-900 dark:text-white">RK</div>
               <div className="w-8 h-8 rounded-full bg-primary border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center font-bold text-[10px] text-white">AJ</div>
               <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-zinc-900/20 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center font-bold text-[10px] backdrop-blur-sm">+3</div>
             </div>
           </div>
        </div>

      </div>

    </div>
  );
}
