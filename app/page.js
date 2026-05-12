"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, MapPin, Star, ShieldCheck, Map, Users, ArrowRight } from "lucide-react";
import { staggerContainer, cardRevealVariant } from "@/lib/animations";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="relative w-full py-24 lg:py-32 flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative bouncing circle — desktop only */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="hidden md:block absolute top-20 right-[15%] w-16 h-16 border-[3px] border-dashed border-accent/40 opacity-60"
          style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-postit text-foreground text-base font-body border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d] mb-6"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <Compass className="w-4 h-4" strokeWidth={2.5} /> Discover India
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-foreground">
              Explore cities like a local
              <motion.span 
                animate={{ rotate: [0, 15, -10, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                className="inline-block text-accent ml-1"
              >!</motion.span>
            </h1>
            <p className="text-xl md:text-2xl font-body text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              GullyGuide connects curious travellers with student guides who know every gully, chai stall, and hidden sunset spot.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link 
                href="/auth" 
                className="px-8 py-4 bg-accent text-white font-body text-xl border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center gap-2 w-full sm:w-auto justify-center"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                Start planning your trip <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/auth" 
                className="px-8 py-4 bg-paper text-foreground font-body text-xl border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] w-full sm:w-auto justify-center"
                style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
              >
                Become a guide ✏️
              </Link>

              {/* Hand-drawn arrow pointing to CTA — desktop only */}
              <svg className="hidden md:block absolute -right-16 top-0 w-12 h-16 text-foreground/30" viewBox="0 0 40 60" fill="none">
                <path d="M5 5 C15 20, 25 35, 20 55" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" fill="none"/>
                <path d="M15 50 L20 58 L25 50" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-20 border-y-2 border-dashed border-foreground/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">How it works</h2>
            <p className="text-xl font-body text-foreground/60">Three simple steps to your next great adventure.</p>
          </div>

          <div className="relative">
            {/* Squiggly connecting line — desktop only */}
            <svg className="hidden md:block absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 z-0" viewBox="0 0 800 30" preserveAspectRatio="none">
              <path d="M50 15 Q150 0, 250 15 Q350 30, 450 15 Q550 0, 650 15 Q750 30, 800 15" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.15"/>
            </svg>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 relative z-10"
            >
              {[
                { icon: MapPin, title: "1. Tell us where you're headed", desc: "Enter your destination, dates, and budget. Our AI co-pilot will sketch an initial itinerary.", rotation: "-rotate-1", decoration: "tape" },
                { icon: Users, title: "2. Browse student guides", desc: "Find verified local students who match your interests. Book them by the hour, dynamically priced.", rotation: "rotate-1", decoration: "tack" },
                { icon: Map, title: "3. Explore with your AI co-pilot", desc: "Use our interactive map and AI travel buddy to track budget, navigate streets, and find live events.", rotation: "-rotate-2", decoration: "tape" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={cardRevealVariant}
                  className={`bg-paper p-8 border-2 border-foreground text-center relative shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] ${step.rotation} ${step.decoration === "tape" ? "tape-decoration mt-3" : "tack-decoration mt-4"}`}
                  style={{ borderRadius: i % 2 === 0 ? "255px 15px 225px 15px / 15px 225px 15px 255px" : "15px 225px 15px 255px / 255px 15px 225px 15px" }}
                >
                  <div 
                    className="w-14 h-14 bg-postit text-foreground border-[3px] border-foreground flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#2d2d2d]"
                    style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                  >
                    <step.icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
                  <p className="text-base font-body text-foreground/60">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* GUIDE CTA BANNER */}
      <section className="w-full py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div 
            className="bg-postit text-foreground p-10 md:p-16 text-center relative overflow-hidden border-[3px] border-foreground shadow-sketch-lg rotate-[0.5deg]"
            style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
          >
            {/* Dashed circle overlay decoration — desktop only */}
            <div className="hidden md:block absolute -top-8 -right-8 w-32 h-32 border-[3px] border-dashed border-foreground/20 rounded-full" />
            <div className="hidden md:block absolute -bottom-4 -left-4 w-20 h-20 border-[3px] border-dashed border-accent/30 rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                Are you a local student? <br/> Earn while you explore.
              </h2>
              <p className="text-lg md:text-xl font-body text-foreground/70 mb-10 max-w-2xl mx-auto">
                Set your own schedule. Share your favorite secret spots. Get paid directly by curious travellers exploring your city.
              </p>
              <Link 
                href="/auth" 
                className="inline-block px-8 py-4 bg-accent text-white font-body text-xl border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                Join as a guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t-2 border-dashed border-foreground/20 py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-foreground">
            <div 
              className="w-8 h-8 bg-accent text-white flex items-center justify-center border-2 border-foreground"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <Compass className="w-4 h-4" strokeWidth={3} />
            </div>
            GullyGuide
          </div>
          <div className="flex gap-6 text-base font-body text-foreground/60">
            <Link href="#" className="hover:text-accent hover:line-through transition-colors">About</Link>
            <Link href="#" className="hover:text-accent hover:line-through transition-colors">Blog</Link>
            <Link href="#" className="hover:text-accent hover:line-through transition-colors">For Guides</Link>
            <Link href="#" className="hover:text-accent hover:line-through transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-accent hover:line-through transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
