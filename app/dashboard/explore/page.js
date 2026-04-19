"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Filter, Star, CheckCircle2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FILTERS = ["All cities", "Mumbai", "Delhi", "Goa", "Jaipur", "Top rated", "Under ₹500/hr", "English"];

export default function ExploreGuidesPage() {
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const querySnapshot = await getDocs(collection(db, "guides"));
        const results = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== user?.uid) {
             results.push({ id: doc.id, ...doc.data() });
          }
        });
        setGuides(results);
      } catch (e) {
        console.error("Error fetching guides: ", e);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, [user]);
  return (
    <div className="w-full h-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">Explore guides</h1>
          <p className="text-zinc-500 font-medium text-sm">Browse student guides in Mumbai</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-sm shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Search className="w-4 h-4" /> Search
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-sm shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Filter
          </button>
        </div>
      </div>

      {/* Horizontal Filter Chips */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 mb-8 scrollbar-hide">
        {FILTERS.map((f, i) => (
          <button 
            key={f}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
              i === 0 
                ? "bg-[#0F6E56] text-white border-[#0F6E56]" 
                : "bg-transparent text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 font-medium">Loading guides...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {guides.length === 0 ? (
            <div className="md:col-span-2 py-12 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No guides in your area yet. Check back soon.</h3>
               <p className="text-sm font-medium text-zinc-500">Want to become a guide? Switch your account role in Settings.</p>
            </div>
          ) : guides.map((guide, i) => (
            <div 
              key={guide.id}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 transition-colors flex flex-col"
            >
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#EEEDFE] flex items-center justify-center font-bold text-[#3C3489] text-lg overflow-hidden">
                  {guide.photoURL ? <img src={guide.photoURL} alt={guide.name} className="w-full h-full object-cover" /> : (guide.name ? guide.name[0].toUpperCase() : <User size={20}/>)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 text-lg">
                    {guide.name}
                    {guide.verified && <CheckCircle2 className="w-4 h-4 text-white fill-[#0F6E56]" />}
                    {guide.rating === 0 && <span className="text-[10px] bg-[#FAEEDA] text-[#633806] px-1.5 py-0.5 rounded font-black uppercase">New guide</span>}
                  </h3>
                  <p className="text-xs text-zinc-500 font-semibold mb-1">
                    {guide.city} {guide.languages?.length > 0 && `· Speaks ${guide.languages.join(', ')}`}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold">
                    <div className="flex gap-0.5">
                       {[...Array(5)].map((_, idx) => (
                         <Star key={idx} className={`w-3.5 h-3.5 ${idx < Math.floor(guide.rating || 0) ? "text-amber-400 fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                       ))}
                    </div>
                    <span className="text-zinc-900 dark:text-white">{(guide.rating || 0).toFixed(1)}</span>
                    <span>({guide.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
                {guide.experiences && guide.experiences.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="font-extrabold text-lg flex items-center gap-2">
                  {guide.pricePerHour > 0 ? (
                     <><span className="text-[#0F6E56]">₹{guide.pricePerHour}</span><span className="text-sm text-zinc-400 font-medium">/hr</span></>
                  ) : <span className="text-sm text-zinc-500">Contact for price</span>}
                  
                  <div className={`w-2 h-2 rounded-full ${guide.available ? 'bg-[#1D9E75]' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/chat/${guide.id}`} className="px-5 py-2.5 font-bold text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    Message
                  </Link>
                  <button onClick={() => alert("Booking functionality coming soon...")} className="px-5 py-2.5 font-bold text-sm text-white bg-[#534AB7] rounded-lg hover:bg-[#433B9B] transition-colors">
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
