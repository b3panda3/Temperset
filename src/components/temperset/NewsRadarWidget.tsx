"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ExternalLink, Clock } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { NewsItem } from "@/lib/news";

export function NewsRadarWidget() {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch mixed news from all categories — one item per category, rotating
  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            const res = await fetch(`/api/news?category=${cat.id}`);
            const data = await res.json();
            return (data.items || []).slice(0, 1).map((item: NewsItem) => ({ ...item, category: cat.id }));
          }),
        );
        const flat = results.flat();
        if (mounted) {
          setItems(flat);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="group flex items-center gap-3 rounded-2xl border border-white/20 backdrop-blur-md bg-black/30 px-4 py-2.5 transition-all hover:border-white/40 hover:bg-black/40"
        aria-label="Heat news radar"
      >
        <div className="relative">
          <Newspaper size={18} className="text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-white/60">Heat Radar</span>
          <span className="text-xs text-white/90">
            {loading ? "Scanning headlines…" : `${items.length} live stories`}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/20 backdrop-blur-xl bg-black/75 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Heat News Radar
              </span>
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                <Clock size={9} /> Updated every 30min
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2">
              {items.length === 0 && !loading ? (
                <div className="text-center py-6 text-white/50 text-xs">
                  No stories available right now.
                </div>
              ) : (
                items.map((item, i) => {
                  const cat = CATEGORIES.find((c) => c.id === item.category);
                  return (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg p-2 hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="flex-shrink-0 w-1 h-12 rounded-full mt-0.5"
                          style={{ background: cat?.gradient.to || "#888" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-white/40">
                            <span className="uppercase tracking-wider">{cat?.name.split(" ")[0]}</span>
                            <span>·</span>
                            <span>{item.source}</span>
                            <ExternalLink size={9} />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/50 text-center">
              Source: GDELT Project · Free, no key
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
