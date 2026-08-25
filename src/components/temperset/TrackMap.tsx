"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackMapProps {
  categoryId: "resilient-cities" | "government-environment";
  lat: number;
  lng: number;
  tempF?: number;
  peakF?: number;
}

// Color stops for heat overlay circles
function heatColor(tempF: number): string {
  if (tempF >= 105) return "#dc2626"; // extreme — red
  if (tempF >= 95) return "#fb923c"; // high — orange
  if (tempF >= 85) return "#fcd34d"; // warm — yellow
  return "#22d3ee"; // cool — cyan
}

export function TrackMap({ categoryId, lat, lng, tempF = 88, peakF = 95 }: TrackMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on user location
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Center marker — user's location with current temp
    const centerColor = heatColor(tempF);
    const centerIcon = L.divIcon({
      className: "temperset-marker",
      html: `
        <div style="
          width: 44px; height: 44px;
          background: ${centerColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 4px ${centerColor}40, 0 4px 12px rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 12px;
          font-family: -apple-system, sans-serif;
        ">
          ${Math.round(tempF)}°
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
    L.marker([lat, lng], { icon: centerIcon })
      .addTo(map)
      .bindPopup(`<strong>Your location</strong><br/>Current: ${tempF}°F<br/>Peak today: ${peakF}°F`);

    // Heat overlay — concentric circles showing heat island distribution
    // Simulated: warm at center, slightly cooler in surrounding ring
    const isCities = categoryId === "resilient-cities";
    const ringCount = isCities ? 6 : 5;
    const baseRadius = isCities ? 600 : 800; // meters

    for (let i = 1; i <= ringCount; i++) {
      const ringLat = lat + (Math.sin(i) * 0.012 * i) / 2;
      const ringLng = lng + (Math.cos(i * 1.3) * 0.015 * i) / 2;
      // Deterministic temperature variation per ring
      const ringTemp = tempF + (Math.sin(i * 1.7) * 4) - i * 0.5;
      const ringColor = heatColor(ringTemp);

      L.circle([ringLat, ringLng], {
        radius: baseRadius * (1 + i * 0.4),
        color: ringColor,
        fillColor: ringColor,
        fillOpacity: 0.18,
        weight: 1.5,
        opacity: 0.6,
      })
        .addTo(map)
        .bindPopup(
          `<strong>Heat tile ${i}</strong><br/>Avg: ${ringTemp.toFixed(1)}°F<br/>${
            isCities ? "Cool corridor candidate" : "Vulnerability zone"
          }`,
        );
    }

    // Track-specific extras
    if (isCities) {
      // Cool corridor suggestion (polyline)
      const corridor = [
        [lat - 0.01, lng - 0.015],
        [lat - 0.005, lng - 0.008],
        [lat, lng],
        [lat + 0.005, lng + 0.007],
        [lat + 0.012, lng + 0.014],
      ];
      L.polyline(corridor, {
        color: "#22d3ee",
        weight: 4,
        opacity: 0.7,
        dashArray: "8,6",
      })
        .addTo(map)
        .bindPopup("<strong>Cool corridor (suggested)</strong><br/>Estimated -3°F vs direct route");
    } else {
      // Vulnerability zones (red highlights)
      const vulnZones = [
        { lat: lat + 0.008, lng: lng + 0.01, label: "Zone A — Elderly density" },
        { lat: lat - 0.009, lng: lng + 0.005, label: "Zone B — No AC" },
        { lat: lat + 0.003, lng: lng - 0.013, label: "Zone C — Low-income" },
      ];
      vulnZones.forEach((z) => {
        L.circle([z.lat, z.lng], {
          radius: 500,
          color: "#dc2626",
          fillColor: "#dc2626",
          fillOpacity: 0.35,
          weight: 2,
        })
          .addTo(map)
          .bindPopup(`<strong>${z.label}</strong><br/>Heat-vulnerable population`);
      });
    }

    mapRef.current = map;

    // Fix layout — Leaflet sometimes needs a manual invalidateSize on mount
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [categoryId, lat, lng, tempF, peakF]);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 md:h-96 rounded-xl border border-white/10 overflow-hidden z-0"
      style={{ background: "#1a1a1a" }}
    />
  );
}
