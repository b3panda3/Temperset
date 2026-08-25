"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, Sunset, Moon, RefreshCw } from "lucide-react";
import { useTemperset } from "@/lib/store";

const MODES = [
  { id: "dawn", label: "Dawn", icon: Cloud, color: "#f0a87a" },
  { id: "day", label: "Day", icon: Sun, color: "#fcd34d" },
  { id: "sunset", label: "Sunset", icon: Sunset, color: "#ff8855" },
  { id: "night", label: "Night", icon: Moon, color: "#a78bfa" },
] as const;

export function BackgroundSwitcher() {
  const { skyMode, skyAuto, cycleSkyMode, setSkyMode, setSkyAuto } = useTemperset();
  const [expanded, setExpanded] = useState(false);

  const current = MODES.find((m) => m.id === skyMode) ?? MODES[1];

  return (
    <div className="flex flex-col items-center gap-2 z-20 relative">
      {/* Primary "Next" button — quick cycle */}
      <button
        onClick={cycleSkyMode}
        onMouseEnter={() => setExpanded(true)}
        className="group flex items-center gap-2 rounded-full border border-white/20 backdrop-blur-md bg-black/40 px-4 py-2.5 text-white transition-all hover:border-white/60 hover:bg-black/60 hover:scale-105 shadow-lg"
        aria-label="Next background"
        title={`Sky: ${current.label}${skyAuto ? " (auto)" : " (locked)"}`}
      >
        <current.icon size={16} style={{ color: current.color }} />
        <span className="text-xs font-medium">Next Sky</span>
        <RefreshCw size={11} className="opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" />
      </button>

      {/* Expanded picker on hover */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onMouseLeave={() => setExpanded(false)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/20 backdrop-blur-xl bg-black/70 p-2 shadow-2xl"
          >
            {MODES.map((m) => {
              const Icon = m.icon;
              const isSel = skyMode === m.id && !skyAuto;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSkyMode(m.id);
                    setExpanded(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                    isSel
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={12} style={{ color: m.color }} />
                  <span className="text-[11px] font-medium">{m.label}</span>
                </button>
              );
            })}
            {/* Reset to auto */}
            <button
              onClick={() => {
                setSkyAuto(true);
                setExpanded(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                skyAuto ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <RefreshCw size={12} className="text-emerald-300" />
              <span className="text-[11px] font-medium">Auto (time)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status pill */}
      <div className="text-[9px] uppercase tracking-widest text-white/40">
        {skyAuto ? "Auto" : skyMode}
      </div>
    </div>
  );
}
