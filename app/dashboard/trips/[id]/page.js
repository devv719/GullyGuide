"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar, ChevronLeft, Plus, Grab, Coffee, Bed, Bus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/map/Map";

const MOCK_TRIP = {
  id: "t1",
  title: "Weekend in old Delhi",
  city: "New Delhi",
  budget: 6000,
  spent: 1200,
  days: [
    {
      id: "d1",
      day: 1,
      date: "Oct 24, 2026",
      places: [
        { id: "p1", name: "Jama Masjid", category: "attraction", estimatedCost: 0, actualCost: 0, lat: 28.6507, lng: 77.2334 },
        { id: "p2", name: "Karim's Restaurant", category: "food", estimatedCost: 800, actualCost: 950, lat: 28.6493, lng: 77.2343 },
        { id: "p3", name: "Red Fort", category: "attraction", estimatedCost: 50, actualCost: 50, lat: 28.6562, lng: 77.2410 },
      ]
    },
    {
      id: "d2",
      day: 2,
      date: "Oct 25, 2026",
      places: [
        { id: "p4", name: "Rajiv Chowk Metro", category: "transport", estimatedCost: 100, actualCost: 0, lat: 28.6328, lng: 77.2197 },
        { id: "p5", name: "Hauz Khas Village", category: "attraction", estimatedCost: 0, actualCost: 0, lat: 28.5535, lng: 77.1936 },
        { id: "p6", name: "Social Cafe", category: "food", estimatedCost: 1200, actualCost: 0, lat: 28.5540, lng: 77.1940 },
      ]
    }
  ]
};

const CATEGORY_ICONS = {
  attraction: <MapPin className="w-5 h-5 text-indigo-500" />,
  food: <Coffee className="w-5 h-5 text-amber-500" />,
  stay: <Bed className="w-5 h-5 text-teal-500" />,
  transport: <Bus className="w-5 h-5 text-zinc-500" />,
};

export default function TripPlannerPage() {
  const params = useParams();
  const [activeDay, setActiveDay] = useState(1);
  const [trip, setTrip] = useState(MOCK_TRIP);
  const [focusedPlaceId, setFocusedPlaceId] = useState(null);

  const currentDayData = trip.days.find(d => d.day === activeDay);
  const mapMarkers = currentDayData?.places || [];

  const handlePlaceClick = (id) => {
    setFocusedPlaceId(id);
    
    // Auto-scroll the left panel to the clicked place when interacted from Map
    const el = document.getElementById(`place-${id}`);
    if (el) {
       el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full">
      {/* Top Banner */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/trips" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold mb-1">
             <ChevronLeft className="w-4 h-4" /> Back to Trips
          </Link>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">{trip.title}</h1>
          <p className="text-zinc-500 font-medium flex items-center gap-4 mt-1">
             <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {trip.city}</span>
             <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {trip.days.length} Days</span>
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm text-left md:text-right w-full md:w-auto">
           <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Budget Tracker</p>
           <div className="flex items-end justify-start md:justify-end gap-2">
             <span className="text-2xl font-black text-amber-600 dark:text-amber-500 tabular-nums">₹{trip.spent}</span>
             <span className="text-zinc-400 font-bold mb-1 tabular-nums">/ ₹{trip.budget}</span>
           </div>
           {/* Progress bar */}
           <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
             <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(trip.spent / trip.budget) * 100}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Panel: Day Planner */}
        <div className="w-full lg:w-[450px] flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
          
          {/* Day Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-x-auto scrollbar-hide">
             {trip.days.map((d) => (
                <button 
                  key={d.id}
                  onClick={() => {
                     setActiveDay(d.day);
                     setFocusedPlaceId(null);
                  }}
                  className={`px-6 py-4 font-bold border-b-2 whitespace-nowrap transition-colors ${activeDay === d.day ? "border-primary text-primary" : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                >
                  Day {d.day}
                  <span className="block text-xs font-medium opacity-70 mt-1">{d.date}</span>
                </button>
             ))}
             <button className="px-6 py-4 text-zinc-400 hover:text-primary transition-colors flex items-center justify-center border-b-2 border-transparent">
                <Plus className="w-5 h-5" />
             </button>
          </div>

          {/* Place List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {currentDayData?.places.map((place, idx) => (
                <motion.div 
                  id={`place-${place.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={place.id} 
                  onClick={() => handlePlaceClick(place.id)}
                  className={`group border p-4 rounded-xl flex items-center gap-4 transition-all cursor-pointer ${
                      focusedPlaceId === place.id 
                       ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20" 
                       : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-primary/30"
                  }`}
                >
                   <div className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 cursor-grab active:cursor-grabbing">
                     <Grab className="w-5 h-5" />
                   </div>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${focusedPlaceId === place.id ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                     {CATEGORY_ICONS[place.category]}
                   </div>
                   <div className="flex-1">
                      <h4 className={`font-bold ${focusedPlaceId === place.id ? 'text-primary dark:text-white' : 'text-zinc-900 dark:text-white'}`}>
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2 rounded-md capitalize">
                           {place.category}
                         </span>
                         {place.actualCost > 0 ? (
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-500 tabular-nums">Spent: ₹{place.actualCost}</span>
                         ) : (
                            <span className="text-xs font-bold text-zinc-400 tabular-nums">Est: ₹{place.estimatedCost}</span>
                         )}
                      </div>
                   </div>
                   <button className="text-zinc-300 hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </motion.div>
             ))}

             <button className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 font-bold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/10 mt-6">
                <Plus className="w-5 h-5" /> Add Place to Day {activeDay}
             </button>
          </div>
        </div>

        {/* Right Panel: Active Leaflet Map */}
        <div className="flex-1 hidden lg:flex bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
            <Map 
               center={mapMarkers.length > 0 ? [mapMarkers[0].lat, mapMarkers[0].lng] : [28.6139, 77.2090]} // default Delhi or first marker
               zoom={13}
               markers={mapMarkers}
               focusedPlaceId={focusedPlaceId}
               onMarkerClick={handlePlaceClick}
               routeEnabled={true}
            />
        </div>
      </div>
    </div>
  );
}
