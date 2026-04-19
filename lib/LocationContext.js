"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const LocationContext = createContext({});

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
        console.error("Error fetching defaults", err);
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
          
          // Reverse geocode to get city name
          try {
             const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
             const data = await res.json();
             const city = data.address?.city || data.address?.state_district || "Current Location";
             setCurrentCity(city);
          } catch(e) { console.error(e) }

          setLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation denied", error);
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
      try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              setCoordinates([lat, lon]);
              setCurrentCity(queryStr);
              return { lat, lon, display_name: data[0].display_name };
          }
          return null;
      } catch (err) {
          console.error("Geocoding failed:", err);
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
