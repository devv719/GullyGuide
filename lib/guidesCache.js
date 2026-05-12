import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// In-memory cache for guides data
let guidesCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch guides with in-memory caching.
 * Returns cached data if within TTL, otherwise fetches fresh from Firestore.
 * @param {string|null} excludeUid — optional UID to exclude (current user)
 * @returns {Promise<Array>} array of guide objects
 */
export async function getGuides(excludeUid = null) {
  // Return cache if still fresh
  if (guidesCache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    console.log("[GuidesCache] ✅ Returning cached guides:", guidesCache.length, "entries");
    const filtered = excludeUid 
      ? guidesCache.filter(g => g.id !== excludeUid)
      : guidesCache;
    return filtered;
  }

  // Fetch fresh from Firestore
  try {
    console.log("[GuidesCache] 📄 Fetching guides from Firestore...");
    const snapshot = await getDocs(collection(db, "guides"));
    guidesCache = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    cacheTime = Date.now();
    console.log("[GuidesCache] ✅ Cached", guidesCache.length, "guides");

    const filtered = excludeUid 
      ? guidesCache.filter(g => g.id !== excludeUid)
      : guidesCache;
    return filtered;
  } catch (err) {
    console.error("[GuidesCache] ❌ Fetch error:", err.message);
    // Return stale cache if available, otherwise empty
    if (guidesCache) {
      console.log("[GuidesCache] 📡 Returning stale cache as fallback");
      const filtered = excludeUid 
        ? guidesCache.filter(g => g.id !== excludeUid)
        : guidesCache;
      return filtered;
    }
    return [];
  }
}

/**
 * Invalidate the guides cache (call after a guide profile is updated)
 */
export function invalidateGuidesCache() {
  guidesCache = null;
  cacheTime = null;
}
