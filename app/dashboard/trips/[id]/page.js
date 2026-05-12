"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, ChevronLeft, Plus, GripVertical, CheckCircle2, Clock, Trash2, MapIcon, Route } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Map from "@/components/map/Map";
import { Calendar } from "@/components/ui/calendar";
import { gridStaggerContainer, gridCardVariant } from "@/lib/animations";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

const MOCK_TRIP = {
  id: "t1", name: "Weekend in Mumbai",
  city: { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  budget: 9000, eventsDateMap: ["2026-10-24", "2026-10-25"],
  days: [
    { day: 1, date: "Oct 24, 2026", rawDate: "2026-10-24", places: [
      { id: "p1", name: "Gateway of India", type: "attraction", cost: 0, timeSlot: "09:00 AM", lat: 18.9220, lng: 72.8347 },
      { id: "p2", name: "Leopold Cafe", type: "food", cost: 1200, timeSlot: "01:30 PM", lat: 18.9230, lng: 72.8322 },
      { id: "p3", name: "Colaba Causeway", type: "shopping", cost: 2500, timeSlot: "04:00 PM", lat: 18.9181, lng: 72.8276 },
      { id: "p4", name: "Marine Drive", type: "attraction", cost: 0, timeSlot: "07:00 PM", lat: 18.9441, lng: 72.8228 },
    ]},
    { day: 2, date: "Oct 25, 2026", rawDate: "2026-10-25", places: [
      { id: "p5", name: "Bandra-Worli Sea Link", type: "transport", cost: 150, timeSlot: "10:00 AM", lat: 19.0357, lng: 72.8170 },
      { id: "p6", name: "Mount Mary Church", type: "attraction", cost: 0, timeSlot: "11:30 AM", lat: 19.0466, lng: 72.8224 },
      { id: "p7", name: "Bandra Linking Road", type: "shopping", cost: 3000, timeSlot: "02:00 PM", lat: 19.0620, lng: 72.8360 },
      { id: "p8", name: "Carter Road Social", type: "food", cost: 2000, timeSlot: "08:00 PM", lat: 19.0655, lng: 72.8207 },
    ]},
    { day: 3, date: "Oct 26, 2026", rawDate: "2026-10-26", places: [] }
  ]
};

const TYPE_COLORS = {
  food: "bg-postit text-foreground border-foreground",
  attraction: "bg-secondary/10 text-secondary border-secondary/30",
  shopping: "bg-accent/10 text-accent border-accent/30",
  transport: "bg-muted text-foreground/60 border-foreground/20",
  stay: "bg-secondary/10 text-secondary border-secondary/30",
};

export default function TripPlannerPage() {
  const params = useParams();
  const [trip, setTrip] = useState(MOCK_TRIP);
  const [activeDay, setActiveDay] = useState(1);
  const [focusedPlaceId, setFocusedPlaceId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [draggedPlaceId, setDraggedPlaceId] = useState(null);
  const [dragOverPlaceId, setDragOverPlaceId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentDayData = trip.days.find(d => d.day === activeDay);
  const mapMarkers = currentDayData?.places || [];
  const totalSpent = trip.days.reduce((acc, d) => acc + d.places.reduce((sub, p) => sub + (p.cost || 0), 0), 0);

  const triggerAutosave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 800); };
  const handlePlaceClick = (id) => { setFocusedPlaceId(id); document.getElementById(`place-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const handleDaySelectFromCalendar = (date) => {
    if(!date) return;
    const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const matched = trip.days.find(d => d.rawDate === dateStr);
    if (matched) { setActiveDay(matched.day); setShowCalendar(false); }
  };
  const handleDeletePlace = (e, placeId) => {
    e.stopPropagation();
    setTrip(prev => { const next = {...prev}; const dayIdx = next.days.findIndex(d => d.day === activeDay); if(dayIdx !== -1) next.days[dayIdx].places = next.days[dayIdx].places.filter(p => p.id !== placeId); return next; });
    triggerAutosave();
  };
  const handleDragStart = (e, id) => { setDraggedPlaceId(id); e.dataTransfer.effectAllowed = "move"; setTimeout(() => { if (e.target) e.target.style.opacity = "0.4"; }, 0); };
  const handleDragEnter = (e, id) => { e.preventDefault(); setDragOverPlaceId(id); };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDragEnd = (e) => { if (e.target) e.target.style.opacity = "1"; setDraggedPlaceId(null); setDragOverPlaceId(null); };
  const handleDrop = (e, dropId) => {
    e.preventDefault(); if (draggedPlaceId === null || draggedPlaceId === dropId) { setDraggedPlaceId(null); setDragOverPlaceId(null); return; }
    setTrip(prevTrip => { const newTrip = {...prevTrip}; const dayIndex = newTrip.days.findIndex(d => d.day === activeDay); if (dayIndex === -1) return prevTrip; const places = [...newTrip.days[dayIndex].places]; const dragIdx = places.findIndex(p => p.id === draggedPlaceId); const dropIdx = places.findIndex(p => p.id === dropId); if (dragIdx > -1 && dropIdx > -1) { const [draggedItem] = places.splice(dragIdx, 1); places.splice(dropIdx, 0, draggedItem); newTrip.days[dayIndex].places = places; } return newTrip; });
    triggerAutosave(); setDraggedPlaceId(null); setDragOverPlaceId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b-2 border-dashed border-foreground/15 pb-4">
        <div>
          <Link href="/dashboard/trips" className="text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1.5 text-base font-body mb-2">
            <ChevronLeft className="w-4 h-4" /> Trip Manager
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-heading font-bold text-foreground">{trip.name}</h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-paper border-2 border-foreground text-sm font-body text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>
              <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} /> {trip.city.name}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-paper border-2 border-foreground text-sm font-body text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>
              <CalendarIcon className="w-3.5 h-3.5" strokeWidth={2.5} /> {trip.days.length} Days
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <button onClick={() => setShowCalendar(!showCalendar)}
              className={`flex items-center gap-2 text-sm font-body px-4 py-2 border-2 border-foreground transition-all ${showCalendar ? 'bg-foreground text-paper' : 'bg-paper text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]'}`}
              style={{ borderRadius: WB }}>
              <CalendarIcon className="w-4 h-4" strokeWidth={2.5}/> Schedule Map
            </button>
            <button onClick={() => setShowRoute(!showRoute)}
              className={`flex items-center gap-2 text-sm font-body px-4 py-2 border-2 border-foreground transition-all ${showRoute ? 'bg-foreground text-paper' : 'bg-paper text-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]'}`}
              style={{ borderRadius: WB }}>
              <Route className="w-4 h-4" strokeWidth={2.5}/> {showRoute ? 'Hide Route' : 'Show Route'}
            </button>
            <div className="flex items-center gap-1.5 text-sm font-body text-foreground/30">
              {isSaving ? <span className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-foreground/20 border-t-foreground/50 animate-spin" style={{ borderRadius: "50%" }}/> Saving...</span>
                : <span className="flex items-center gap-1 text-secondary"><CheckCircle2 className="w-3.5 h-3.5"/> Saved</span>}
            </div>
          </div>
        </div>

        <div className="bg-paper border-2 border-foreground p-4 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)] text-left md:text-right w-full md:w-auto min-w-[240px]" style={{ borderRadius: WB2 }}>
          <p className="text-xs font-heading font-bold text-foreground/40 uppercase mb-1">Total Expenditure</p>
          <div className="flex items-baseline justify-start md:justify-end gap-1.5">
            <span className="text-3xl font-heading font-bold text-foreground tabular-nums leading-none">₹{totalSpent}</span>
            <span className="text-foreground/30 font-body tabular-nums text-sm">/ ₹{trip.budget}</span>
          </div>
          <div className="w-full h-2 bg-muted/30 border-2 border-foreground mt-3 overflow-hidden" style={{ borderRadius: WB }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((totalSpent/trip.budget)*100, 100)}%` }} transition={{ duration: 0.8 }} className="bg-secondary h-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative">
        <AnimatePresence>
          {showCalendar && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 left-0 z-50 bg-paper border-2 border-foreground shadow-sketch-lg" style={{ borderRadius: WB2 }}>
              <Calendar mode="single" selected={new Date(currentDayData.rawDate)} onSelect={handleDaySelectFromCalendar} events={trip.eventsDateMap} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Panel: Day Planner */}
        <div className="w-full lg:w-[480px] flex flex-col bg-paper border-2 border-foreground overflow-hidden flex-shrink-0 z-10 relative shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB2 }}>
          <div className="flex overflow-x-auto no-scrollbar border-b-2 border-foreground">
            {trip.days.map((d) => (
              <button key={d.day} onClick={() => { setActiveDay(d.day); setFocusedPlaceId(null); }}
                className={`flex-1 min-w-[80px] px-4 py-4 border-b-[3px] transition-all flex flex-col items-center justify-center ${activeDay === d.day ? "border-accent text-accent bg-accent/5" : "border-transparent text-foreground/40 hover:text-foreground hover:bg-muted/30"}`}>
                <span className="font-heading font-bold text-base leading-none">Day {d.day}</span>
                <span className="block text-xs font-body opacity-60 mt-1.5 uppercase leading-none">{d.date.split(',')[0]}</span>
              </button>
            ))}
            <button className="px-6 border-b-[3px] border-transparent text-foreground/30 hover:text-foreground transition-colors bg-muted/10">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mapMarkers.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-muted/30 border-2 border-dashed border-foreground/20 flex items-center justify-center mb-6" style={{ borderRadius: WB }}>
                  <MapIcon className="w-6 h-6 text-foreground/20" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg">Start building your itinerary</h3>
                <p className="text-base font-body text-foreground/40 mt-2 mb-8">Add places you want to visit on Day {activeDay}.</p>
                <button className="px-6 py-2.5 bg-accent text-white font-body border-[3px] border-foreground shadow-sketch hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-base flex items-center gap-2" style={{ borderRadius: WB }}>
                  <Plus className="w-4 h-4" /> Add places
                </button>
              </motion.div>
            ) : (
              <motion.div variants={gridStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
                {mapMarkers.map((place) => (
                  <motion.div variants={gridCardVariant} id={`place-${place.id}`} key={place.id}
                    draggable="true" onDragStart={(e) => handleDragStart(e, place.id)} onDragEnter={(e) => handleDragEnter(e, place.id)} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDrop={(e) => handleDrop(e, place.id)}
                    onClick={() => handlePlaceClick(place.id)}
                    className={`group border-2 p-4 flex items-center gap-3 transition-all cursor-pointer ${
                      focusedPlaceId === place.id ? "bg-postit border-foreground shadow-sketch" : "bg-paper border-foreground/30 shadow-[2px_2px_0px_0px_rgba(45,45,45,0.05)] hover:border-foreground hover:shadow-sketch"
                    } ${dragOverPlaceId === place.id && draggedPlaceId !== place.id ? "border-t-[3px] border-t-accent" : ""}`}
                    style={{ borderRadius: WB }}>
                    <div className="text-foreground/20 cursor-grab active:cursor-grabbing hover:bg-muted p-1.5 transition-colors hidden md:block" style={{ borderRadius: WB }}>
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-heading font-bold truncate text-base text-foreground">{place.name}</h4>
                        <span className="text-sm font-heading font-bold text-foreground tabular-nums">₹{place.cost}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-body font-bold px-2 py-0.5 border-2 uppercase ${TYPE_COLORS[place.type] || TYPE_COLORS.transport}`} style={{ borderRadius: WB }}>{place.type}</span>
                        {place.timeSlot && (
                          <span className="flex items-center gap-1 text-xs font-body text-foreground/40 bg-muted/30 border border-foreground/10 px-2 py-0.5" style={{ borderRadius: WB }}>
                            <Clock className="w-3 h-3" strokeWidth={3} /> {place.timeSlot}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={(e) => handleDeletePlace(e, place.id)} className="text-foreground/15 hover:text-accent opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-accent/5 shrink-0" style={{ borderRadius: WB }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {mapMarkers.length > 0 && (
              <button className="w-full py-4 border-2 border-dashed border-foreground/20 text-foreground/40 font-body flex items-center justify-center gap-2 hover:border-foreground hover:text-foreground transition-all bg-muted/10 mt-4 text-base" style={{ borderRadius: WB }}>
                <Plus className="w-4 h-4" /> Add Destination
              </button>
            )}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="flex-1 hidden lg:flex overflow-hidden relative z-0 isolate bg-muted/20 border-2 border-foreground" style={{ borderRadius: WB }}>
          <Map center={trip.city ? [trip.city.lat, trip.city.lng] : [19.0760, 72.8777]} zoom={12} markers={mapMarkers} focusedPlaceId={focusedPlaceId} onMarkerClick={handlePlaceClick} routeEnabled={showRoute} />
        </div>
      </div>
    </div>
  );
}
