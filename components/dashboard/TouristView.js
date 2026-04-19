"use client";

import { useTrips } from "@/hooks/useTrips";
import { useRouter } from "next/navigation";
import { MapPin, Compass, Navigation, Plane, Wallet, ArrowRight, Loader2, Sparkles, Map } from "lucide-react";
import { useLocation } from "@/lib/LocationContext";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function TouristView({ user }) {
  const router = useRouter();
  const { role } = useAuth();
  
  // Route Protection
  useEffect(() => {
    if (role === 'guide') {
       router.replace("/dashboard");
    }
  }, [role, router]);

  const { currentCity, requestLiveLocation, loadingLocation, locationPermission } = useLocation();
  const { trips, loading, totalPlanned, totalSpent, totalBudget, upcomingTrips } = useTrips();

  const remainingBudget = totalBudget - totalSpent;
  const isOverspent = remainingBudget < 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Welcome back, {user?.displayName?.split(" ")[0]}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-sm">
               <MapPin className="w-4 h-4 text-[#534AB7]" />
               Exploring {currentCity || "Mumbai"}
            </span>
            
            {locationPermission !== "granted" && (
                <button 
                  onClick={requestLiveLocation} 
                  disabled={loadingLocation}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#534AB7] hover:opacity-80 transition-opacity ml-2 disabled:opacity-50"
                >
                  {loadingLocation ? <Loader2 className="w-3 h-3 animate-spin"/> : <Navigation className="w-3 h-3"/>}
                  Use live location
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Total planned <Plane className="w-4 h-4 text-[#534AB7]" />
          </p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1.5">{loading ? "-" : totalPlanned}</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 self-start px-2 py-0.5 rounded-md">
            {loading ? "-" : `${trips.filter(t=>t.status==='active').length} active, ${trips.filter(t=>t.status==='planning').length} upcoming`}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Upcoming Bookings <Compass className="w-4 h-4 text-teal-600" />
          </p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1.5">-</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 self-start px-2 py-0.5 rounded-md">
             0 pending approval
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Total spent <Wallet className="w-4 h-4 text-amber-500" />
          </p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1.5 tabular-nums">
            ₹{loading ? "-" : totalSpent.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 self-start px-2 py-0.5 rounded-md">
            across {loading ? "-" : trips.length} trips
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Budget remaining <Map className="w-4 h-4 text-[#534AB7]" />
          </p>
          <p className={`text-3xl font-extrabold mb-1.5 tabular-nums ${isOverspent ? 'text-red-500' : 'text-[#1D9E75]'}`}>
            ₹{loading ? "-" : Math.abs(remainingBudget).toLocaleString("en-IN")}
          </p>
          <p className={`text-[10px] font-bold uppercase tracking-widest self-start px-2 py-0.5 rounded-md ${isOverspent ? 'bg-red-50 text-red-600 dark:bg-red-500/10' : 'bg-green-50 text-green-600 dark:bg-green-500/10'}`}>
            {isOverspent ? 'Over budget' : 'Under budget'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-sm font-medium text-zinc-400">Syncing trips...</div>
      ) : upcomingTrips.length === 0 ? (
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div 
            onClick={() => router.push("/dashboard/trips")}
            className="bg-[#534AB7] hover:bg-[#4a42a3] text-white rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between h-48 active:scale-[0.98]"
          >
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md">
                 Start Fresh
               </span>
             </div>
             <div>
               <h4 className="text-xl font-extrabold truncate mb-1">Plan a New Trip</h4>
               <p className="text-[13px] font-medium opacity-80">Discover new destinations and itineraries.</p>
               <div className="mt-4 w-9 h-9 bg-white/20 rounded-full flex justify-center items-center backdrop-blur-sm">
                  <ArrowRight className="w-4 h-4 text-white" />
               </div>
             </div>
          </div>

          <div 
            onClick={() => router.push("/dashboard/explore")}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between h-48 active:scale-[0.98]"
          >
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                 Explore Local
               </span>
             </div>
             <div>
               <h4 className="text-xl font-extrabold mb-1">Experiences in {currentCity || "Mumbai"}</h4>
               <p className="text-[13px] font-medium opacity-80">Connect with student guides in your city.</p>
               <div className="mt-4 flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center font-bold text-[10px] text-zinc-900 dark:text-white">RK</div>
                 <div className="w-8 h-8 rounded-full bg-[#534AB7] border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center font-bold text-[10px] text-white">AJ</div>
               </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Upcoming trips</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map(trip => {
              const start = trip.startDate?.seconds ? new Date(trip.startDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
              const end = trip.endDate?.seconds ? new Date(trip.endDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
              
              const isPlanning = trip.status === "planning";
              const accentColor = isPlanning ? "bg-[#534AB7]" : "bg-[#0F6E56]";
              const badgeClass = isPlanning ? "bg-[#534AB7]/10 text-[#534AB7]" : "bg-[#0F6E56]/10 text-[#0F6E56]";

              const spendRatio = trip.totalBudget ? (trip.spentAmount||0) / trip.totalBudget : 0;
              let budgetColor = "bg-green-500";
              if (spendRatio >= 0.8 && spendRatio < 1) budgetColor = "bg-amber-500";
              if (spendRatio >= 1) budgetColor = "bg-red-500";

              return (
                <div key={trip.id} className="relative bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col justify-between">
                  {/* Left color bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`}></div>
                  
                  <div className="p-5 pl-6">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                         <h4 className="font-bold text-[15px] text-zinc-900 dark:text-white mb-1.5">{trip.title}</h4>
                         <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                           {trip.city}
                         </span>
                       </div>
                       <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${badgeClass}`}>
                         {trip.status}
                       </div>
                    </div>
                    
                    <p className="text-xs font-semibold text-zinc-400 mb-5">{start} &ndash; {end}</p>

                    <div className="space-y-4">
                       <div>
                         <div className="flex justify-between text-[11px] font-bold text-zinc-500 mb-1">
                           <span>Progress</span>
                           <span>{trip.days?.length ? `Day 1 of ${trip.days.length}` : 'Planning'}</span>
                         </div>
                         <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                           <div className={`${accentColor} h-full`} style={{ width: "20%" }}></div>
                         </div>
                       </div>
                       <div>
                         <div className="flex justify-between text-[11px] font-bold text-zinc-500 mb-1">
                           <span>Budget</span>
                           <span>₹{trip.spentAmount||0} of ₹{trip.totalBudget||0}</span>
                         </div>
                         <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                           <div className={`${budgetColor} h-full`} style={{ width: `${Math.min(spendRatio * 100, 100)}%` }}></div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10">
                    <Link href={`/dashboard/trips/${trip.id}`} className="text-xs font-bold text-[#534AB7] hover:underline flex items-center justify-between w-full">
                       View itinerary <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* AI FAB Placeholder */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#534AB7] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-50">
         <Sparkles className="w-6 h-6" />
      </button>

    </div>
  );
}
