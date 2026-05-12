"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Search, Star, MapPin, ChevronRight, Clock } from "lucide-react";

const CATEGORIES = ["All", "Hidden Gems", "Food & Drink", "Culture & History", "Nightlife", "Budget Tips"];

const ARTICLES = [
  { id: 1, title: "10 Hidden Gems in South Mumbai You Won't Find in Guidebooks", category: "Hidden Gems", author: "Rahul M.", role: "Local Guide", readTime: "5 min", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop", excerpt: "Skip the Gateway of India and explore these quiet, century-old libraries and hidden Irani cafes." },
  { id: 2, title: "The Ultimate ₹500 Street Food Challenge in Old Delhi", category: "Food & Drink", author: "Sneha P.", role: "Foodie Guide", readTime: "8 min", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop", excerpt: "How to eat like a king in Chandni Chowk without breaking the bank." },
  { id: 3, title: "Understanding Jaipur's Architecture: A Walk Through the Pink City", category: "Culture & History", author: "Vikram S.", role: "History Guide", readTime: "12 min", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", excerpt: "The science and art behind the iconic terra-cotta pink buildings of Rajasthan's capital." }
];

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Stories from the <span className="wavy-underline">Streets</span>
            </h1>
            <p className="text-lg font-body text-foreground/60">Read travel guides and city secrets by our verified student guides.</p>
          </div>
          <div className="w-full md:w-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input type="text" placeholder="Search articles..." className="w-full md:w-80 pl-11 pr-4 py-3 bg-paper border-2 border-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-body text-lg placeholder:text-foreground/30" style={{ borderRadius: WB }} />
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-base font-body whitespace-nowrap border-2 border-foreground transition-all ${activeCategory === cat ? "bg-foreground text-paper" : "bg-paper text-foreground shadow-[2px_2px_0px_0px_#2d2d2d] hover:translate-x-[1px] hover:translate-y-[1px]"}`}
              style={{ borderRadius: WB }}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filtered.map((article, i) => (
            <Link href="#" key={article.id}
              className={`group flex flex-col bg-paper border-2 border-foreground overflow-hidden shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-sketch hover:-translate-y-1 transition-all ${i % 2 === 0 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'}`}
              style={{ borderRadius: i % 2 === 0 ? WB2 : WB }}>
              <div className="relative h-60 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-postit text-foreground px-3 py-1 text-sm font-body border-2 border-foreground shadow-[2px_2px_0px_0px_#2d2d2d]" style={{ borderRadius: WB }}>{article.category}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-tight">{article.title}</h3>
                <p className="font-body text-foreground/60 text-base mb-6 flex-1 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/15">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-postit flex items-center justify-center text-foreground font-heading font-bold text-sm border-2 border-foreground" style={{ borderRadius: WB }}>{article.author[0]}</div>
                    <div>
                      <p className="text-sm font-heading font-bold">{article.author}</p>
                      <p className="text-xs font-body text-foreground/40">{article.role}</p>
                    </div>
                  </div>
                  <div className="text-sm font-body text-foreground/40 flex items-center gap-1"><Clock className="w-3 h-3" strokeWidth={3} /> {article.readTime}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
