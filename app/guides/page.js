"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Star, Clock, Filter } from "lucide-react";
import { useState } from "react";
import { gridStaggerContainer, gridCardVariant } from "@/lib/animations";

const DEMO_GUIDES = [
  { id: "g1", name: "Aisha R.", university: "Delhi University", languages: ["English", "Hindi", "Punjabi"], hourlyRate: 400, rating: 4.9, bio: "History major who loves to show the hidden architectural gems of Old Delhi.", image: "https://i.pravatar.cc/300?img=1" },
  { id: "g2", name: "Rohan M.", university: "Mumbai University", languages: ["English", "Marathi"], hourlyRate: 500, rating: 4.8, bio: "Foodie. Let's explore the best street food from Vada Pav to Pav Bhaji.", image: "https://i.pravatar.cc/300?img=11" },
  { id: "g3", name: "Priya K.", university: "JNU", languages: ["English", "Hindi"], hourlyRate: 350, rating: 4.7, bio: "Art and culture enthusiast. We'll visit the best galleries and indie cafes.", image: "https://i.pravatar.cc/300?img=5" },
  { id: "g4", name: "Vikram S.", university: "IIT Delhi", languages: ["English"], hourlyRate: 600, rating: 5.0, bio: "I'll show you the modern tech hubs mixed with historical monuments.", image: "https://i.pravatar.cc/300?img=15" },
];

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [guides] = useState(DEMO_GUIDES);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Explore Guides</h1>
        <p className="font-body text-lg text-foreground/60">Find the perfect local student to show you around.</p>
      </div>

      <div className="bg-paper border-2 border-foreground p-4 shadow-sketch-sm mb-10 flex flex-col sm:flex-row gap-4" style={{ borderRadius: WB2 }}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <input type="text" placeholder="Search city, languages, or university..." className="w-full pl-12 pr-4 py-3 bg-background border-2 border-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-body text-lg placeholder:text-foreground/30" style={{ borderRadius: WB }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-foreground font-body text-lg bg-paper hover:bg-muted transition-colors shadow-[2px_2px_0px_0px_#2d2d2d] hover:shadow-[1px_1px_0px_0px_#2d2d2d] hover:translate-x-[1px] hover:translate-y-[1px]" style={{ borderRadius: WB }}>
          <Filter className="w-5 h-5" strokeWidth={2.5} /> Filters
        </button>
      </div>

      <motion.div variants={gridStaggerContainer} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {guides.map((guide, i) => (
          <motion.div variants={gridCardVariant} key={guide.id}
            className={`bg-paper border-2 border-foreground overflow-hidden flex flex-col group cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-sketch hover:-rotate-[0.5deg] transition-all tack-decoration mt-4`}
            style={{ borderRadius: i % 2 === 0 ? WB : WB2 }}>
            <div className="h-48 relative overflow-hidden">
              <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-postit px-2 py-1 text-sm font-body flex items-center gap-1 border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d]" style={{ borderRadius: WB }}>
                <Star className="w-3 h-3 text-foreground fill-foreground" /> {guide.rating}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-heading font-bold text-xl flex items-center justify-between border-b-2 border-dashed border-foreground/15 pb-2 mb-2">{guide.name}</h4>
              <p className="text-sm font-body text-secondary font-medium mt-1 pb-3 mb-3">{guide.university}</p>
              <p className="text-base font-body text-foreground/60 mb-4 line-clamp-2 flex-1">{guide.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.languages.map((l) => (
                  <span key={l} className="text-sm font-body bg-muted/50 border-2 border-dashed border-foreground/20 px-2 py-1" style={{ borderRadius: WB }}>{l}</span>
                ))}
              </div>
              <div className="mt-auto flex justify-between items-center bg-background -mx-5 -mb-5 px-5 py-4 border-t-2 border-foreground">
                <span className="font-heading font-bold text-xl">₹{guide.hourlyRate}<span className="text-sm font-body text-foreground/50">/hr</span></span>
                <Link href={`/guides/${guide.id}`} className="px-5 py-2 text-base font-body bg-foreground text-paper border-2 border-foreground shadow-[2px_2px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" style={{ borderRadius: WB }}>Book</Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
