"use client";

import { motion } from "framer-motion";
import { Star, ChevronRight, MessageSquare, Clock, MapPin, Map, Calendar as CalendarIcon, Wallet } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { staggerContainer, cardRevealVariant } from "@/lib/animations";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function GuideView({ user }) {
  const [date, setDate] = useState(new Date());

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12 pb-10">

      {/* HERO */}
      <motion.div variants={cardRevealVariant} className="relative w-full bg-paper border-[3px] border-foreground p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[300px] shadow-sketch tape-decoration mt-3" style={{ borderRadius: WB2 }}>
        <div className="relative z-10 md:w-2/3 flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-postit text-foreground text-sm font-body border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d]" style={{ borderRadius: WB }}>
            <MapPin className="w-3.5 h-3.5 text-accent" strokeWidth={3} /> Guide Dashboard
          </span>
          <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground tracking-tight leading-[1.1]">
            Welcome back, <br/> <span className="text-accent">{user?.displayName?.split(" ")[0] || "Guide"}</span>
          </h1>
          <p className="text-lg font-body text-foreground/60 max-w-md mt-2">You have <span className="text-accent font-bold">2 new booking requests</span> waiting for your approval today.</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button className="px-6 py-3 bg-accent text-white font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center gap-2" style={{ borderRadius: WB }}>View Requests <ChevronRight className="w-4 h-4" /></button>
            <button className="px-6 py-3 bg-paper text-foreground font-body text-lg border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2" style={{ borderRadius: WB2 }}>Edit Profile</button>
          </div>
        </div>
        {/* Stats Card */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="relative z-10 w-full md:w-1/3 bg-muted/20 border-[3px] border-foreground p-6 flex flex-col gap-6 shadow-sketch -rotate-1" style={{ borderRadius: WB }}>
          <div>
            <h3 className="text-xs font-body text-foreground/40 uppercase font-bold mb-1.5">This month earnings</h3>
            <div className="text-4xl font-heading font-bold text-foreground tabular-nums">₹14,200</div>
            <div className="w-full bg-muted/30 border-2 border-foreground h-3 overflow-hidden mt-3 mb-2" style={{ borderRadius: WB }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "71%" }} transition={{ duration: 1, delay: 0.5 }} className="bg-secondary h-full" />
            </div>
            <div className="text-xs font-body text-foreground/40">71% of ₹20k goal</div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t-2 border-dashed border-foreground/20 pt-6">
            <div><h3 className="text-xs font-body text-foreground/40 uppercase font-bold mb-1">Rating</h3><div className="text-xl font-heading font-bold text-foreground flex items-center gap-1">4.9 <Star className="w-4 h-4 text-foreground fill-foreground" /></div></div>
            <div><h3 className="text-xs font-body text-foreground/40 uppercase font-bold mb-1">Tours</h3><div className="text-xl font-heading font-bold text-foreground">86</div></div>
          </div>
        </motion.div>
      </motion.div>

      {/* TWO COLUMN */}
      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        <motion.div variants={cardRevealVariant} className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-heading font-bold text-foreground">Booking Requests</h3>
            <span className="text-sm font-body text-foreground/40">2 pending</span>
          </div>

          {/* Request Cards */}
          {[
            { initials: "AM", name: "Aman Mehta", tour: "Dharavi deep dive", time: "Sat 19 Apr, 9:00 AM", people: 2, amount: "₹2,400", ago: "10 mins ago", color: "bg-secondary/10" },
            { initials: "LW", name: "Lisa Wong", tour: "Street food trail", time: "Sun 20 Apr, 11:00 AM", people: 4, amount: "₹3,200", ago: "1 hour ago", color: "bg-accent/10" },
          ].map((req, idx) => (
            <div key={idx} className={`bg-paper border-2 border-foreground p-6 relative group transition-all shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-sketch ${idx === 0 ? 'rotate-[0.3deg]' : '-rotate-[0.3deg]'}`} style={{ borderRadius: idx === 0 ? WB : WB2 }}>
              <div className="absolute top-6 right-6 bg-postit text-foreground border-2 border-foreground px-2.5 py-1 text-xs font-body font-bold uppercase" style={{ borderRadius: WB }}>Pending Review</div>
              <div className="flex gap-4 items-start mb-6">
                <div className={`w-12 h-12 ${req.color} text-foreground border-2 border-foreground flex items-center justify-center font-heading font-bold text-sm shrink-0`} style={{ borderRadius: WB }}>{req.initials}</div>
                <div className="pr-16">
                  <h4 className="font-heading font-bold text-foreground text-lg mb-1 group-hover:text-accent transition-colors">{req.name}</h4>
                  <p className="text-sm font-body text-foreground/50 mb-1 flex items-center gap-1.5"><Map className="w-3.5 h-3.5" strokeWidth={3} /> {req.tour} · {req.time}</p>
                  <p className="text-sm font-body font-bold text-foreground mt-3 bg-muted/30 inline-block px-3 py-1.5 border-2 border-foreground/20" style={{ borderRadius: WB }}>{req.people} people · <span className="text-accent">{req.amount} total</span></p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t-2 border-dashed border-foreground/15 gap-4">
                <div className="text-xs font-body text-foreground/40 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" strokeWidth={3} /> Requested {req.ago}</div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="px-4 py-2 bg-paper text-secondary border-2 border-secondary font-body text-sm hover:bg-secondary hover:text-white transition-all flex-1 sm:flex-none text-center" style={{ borderRadius: WB }}>Accept</button>
                  <button className="px-4 py-2 bg-paper text-accent border-2 border-accent font-body text-sm hover:bg-accent hover:text-white transition-all flex-1 sm:flex-none text-center" style={{ borderRadius: WB }}>Decline</button>
                  <button className="px-4 py-2 bg-foreground text-paper border-2 border-foreground font-body text-sm hover:bg-foreground/80 transition-all flex-1 sm:flex-none text-center flex items-center justify-center gap-1.5" style={{ borderRadius: WB }}><MessageSquare className="w-3.5 h-3.5" /> Message</button>
                </div>
              </div>
            </div>
          ))}

          <h3 className="text-2xl font-heading font-bold text-foreground pt-8 mb-4">Upcoming Confirmed</h3>
          <div className="bg-paper border-2 border-foreground overflow-hidden shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB2 }}>
            {[{ name: "Rohan K.", tour: "Sunrise at Worli", time: "Mon 21, 6:00 AM" }, { name: "Sarah T.", tour: "Street food trail", time: "Wed 23, 7:00 PM" }].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-5 cursor-pointer hover:bg-postit/30 transition-colors ${idx !== 0 ? 'border-t-2 border-dashed border-foreground/15' : ''}`}>
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground mb-1">{item.name} · <span className="text-secondary">{item.tour}</span></h4>
                  <p className="text-sm font-body text-foreground/40 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" strokeWidth={3} /> {item.time}</p>
                </div>
                <div className="px-3 py-1.5 bg-secondary/10 text-secondary border-2 border-secondary/30 text-xs font-body font-bold uppercase" style={{ borderRadius: WB }}>Confirmed</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div variants={cardRevealVariant} className="space-y-6">
          <div className="bg-paper border-2 border-foreground p-6 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB2 }}>
            <h3 className="text-base font-heading font-bold text-foreground mb-4 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-accent" strokeWidth={3} /> Availability (April)</h3>
            <div className="bg-background border-2 border-dashed border-foreground/20 p-2 flex justify-center w-full overflow-hidden" style={{ borderRadius: WB }}>
              <Calendar mode="single" selected={date} onSelect={setDate} className="font-body" />
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-xs font-body text-foreground/40 justify-center">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-muted border-2 border-foreground/30"></div> Available</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-secondary border-2 border-foreground/30"></div> Selected</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-postit border-2 border-foreground/30"></div> Booked</div>
            </div>
          </div>

          <div className="bg-paper border-2 border-foreground p-6 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>
            <h3 className="text-base font-heading font-bold text-foreground mb-6 flex items-center gap-2"><Wallet className="w-4 h-4 text-secondary" strokeWidth={3} /> Earnings Breakdown</h3>
            <div className="space-y-6">
              {[{ name: "Dharavi deep dive", amount: "₹7,200", percent: 51, color: "bg-secondary" }, { name: "Street food trail", amount: "₹4,800", percent: 34, color: "bg-accent" }, { name: "Sunrise at Worli", amount: "₹2,200", percent: 15, color: "bg-foreground" }].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-heading font-bold text-foreground mb-2"><span>{item.name}</span><span className="text-foreground/50">{item.amount}</span></div>
                  <div className="w-full bg-muted/30 border-2 border-foreground h-3 overflow-hidden" style={{ borderRadius: WB }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.percent}%` }} transition={{ duration: 1, delay: 0.5 + (idx*0.2) }} className={`h-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t-2 border-dashed border-foreground/15 flex justify-between items-end">
              <div className="text-xs font-body text-foreground/40 uppercase font-bold">Total this month</div>
              <div className="text-2xl font-heading font-bold text-foreground tabular-nums">₹14,200</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
