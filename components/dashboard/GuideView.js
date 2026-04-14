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
           <h2 className="text-2xl font-bold text-white tracking-tight">Guide Overview</h2>
           <p className="text-gray-400 text-sm mt-1">Manage your upcoming tours and connect with travelers.</p>
         </div>
         <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-[#111827] px-5 py-3 rounded-xl border border-[#1F2937] shadow-sm">
             <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                 <span className="text-lg font-bold text-[#10B981]">{assignedTrips.length}</span>
             </div>
             <div>
               <span className="text-sm tracking-wide text-gray-500 font-medium block">Total</span>
               <span className="text-gray-200 font-bold block leading-tight">Requests</span>
             </div>
           </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Schedule Column */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
             <Calendar className="w-4 h-4 text-[#4F46E5]" /> Active Assignments
           </h3>
           
           <div className="space-y-4">
             {loading ? (
               <div className="w-full h-32 bg-[#111827] border border-[#1F2937] rounded-2xl animate-pulse" />
             ) : assignedTrips.length === 0 ? (
               <div className="bg-[#111827]/50 p-8 rounded-2xl border border-dashed border-[#1F2937] text-center flex flex-col items-center justify-center min-h-[200px]">
                 <Navigation className="w-10 h-10 text-gray-600 mb-4" />
                 <p className="font-medium text-gray-400">No tours assigned right now.</p>
                 <p className="text-sm text-gray-500 mt-1">When tourists request your expertise, they will appear here.</p>
               </div>
             ) : (
               assignedTrips.map(trip => (
                 <motion.div whileHover={{ y: -2 }} key={trip.id} className="bg-[#111827] p-5 rounded-2xl border border-[#1F2937] shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row justify-between gap-4">
                   <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${trip.status === 'ongoing' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#1F2937] text-gray-400'}`}>
                            {trip.status}
                          </span>
                       </div>
                       <h4 className="text-lg font-bold text-gray-100">{trip.name}</h4>
                       <p className="text-sm text-gray-500 capitalize flex items-center gap-1.5 mt-1 font-medium">
                         <MapPin className="w-4 h-4 text-gray-500" /> {trip.city}
                       </p>
                   </div>
                   
                   <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1F2937] justify-center items-end shrink-0 w-full sm:w-auto">
                     <button className="w-full sm:w-auto px-4 py-2 bg-[#4F46E5] text-white font-medium text-xs rounded-lg hover:bg-[#4338ca] transition-colors shadow-sm">Review Itinerary</button>
                     <button className="w-full sm:w-auto px-4 py-2 border border-[#1F2937] text-gray-300 font-medium text-xs rounded-lg hover:bg-gray-800 transition-colors">Message</button>
                   </div>
                 </motion.div>
               ))
             )}
           </div>
        </div>

        {/* Sidebar Alerts / Stats */}
        <div className="space-y-6">
           <div className="bg-[#111827] p-6 rounded-2xl border border-[#1F2937] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-200 text-sm">Status Active</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Your profile is visible in search. Tourists can send you booking requests matching their destination.</p>
              </div>
           </div>

           <div className="bg-gradient-to-br from-[#4F46E5]/10 to-transparent p-6 rounded-2xl border border-[#4F46E5]/20">
              <h4 className="font-bold text-[#818cf8] text-sm mb-2">Tips for Guides</h4>
              <ul className="text-sm text-gray-400 space-y-3 font-medium">
                 <li className="flex gap-2"><span className="text-[#4F46E5]">•</span> Keep a close eye on budget limits when recommending restaurants.</li>
                 <li className="flex gap-2"><span className="text-[#4F46E5]">•</span> Use direct messaging to coordinate meetups safely.</li>
              </ul>
           </div>
        </div>
      </div>

    </div>
  );
}
