"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Clock, MapPin, Calendar, Heart } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

const DEMO_GUIDE = {
  id: "g1", name: "Aisha R.", university: "Delhi University",
  languages: ["English", "Hindi", "Punjabi"], hourlyRate: 400, rating: 4.9, reviews: 42,
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
            <img src={DEMO_GUIDE.image} alt={DEMO_GUIDE.name} className="w-32 h-32 object-cover border-[3px] border-foreground shadow-sketch" style={{ borderRadius: WB }} />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-heading font-bold text-foreground">{DEMO_GUIDE.name}</h1>
                <span className="bg-secondary/10 text-secondary p-1.5 border-2 border-secondary/30" style={{ borderRadius: WB }} title="Student ID Verified">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              </div>
              <p className="text-lg text-secondary font-heading font-bold mb-2">{DEMO_GUIDE.university}</p>
              <div className="flex items-center gap-4 text-base font-body text-foreground">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-foreground text-foreground" /> {DEMO_GUIDE.rating} ({DEMO_GUIDE.reviews} ratings)</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-foreground/40" strokeWidth={2.5} /> New Delhi</span>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-foreground/15 pt-8">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">About Me</h2>
            <p className="text-foreground/60 leading-relaxed max-w-2xl text-lg font-body">
              {DEMO_GUIDE.bio} I typically start my tours in the historic lanes of Chandni Chowk, taking you to spots that only true locals know about. From 300-year-old jalebi shops to quiet rooftops overlooking the Jama Masjid.
            </p>
          </div>

          <div className="border-t-2 border-dashed border-foreground/15 pt-8">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Languages Spoken</h2>
            <div className="flex flex-wrap gap-3">
              {DEMO_GUIDE.languages.map((l) => (
                <span key={l} className="px-4 py-2 bg-paper font-body text-base text-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-paper border-[3px] border-foreground p-6 sticky top-24 shadow-sketch-lg tack-decoration mt-4" style={{ borderRadius: WB2 }}>
            <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-foreground/15 pb-6">
              <span className="text-3xl font-heading font-bold text-foreground">₹{DEMO_GUIDE.hourlyRate}<span className="text-lg font-body text-foreground/40"> / hr</span></span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="border-2 border-foreground p-1 flex" style={{ borderRadius: WB }}>
                <div className="flex-1 p-3 border-r-2 border-foreground">
                  <label className="block text-xs font-heading font-bold text-foreground/40 uppercase">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent font-body text-lg text-foreground focus:outline-none" />
                </div>
              </div>

              <div className="border-2 border-foreground p-1 flex justify-between items-center px-4 py-2" style={{ borderRadius: WB }}>
                <label className="font-heading font-bold text-foreground">Hours Tour</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setHours(Math.max(1, hours - 1))} className="w-8 h-8 bg-muted/50 border-2 border-foreground font-heading font-bold text-foreground hover:bg-muted transition-colors" style={{ borderRadius: WB }}>-</button>
                  <span className="font-heading font-bold w-4 text-center text-foreground">{hours}</span>
                  <button onClick={() => setHours(hours + 1)} className="w-8 h-8 bg-muted/50 border-2 border-foreground font-heading font-bold text-foreground hover:bg-muted transition-colors" style={{ borderRadius: WB }}>+</button>
                </div>
              </div>
            </div>

            <button className="w-full py-4 text-lg font-body bg-accent text-white border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]" style={{ borderRadius: WB }}>
              Reserve Tour
            </button>
            <p className="text-center text-sm font-body text-foreground/30 mt-4">You won't be charged yet</p>

            <div className="mt-6 pt-6 border-t-2 border-dashed border-foreground/15 space-y-3 font-body">
              <div className="flex justify-between text-foreground">
                <span className="underline text-foreground/50">₹{DEMO_GUIDE.hourlyRate} x {hours} hours</span>
                <span className="font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="underline text-foreground/50">Platform fee</span>
                <span className="font-bold">₹{(total * 0.1).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xl font-heading font-bold border-t-2 border-foreground pt-4 mt-2 text-foreground">
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
