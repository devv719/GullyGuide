"use client";

import { useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Plus } from "lucide-react";

// Fix default marker icon issues in Next.js + Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const TYPE_COLORS = {
  food: '#f59e0b',        // amber-500
  attraction: '#4f46e5',  // indigo-600
  shopping: '#a855f7',    // purple-500
  transport: '#71717a',   // zinc-500
  stay: '#14b8a6',        // teal-500
};

// Generates dynamic SVG dot markers
const createCustomIcon = (active, type) => {
  const color = TYPE_COLORS[type] || '#18181b'; // default zinc-900
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        background-color: ${color}; 
        border: 3px solid ${active ? '#ffffff' : '#f4f4f5'}; 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
        transform: scale(${active ? '1.3' : '1.0'});
        z-index: ${active ? 999 : 1};
        position: relative;
      "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12], 
  });
};

function MapPanController({ markers, focusedPlaceId }) {
  const map = useMap();

  useEffect(() => {
    if (focusedPlaceId && markers?.length) {
      const activeMarker = markers.find((m) => m.id === focusedPlaceId);
      if (activeMarker && activeMarker.lat && activeMarker.lng) {
         map.flyTo([activeMarker.lat, activeMarker.lng], 16, { duration: 1.2, easeLinearity: 0.1 });
      }
    }
  }, [focusedPlaceId, markers, map]);

  useEffect(() => {
      // Auto-zoom fit bounds if > 1 marker and NO currently focused place
      if (!focusedPlaceId && markers?.length > 1) {
          const latlngs = markers.map(m => [m.lat, m.lng]);
          const bounds = L.latLngBounds(latlngs);
          map.fitBounds(bounds, { padding: [60, 60], animate: true, maxZoom: 15 });
      }
  }, [markers, focusedPlaceId, map]);

  return null;
}

function MapCenterController({ center, markers }) {
  const map = useMap();
  useEffect(() => {
     if ((!markers || markers.length === 0) && center && center.length === 2 && !isNaN(center[0])) {
         map.setView(center, 13, { animate: true });
     }
  }, [center, markers, map]);
  return null;
}

export default function MapClient({ 
  center = null, 
  zoom = 13, 
  markers = [], 
  focusedPlaceId = null,
  onMarkerClick,
  routeEnabled = false 
}) {

  // Memoized coordinate array sequence purely for plotting Polyline rendering avoiding re-traces
  const routeCoordinates = useMemo(() => markers.map(m => [m.lat, m.lng]), [markers]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden z-0 isolate shadow-inner border border-zinc-200 dark:border-zinc-800 relative bg-zinc-50 dark:bg-[#09090b]">
      {/* If center evaluates totally blank, delay initialization to avoid rendering the Equator */}
      {center && (
        <MapContainer 
          center={center} 
          zoom={zoom} 
          scrollWheelZoom={true}
          className="w-full h-full z-0 font-sans"
          zoomControl={false} 
        >
          <MapPanController markers={markers} focusedPlaceId={focusedPlaceId} />
          <MapCenterController center={center} markers={markers} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Cleaner vector-style tile map
            className="map-tiles"
          />

          {routeEnabled && routeCoordinates.length > 1 && (
            <Polyline 
               positions={routeCoordinates} 
               pathOptions={{ 
                 color: '#3b82f6', 
                 weight: 4, 
                 dashArray: '8, 8', 
                 lineCap: 'round',
                 lineJoin: 'round',
                 opacity: 0.6 
               }} 
            />
          )}

          {markers.map((marker) => (
            <Marker 
               key={marker.id} 
               position={[marker.lat, marker.lng]}
               icon={createCustomIcon(focusedPlaceId === marker.id, marker.type)}
               eventHandlers={{
                 click: () => onMarkerClick?.(marker.id),
               }}
            >
              <Popup className="custom-popup" closeButton={false}>
                 <div className="p-1">
                   <h4 className="font-extrabold text-sm text-zinc-900 leading-tight">{marker.name}</h4>
                   <div className="flex items-center gap-2 mt-1 mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{marker.type}</span>
                     <span className="text-[10px] font-bold text-zinc-400 tabular-nums ml-auto">₹{marker.cost || 0}</span>
                   </div>
                   <button className="w-full py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
                     <Plus className="w-3 h-3" /> Add to Itinerary
                   </button>
                 </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* Modern map overriding elements */}
      <style jsx global>{`
        .leaflet-container {
          background-color: #f4f4f5 !important;
        }
        .dark .leaflet-container {
           background-color: #09090b !important;
        }
        .dark .map-tiles {
           filter: invert(1) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none; /* Hide standard white arrow for sleeker look */
        }
        .leaflet-popup-content p {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
