"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Clock, MapPin, Calendar, Heart } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

// Reuse DEMO_GUIDES for specific lookup, or assume one for MVP
const DEMO_GUIDE = {
  id: "g1",
  name: "Aisha R.",
  university: "Delhi University",
  languages: ["English", "Hindi", "Punjabi"],
  hourlyRate: 400,
  rating: 4.9,
  reviews: 42,
  bio: "History major who loves to show the hidden architectural gems of Old Delhi.",
  image: "https://i.pravatar.cc/300?img=1"
};

export default function GuideProfile() {
  const [hours, setHours] = useState(2);
  const [date, setDate] = useState("");
  const total = hours * DEMO_GUIDE.hourlyRate;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <img src={DEMO_GUIDE.image} alt={DEMO_GUIDE.name} className="w-32 h-32 rounded-3xl object-cover shadow-md" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold">{DEMO_GUIDE.name}</h1>
                <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 p-1.5 rounded-full" title="Student ID Verified">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              </div>
              <p className="text-lg text-primary-light dark:text-primary-dark font-medium mb-2">{DEMO_GUIDE.university}</p>
              <div className="flex items-center gap-4 text-sm font-bold text-foreground">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {DEMO_GUIDE.rating} ({DEMO_GUIDE.reviews} ratings)</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> New Delhi</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-lg">
              {DEMO_GUIDE.bio} I typically start my tours in the historic lanes of Chandni Chowk, taking you to spots that only true locals know about. From 300-year-old jalebi shops to quiet rooftops overlooking the Jama Masjid. 
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold mb-4">Languages Spoken</h2>
            <div className="flex flex-wrap gap-3">
              {DEMO_GUIDE.languages.map((l) => (
                <span key={l} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm border border-border shadow-sm">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg sticky top-24">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-6">
              <span className="text-3xl font-extrabold">₹{DEMO_GUIDE.hourlyRate}<span className="text-lg font-medium text-slate-500"> / hr</span></span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="border-2 border-border rounded-2xl p-1 flex">
                <div className="flex-1 p-3 border-r-2 border-border">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" />
                </div>
              </div>
              
              <div className="border-2 border-border rounded-2xl p-1 flex justify-between items-center px-4 py-2">
                <label className="font-bold">Hours Tour</label>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => setHours(Math.max(1, hours - 1))} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">-</button>
                  <span className="font-bold w-4 text-center">{hours}</span>
                  <button onClick={(e) => setHours(hours + 1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">+</button>
                </div>
              </div>
            </div>

            <button className="neo-brutalist-btn w-full py-4 text-lg">
              Reserve Tour
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 font-medium">You won't be charged yet</p>

            <div className="mt-6 pt-6 border-t border-border space-y-3 font-bold">
              <div className="flex justify-between">
                <span className="underline text-slate-600 dark:text-slate-400">₹{DEMO_GUIDE.hourlyRate} x {hours} hours</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="underline text-slate-600 dark:text-slate-400">Platform fee</span>
                <span>₹{(total * 0.1).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xl border-t-2 border-border pt-4 mt-2">
                <span>Total</span>
                <span>₹{total + (total * 0.1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
