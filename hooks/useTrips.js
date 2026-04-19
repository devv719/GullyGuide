import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
       setLoading(false);
       return;
    }

    const q = query(
      collection(db, "trips"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      setTrips(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.error("Trips fetch Error:", err);
      setLoading(false);
    });

    return unsub;
  }, [user?.uid]);

  const totalPlanned  = trips.length;
  const totalSpent    = trips.reduce((s,t) => s + (t.spentAmount||0), 0);
  const totalBudget   = trips.reduce((s,t) => s + (t.totalBudget||0), 0);
  const activeTrips   = trips.filter(t => t.status === "active");
  const planningTrips = trips.filter(t => t.status === "planning");
  
  // Sort upcoming chronologically by startDate
  const upcomingTrips = [...activeTrips, ...planningTrips].sort((a,b) => {
     if (!a.startDate || !b.startDate) return 0;
     return a.startDate.seconds - b.startDate.seconds;
  });

  return {
    trips, 
    loading,
    totalPlanned, 
    totalSpent, 
    totalBudget,
    activeTrips, 
    planningTrips, 
    upcomingTrips
  };
}
