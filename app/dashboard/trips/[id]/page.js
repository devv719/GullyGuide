"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, ChevronLeft, Plus, GripVertical, CheckCircle2, Clock, Trash2, MapIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Map from "@/components/map/Map";
import { Calendar } from "@/components/ui/calendar";

// Strict Layout Schema enforcing no loose strings for map bounds.
const MOCK_TRIP = {
  id: "t1",
  name: "Weekend in Mumbai",
  city: {
    name: "Mumbai",
    lat: 19.0760,
    lng: 72.8777
  },
  budget: 9000,
  eventsDateMap: ["2026-10-24", "2026-10-25"], 
  days: [
    {
      day: 1,
      date: "Oct 24, 2026",
      rawDate: "2026-10-24",
      places: [
        { id: "p1", name: "Gateway of India", type: "attraction", cost: 0, timeSlot: "09:00 AM", lat: 18.9220, lng: 72.8347 },
        { id: "p2", name: "Leopold Cafe", type: "food", cost: 1200, timeSlot: "01:30 PM", lat: 18.9230, lng: 72.8322 },
        { id: "p3", name: "Colaba Causeway", type: "shopping", cost: 2500, timeSlot: "04:00 PM", lat: 18.9181, lng: 72.8276 },
        { id: "p4", name: "Marine Drive", type: "attraction", cost: 0, timeSlot: "07:00 PM", lat: 18.9441, lng: 72.8228 },
      ]
    },
    {
      day: 2,
      date: "Oct 25, 2026",
      rawDate: "2026-10-25",
      places: [
        { id: "p5", name: "Bandra-Worli Sea Link", type: "transport", cost: 150, timeSlot: "10:00 AM", lat: 19.0357, lng: 72.8170 },
        { id: "p6", name: "Mount Mary Church", type: "attraction", cost: 0, timeSlot: "11:30 AM", lat: 19.0466, lng: 72.8224 },
        { id: "p7", name: "Bandra Linking Road", type: "shopping", cost: 3000, timeSlot: "02:00 PM", lat: 19.0620, lng: 72.8360 },
        { id: "p8", name: "Carter Road Social", type: "food", cost: 2000, timeSlot: "08:00 PM", lat: 19.0655, lng: 72.8207 },
      ]
    },
    {
      day: 3,
      date: "Oct 26, 2026",
      rawDate: "2026-10-26",
      places: [] // Empty state testing
    }
  ]
};

const TYPE_COLORS = {
  food: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  attraction: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
  shopping: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
  transport: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20",
  stay: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20",
};

