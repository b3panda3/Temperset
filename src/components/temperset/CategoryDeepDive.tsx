"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Sparkles, Newspaper, Bot, MessageSquare, TrendingUp } from "lucide-react";
import { getCategory } from "@/lib/categories";
import { getRole } from "@/lib/roles";
import { useTemperset } from "@/lib/store";
import { ChatbotWidget } from "./ChatbotWidget";
import { NewsSection } from "./NewsSection";
import * as Icons from "lucide-react";

export function CategoryDeepDive() {
  const { activeCategory, setActiveCategory, profile } = useTemperset();
  const cat = activeCategory ? getCategory(activeCategory) : null;
  const [tempData, setTempData] = useState<any>(null);
  const [loadingTemp, setLoadingTemp] = useState(false);

  useEffect(() => {
    if (!cat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempData(null);
      return;
    }
    setLoadingTemp(true);
    // Use profile location or a default US city
    const lat = profile?.latitude || 33.4484;
    const lng = profile?.longitude || -112.074;
    fetch(`/api/temperature?lat=${lat}&lng=${lng}`)
      .then((r) => r.json())
      .then((data) => setTempData(data))
      .catch(() => setTempData(null))
      .finally(() => setLoadingTemp(false));
  }, [cat, profile]);

  return (
    <AnimatePresence>
      {cat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-stretch justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveCategory(null)}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl m-4 my-6 md:my-12 rounded-3xl overflow-hidden border border-white/15 bg-slate-950/85 shadow-2xl flex flex-col"
          >
            {/* Hero band */}
            <div
              className="relative h-32 md:h-40 flex-shrink-0 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${cat.gradient.from}, ${cat.gradient.to})`,
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative h-full flex items-center justify-between px-6 md:px-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    {(() => {
                      const Icon = (Icons as any)[cat.icon] ?? Icons.Circle;
                      return <Icon size={28} className="text-white" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">
                      Track {cat.trackNumber} of 7
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {cat.name}
                    </h2>
                    <p className="text-xs md:text-sm text-white/80 italic">{cat.tagline}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="rounded-full p-2 bg-white/15 hover:bg-white/25 transition-colors text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
              {/* Description */}
              <section>
                <SectionTitle icon={<Sparkles size={14} />} label="What this track does" />
                <p className="text-sm md:text-base text-white/85 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {cat.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {/* Live temperature readout */}
              <section>
                <SectionTitle
                  icon={<TrendingUp size={14} />}
                  label={`Live heat — ${profile?.location || "Phoenix, AZ"}`}
                />
                {loadingTemp ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : tempData ? (
                  <div className="grid grid-cols-3 gap-2">
                    <StatCard
                      label="Current"
                      value={`${tempData.current?.tempF ?? "—"}°F`}
                      sub={`${tempData.current?.tempC ?? "—"}°C`}
                      color={cat.gradient.from}
                    />
                    <StatCard
                      label="Peak today"
                      value={`${tempData.peakF ?? "—"}°F`}
                      sub={tempData.peakHour ? `@ ${tempData.peakHour}` : ""}
                      color={cat.gradient.to}
                    />
                    <StatCard
                      label="Heat island Δ"
                      value={`+${tempData.heatIslandDeltaF ?? "—"}°F`}
                      sub="vs city baseline"
                      color="#ef4444"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-white/50">Live data unavailable.</div>
                )}
              </section>

              {/* Role-curated translations */}
              <section>
                <SectionTitle
                  icon={<MessageSquare size={14} />}
                  label={profile ? `Curated for ${profile.label}` : "Same temperature, different decisions"}
                />
                <p className="text-xs text-white/50 mb-3">
                  {profile
                    ? `Insights prioritized for your role. Other translations shown for context.`
                    : `This is Temperset's core innovation — the same temperature data translates into different operational decisions per role.`}
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {cat.translations.map((t, i) => {
                    const isUserRole = profile && getRole(profile.role)?.label === t.role;
                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border p-4 transition-all ${
                          isUserRole
                            ? "border-orange-400 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-widest font-semibold text-white/70">
                            {t.role}
                          </span>
                          {isUserRole && (
                            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-orange-300 font-semibold">
                              Your lens
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">{t.insight}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Build examples */}
              <section>
                <SectionTitle icon={<Sparkles size={14} />} label="What you can build here" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {cat.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-white/20 hover:bg-white/10 transition-colors"
                    >
                      <div className="text-xs font-semibold text-white mb-1">{ex}</div>
                      <div className="text-[10px] text-white/50">
                        Example build from the hackathon brief.
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* News section */}
              <section>
                <SectionTitle icon={<Newspaper size={14} />} label="Latest heat news — this track" />
                <NewsSection categoryId={cat.id} />
              </section>
            </div>

            {/* Floating chatbot */}
            <ChatbotWidget categoryId={cat.id} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-orange-300">{icon}</span>
      <h3 className="text-xs uppercase tracking-widest font-semibold text-white/80">{label}</h3>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{label}</div>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-white/50 mt-0.5">{sub}</div>
    </div>
  );
}
