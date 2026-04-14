"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Loader2, Star, Clock, Filter } from "lucide-react";
import { useState } from "react";

const DEMO_GUIDES = [
  {
    id: "g1",
    name: "Aisha R.",
    university: "Delhi University",
    languages: ["English", "Hindi", "Punjabi"],
    hourlyRate: 400,
    rating: 4.9,
    bio: "History major who loves to show the hidden architectural gems of Old Delhi.",
    image: "https://i.pravatar.cc/300?img=1"
  },
  {
    id: "g2",
    name: "Rohan M.",
    university: "Mumbai University",
    languages: ["English", "Marathi"],
    hourlyRate: 500,
    rating: 4.8,
    bio: "Foodie. Let's explore the best street food from Vada Pav to Pav Bhaji.",
    image: "https://i.pravatar.cc/300?img=11"
  },
  {
    id: "g3",
    name: "Priya K.",
    university: "JNU",
    languages: ["English", "Hindi"],
    hourlyRate: 350,
    rating: 4.7,
    bio: "Art and culture enthusiast. We'll visit the best galleries and indie cafes.",
    image: "https://i.pravatar.cc/300?img=5"
  },
  {
    id: "g4",
    name: "Vikram S.",
    university: "IIT Delhi",
    languages: ["English"],
    hourlyRate: 600,
    rating: 5.0,
    bio: "I'll show you the modern tech hubs mixed with historical monuments.",
    image: "https://i.pravatar.cc/300?img=15"
  }
];

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState(DEMO_GUIDES);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-4">Explore Guides</h1>
        <p className="text-slate-600 dark:text-slate-400">Find the perfect local student to show you around.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-10 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search city, languages, or university..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary-light transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl font-bold bg-background hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="w-5 h-5" /> Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {guides.map((guide, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={guide.id} 
            className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col group cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-sm shadow-sm text-foreground">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {guide.rating}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-bold border-b text-xl flex items-center justify-between">
                {guide.name}
              </h4>
              <p className="text-sm text-primary-light dark:text-primary-dark font-medium mt-1 pb-3 mb-3 border-border">
                {guide.university}
              </p>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 flex-1">
                {guide.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {guide.languages.map((l) => (
                  <span key={l} className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md font-medium">
                    {l}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 -mx-5 -mb-5 px-5 py-4 border-t border-border">
                <span className="font-extrabold text-xl">
                  ₹{guide.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span>
                </span>
                <Link href={`/guides/${guide.id}`} className="neo-brutalist-btn px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black">
                  Book
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