export default function TripPlannerPage() {
  const params = useParams();
  const [trip, setTrip] = useState(MOCK_TRIP);
  const [activeDay, setActiveDay] = useState(1);
  const [focusedPlaceId, setFocusedPlaceId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Drag and Drop state
  const [draggedPlaceId, setDraggedPlaceId] = useState(null);
  const [dragOverPlaceId, setDragOverPlaceId] = useState(null);

  // Autosave UI flags
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());

  const currentDayData = trip.days.find(d => d.day === activeDay);
  const mapMarkers = currentDayData?.places || [];
  
  // Sum array cost mapping
  const totalSpent = trip.days.reduce((acc, d) => 
     acc + d.places.reduce((sub, p) => sub + (p.cost || 0), 0), 0
  );

  useEffect(() => {
     if(!trip.city || !trip.city.lat) return;
  }, [trip]);

  const triggerAutosave = () => {
     setIsSaving(true);
     setTimeout(() => {
        setIsSaving(false);
        setLastSaved(Date.now());
     }, 800);
  };

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

  const handleDeletePlace = (e, placeId) => {
      e.stopPropagation();
      setTrip(prev => {
        const next = { ...prev };
        const dayIdx = next.days.findIndex(d => d.day === activeDay);
        if(dayIdx !== -1) {
           next.days[dayIdx].places = next.days[dayIdx].places.filter(p => p.id !== placeId);
        }
        return next;
      });
      triggerAutosave();
  };

  // Drag and drop event handlers
  const handleDragStart = (e, id) => {
    setDraggedPlaceId(id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      if (e.target) e.target.style.opacity = "0.4";
    }, 0);
  };

  const handleDragEnter = (e, id) => {
    e.preventDefault();
    setDragOverPlaceId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
    setDraggedPlaceId(null);
    setDragOverPlaceId(null);
  };

  const handleDrop = (e, dropId) => {
    e.preventDefault();
    if (draggedPlaceId === null || draggedPlaceId === dropId) {
      setDraggedPlaceId(null);
      setDragOverPlaceId(null);
      return;
    }

    setTrip(prevTrip => {
      const newTrip = { ...prevTrip };
      const dayIndex = newTrip.days.findIndex(d => d.day === activeDay);
      if (dayIndex === -1) return prevTrip;
      
      const places = [...newTrip.days[dayIndex].places];
      const dragIdx = places.findIndex(p => p.id === draggedPlaceId);
      const dropIdx = places.findIndex(p => p.id === dropId);
      
      if (dragIdx > -1 && dropIdx > -1) {
        const [draggedItem] = places.splice(dragIdx, 1);
        places.splice(dropIdx, 0, draggedItem);
        newTrip.days[dayIndex].places = places;
      }
      return newTrip;
    });
    
    triggerAutosave();
    setDraggedPlaceId(null);
    setDragOverPlaceId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full font-sans tracking-tight">
      
      {/* Premium Header Alignment */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-[#1F2937] pb-4">
        <div>
          <Link href="/dashboard/trips" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-sm font-semibold mb-2">
             <ChevronLeft className="w-4 h-4" /> Trip Manager
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black text-zinc-900 dark:text-white">{trip.name}</h1>
             <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-400">
               <MapPin className="w-3.5 h-3.5" /> {trip.city.name}
             </span>
             <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <CalendarIcon className="w-3.5 h-3.5" /> {trip.days.length} Days
             </span>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
             <button 
               onClick={() => setShowCalendar(!showCalendar)}
               className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-colors border shadow-sm ${showCalendar ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-white dark:text-indigo-900 dark:border-white' : 'bg-white dark:bg-[#0B0F19] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#1F2937] hover:bg-zinc-50 dark:hover:bg-[#111827]'}`}
             >
               <CalendarIcon className="w-4 h-4"/> Schedule Map
             </button>

             <motion.div initial={{ opacity: 0}} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                {isSaving ? (
                  <span className="flex items-center gap-1 text-zinc-500"><div className="w-3 h-3 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-500 animate-spin"/> Saving...</span>
                ) : (
                  <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500"><CheckCircle2 className="w-3.5 h-3.5"/> Saved</span>
                )}
             </motion.div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-[#1F2937] p-4 rounded-xl shadow-sm text-left md:text-right w-full md:w-auto min-w-[240px]">
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Expenditure</p>
           <div className="flex items-baseline justify-start md:justify-end gap-1.5">
             <span className="text-3xl font-black text-zinc-900 dark:text-white tabular-nums leading-none">₹{totalSpent}</span>
             <span className="text-zinc-400 font-bold tabular-nums text-sm">/ ₹{trip.budget}</span>
           </div>
           <div className="w-full h-1.5 bg-zinc-100 dark:bg-[#1F2937] rounded-full mt-3 overflow-hidden flex">
             <div className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-l-full transition-all duration-300" style={{ width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative">
        
        <AnimatePresence>
            {showCalendar && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="absolute top-0 left-0 z-50 bg-white dark:bg-[#111827] rounded-xl shadow-xl border border-zinc-200 dark:border-[#1F2937]"
               >
                 <Calendar 
                   mode="single"
                   selected={new Date(currentDayData.rawDate)}
                   onSelect={handleDaySelectFromCalendar}
                   events={trip.eventsDateMap}
                 />
               </motion.div>
            )}
        </AnimatePresence>

        {/* Left Panel: Day Planner */}
        <div className="w-full lg:w-[480px] flex flex-col bg-white dark:bg-[#0B0F19] border border-zinc-200 dark:border-[#1F2937] rounded-xl shadow-sm overflow-hidden flex-shrink-0 z-10 relative">
          
          <div className="flex overflow-x-auto scrollbar-hide border-b border-zinc-100 dark:border-[#1F2937]">
             {trip.days.map((d) => (
                <button 
                  key={d.id}
                  onClick={() => {
                     setActiveDay(d.day);
                     setFocusedPlaceId(null);
                  }}
                  className={`flex-1 min-w-[80px] px-4 py-4 border-b-[3px] transition-all flex flex-col items-center justify-center ${activeDay === d.day ? "border-indigo-600 text-indigo-700 bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:bg-indigo-900/20" : "border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-[#111827]"}`}
                >
                  <span className="font-extrabold text-sm tracking-tight leading-none">Day {d.day}</span>
                  <span className="block text-[10px] font-bold opacity-60 mt-1.5 tracking-widest uppercase leading-none">{d.date.split(',')[0]}</span>
                </button>
             ))}
             <button className="px-6 border-b-[3px] border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-50/50 dark:bg-[#111827]/50">
                <Plus className="w-4 h-4" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             
             {mapMarkers.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center p-8">
                     <div className="w-16 h-16 bg-zinc-50 dark:bg-[#111827] border border-zinc-200 dark:border-[#1F2937] rounded-full flex items-center justify-center mb-6">
                        <MapIcon className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                     </div>
                     <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Start building your itinerary</h3>
                     <p className="text-sm font-medium text-zinc-500 mt-2 mb-8">Add places you want to visit on Day {activeDay}.</p>
                     <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm transition-colors active:scale-[0.98] text-sm flex items-center gap-2">
                         <Plus className="w-4 h-4" /> Add places
                     </button>
                 </div>
             ) : (
                mapMarkers.map((place, idx) => (
                    <div 
                      id={`place-${place.id}`}
                      key={place.id}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, place.id)}
                      onDragEnter={(e) => handleDragEnter(e, place.id)}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, place.id)}
                      onClick={() => handlePlaceClick(place.id)}
                      className={`group border p-4 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                          focusedPlaceId === place.id 
                           ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-300 dark:border-indigo-700 shadow-md" 
                           : "bg-white dark:bg-[#0B0F19] border-zinc-200 dark:border-[#1F2937] shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow"
                      } ${dragOverPlaceId === place.id && draggedPlaceId !== place.id ? "border-t-2 border-t-indigo-500 my-1" : ""}`}
                    >
                       <div className="text-zinc-300 dark:text-zinc-700 cursor-grab active:cursor-grabbing hover:bg-zinc-100 dark:hover:bg-[#111827] p-1.5 rounded transition-colors hide-on-mobile hidden md:block">
                         <GripVertical className="w-4 h-4" />
                       </div>
                       
                       <div className="flex-1 overflow-hidden">
                          <div className="flex items-start justify-between mb-1">
                             <h4 className="font-bold truncate text-[15px] text-zinc-900 dark:text-white tracking-tight">
                               {place.name}
                             </h4>
                             <span className="text-xs font-black text-zinc-900 dark:text-zinc-300 tabular-nums">
                               ₹{place.cost}
                             </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${TYPE_COLORS[place.type] || TYPE_COLORS.transport}`}>
                               {place.type}
                             </span>
                             {place.timeSlot && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 bg-zinc-50 dark:bg-[#111827] border border-zinc-100 dark:border-[#1F2937] px-2 py-0.5 rounded">
                                  <Clock className="w-3 h-3" /> {place.timeSlot}
                                </span>
                             )}
                          </div>
                       </div>
                       
                       <button onClick={(e) => handleDeletePlace(e, place.id)} className="text-zinc-300 hover:text-red-600 dark:text-zinc-700 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg shrink-0">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 ))
             )}

             {mapMarkers.length > 0 && (
                 <button className="w-full py-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-500 font-bold flex items-center justify-center gap-2 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all bg-zinc-50 dark:bg-[#111827]/50 mt-4 shadow-sm active:scale-[0.99] text-sm">
                    <Plus className="w-4 h-4" /> Add Destination
                 </button>
             )}
          </div>
        </div>

        {/* Right Panel: Map Base */}
        <div className="flex-1 hidden lg:flex rounded-xl overflow-hidden relative shadow-sm border border-zinc-200 dark:border-[#1F2937] z-0 isolate bg-zinc-50 dark:bg-[#0B0F19]">
            <Map 
               center={trip.city ? [trip.city.lat, trip.city.lng] : [19.0760, 72.8777]}
               zoom={12}
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
