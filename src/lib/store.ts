// Temperset client state — single source of truth for view state + profile.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TempersetProfile {
  id?: string;
  role: string;
  label: string;
  name?: string;
  email?: string;
  organization?: string;
  industry?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  preferences?: Record<string, any>;
  onboarded: boolean;
}

interface TempersetState {
  // Onboarding
  profile: TempersetProfile | null;
  setProfile: (p: TempersetProfile | null) => void;
  clearProfile: () => void;

  // View state
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;

  // Wheel state
  wheelPaused: boolean;
  setWheelPaused: (p: boolean) => void;

  // Chat state per category
  chatOpen: boolean;
  setChatOpen: (o: boolean) => void;

  // News drawer
  newsOpen: boolean;
  setNewsOpen: (o: boolean) => void;

  // Sky mode — supports both auto (time-based) and manual override
  skyMode: "dawn" | "day" | "sunset" | "night";
  skyAuto: boolean; // true = follow time-of-day, false = user-locked
  setSkyMode: (m: "dawn" | "day" | "sunset" | "night") => void;
  setSkyAuto: (auto: boolean) => void;
  cycleSkyMode: () => void; // advance to next preset
}

export const useTemperset = create<TempersetState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (p) => set({ profile: p }),
      clearProfile: () => set({ profile: null }),

      activeCategory: null,
      setActiveCategory: (id) => set({ activeCategory: id }),

      wheelPaused: false,
      setWheelPaused: (p) => set({ wheelPaused: p }),

      chatOpen: false,
      setChatOpen: (o) => set({ chatOpen: o }),

      newsOpen: false,
      setNewsOpen: (o) => set({ newsOpen: o }),

      skyMode: "day",
      skyAuto: true,
      setSkyMode: (m) => set({ skyMode: m, skyAuto: false }),
      setSkyAuto: (auto) => set({ skyAuto: auto }),
      cycleSkyMode: () => {
        const order = ["dawn", "day", "sunset", "night"] as const;
        const current = get().skyMode;
        const idx = order.indexOf(current);
        const next = order[(idx + 1) % order.length];
        set({ skyMode: next, skyAuto: false });
      },
    }),
    {
      name: "temperset-state",
      partialize: (s) => ({ profile: s.profile }),
    },
  ),
);

// Compute sky mode from local hour
export function computeSkyMode(hour: number): "dawn" | "day" | "sunset" | "night" {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "sunset";
  return "night";
}
