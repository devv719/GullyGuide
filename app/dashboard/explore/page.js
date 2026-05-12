"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getGuides } from "@/lib/guidesCache";
import { Search, Filter, Star, CheckCircle2, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gridStaggerContainer, gridCardVariant } from "@/lib/animations";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";
const FILTERS = ["All cities", "Mumbai", "Delhi", "Goa", "Jaipur", "Top rated", "Under ₹500/hr", "English"];

function GuideSkeleton() {
  return (
    <div className="bg-paper border-2 border-dashed border-foreground/10 p-5 animate-pulse" style={{ borderRadius: WB }}>
      <div className="flex gap-4 items-start mb-4">
        <div className="w-12 h-12 bg-muted/60 border-2 border-dashed border-foreground/10 shrink-0" style={{ borderRadius: WB }} />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted/60 w-2/3" style={{ borderRadius: WB }} />
          <div className="h-3 bg-muted/40 w-1/2" />
          <div className="h-3 bg-muted/40 w-1/3" />
        </div>
      </div>
      <div className="flex gap-2 mb-6"><div className="h-6 bg-muted/40 w-16" style={{ borderRadius: WB }} /><div className="h-6 bg-muted/40 w-20" style={{ borderRadius: WB }} /></div>
      <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/10"><div className="h-6 bg-muted/60 w-16" /><div className="flex gap-2"><div className="h-9 bg-muted/40 w-20" style={{ borderRadius: WB }} /><div className="h-9 bg-muted/60 w-20" style={{ borderRadius: WB }} /></div></div>
    </div>
  );
}

export default function ExploreGuidesPage() {
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    async function fetchGuides() {
      try { const results = await getGuides(user?.uid); setGuides(results); } catch (e) { console.error("[Explore] Error:", e); } finally { setLoading(false); }
    }
    fetchGuides();
  }, [user]);

  const filteredGuides = guides.filter(guide => {
    const filter = FILTERS[activeFilter];
    if (filter === "All cities") return true;
    if (filter === "Top rated") return (guide.rating || 0) >= 4;
    if (filter === "Under ₹500/hr") return (guide.pricePerHour || guide.hourlyRate || 0) < 500;
    if (filter === "English") return guide.languages?.includes("English");
    return guide.city?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="w-full h-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-1">Explore guides</h1>
          <p className="font-body text-foreground/50 text-base">Browse student guides across India</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-paper border-2 border-foreground font-body text-base shadow-[2px_2px_0px_0px_#2d2d2d] hover:shadow-[1px_1px_0px_0px_#2d2d2d] hover:translate-x-[1px] hover:translate-y-[1px] transition-all" style={{ borderRadius: WB }}>
            <Search className="w-4 h-4" strokeWidth={2.5} /> Search
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-paper border-2 border-foreground font-body text-base shadow-[2px_2px_0px_0px_#2d2d2d] hover:shadow-[1px_1px_0px_0px_#2d2d2d] hover:translate-x-[1px] hover:translate-y-[1px] transition-all" style={{ borderRadius: WB }}>
            <Filter className="w-4 h-4" strokeWidth={2.5} /> Filter
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2.5 pb-2 mb-8 no-scrollbar">
        {FILTERS.map((f, i) => (
          <button key={f} onClick={() => setActiveFilter(i)}
            className={`whitespace-nowrap px-4 py-2 text-base font-body border-2 border-foreground transition-all ${activeFilter === i ? "bg-foreground text-paper" : "bg-paper text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]"}`}
            style={{ borderRadius: WB }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">{[1,2,3,4].map(i => <GuideSkeleton key={i} />)}</div>
      ) : (
        <motion.div variants={gridStaggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
          {filteredGuides.length === 0 ? (
            <motion.div variants={gridCardVariant}
              className="md:col-span-2 py-12 flex flex-col items-center justify-center text-center bg-paper border-2 border-dashed border-foreground/30" style={{ borderRadius: WB }}>
              <User className="w-10 h-10 text-foreground/20 mb-3" />
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">No guides in your area yet. Check back soon.</h3>
              <p className="text-base font-body text-foreground/40">Want to become a guide? Switch your account role in Settings.</p>
            </motion.div>
          ) : filteredGuides.map((guide, i) => (
            <motion.div key={guide.id} variants={gridCardVariant}
              className={`bg-paper border-2 border-foreground p-5 flex flex-col shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-sketch transition-all ${i % 2 === 0 ? 'rotate-[0.3deg] hover:rotate-0' : '-rotate-[0.3deg] hover:rotate-0'}`}
              style={{ borderRadius: i % 2 === 0 ? WB : WB2 }}>
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 shrink-0 bg-postit flex items-center justify-center font-heading font-bold text-foreground text-lg overflow-hidden border-2 border-foreground" style={{ borderRadius: WB }}>
                  {guide.photoURL ? <img src={guide.photoURL} alt={guide.name} className="w-full h-full object-cover" /> : (guide.name ? guide.name[0].toUpperCase() : <User size={20}/>)}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-foreground flex items-center gap-1.5 text-lg">
                    {guide.name}
                    {guide.verified && <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary/20" />}
                    {guide.rating === 0 && <span className="text-[10px] bg-postit text-foreground px-1.5 py-0.5 font-body font-bold uppercase border border-foreground/20" style={{ borderRadius: WB }}>New guide</span>}
                  </h3>
                  <p className="text-sm text-foreground/40 font-body mb-1">{guide.city} {guide.languages?.length > 0 && `· Speaks ${guide.languages.join(', ')}`}</p>
                  <div className="flex items-center gap-1.5 text-sm text-foreground/40 font-body">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, idx) => (<Star key={idx} className={`w-3.5 h-3.5 ${idx < Math.floor(guide.rating || 0) ? "text-foreground fill-foreground" : "text-foreground/15"}`} />))}
                    </div>
                    <span className="text-foreground font-bold">{(guide.rating || 0).toFixed(1)}</span>
                    <span>({guide.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
                {guide.experiences && guide.experiences.map(tag => (
                  <span key={tag} className="px-2.5 py-1 border-2 border-dashed border-foreground/20 bg-muted/30 text-sm font-body text-foreground/60" style={{ borderRadius: WB }}>{tag}</span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/15">
                <div className="font-heading font-bold text-lg flex items-center gap-2">
                  {(guide.pricePerHour || guide.hourlyRate) > 0 ? (
                    <><span className="text-secondary">₹{guide.pricePerHour || guide.hourlyRate}</span><span className="text-sm text-foreground/30 font-body">/hr</span></>
                  ) : <span className="text-sm text-foreground/40 font-body">Contact for price</span>}
                  <div className={`w-2.5 h-2.5 border-2 border-foreground/30 ${guide.available ? 'bg-secondary' : 'bg-muted'}`} style={{ borderRadius: "50%" }}></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/chat/${guide.id}`} className="px-5 py-2 font-body text-base text-foreground border-2 border-foreground hover:bg-muted transition-colors" style={{ borderRadius: WB }}>Message</Link>
                  <button onClick={() => alert("Booking functionality coming soon...")} className="px-5 py-2 font-body text-base text-paper bg-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" style={{ borderRadius: WB }}>Book now</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
