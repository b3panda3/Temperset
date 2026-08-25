"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, type Category } from "@/lib/categories";
import { useTemperset } from "@/lib/store";
import * as Icons from "lucide-react";

const WHEEL_SIZE = 560; // px
const WHEEL_RADIUS = 220; // px from center to icon

export function CategoryWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinBoost, setSpinBoost] = useState(0);
  const { wheelPaused, setWheelPaused, setActiveCategory } = useTemperset();
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Slow rotation: full turn per ~80 seconds, pausable on hover/interaction
  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!wheelPaused) {
        // 0.08 deg per ms = ~80s per full turn (very slow, readable)
        setRotation((r) => (r + (0.08 * delta) / 16.67 + spinBoost) % 360);
        if (spinBoost > 0) setSpinBoost((s) => Math.max(0, s - 0.005 * delta));
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [wheelPaused, spinBoost]);

  const handleClick = (cat: Category) => {
    // Quick spin feedback on click
    setSpinBoost(15);
    setActiveCategory(cat.id);
  };

  return (
    <div
      className="relative"
      style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
      onMouseEnter={() => setWheelPaused(true)}
      onMouseLeave={() => setWheelPaused(false)}
    >
      {/* Outermost thermal halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #fb923c, #fcd34d, #22d3ee, #34d399, #a78bfa, #f472b6, #fb923c)",
          opacity: 0.2,
          filter: "blur(60px)",
        }}
      />

      {/* Tick marks ring (72 ticks around the perimeter) */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox="0 0 100 100"
        style={{ width: "100%", height: "100%" }}
      >
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i / 72) * 360;
          const isMajor = i % 6 === 0;
          const inner = isMajor ? 46 : 47.5;
          const outer = 48.5;
          const opacity = isMajor ? 0.6 : 0.25;
          return (
            <line
              key={i}
              x1={50 + inner * Math.cos((angle - 90) * (Math.PI / 180))}
              y1={50 + inner * Math.sin((angle - 90) * (Math.PI / 180))}
              x2={50 + outer * Math.cos((angle - 90) * (Math.PI / 180))}
              y2={50 + outer * Math.sin((angle - 90) * (Math.PI / 180))}
              stroke="white"
              strokeWidth={isMajor ? 0.4 : 0.2}
              opacity={opacity}
            />
          );
        })}
      </svg>

      {/* Pointer at top — indicates the "current" position */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
        style={{ top: -8 }}
      >
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
          <defs>
            <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <path
            d="M12 28 L2 8 Q12 12 22 8 Z"
            fill="url(#pointer-grad)"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2" fill="white" />
        </svg>
      </div>

      {/* Outer rim — chrome bezel */}
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #fb923c40, #fcd34d40, #22d3ee40, #34d39940, #a78bfa40, #f472b640, #fb923c40)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.2), inset 0 0 40px rgba(0,0,0,0.5), 0 20px 80px rgba(0,0,0,0.5)",
        }}
      />

      {/* Wheel hub — backdrop */}
      <div
        className="absolute inset-6 rounded-full border border-white/10 backdrop-blur-md"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), 0 20px 60px rgba(0,0,0,0.4)",
        }}
      />

      {/* Rotating wheel with category nodes */}
      <motion.div
        className="absolute inset-0"
        style={{ rotate: rotation }}
        animate={{ rotate: rotation }}
        transition={{ duration: 0 }}
      >
        {CATEGORIES.map((cat, i) => {
          const angle = (i / CATEGORIES.length) * Math.PI * 2 - Math.PI / 2; // start at top
          const x = Math.cos(angle) * WHEEL_RADIUS + WHEEL_SIZE / 2;
          const y = Math.sin(angle) * WHEEL_RADIUS + WHEEL_SIZE / 2;

          const Icon = (Icons as any)[cat.icon] ?? Icons.Circle;

          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat)}
              className="absolute group"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                background: `linear-gradient(135deg, ${cat.gradient.from}, ${cat.gradient.to})`,
              }}
              aria-label={`Open ${cat.name}`}
            >
              <div
                className="flex flex-col items-center justify-center rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-white group-hover:shadow-2xl"
                style={{
                  width: 110,
                  height: 110,
                  background: `linear-gradient(135deg, ${cat.gradient.from}cc, ${cat.gradient.to}cc)`,
                  transform: `rotate(${-rotation}deg)`,
                  boxShadow: `0 4px 24px ${cat.gradient.ring}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}
              >
                <Icon
                  className="mb-1 text-white drop-shadow-md"
                  size={28}
                  strokeWidth={2}
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white px-1.5 text-center leading-tight drop-shadow">
                  {cat.name}
                </span>
              </div>

              {/* Track number badge */}
              <div
                className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white border border-white/30 shadow-lg"
                style={{ background: cat.gradient.to }}
              >
                {cat.trackNumber}
              </div>

              {/* Hover tooltip */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2.5 py-1 rounded-lg bg-black/80 border border-white/20 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {cat.blurb}
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Center hub — Temperset core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex flex-col items-center justify-center rounded-full backdrop-blur-md"
          style={{
            width: 180,
            height: 180,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(0,0,0,0.6) 80%)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 0 60px rgba(251, 146, 60, 0.3), inset 0 0 30px rgba(0,0,0,0.4)",
          }}
        >
          <ThermometerIcon />
          <div className="mt-1 text-white text-xl font-bold tracking-wider" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            TEMPERSET
          </div>
          <div className="text-[10px] text-white/70 tracking-widest uppercase mt-0.5">
            Temperature, Translated
          </div>
        </div>
      </div>

      {/* Pause indicator */}
      <AnimatePresence>
        {wheelPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-widest pointer-events-none"
          >
            Hover to pause · Click to dive in
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThermometerIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="drop-shadow-lg">
      <defs>
        <linearGradient id="temp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
      </defs>
      <path
        d="M24 4a4 4 0 0 0-4 4v22.5a8 8 0 1 0 8 0V8a4 4 0 0 0-4-4z"
        stroke="white"
        strokeWidth="2"
        fill="rgba(0,0,0,0.3)"
      />
      <rect x="22" y="10" width="4" height="22" rx="2" fill="url(#temp-grad)" />
      <circle cx="24" cy="34" r="6" fill="url(#temp-grad)" stroke="white" strokeWidth="2" />
      {/* Tick marks */}
      {[12, 16, 20, 24].map((y, i) => (
        <line
          key={i}
          x1="28"
          y1={y}
          x2={i % 2 === 0 ? 32 : 30}
          y2={y}
          stroke="white"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}
