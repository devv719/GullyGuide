"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation } from "lucide-react";

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

// Custom dot icon specific to SaaS app aesthetics
const createCustomIcon = (active) => {
  return L.divIcon({
    className: "bg-transparent",
    html: `<div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${active ? '#4f46e5' : '#18181b'}; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s; transform: scale(${active ? '1.2' : '1.0'});"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10], // exact center
  });
};

// Hook to control panning the map whenever `focusedPlaceId` changes
function MapPanController({ markers, focusedPlaceId }) {
  const map = useMap();

  useEffect(() => {
    if (focusedPlaceId && markers?.length) {
      const activeMarker = markers.find((m) => m.id === focusedPlaceId);
      if (activeMarker && activeMarker.lat && activeMarker.lng) {
         map.flyTo([activeMarker.lat, activeMarker.lng], 15, { duration: 1.5 });
      }
    }
  }, [focusedPlaceId, markers, map]);

  // Hook to fit all bounds if itinerary changes and no place is focused
  useEffect(() => {
      if (!focusedPlaceId && markers?.length > 1) {
          const latlngs = markers.map(m => [m.lat, m.lng]);
          const bounds = L.latLngBounds(latlngs);
          // Pad bounds to ensure nodes don't hug the very edge of the viewport
          map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
  }, [markers, focusedPlaceId, map]);

  return null;
}

export default function MapClient({ 
  center = [19.0760, 72.8777], // Default: Mumbai
  zoom = 12, 
  markers = [], // { id, name, lat, lng, category }
  focusedPlaceId = null,
  onMarkerClick,
  routeEnabled = false 
}) {

  const routeCoordinates = routeEnabled ? markers.map(m => [m.lat, m.lng]) : [];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden z-0 isolate shadow-sm border border-zinc-200 dark:border-zinc-800 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false} // Disable default top-left control to position custom controls if needed
      >
        <MapPanController markers={markers} focusedPlaceId={focusedPlaceId} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {routeEnabled && routeCoordinates.length > 1 && (
          <Polyline 
             positions={routeCoordinates} 
             pathOptions={{ color: '#4f46e5', weight: 4, dashArray: '10, 10', opacity: 0.8 }} 
          />
        )}

        {markers.map((marker, idx) => (
          <Marker 
             key={marker.id} 
             position={[marker.lat, marker.lng]}
             icon={createCustomIcon(focusedPlaceId === marker.id)}
             eventHandlers={{
               click: () => onMarkerClick?.(marker.id),
             }}
          >
            <Popup className="rounded-xl overflow-hidden shadow-xl border-none">
               <div className="font-bold text-zinc-900">{marker.name}</div>
               <div className="text-xs text-zinc-500 capitalize">{marker.category}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Dark mode overriding styles specifically for standard OpenStreetMap tiles */}
      <style jsx global>{`
        .dark .map-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .leaflet-container {
          background-color: #09090b !important;
        }
        /* Fix popup styles */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
