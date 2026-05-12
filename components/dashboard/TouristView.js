"use client";

import { useTrips } from "@/hooks/useTrips";
import { useRouter } from "next/navigation";
import { MapPin, Compass, Navigation, Plane, Wallet, ArrowRight, Loader2, Sparkles, Map, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { useLocation } from "@/lib/LocationContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { staggerContainer, cardRevealVariant } from "@/lib/animations";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function TouristView({ user }) {
  const router = useRouter();
  const { role } = useAuth();
  const [date, setDate] = useState(new Date());

  useEffect(() => { if (role === 'guide') router.replace("/dashboard"); }, [role, router]);

  const { currentCity, requestLiveLocation, loadingLocation } = useLocation();
  const { trips, loading, totalSpent, totalBudget, upcomingTrips } = useTrips();
  const remainingBudget = totalBudget - totalSpent;
  const isOverspent = remainingBudget < 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12 pb-10">

      {/* HERO SECTION */}
      <motion.div variants={cardRevealVariant} className="relative w-full overflow-hidden bg-paper border-[3px] border-foreground p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[350px] shadow-sketch tape-decoration mt-3" style={{ borderRadius: WB2 }}>

        <div className="relative z-10 md:w-1/2 flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-postit text-foreground text-sm font-body border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d]" style={{ borderRadius: WB }}>
            <MapPin className="w-3.5 h-3.5 text-accent" strokeWidth={3} /> Exploring {currentCity || "Mumbai"}
          </span>

          <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground tracking-tight leading-[1.1]">
            Plan your city <br/> <span className="text-accent">like a local.</span>
          </h1>

          <p className="text-lg font-body text-foreground/60 max-w-md mt-2">
            Welcome back, {user?.displayName?.split(" ")[0] || "explorer"}. Connect with student guides and discover hidden spots.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button onClick={() => router.push("/dashboard/trips")}
              className="px-6 py-3 bg-accent text-white font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center gap-2"
              style={{ borderRadius: WB }}>
              Start Planning <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={requestLiveLocation} disabled={loadingLocation}
              className="px-6 py-3 bg-paper text-foreground font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ borderRadius: WB2 }}>
              {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin"/> : <Navigation className="w-4 h-4 text-secondary" strokeWidth={3} />} Locate me
            </button>
          </div>
        </div>

        {/* Map placeholder — hand-drawn style */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          onClick={() => router.push("/dashboard/explore")}
          className="cursor-pointer relative z-10 w-full md:w-1/2 aspect-[4/3] max-w-[400px] bg-muted/30 border-[3px] border-dashed border-foreground/30 overflow-hidden p-4 flex flex-col items-center justify-center group rotate-1"
          style={{ borderRadius: WB }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="relative">
            <Compass className="w-16 h-16 text-foreground/30 group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
          </motion.div>
          <div className="mt-6 bg-paper border-2 border-foreground p-4 flex items-center justify-between gap-4 group-hover:shadow-sketch transition-all w-full" style={{ borderRadius: WB2 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-postit flex items-center justify-center border-2 border-foreground" style={{ borderRadius: WB }}>
                <Map className="w-5 h-5 text-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-heading font-bold text-foreground">Interactive Map</p>
                <p className="text-xs font-body text-foreground/40">Discover nearby spots</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-colors" />
          </div>
        </motion.div>
      </motion.div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={cardRevealVariant} className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-heading font-bold text-foreground">Your Upcoming Trips</h3>
            <Link href="/dashboard/trips" className="text-base font-body text-secondary hover:text-accent flex items-center gap-1 transition-colors">View all <ChevronRight className="w-4 h-4" /></Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 text-base font-body text-foreground/40">Syncing trips...</div>
          ) : upcomingTrips.length === 0 ? (
            <div className="w-full bg-paper border-2 border-dashed border-foreground/30 p-8 flex flex-col items-center justify-center text-center" style={{ borderRadius: WB }}>
              <Plane className="w-8 h-8 text-foreground/30 mb-3" />
              <h4 className="text-xl font-heading font-bold text-foreground">No trips planned yet</h4>
              <p className="text-base font-body text-foreground/40 mt-1 mb-4">It's time to start an adventure.</p>
              <button onClick={() => router.push("/dashboard/trips")} className="px-5 py-2 bg-foreground text-paper font-body text-base border-2 border-foreground shadow-[2px_2px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" style={{ borderRadius: WB }}>Create Trip</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              <AnimatePresence>
                {upcomingTrips.slice(0,4).map((trip, idx) => {
                  const start = trip.startDate?.seconds ? new Date(trip.startDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
                  const end = trip.endDate?.seconds ? new Date(trip.endDate.seconds * 1000).toLocaleDateString([],{month:'short', day:'numeric'}) : 'TBD';
                  const isPlanning = trip.status === "planning";
                  return (
                    <motion.div initial={{ opacity: 0, y: 20, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: idx * 0.1 }}
                      key={trip.id} className={`relative bg-paper border-2 border-foreground p-5 flex flex-col justify-between group cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-sketch transition-all ${idx % 2 === 0 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'} hover:rotate-0 tack-decoration mt-4`}
                      style={{ borderRadius: idx % 2 === 0 ? WB : WB2 }}
                      onClick={() => router.push(`/dashboard/trips/${trip.id}`)}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-accent transition-colors">{trip.title}</h4>
                          <span className="text-xs font-body text-foreground/40 bg-muted px-2 py-0.5 border border-foreground/20" style={{ borderRadius: WB }}>{trip.city}</span>
                        </div>
                        <div className={`px-2.5 py-1 border-2 text-xs font-body font-bold uppercase ${isPlanning ? 'border-secondary text-secondary bg-secondary/5' : 'border-accent text-accent bg-accent/5'}`} style={{ borderRadius: WB }}>{trip.status}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-body text-foreground/40 mb-6"><CalendarIcon className="w-3.5 h-3.5" strokeWidth={3} /> {start} &ndash; {end}</div>
                      <div className="mt-auto flex justify-between items-center pt-4 border-t-2 border-dashed border-foreground/15">
                        <span className="text-sm font-body text-foreground/40">Budget: ₹{trip.totalBudget||0}</span>
                        <div className="w-8 h-8 bg-foreground text-paper flex items-center justify-center group-hover:bg-accent transition-colors border-2 border-foreground" style={{ borderRadius: WB }}><ArrowRight className="w-3.5 h-3.5" /></div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div variants={cardRevealVariant} className="space-y-6">
          <div className="bg-paper border-2 border-foreground p-6 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB2 }}>
            <h3 className="text-base font-heading font-bold text-foreground mb-4 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-accent" strokeWidth={3} /> Calendar</h3>
            <div className="bg-background border-2 border-dashed border-foreground/20 p-2 flex justify-center w-full overflow-hidden" style={{ borderRadius: WB }}>
              <Calendar mode="single" selected={date} onSelect={setDate} className="font-body" />
            </div>
          </div>

          <div className="bg-paper border-2 border-foreground p-6 relative overflow-hidden shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>
            <div className="absolute -bottom-4 -right-4 p-4 opacity-5"><Wallet className="w-32 h-32" /></div>
            <h3 className="text-sm font-heading font-bold text-foreground/60 mb-2 uppercase">Total Spendings</h3>
            <p className="text-4xl font-heading font-bold text-foreground mb-1 tabular-nums">₹{loading ? "-" : totalSpent.toLocaleString("en-IN")}</p>
            <p className="text-sm font-body text-foreground/40 mb-4">Across {loading ? "-" : trips.length} planned trips</p>
            <div className="w-full bg-muted/30 h-3 overflow-hidden mt-6 border-2 border-foreground" style={{ borderRadius: WB }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((totalSpent||0)/(totalBudget||1))*100, 100)}%` }} transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${isOverspent ? 'bg-accent' : 'bg-secondary'}`} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* CURATED EXPERIENCES */}
      <motion.div variants={cardRevealVariant} className="pt-8">
        <h3 className="text-2xl font-heading font-bold text-foreground mb-4">Curated Experiences</h3>
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {[{title: "Hidden Culinary Walk", desc: "Discover best street food spots verified by locals.", by: "RK"},
            {title: "Midnight Heritage Tour", desc: "See the historical monuments under the moonlight.", by: "AS"},
            {title: "Artisan Shopping Trail", desc: "Bargain at local markets for authentic souvenirs.", by: "MD"},
            {title: "Silent Sunset Hike", desc: "Hidden trails that tourists never know about.", by: "VJ"}
          ].map((item, idx) => (
            <div key={idx} className={`min-w-[260px] bg-paper border-2 border-foreground p-6 snap-start shrink-0 group cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-sketch hover:-rotate-1 transition-all tape-decoration mt-3 ${idx % 2 === 0 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'}`}
              style={{ borderRadius: idx % 2 === 0 ? WB : WB2 }}>
              <div className="w-12 h-12 bg-postit border-2 border-foreground mb-5 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[2px_2px_0px_0px_#2d2d2d]" style={{ borderRadius: WB }}>
                <Compass className="w-5 h-5 text-foreground" strokeWidth={2.5} />
              </div>
              <h4 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors text-lg">{item.title}</h4>
              <p className="text-sm font-body text-foreground/50 mb-6 leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-7 h-7 bg-muted border-2 border-foreground flex items-center justify-center font-body text-xs text-foreground" style={{ borderRadius: WB }}>{item.by}</div>
                  <div className="w-7 h-7 bg-accent text-white border-2 border-foreground flex items-center justify-center font-body text-xs" style={{ borderRadius: WB }}>AJ</div>
                </div>
                <span className="text-xs font-body text-foreground/40 uppercase">Local guides</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
