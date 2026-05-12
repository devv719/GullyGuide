"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";

const MapClient = dynamic(() => import("./MapClient"), { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed border-foreground/15 text-foreground/40" style={{ borderRadius: WB }}>
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <p className="font-body text-base">Loading Map...</p>
      </div>
    )
});

export default function Map(props) {
  return <MapClient {...props} />;
}
