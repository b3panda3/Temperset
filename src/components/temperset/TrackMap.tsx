"use client";

import dynamic from "next/dynamic";

// Leaflet accesses `window` at import time, so it CANNOT be server-rendered.
// This wrapper dynamically loads the actual map only on the client.
const TrackMapInner = dynamic(
  () => import("./TrackMapInner").then((m) => m.TrackMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 md:h-96 rounded-xl border border-white/10 overflow-hidden bg-slate-900/50 flex items-center justify-center text-white/40 text-sm">
        Loading heat map…
      </div>
    ),
  },
);

interface TrackMapProps {
  categoryId: "resilient-cities" | "government-environment";
  lat: number;
  lng: number;
  tempF?: number;
  peakF?: number;
}

export function TrackMap(props: TrackMapProps) {
  return <TrackMapInner {...props} />;
}
