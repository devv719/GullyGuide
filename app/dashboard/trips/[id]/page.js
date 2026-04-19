"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, ChevronLeft, Plus, Grab, Coffee, Bed, Bus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/map/Map";
import { Calendar } from "@/components/ui/calendar";

const MOCK_TRIP = {
  id: "t1",
  title: "Weekend in Mumbai",
  cityName: "Mumbai",
  coordinates: {
    lat: 19.0760,
    lng: 72.8777
  },
  budget: 9000,
  spent: 1200,
  eventsDateMap: ["2026-10-24", "2026-10-25"], // For our calendar
  days: [
    {
      id: "d1",
      day: 1,
      date: "Oct 24, 2026",
      rawDate: "2026-10-24",
      places: [
        { id: "p1", name: "Gateway of India", category: "attraction", estimatedCost: 0, actualCost: 0, lat: 18.9220, lng: 72.8347 },
        { id: "p2", name: "Leopold Cafe", category: "food", estimatedCost: 1500, actualCost: 1200, lat: 18.9230, lng: 72.8322 },
        { id: "p3", name: "Marine Drive", category: "attraction", estimatedCost: 0, actualCost: 0, lat: 18.9441, lng: 72.8228 },
      ]
    },
    {
      id: "d2",
      day: 2,
      date: "Oct 25, 2026",
      rawDate: "2026-10-25",
      places: [
        { id: "p4", name: "Bandra-Worli Sea Link", category: "transport", estimatedCost: 150, actualCost: 0, lat: 19.0357, lng: 72.8170 },
        { id: "p5", name: "Mount Mary Church", category: "attraction", estimatedCost: 0, actualCost: 0, lat: 19.0466, lng: 72.8224 },
        { id: "p6", name: "Carter Road Social", category: "food", estimatedCost: 2000, actualCost: 0, lat: 19.0655, lng: 72.8207 },
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
  
  // Real implementation would fetch from Firestore based on params.id
  // and load into state.
  const [trip, setTrip] = useState(MOCK_TRIP);
  
  const [activeDay, setActiveDay] = useState(1);
  const [focusedPlaceId, setFocusedPlaceId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Derive the map center from the exact Trip structured output hook
  const [mapCenter, setMapCenter] = useState([trip.coordinates.lat, trip.coordinates.lng]);

  useEffect(() => {
     // If the trip or its coordinates change downstream, trigger a re-center
     if(trip?.coordinates) {
         setMapCenter([trip.coordinates.lat, trip.coordinates.lng]);
     }
  }, [trip]);

  const currentDayData = trip.days.find(d => d.day === activeDay);
  const mapMarkers = currentDayData?.places || [];

  const handlePlaceClick = (id) => {
    setFocusedPlaceId(id);
    const el = document.getElementById(`place-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDaySelectFromCalendar = (date) => {
     if(!date) return;
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0');
     const day = String(date.getDate()).padStart(2, '0');
     const dateStr = `${year}-${month}-${day}`;
     
     const matchedDay = trip.days.find(d => d.rawDate === dateStr);
     if (matchedDay) {
       setActiveDay(matchedDay.day);
       setShowCalendar(false);
     }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/trips" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold mb-2">
             <ChevronLeft className="w-4 h-4" /> Back to Manager
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{trip.title}</h1>
          <div className="flex items-center gap-4 mt-2">
             <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm"><MapPin className="w-4 h-4 text-primary"/> {trip.cityName || trip.city}</span>
             <button 
               onClick={() => setShowCalendar(!showCalendar)}
               className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border transition-colors shadow-sm ${showCalendar ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-primary/50'}`}
             >
               <CalendarIcon className="w-4 h-4"/> Schedule Dates
             </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm text-left md:text-right w-full md:w-auto min-w-[250px]">
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Budget Tracker</p>
           <div className="flex items-end justify-start md:justify-end gap-2">
             <span className="text-3xl font-black text-amber-600 dark:text-amber-500 tabular-nums leading-none">₹{trip.spent}</span>
             <span className="text-zinc-400 font-bold mb-1 tabular-nums text-sm">/ ₹{trip.budget}</span>
           </div>
           {/* Progress bar */}
           <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
             <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(trip.spent / trip.budget) * 100}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative">
        
        {/* Floating Calendar Widget */}
        {showCalendar && (
           <div className="absolute top-0 left-0 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
             <Calendar 
               mode="single"
               selected={new Date(currentDayData.rawDate)}
               onSelect={handleDaySelectFromCalendar}
               events={trip.eventsDateMap}
             />
           </div>
        )}

        {/* Left Panel: Day Planner */}
        <div className="w-full lg:w-[450px] flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 z-10 relative">
          {/* Day Tabs Elements */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-x-auto scrollbar-hide">
             {trip.days.map((d) => (
                <button 
                  key={d.id}
                  onClick={() => {
                     setActiveDay(d.day);
                     setFocusedPlaceId(null);
                  }}
                  className={`px-8 py-5 border-b-2 whitespace-nowrap transition-colors flex flex-col items-center justify-center ${activeDay === d.day ? "border-primary text-primary bg-primary/5" : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                >
                  <span className="font-extrabold text-sm tracking-tight">Day {d.day}</span>
                  <span className="block text-[10px] font-bold opacity-70 mt-1 tracking-widest uppercase">{d.date}</span>
                </button>
             ))}
             <button className="px-6 py-4 text-zinc-400 hover:text-primary transition-colors flex items-center justify-center border-b-2 border-transparent">
                <Plus className="w-5 h-5" />
             </button>
          </div>

          {/* Place List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
             {currentDayData?.places.map((place, idx) => (
                <motion.div 
                  id={`place-${place.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={place.id} 
                  onClick={() => handlePlaceClick(place.id)}
                  className={`group border p-4 rounded-xl flex items-center gap-4 transition-all cursor-pointer shadow-sm ${
                      focusedPlaceId === place.id 
                       ? "bg-primary/5 border-primary ring-1 ring-primary/20 scale-[1.02]" 
                       : "bg-white dark:bg-[#0B0F19] border-zinc-200 dark:border-zinc-800 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                   <div className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 cursor-grab active:cursor-grabbing hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-md transition-colors">
                     <Grab className="w-4 h-4" />
                   </div>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 ${focusedPlaceId === place.id ? 'bg-white dark:bg-zinc-900 shadow-sm' : 'bg-zinc-50 dark:bg-zinc-900'}`}>
                     {CATEGORY_ICONS[place.category]}
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <h4 className={`font-extrabold truncate text-base ${focusedPlaceId === place.id ? 'text-primary dark:text-white' : 'text-zinc-900 dark:text-white'}`}>
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                         <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
                           {place.category}
                         </span>
                         {place.actualCost > 0 ? (
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-500 tabular-nums">Spent: ₹{place.actualCost}</span>
                         ) : (
                            <span className="text-xs font-bold text-zinc-400 tabular-nums">Est: ₹{place.estimatedCost}</span>
                         )}
                      </div>
                   </div>
                   <button className="text-zinc-300 hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </motion.div>
             ))}

             <button className="w-full py-5 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-500 font-bold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all hover:bg-teal-50 dark:hover:bg-teal-900/10 mt-6 shadow-sm active:scale-95">
                <Plus className="w-5 h-5" /> Add Location to Day {activeDay}
             </button>
          </div>
        </div>

        {/* Right Panel: Active Leaflet Map */}
        <div className="flex-1 hidden lg:flex bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative shadow-inner z-0">
            <Map 
               center={mapCenter}
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
