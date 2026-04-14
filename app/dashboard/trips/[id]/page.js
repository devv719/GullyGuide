"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Receipt, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TripDetailPage({ params }) {
  const router = useRouter();
  const tripId = params.id;
  const [activeTrip, setActiveTrip] = useState(null);
  
  const [newPlace, setNewPlace] = useState("");
  const [newExpenseAmt, setNewExpenseAmt] = useState("");
  const [newExpenseCat, setNewExpenseCat] = useState("food");

  useEffect(() => {
    async function fetchTrip() {
      const snap = await getDoc(doc(db, "trips", tripId));
      if (snap.exists()) {
        setActiveTrip({ id: snap.id, ...snap.data() });
      }
    }
    fetchTrip();
  }, [tripId]);

  if (!activeTrip) return <div className="p-8 text-gray-500 animate-pulse">Loading Trip Details...</div>;

  const totalSpent = activeTrip.expenses ? activeTrip.expenses.reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const progressPercent = activeTrip.budget ? Math.min(100, Math.round((totalSpent / activeTrip.budget) * 100)) : 0;
  const progressColor = progressPercent > 90 ? "bg-red-500" : progressPercent > 70 ? "bg-yellow-500" : "bg-[#10B981]"; 

  const handleAddPlace = async (e) => {
    e.preventDefault();
    if (!newPlace) return;
    const updatedPlans = [...(activeTrip.dailyPlans || []), { id: Date.now().toString(), name: newPlace, notes: "" }];
    await updateDoc(doc(db, "trips", activeTrip.id), { dailyPlans: updatedPlans });
    setActiveTrip(prev => ({...prev, dailyPlans: updatedPlans}));
    setNewPlace("");
  };

  const handleRemovePlace = async (placeId) => {
    const updatedPlans = (activeTrip.dailyPlans || []).filter(p => p.id !== placeId);
    await updateDoc(doc(db, "trips", activeTrip.id), { dailyPlans: updatedPlans });
    setActiveTrip(prev => ({...prev, dailyPlans: updatedPlans}));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpenseAmt) return;
    const updatedExpenses = [...(activeTrip.expenses || []), { id: Date.now().toString(), amount: Number(newExpenseAmt), category: newExpenseCat }];
    await updateDoc(doc(db, "trips", activeTrip.id), { expenses: updatedExpenses });
    setActiveTrip(prev => ({...prev, expenses: updatedExpenses}));
    setNewExpenseAmt("");
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <button onClick={() => router.push("/dashboard/trips")} className="text-gray-500 font-medium mb-6 hover:text-gray-200 text-sm flex items-center gap-2 transition-colors">
         ← Back to Trips
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Itinerary Column */}
        <div className="flex-1 bg-[#111827] p-6 lg:p-8 rounded-2xl border border-[#1F2937] shadow-sm relative">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1F2937]">
             <div>
               <h3 className="text-2xl font-bold text-white tracking-tight">{activeTrip.name}</h3>
               <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 capitalize font-medium"><MapPin className="w-4 h-4"/>{activeTrip.city}</p>
             </div>
           </div>
           
           <div className="space-y-6">
             <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Itinerary Map</h4>
             
             <ul className="space-y-4 border-l-2 border-[#1F2937] ml-2 pl-6 relative">
                <AnimatePresence>
                  {(activeTrip.dailyPlans || []).map((plan) => (
                    <motion.li key={plan.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="relative group">
                      <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-[#111827] border-2 border-[#4F46E5] ring-4 ring-[#111827]"></div>
                      <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#1F2937] group-hover:border-gray-700 transition-colors flex justify-between items-center shadow-sm">
                        <p className="font-medium text-gray-200">{plan.name}</p>
                        <button onClick={() => handleRemovePlace(plan.id)} className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
             </ul>

             <form onSubmit={handleAddPlace} className="flex gap-2 pt-2">
               <input type="text" placeholder="Add place (e.g. Golden Gate Bridge)" value={newPlace} onChange={e=>setNewPlace(e.target.value)} className="flex-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-4 py-2.5 text-gray-200 outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition-all" />
               <button type="submit" className="px-4 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-xl shadow-sm transition-colors text-sm font-medium">Add</button>
             </form>
           </div>
        </div>

        {/* Budget Column */}
        <div className="w-full lg:w-[340px] space-y-6">
           <div className="bg-[#111827] p-6 rounded-2xl border border-[#1F2937] shadow-sm">
             <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-6 flex items-center gap-2"><Receipt className="w-4 h-4 text-gray-500"/> Current Financials</h4>
             
             <div className="mb-6">
               <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                 <span>₹{totalSpent.toLocaleString()} Spent</span>
                 <span>₹{activeTrip.budget?.toLocaleString()} Limit</span>
               </div>
               <div className="w-full bg-[#1F2937] h-2.5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className={`h-full ${progressColor} rounded-full`} />
               </div>
               <p className={`text-right text-xs font-semibold mt-2 ${progressPercent > 90 ? 'text-red-400' : 'text-gray-500'}`}>{progressPercent}% Used</p>
             </div>

             <form onSubmit={handleAddExpense} className="flex flex-col gap-3 border-t border-[#1F2937] pt-5">
               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Log an Expense</p>
               <div className="flex gap-2">
                 <input type="number" placeholder="₹ Value" value={newExpenseAmt} onChange={e=>setNewExpenseAmt(e.target.value)} className="w-24 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm transition-all" />
                 <select value={newExpenseCat} onChange={e=>setNewExpenseCat(e.target.value)} className="flex-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-3 py-2 text-gray-200 outline-none text-sm font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all">
                   <option value="food">Food & Dining</option>
                   <option value="travel">Transport</option>
                   <option value="shopping">Shopping</option>
                 </select>
               </div>
               <button type="submit" className="w-full py-2.5 bg-[#1F2937] text-gray-300 hover:bg-[#10B981] hover:text-white rounded-xl text-sm font-semibold transition-colors mt-1">Submit Expense</button>
             </form>
           </div>
        </div>

      </div>
    </div>
  );
}
