"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Circle, Compass, ShieldCheck, MapPin } from "lucide-react";
import { staggerContainer, fadeUpVariant, cardRevealVariant, fadeLeftVariant } from "@/lib/animations";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax calculations (Background Elements move slower than scroll)
  const yParallaxStar = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yParallaxCircle = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  // Hero Text fades out rapidly as you scroll down
  const opacityFadeOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col items-center overflow-hidden bg-background">
      
      {/* HERO SECTION */}
      <section className="w-full relative py-20 lg:py-32 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Floating Background Neon Shapes with Parallax (Optimized for performance) */}
        <motion.div 
          style={{ y: yParallaxStar, willChange: "transform" }}
          animate={{ rotate: 180 }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
          className="absolute left-10 lg:left-32 top-32 lg:top-40 z-0"
        >
          <Star className="w-12 h-12 text-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.5)] fill-[#00f2fe]" />
        </motion.div>
        
        <motion.div 
          style={{ y: yParallaxCircle, willChange: "transform" }}
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute right-10 lg:right-32 top-60 lg:top-80 z-0"
        >
          <div className="w-16 h-16 rounded-full border-4 border-[#ff2a85] shadow-[0_0_15px_rgba(255,42,133,0.5)]"></div>
        </motion.div>

        {/* Hero Content (Staggered Animation + Scroll Fade Out) */}
        <motion.div 
          style={{ opacity: opacityFadeOut, willChange: "opacity, transform" }}
          className="text-center relative z-10 flex flex-col items-center px-4 mt-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariant} className="neon-border-pink rounded-full px-6 py-2 mb-8 flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-[#ff2a85]">
             LOCAL TRAVEL, SIMPLIFIED.
          </motion.div>

          {/* Staggered Words */}
          <motion.div className="flex flex-col items-center leading-none uppercase gap-4 mt-2">
            <motion.h1 variants={fadeUpVariant} className="text-3d-white text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tighter">
              EXPLORE,
            </motion.h1>
            <motion.h1 variants={fadeUpVariant} className="text-3d-white text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tighter">
              CONNECT &
            </motion.h1>
            <motion.h1 variants={fadeUpVariant} className="text-3d-purple text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tighter">
              DISCOVER
            </motion.h1>
            <motion.h1 variants={fadeUpVariant} className="text-3d-white text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tighter">
              THE REAL CITY.
            </motion.h1>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION (Scroll Reveal via whileInView) */}
      <section className="w-full relative py-20 bg-dot-pattern border-t border-[#27272a] overflow-hidden">
        {/* Glow Line Seperator */}
        <div className="absolute top-0 w-full h-[1px] bg-[#00f2fe] shadow-[0_0_15px_#00f2fe,0_0_30px_#00f2fe]"></div>

        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUpVariant} className="flex items-center gap-4 mb-20 uppercase leading-[0.9]">
            <h2 className="text-3d-white text-5xl md:text-7xl font-black">OUTRAGEOUS</h2>
            <h2 className="text-3d-purple text-5xl md:text-7xl font-black">FEATURES</h2>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 w-full mt-4">
            
            {/* Card 1: Teal */}
            <motion.div 
              variants={cardRevealVariant}
              whileHover={{ scale: 1.02, y: -5, boxShadow: "0 10px 30px -10px rgba(0, 242, 254, 0.2)" }} 
              className="neon-border-teal bg-[#131318] rounded-[2rem] p-8 md:translate-y-6 transition-all duration-300 transform-gpu"
              style={{ willChange: "transform" }}
            >
              <div className="w-14 h-14 bg-[#131318] border-2 border-[#00f2fe] rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_10px_#00f2fe]">
                 <MapPin className="w-6 h-6 text-[#00f2fe]" />
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight text-[#00f2fe]">
                authentic<br/>ROUTES
              </h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">
                Skip the generic tourist maps. Get real-time, curated local spots across hidden food alleys and centuries-old monuments shown strictly by native students.
              </p>
            </motion.div>

            {/* Card 2: Yellow */}
            <motion.div 
              variants={cardRevealVariant}
              whileHover={{ scale: 1.02, y: -5, boxShadow: "0 10px 30px -10px rgba(255, 220, 0, 0.2)" }} 
              className="neon-border-yellow bg-[#131318] rounded-[2rem] p-8 -translate-y-4 transition-all duration-300 transform-gpu"
              style={{ willChange: "transform" }}
            >
              <div className="w-14 h-14 bg-[#131318] border-2 border-[#ffdc00] rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_10px_#ffdc00]">
                 <ShieldCheck className="w-6 h-6 text-[#ffdc00]" />
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight text-[#ffdc00]">
                STUDENT<br/>VERIFIED
              </h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">
                Trust matters. Every single guide on our platform goes through mandatory University ID and native ID verification before they can host a single tourist.
              </p>
            </motion.div>

            {/* Card 3: Orange */}
            <motion.div 
             variants={cardRevealVariant}
             whileHover={{ scale: 1.02, y: -5, boxShadow: "0 10px 30px -10px rgba(255, 90, 0, 0.2)" }} 
             className="neon-border-orange bg-[#131318] rounded-[2rem] p-8 md:translate-y-12 transition-all duration-300 transform-gpu"
             style={{ willChange: "transform" }}
            >
              <div className="w-14 h-14 bg-[#131318] border-2 border-[#ff5a00] rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_10px_#ff5a00]">
                 <Compass className="w-6 h-6 text-[#ff5a00]" />
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight text-[#ff5a00]">
                DYNAMIC<br/>PRICING
              </h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">
                Visual tour projections. Decide your own budget and bid on student hours, bypassing the outrageous agency markups while supporting college tuition funds.
              </p>
            </motion.div>

          </div>
        </motion.div>
      </section>
    </div>
  );
}
