"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Clock, Loader2 } from "lucide-react";
import type { NewsItem } from "@/lib/news";

interface NewsSectionProps {
  categoryId: string;
}

export function NewsSection({ categoryId }: NewsSectionProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/news?category=${categoryId}`)
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          setItems(data.items || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-white/50 text-sm">
        <Loader2 size={16} className="animate-spin mr-2" />
        Fetching latest heat news…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-white/40 text-sm">
        No stories available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-white/10 bg-white/5 p-3 hover:border-white/20 hover:bg-white/10 transition-colors group"
        >
          <p className="text-sm font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-white/40">
            <span className="font-medium text-white/60">{item.source}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={9} />
              {formatTime(item.publishedAt)}
            </span>
            <ExternalLink size={9} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      ))}
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "recent";
  }
}
