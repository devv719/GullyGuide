"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const LocationContext = createContext({});

// Module-level geocode cache — survives re-renders and component remounts
const geocodeCache = new Map();
let lastNominatimCall = 0;
const NOMINATIM_MIN_INTERVAL = 1100; // Nominatim policy: max 1 request per second

/**
 * Rate-limited Nominatim fetch — ensures ≤1 req/sec
 */
async function rateLimitedFetch(url) {
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < NOMINATIM_MIN_INTERVAL) {
    await new Promise(r => setTimeout(r, NOMINATIM_MIN_INTERVAL - elapsed));
  }
  lastNominatimCall = Date.now();
  return fetch(url, {
    headers: { "User-Agent": "GullyGuide/1.0 (student-guide-platform)" }
  });
}

export function LocationProvider({ children }) {
  const { user } = useAuth();
  const [currentCity, setCurrentCity] = useState("Mumbai");
  const [coordinates, setCoordinates] = useState([19.0760, 72.8777]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationPermission, setLocationPermission] = useState("prompt");

  useEffect(() => {
    async function initUserLocation() {
      if (!user) return;
      
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().profile?.preferredCity) {
            setCurrentCity(snap.data().profile.preferredCity);
            // Default load their preferred city geometry
            await geocodeAndSetPos(snap.data().profile.preferredCity);
        }
      } catch (err) {
        console.error("[Location] Error fetching defaults", err);
      }
      setLoadingLocation(false);
    }
    
    // Only fire off live geolocation if we hadn't already grabbed it
    initUserLocation();
  }, [user]);

  const requestLiveLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates([latitude, longitude]);
          setLocationPermission("granted");
          
          // Reverse geocode to get city name — with cache
          const cacheKey = `reverse_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
          if (geocodeCache.has(cacheKey)) {
            setCurrentCity(geocodeCache.get(cacheKey));
            setLoadingLocation(false);
            return;
          }

          try {
             const res = await rateLimitedFetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
             const data = await res.json();
             const city = data.address?.city || data.address?.state_district || "Current Location";
             geocodeCache.set(cacheKey, city);
             setCurrentCity(city);
          } catch(e) {
            console.error("[Location] Reverse geocode failed:", e);
            // Keep existing city — don't crash
          }

          setLoadingLocation(false);
        },
        (error) => {
          console.error("[Location] Geolocation denied", error);
          setLocationPermission("denied");
          setLoadingLocation(false);
        }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  const geocodeAndSetPos = async (queryStr) => {
      if(!queryStr) return null;

      // Check cache first
      const cacheKey = `forward_${queryStr.toLowerCase().trim()}`;
      if (geocodeCache.has(cacheKey)) {
        const cached = geocodeCache.get(cacheKey);
        setCoordinates([cached.lat, cached.lon]);
        setCurrentCity(queryStr);
        return cached;
      }

      try {
          const res = await rateLimitedFetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              const result = { lat, lon, display_name: data[0].display_name };
              
              // Cache the result
              geocodeCache.set(cacheKey, result);
              
              setCoordinates([lat, lon]);
              setCurrentCity(queryStr);
              return result;
          }
          return null;
      } catch (err) {
          console.error("[Location] Geocoding failed:", err);
          return null;
      }
  };

  return (
    <LocationContext.Provider value={{
      currentCity,
      coordinates,
      loadingLocation,
      locationPermission,
      requestLiveLocation,
      geocodeAndSetPos,
      setCurrentCity
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
