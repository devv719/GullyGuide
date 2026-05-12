"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Plus, MapIcon, AlertTriangle } from "lucide-react";

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
  food: '#e8a900',
  attraction: '#2d9f6f',
  shopping: '#ff4d4d',
  transport: '#6b6b6b',
  stay: '#2d9f6f',
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
        border: 3px solid ${active ? '#2d2d2d' : '#fdfbf7'}; 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease; 
        transform: scale(${active ? '1.3' : '1.0'});
        z-index: ${active ? 999 : 1};
        position: relative;
        ${active ? `box-shadow: 0 0 0 4px ${color}33, 0 4px 12px rgba(0,0,0,0.15);` : ''}
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

// ── Fallback UI when map cannot load ──
function MapFallback({ markers }) {
  const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-paper border-2 border-dashed border-foreground/20 p-8" style={{ borderRadius: WB }}>
      <div className="w-16 h-16 bg-muted/30 border-2 border-dashed border-foreground/15 flex items-center justify-center mb-4" style={{ borderRadius: WB }}>
        <AlertTriangle className="w-7 h-7 text-foreground/30" />
      </div>
      <h3 className="font-heading font-bold text-foreground text-lg mb-1">Map unavailable</h3>
      <p className="text-base font-body text-foreground/40 text-center mb-6">Showing list view instead</p>
      {markers && markers.length > 0 && (
        <div className="w-full max-w-sm space-y-2">
          {markers.map((m, i) => (
            <div key={m.id || i} className="flex items-center gap-3 px-4 py-3 bg-paper border-2 border-foreground/20" style={{ borderRadius: WB }}>
              <div className="w-3 h-3 shrink-0" style={{ backgroundColor: TYPE_COLORS[m.type] || '#6b6b6b', borderRadius: '50%' }} />
              <span className="text-base font-body font-bold text-foreground truncate">{m.name}</span>
              <span className="text-sm font-body text-foreground/30 ml-auto tabular-nums">₹{m.cost || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapClient({ 
  center = null, 
  zoom = 13, 
  markers = [], 
  focusedPlaceId = null,
  onMarkerClick,
  routeEnabled = false 
}) {
  const [hasError, setHasError] = useState(false);

  // Memoized coordinate array sequence purely for plotting Polyline rendering avoiding re-traces
  const routeCoordinates = useMemo(() => markers.map(m => [m.lat, m.lng]), [markers]);

  // Validate center coordinates
  const isValidCenter = center && Array.isArray(center) && center.length === 2 && 
    !isNaN(center[0]) && !isNaN(center[1]) &&
    Math.abs(center[0]) <= 90 && Math.abs(center[1]) <= 180;

  if (hasError || !isValidCenter) {
    return <MapFallback markers={markers} />;
  }

  return (
    <div className="w-full h-full overflow-hidden z-0 isolate border-2 border-foreground relative bg-muted/10">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full z-0 font-sans"
        zoomControl={false}
        whenReady={() => console.log("[Map] ✅ Leaflet map ready")}
      >
        <MapPanController markers={markers} focusedPlaceId={focusedPlaceId} />
        <MapCenterController center={center} markers={markers} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          className="map-tiles"
          eventHandlers={{
            tileerror: () => {
              console.warn("[Map] ⚠️ Tile loading failed");
              setHasError(true);
            }
          }}
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
                 <h4 className="font-heading font-bold text-sm text-foreground leading-tight">{marker.name}</h4>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span className="text-[10px] font-body font-bold uppercase text-foreground/40">{marker.type}</span>
                    <span className="text-[10px] font-body font-bold text-foreground/30 tabular-nums ml-auto">₹{marker.cost || 0}</span>
                  </div>
                  <button className="w-full py-1.5 bg-foreground text-paper text-xs font-body font-bold hover:bg-foreground/80 transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Add to Itinerary
                  </button>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modern map overriding elements */}
      <style jsx global>{`
        .leaflet-container {
          background-color: #fdfbf7 !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 4px;
          border: 2px solid #2d2d2d;
          box-shadow: 3px 3px 0px 0px rgba(45,45,45,0.1);
          padding: 4px;
          font-family: var(--font-body);
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-popup-content p {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
