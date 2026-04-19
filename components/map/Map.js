"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// The Map component dynamically imports the MapClient
// ssr: false prevents "window is not defined" error from Leaflet in Next.js
const MapClient = dynamic(() => import("./MapClient"), { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="font-bold text-sm tracking-wide">Loading Map...</p>
      </div>
    )
});

export default function Map(props) {
  return <MapClient {...props} />;
}
