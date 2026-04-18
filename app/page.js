"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, MapPin, Star, ShieldCheck, Map, Users, ArrowRight } from "lucide-react";

const FloatingCityTags = () => {
  const cities = ["Mumbai", "Jaipur", "Goa", "Delhi", "Varanasi", "Kochi"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10 z-0">
      {cities.map((city, i) => (
        <motion.div
          key={city}
          initial={{ y: "100vh", x: Math.random() * 100 + "%", opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear",
          }}
          className="absolute text-2xl font-bold text-primary whitespace-nowrap"
        >
          #{city}
        </motion.div>
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="relative w-full py-24 lg:py-32 flex flex-col items-center justify-center overflow-hidden">
        <FloatingCityTags />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm font-semibold mb-6">
              <Compass className="w-4 h-4" /> Discover India
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-zinc-900 dark:text-white">
              Explore cities like a local, guided by students who actually live there.
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              GullyGuide connects curious travellers with student guides who know every gully, chai stall, and hidden sunset spot.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="px-8 py-4 bg-primary text-white hover:bg-primary/90 transition-colors rounded-xl font-bold text-lg flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
                Start planning your trip <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-xl font-bold text-lg w-full sm:w-auto justify-center">
                Become a guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-20 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Three simple steps to your next great adventure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
              <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Tell us where you're headed</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Enter your destination, dates, and budget. Our AI co-pilot will sketch an initial itinerary.</p>
            </div>
            <div className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm text-center relative md:-translate-y-4">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Browse student guides</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Find verified local students who match your interests. Book them by the hour, dynamically priced.</p>
            </div>
            <div className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Explore with your AI co-pilot</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Use our interactive map and AI travel buddy to track budget, navigate streets, and find live events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDE CTA BANNER */}
      <section className="w-full py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Are you a local student? <br/> Earn while you explore.</h2>
              <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">Set your own schedule. Share your favorite secret spots. Get paid directly by curious travellers exploring your city.</p>
              <Link href="/login" className="px-8 py-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors rounded-xl font-bold text-lg inline-block shadow-md">
                Join as a guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-black text-xl text-primary">
            <Compass className="w-6 h-6" /> GullyGuide
          </div>
          <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            <Link href="#">About</Link>
            <Link href="#">Blog</Link>
            <Link href="#">For Guides</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
