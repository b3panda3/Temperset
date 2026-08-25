"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, ChevronDown, Github, Thermometer } from "lucide-react";
import * as Icons from "lucide-react";
import { SkyBackground } from "@/components/temperset/SkyBackground";
import { CategoryWheel } from "@/components/temperset/CategoryWheel";
import { HeatPulseWidget } from "@/components/temperset/HeatPulseWidget";
import { NewsRadarWidget } from "@/components/temperset/NewsRadarWidget";
import { OnboardingModal } from "@/components/temperset/OnboardingModal";
import { CategoryDeepDive } from "@/components/temperset/CategoryDeepDive";
import { BackgroundSwitcher } from "@/components/temperset/BackgroundSwitcher";
import { useTemperset } from "@/lib/store";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  const { profile, activeCategory } = useTemperset();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Open onboarding automatically if no profile
    const t = setTimeout(() => {
      if (!profile) {
        setOnboardingOpen(true);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [profile]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-white">
      <SkyBackground />

      {/* Top bar — sticky, transparent */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 py-3">
        <div className="flex items-start justify-between gap-4">
          {/* Top-left: Heat Pulse widget (perky ear) */}
          <div className="flex-1 max-w-xs">
            <HeatPulseWidget />
          </div>

          {/* Top-center: Brand (mobile-friendly) */}
          <div className="hidden md:flex flex-col items-center pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
              <Thermometer size={14} className="text-orange-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-white">
                Temperset
              </span>
              <span className="text-[10px] text-white/50 hidden lg:inline">
                · Temperature, Translated
              </span>
            </div>
          </div>

          {/* Top-right: News Radar widget + Profile (perky ear) */}
          <div className="flex-1 max-w-xs flex justify-end items-center gap-2">
            <NewsRadarWidget />
            <ProfileBadge onClick={() => setOnboardingOpen(true)} />
          </div>
        </div>
      </header>

      {/* Hero — wheel center stage */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        {/* Headline — only show when wheel not focused */}
        <AnimatePresence>
          {!activeCategory && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 text-center px-4 pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 bg-white/10 backdrop-blur-md border border-white/20"
              >
                <Sparkles size={12} className="text-orange-300" />
                <span className="text-[11px] uppercase tracking-widest font-semibold text-white/80">
                  Built on FortyGuard · Hackathon '26
                </span>
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                Temperature, <span className="text-orange-400">Translated.</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                One heat data layer. Infinite operational decisions. Temperset translates the same
                hyperlocal temperature into role-specific actions — for logistics, data centers,
                city planners, architects, airlines, and everyone in between.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Wheel + Background Switcher */}
        <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8">
          <BackgroundSwitcher />
          <CategoryWheel />
          {/* Spacer on the right to keep wheel centered */}
          <div className="hidden sm:block w-20" aria-hidden />
        </div>

        {/* Sub-call to action */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-white/60 mb-3">
            {profile
              ? `Welcome back, ${profile.name?.split(" ")[0] || profile.label}. Your lens is active.`
              : "Pick your angle. The same temperature means different things to different roles."}
          </p>
          {!profile && (
            <button
              onClick={() => setOnboardingOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
            >
              <User size={14} /> Set Your Role Lens
            </button>
          )}
        </div>
      </section>

      {/* Below-the-fold: explanatory band */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
            Why Temperset is different
          </h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            Most heat platforms show you the temperature. Temperset shows you the decision. The same
            100°F means something completely different to a truck driver, an architect, and a city
            planner — we translate it for each.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon="Building2"
              title="7 Tracks, 1 Platform"
              text="All FortyGuard hackathon tracks unified under one role-aware lens — Resilient Cities, Future Buildings, Industrial, Government, Model Designing, Agentic AI, and Data Analysis."
              color="#22D3EE"
            />
            <FeatureCard
              icon="User"
              title="Role-Aware Curation"
              text="Onboard as a logistics manager, architect, city planner, airline ops, road contractor — and the same temperature data translates into your specific operational decisions."
              color="#FB923C"
            />
            <FeatureCard
              icon="Bot"
              title="Per-Category AI Analyst"
              text="Each track has its own chatbot persona powered by Z.ai GLM. Ask anything, get a decision — not a data dump."
              color="#A78BFA"
            />
          </div>

          {/* Track summary */}
          <h3 className="text-xl font-bold text-white mb-4 text-center">All 7 Tracks, Unified</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center hover:border-white/20 transition-colors"
                style={{ borderTopColor: c.gradient.from, borderTopWidth: 2 }}
              >
                <div className="text-[10px] text-white/40 mb-1">Track {c.trackNumber}</div>
                <div className="text-xs font-semibold text-white leading-tight">{c.name}</div>
              </div>
            ))}
          </div>

          {/* API credits */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Powered by free & open APIs
            </h3>
            <p className="text-sm text-white/70 mb-4">
              Temperset is built entirely on free-tier APIs — no paid keys required. Total cash
              outlay: $0.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {[
                "FortyGuard Temperature API®",
                "Z.ai GLM-4.5",
                "GDELT Project",
                "Open-Meteo",
                "OpenStreetMap",
                "Nominatim",
                "EPA AirNow",
                "NOAA NWS",
                "US Census",
                "NASA POWER",
                "OpenRouteService",
                "Supabase",
                "Vercel",
              ].map((api) => (
                <span
                  key={api}
                  className="rounded-full px-2.5 py-1 bg-white/5 border border-white/10 text-white/70"
                >
                  {api}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/60 backdrop-blur-md border-t border-white/10 px-4 sm:px-6 py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <Thermometer size={14} className="text-orange-400" />
            <span className="font-semibold text-white/70">Temperset</span>
            <span>· Temperature, Translated</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Built for FortyGuard Hackathon '26</span>
            <a
              href="https://www.fortyguard.com/hackathon26"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github size={11} /> Hackathon details
            </a>
          </div>
        </div>
      </footer>

      {/* Floating: scroll hint when at top */}
      <ScrollHint />

      {/* Modals & deep-dive overlay */}
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      <CategoryDeepDive />
    </main>
  );
}

function ProfileBadge({ onClick }: { onClick: () => void }) {
  const { profile } = useTemperset();
  if (!profile) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-2xl border border-white/20 backdrop-blur-md bg-black/30 px-3 py-2.5 hover:border-orange-400/60 transition-colors"
        aria-label="Onboard"
      >
        <User size={14} className="text-white/60" />
        <span className="text-xs text-white/70 hidden sm:inline">Set Role</span>
      </button>
    );
  }
  const initials = (profile.name || profile.label || "U")
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl border border-orange-400/40 backdrop-blur-md bg-orange-500/15 px-3 py-2 hover:border-orange-400 transition-colors"
      aria-label="View profile"
      title={profile.label}
    >
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] font-bold text-white">
        {initials}
      </div>
      <span className="text-xs text-white/90 hidden sm:inline max-w-[100px] truncate">
        {profile.label}
      </span>
    </button>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  color,
}: {
  icon: string;
  title: string;
  text: string;
  color: string;
}) {
  const Icon = (Icons as any)[icon] ?? Icons.Circle;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition-colors">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}

function ScrollHint() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY < 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/60 text-[10px] uppercase tracking-widest pointer-events-none"
        >
          <div className="flex flex-col items-center gap-1">
            <span>Scroll to learn more</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// (Icons imported at top of file)
