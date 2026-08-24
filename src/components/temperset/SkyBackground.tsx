"use client";

import { useEffect, useState } from "react";
import { computeSkyMode, useTemperset } from "@/lib/store";

const SKY_PRESETS = {
  dawn: {
    // Soft peach/coral morning
    bg: "linear-gradient(180deg, #1a0f1f 0%, #4a2538 25%, #8b4565 55%, #d4806b 80%, #f0a87a 100%)",
    sun: "#ffd9a3",
    sunGlow: "rgba(255, 196, 120, 0.4)",
    cloud: "rgba(255, 220, 200, 0.5)",
    starOpacity: 0.3,
  },
  day: {
    // Bright blue with high cirrus
    bg: "linear-gradient(180deg, #2c5f8d 0%, #4a8fb8 35%, #7cb4d4 65%, #b5d8e8 100%)",
    sun: "#fff4c4",
    sunGlow: "rgba(255, 244, 196, 0.5)",
    cloud: "rgba(255, 255, 255, 0.7)",
    starOpacity: 0,
  },
  sunset: {
    // Orange/magenta/purple
    bg: "linear-gradient(180deg, #2d1b3d 0%, #5e2e5b 30%, #c44a6a 60%, #e87a4a 85%, #f0a85a 100%)",
    sun: "#ff8855",
    sunGlow: "rgba(255, 136, 85, 0.5)",
    cloud: "rgba(255, 180, 150, 0.5)",
    starOpacity: 0.4,
  },
  night: {
    // Deep indigo with stars
    bg: "linear-gradient(180deg, #050810 0%, #0a1428 30%, #142848 60%, #1e3a5f 100%)",
    sun: "#e0e7ff",
    sunGlow: "rgba(224, 231, 255, 0.3)",
    cloud: "rgba(40, 60, 100, 0.5)",
    starOpacity: 1,
  },
} as const;

export function SkyBackground() {
  // SSR-safe mount detection (avoids setState-in-effect lint error)
  const [mounted, setMounted] = useState(false);
  const { skyMode, setSkyMode } = useTemperset();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const update = () => setSkyMode(computeSkyMode(new Date().getHours()));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [setSkyMode]);

  if (!mounted) return null;

  const preset = SKY_PRESETS[skyMode];

  // Sun/moon position based on hour (0-23 → 0-360deg)
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const dayFraction = (hour + minute / 60) / 24;
  const arcAngle = dayFraction * Math.PI * 2 - Math.PI / 2; // start at top
  const sunX = 50 + Math.cos(arcAngle) * 45; // % from left
  const sunY = 60 + Math.sin(arcAngle) * 50; // % from top (lower = higher sky)

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-1000">
      {/* Sky gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: preset.bg }}
      />

      {/* Stars (only visible at night/sunset) */}
      {preset.starOpacity > 0 && (
        <div className="absolute inset-0" style={{ opacity: preset.starOpacity }}>
          {Array.from({ length: 80 }).map((_, i) => {
            const x = (i * 137.5) % 100;
            const y = (i * 47.3) % 70; // only upper 70% of sky
            const size = (i % 3) + 1;
            const delay = (i * 0.3) % 4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.6 + (i % 4) * 0.1,
                  animation: `twinkle 3s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Sun / Moon */}
      <div
        className="absolute rounded-full transition-all duration-1000"
        style={{
          left: `${sunX}%`,
          top: `${sunY}%`,
          width: "80px",
          height: "80px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${preset.sun} 0%, ${preset.sunGlow} 70%, transparent 100%)`,
          boxShadow: `0 0 80px 40px ${preset.sunGlow}`,
        }}
      />

      {/* Drifting clouds */}
      {Array.from({ length: 4 }).map((_, i) => {
        const top = 10 + i * 12;
        const duration = 80 + i * 25;
        const delay = i * -20;
        const width = 200 + i * 60;
        return (
          <div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{
              top: `${top}%`,
              width: `${width}px`,
              height: `${width * 0.4}px`,
              background: preset.cloud,
              animation: `drift ${duration}s linear ${delay}s infinite`,
              opacity: skyMode === "day" ? 0.6 : 0.3,
            }}
          />
        );
      })}

      {/* City skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none">
        <Skyline skyMode={skyMode} />
      </div>

      {/* Heat shimmer overlay (subtle, more intense at high sun) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            skyMode === "day" || skyMode === "sunset"
              ? "radial-gradient(ellipse at 50% 100%, rgba(255, 120, 50, 0.15) 0%, transparent 60%)"
              : "transparent",
        }}
      />

      <style jsx>{`
        @keyframes drift {
          from { transform: translateX(-300px); }
          to { transform: translateX(calc(100vw + 300px)); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Skyline({ skyMode }: { skyMode: string }) {
  // Stylized city skyline silhouette — changes color with sky
  const buildingColor =
    skyMode === "night" ? "#050810" : skyMode === "sunset" ? "#2d1b3d" : skyMode === "dawn" ? "#3d1f2e" : "#1a3a5f";

  // Each building: {x, w, h} — deterministic positions
  const buildings = [
    { x: 0, w: 60, h: 80 },
    { x: 60, w: 40, h: 120 },
    { x: 100, w: 80, h: 60 },
    { x: 180, w: 50, h: 140 },
    { x: 230, w: 70, h: 90 },
    { x: 300, w: 45, h: 160 },
    { x: 345, w: 90, h: 70 },
    { x: 435, w: 55, h: 110 },
    { x: 490, w: 80, h: 50 },
    { x: 570, w: 50, h: 130 },
    { x: 620, w: 70, h: 85 },
    { x: 690, w: 60, h: 105 },
    { x: 750, w: 90, h: 65 },
    { x: 840, w: 55, h: 145 },
    { x: 895, w: 70, h: 80 },
    { x: 965, w: 50, h: 120 },
    { x: 1015, w: 80, h: 70 },
    { x: 1095, w: 60, h: 100 },
    { x: 1155, w: 90, h: 55 },
    { x: 1245, w: 50, h: 135 },
    { x: 1295, w: 70, h: 90 },
    { x: 1365, w: 55, h: 115 },
    { x: 1420, w: 80, h: 65 },
    { x: 1500, w: 60, h: 130 },
  ];

  return (
    <svg
      viewBox="0 0 1600 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 -4px 8px rgba(0,0,0,0.3))" }}
    >
      <rect x="0" y="0" width="1600" height="200" fill={buildingColor} opacity="0" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={200 - b.h}
            width={b.w}
            height={b.h}
            fill={buildingColor}
          />
          {/* Windows — only lit at dusk/night */}
          {skyMode === "night" || skyMode === "sunset"
            ? Array.from({ length: Math.floor(b.h / 25) }).map((_, j) =>
                Array.from({ length: Math.floor(b.w / 20) }).map((_, k) => {
                  const lit = (i * 7 + j * 3 + k * 5) % 4 < 2;
                  return (
                    <rect
                      key={`${j}-${k}`}
                      x={b.x + 6 + k * 18}
                      y={200 - b.h + 8 + j * 22}
                      width={6}
                      height={8}
                      fill={lit ? "#ffd966" : buildingColor}
                      opacity={lit ? 0.85 : 0.3}
                    />
                  );
                }),
              )
            : null}
        </g>
      ))}
      {/* Ground line */}
      <rect x="0" y="195" width="1600" height="5" fill={buildingColor} opacity="0.6" />
    </svg>
  );
}
