"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, MapPin, UserSquare2, CheckCircle2, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function GuideView({ user }) {
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Monitor trips assigned directly to this guide ID
    const q = query(collection(db, "trips"), where("guideId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignedTrips(tripsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const activeCount = assignedTrips.filter(t => t.status === 'ongoing').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
         <div>
           <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Guide Overview</h2>
           <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your upcoming tours and connect with travelers.</p>
         </div>
         <div className="flex gap-4">
           <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border border-teal-100 dark:border-teal-900/50">
                 <span className="text-xl font-black text-teal-600 dark:text-teal-400">{assignedTrips.length}</span>
             </div>
             <div>
               <span className="text-xs tracking-widest uppercase text-zinc-500 font-bold block mb-0.5">Total</span>
               <span className="text-zinc-900 dark:text-white font-black block leading-tight">Requests</span>
             </div>
           </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        
        {/* Main Schedule Column */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
             <Calendar className="w-4 h-4 text-primary" /> Active Assignments
           </h3>
           
           <div className="space-y-4">
             {loading ? (
               <div className="w-full h-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl animate-pulse" />
             ) : assignedTrips.length === 0 ? (
               <div className="bg-zinc-50 dark:bg-zinc-900/50 p-12 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center min-h-[250px]">
                 <Navigation className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                 <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">No tours assigned right now.</p>
                 <p className="text-sm text-zinc-500 mt-2 font-medium">When tourists request your expertise, they will appear here.</p>
               </div>
             ) : (
               assignedTrips.map(trip => (
                 <motion.div whileHover={{ y: -2 }} key={trip.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex flex-col sm:flex-row justify-between gap-4">
                   <div className="flex-1">
                       <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md tracking-widest ${trip.status === 'ongoing' ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                            {trip.status}
                          </span>
                       </div>
                       <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{trip.name}</h4>
                       <p className="text-sm text-zinc-500 capitalize flex items-center gap-1.5 mt-2 font-medium">
                         <MapPin className="w-4 h-4 text-zinc-400" /> {trip.city}
                       </p>
                   </div>
                   
                   <div className="flex sm:flex-col gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 justify-center items-end shrink-0 w-full sm:w-auto">
                     <button className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors shadow-sm">Review Itinerary</button>
                     <button className="w-full sm:w-auto px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Message</button>
                   </div>
                 </motion.div>
               ))
             )}
           </div>
        </div>

        {/* Sidebar Alerts / Stats */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start gap-4 hover:border-teal-200 dark:hover:border-teal-900/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/50">
                <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-base">Status Active</h4>
                <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed font-medium">Your profile is visible in search. Tourists can send you booking requests matching your destination.</p>
              </div>
           </div>

           <div className="bg-teal-50/50 dark:bg-teal-900/10 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/30">
              <h4 className="font-bold text-teal-800 dark:text-teal-300 text-sm mb-3">Tips for Guides</h4>
              <ul className="text-sm text-teal-700 dark:text-teal-400 space-y-3 font-medium">
                 <li className="flex gap-2"><span className="text-primary">•</span> Keep a close eye on budget limits when recommending restaurants.</li>
                 <li className="flex gap-2"><span className="text-primary">•</span> Use direct messaging to coordinate meetups safely.</li>
              </ul>
           </div>
        </div>
      </div>

    </div>
  );
}
