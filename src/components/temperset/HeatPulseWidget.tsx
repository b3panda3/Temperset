"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MapPin, TrendingUp, AlertTriangle } from "lucide-react";

interface CityPulse {
  label: string;
  tempF: number;
  tempC: number;
  peakF: number;
  peakHour: string;
  heatIslandDeltaF: number;
}

export function HeatPulseWidget() {
  const [cities, setCities] = useState<CityPulse[]>([]);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/temperature?mode=pulse")
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data.cities) {
          setCities(data.cities);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (cities.length === 0) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % cities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [cities.length]);

  const current = cities[index];

  const heatLevel =
    !current ? "normal" : current.tempF >= 100 ? "extreme" : current.tempF >= 90 ? "high" : "normal";

  const accentColor =
    heatLevel === "extreme" ? "#ef4444" : heatLevel === "high" ? "#fb923c" : "#22d3ee";

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="group relative flex items-center gap-3 rounded-2xl border border-white/20 backdrop-blur-md bg-black/30 px-4 py-2.5 transition-all hover:border-white/40 hover:bg-black/40"
        style={{ boxShadow: `0 4px 24px ${accentColor}30` }}
        aria-label="Global heat pulse"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity size={18} className="text-white" />
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
              style={{ background: accentColor }}
            />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-widest text-white/60">Heat Pulse</span>
            {loading ? (
              <span className="text-xs text-white/50">Loading…</span>
            ) : current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <MapPin size={11} className="text-white/60" />
                  <span className="text-xs font-medium text-white">{current.label}</span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: accentColor }}
                  >
                    {current.tempF}°F
                  </span>
                </motion.div>
              </AnimatePresence>
            ) : (
              <span className="text-xs text-white/50">No data</span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && cities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 w-80 rounded-2xl border border-white/20 backdrop-blur-xl bg-black/70 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                US Heat Pulse — Live
              </span>
              <span className="text-[10px] text-white/40">Updated every 5min</span>
            </div>

            <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-1">
              {cities.map((c, i) => {
                const lvl = c.tempF >= 100 ? "extreme" : c.tempF >= 90 ? "high" : "normal";
                const color = lvl === "extreme" ? "#ef4444" : lvl === "high" ? "#fb923c" : "#22d3ee";
                return (
                  <div
                    key={c.label}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={12} className="text-white/50 flex-shrink-0" />
                      <span className="text-xs text-white/90 truncate">{c.label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex flex-col items-end leading-tight">
                        <span className="text-[9px] text-white/40">peak {c.peakHour}</span>
                        <span className="text-[10px] text-white/60 tabular-nums">↑{c.peakF}°F</span>
                      </div>
                      <span
                        className="text-sm font-bold tabular-nums w-12 text-right"
                        style={{ color }}
                      >
                        {c.tempF}°F
                      </span>
                      {lvl === "extreme" && <AlertTriangle size={12} className="text-red-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
              <span>Source: FortyGuard Temperature API®</span>
              <span className="flex items-center gap-1">
                <TrendingUp size={10} />
                {cities.filter((c) => c.tempF >= 90).length} cities above 90°F
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
