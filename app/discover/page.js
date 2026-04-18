"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Search, Star, MapPin, ChevronRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

const CATEGORIES = ["All", "Hidden Gems", "Food & Drink", "Culture & History", "Nightlife", "Budget Tips"];

const ARTICLES = [
  {
    id: 1,
    title: "10 Hidden Gems in South Mumbai You Won't Find in Guidebooks",
    category: "Hidden Gems",
    author: "Rahul M.",
    role: "Local Guide",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
    excerpt: "Skip the Gateway of India and explore these quiet, century-old libraries and hidden Irani cafes."
  },
  {
    id: 2,
    title: "The Ultimate ₹500 Street Food Challenge in Old Delhi",
    category: "Food & Drink",
    author: "Sneha P.",
    role: "Foodie Guide",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    excerpt: "How to eat like a king in Chandni Chowk without breaking the bank."
  },
  {
    id: 3,
    title: "Understanding Jaipur's Architecture: A Walk Through the Pink City",
    category: "Culture & History",
    author: "Vikram S.",
    role: "History Guide",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop",
    excerpt: "The science and art behind the iconic terra-cotta pink buildings of Rajasthan's capital."
  }
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All" 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
              Stories from the <span className="text-primary placeholder">Streets</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Read travel guides, local insights, and city secrets written exclusively by our verified student guides.
            </p>
          </div>
          <div className="w-full md:w-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search articles, cities..." 
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? "bg-primary text-white border-primary shadow-sm" 
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredArticles.map(article => (
            <Link href="#" key={article.id} className="group flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-zinc-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-1 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-primary font-bold text-xs">
                      {article.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{article.author}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{article.role}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                     <Clock className="w-3 h-3" /> {article.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
