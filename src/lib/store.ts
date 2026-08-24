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

  // Sky mode (time-based)
  skyMode: "dawn" | "day" | "sunset" | "night";
  setSkyMode: (m: "dawn" | "day" | "sunset" | "night") => void;
}

export const useTemperset = create<TempersetState>()(
  persist(
    (set) => ({
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
      setSkyMode: (m) => set({ skyMode: m }),
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
