"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, ChevronRight, X, MessageSquare, Clock } from "lucide-react";

export default function GuideView({ user }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
         <div>
           <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Guide dashboard</h2>
           <p className="text-zinc-500 text-sm mt-1 font-medium">Good morning, Priya — you have 2 new booking requests</p>
         </div>
         <button className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-sm transition-colors">
            Edit profile
         </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">This month earnings</h3>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mb-3">₹14,200</div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-1.5">
            <div className="bg-[#0F6E56] h-full transition-all" style={{ width: "71%" }}></div>
          </div>
          <div className="text-[10px] font-bold text-zinc-500">71% of ₹20k goal</div>
        </div>
        
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Bookings this month</h3>
            <div className="text-2xl font-black text-zinc-900 dark:text-white mb-3">18</div>
          </div>
          <div className="text-[11px] font-bold text-[#0F6E56]">+4 vs last month</div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Avg. rating</h3>
            <div className="text-2xl font-black text-zinc-900 dark:text-white mb-3">4.9</div>
          </div>
          <div className="flex gap-0.5">
             {[...Array(5)].map((_, i) => (
               <Star key={i} className="w-3.5 h-3.5 text-[#0F6E56] fill-[#0F6E56]" />
             ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
           <div>
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Total tours done</h3>
            <div className="text-2xl font-black text-zinc-900 dark:text-white mb-3">86</div>
          </div>
          <div className="text-[11px] font-bold text-zinc-500">Since Jan 2024</div>
        </div>
      </div>

      {/* 2-COLUMN GRID */}
      <div className="grid lg:grid-cols-2 gap-8 pt-4">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
           <h3 className="text-sm font-bold text-zinc-900 dark:text-white">New booking requests</h3>
           
           <div className="space-y-4">
             {/* Request 1 */}
             <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm relative">
                <div className="absolute top-5 right-5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Pending
                </div>
                
                <div className="flex gap-4 items-start mb-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm shrink-0">AM</div>
                   <div className="pr-16">
                     <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Aman Mehta</h4>
                     <p className="text-xs font-semibold text-zinc-500 mb-0.5">Dharavi deep dive · Sat 19 Apr, 9am</p>
                     <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-2">2 people · <span className="font-bold">₹2,400 total</span></p>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 mb-2 gap-3">
                   <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Requested 10 mins ago</div>
                   <div className="flex gap-2 w-full sm:w-auto">
                      <button className="px-4 py-2 bg-[#E1F5EE] dark:bg-[#0F6E56]/20 text-[#0F6E56] dark:text-[#E1F5EE] hover:bg-[#cbf0e4] font-bold text-xs rounded-lg transition-colors flex-1 sm:flex-none text-center">Accept</button>
                      <button className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors flex-1 sm:flex-none text-center">Decline</button>
                      <button className="px-4 py-2 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-bold text-xs rounded-lg transition-colors flex-1 sm:flex-none text-center border border-transparent hover:border-zinc-200">Message</button>
                   </div>
                </div>
             </div>

             {/* Request 2 */}
             <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm relative">
                <div className="absolute top-5 right-5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Pending
                </div>
                
                <div className="flex gap-4 items-start mb-4">
                   <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-sm shrink-0">LW</div>
                   <div className="pr-16">
                     <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Lisa Wong</h4>
                     <p className="text-xs font-semibold text-zinc-500 mb-0.5">Street food trail · Sun 20 Apr, 11am</p>
                     <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-2">4 people · <span className="font-bold">₹3,200 total</span></p>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 mb-2 gap-3">
                   <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Requested 1 hr ago</div>
                   <div className="flex gap-2 w-full sm:w-auto">
                      <button className="px-4 py-2 bg-[#E1F5EE] dark:bg-[#0F6E56]/20 text-[#0F6E56] dark:text-[#E1F5EE] hover:bg-[#cbf0e4] font-bold text-xs rounded-lg transition-colors flex-1 sm:flex-none text-center">Accept</button>
                      <button className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors flex-1 sm:flex-none text-center">Decline</button>
                      <button className="px-4 py-2 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-bold text-xs rounded-lg transition-colors flex-1 sm:flex-none text-center border border-transparent hover:border-zinc-200">Message</button>
                   </div>
                </div>
             </div>
           </div>

           <h3 className="text-sm font-bold text-zinc-900 dark:text-white pt-4">Upcoming confirmed</h3>
           <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                 <div>
                   <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Rohan K. · <span className="font-semibold text-zinc-500">Sunrise at Worli</span></h4>
                   <p className="text-xs text-zinc-500 font-medium mt-0.5">Mon 21, 6:00 AM</p>
                 </div>
                 <div className="bg-[#E1F5EE] dark:bg-[#0F6E56]/20 text-[#0F6E56] dark:text-[#E1F5EE] px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                   Confirmed
                 </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                 <div>
                   <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Sarah T. · <span className="font-semibold text-zinc-500">Street food trail</span></h4>
                   <p className="text-xs text-zinc-500 font-medium mt-0.5">Wed 23, 7:00 PM</p>
                 </div>
                 <div className="bg-[#E1F5EE] dark:bg-[#0F6E56]/20 text-[#0F6E56] dark:text-[#E1F5EE] px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                   Confirmed
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
           
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Availability — April</h3>
           </div>
           
           {/* Calendar */}
           <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm">
             <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-500 mb-3">
                {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
             </div>
             
             <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold">
                {/* 1st to 30th simplified array */}
                <div className="py-2"></div><div className="py-2"></div>
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  let bg = "bg-[#E1F5EE] dark:bg-[#0F6E56]/20 text-[#0F6E56] dark:text-[#E1F5EE] rounded hover:opacity-80 cursor-pointer"; // Available (teal light)
                  if (day === 18) bg = "bg-[#0F6E56] text-white rounded font-bold"; // Today (teal filled)
                  else if ([19,21,23].includes(day)) bg = "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded"; // Booked
                  else if ([12,13,26,27].includes(day)) bg = "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded cursor-not-allowed"; // Unavailable (gray)

                  return <div key={day} className={`py-2 transition-colors ${bg}`}>{day}</div>
                })}
             </div>

             <div className="flex gap-4 mt-5 text-[10px] font-bold text-zinc-500 justify-center">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#E1F5EE] dark:bg-[#0F6E56]/20 rounded-sm"></div> Available</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#0F6E56] rounded-sm"></div> Today</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/40 rounded-sm"></div> Booked</div>
             </div>
           </div>

           {/* Earnings Breakdown */}
           <h3 className="text-sm font-bold text-zinc-900 dark:text-white pt-2">Earnings breakdown</h3>
           <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm">
             <div className="space-y-4">
                
                <div>
                   <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
                     <span>Dharavi deep dive</span>
                     <span>₹7,200</span>
                   </div>
                   <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-amber-400 h-full" style={{ width: "51%" }}></div>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
                     <span>Street food trail</span>
                     <span>₹4,800</span>
                   </div>
                   <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-indigo-400 h-full" style={{ width: "34%" }}></div>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
                     <span>Sunrise at Worli</span>
                     <span>₹2,200</span>
                   </div>
                   <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-purple-400 h-full" style={{ width: "15%" }}></div>
                   </div>
                </div>

             </div>

             <div className="mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-end">
               <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total this month</div>
               <div className="text-xl font-bold text-[#0F6E56]">₹14,200</div>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
