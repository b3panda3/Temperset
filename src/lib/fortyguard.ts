// FortyGuard Temperature API® client — uses real API when key is configured,
// falls back to a deterministic mock when no key is available (for dev/demo).

export interface TemperaturePoint {
  lat: number;
  lng: number;
  tempF: number;
  tempC: number;
  timestamp: string;
  // Optional: sub-grid variance for the surrounding 10mi² tile
  tileMinF?: number;
  tileMaxF?: number;
  tileAvgF?: number;
}

export interface TemperatureForecast {
  location: { lat: number; lng: number; label: string };
  current: TemperaturePoint;
  hourly: { hour: string; tempF: number }[];
  // 12-hour forecast peak
  peakF: number;
  peakHour: string;
  // Heat island delta vs city baseline
  heatIslandDeltaF: number;
}

const FORTYGUARD_API_KEY = process.env.FORTYGUARD_API_KEY;
const FORTYGUARD_BASE = process.env.FORTYGUARD_BASE_URL || "https://api.fortyguard.com/v1";

// Deterministic mock — produces realistic-looking temperature data based on lat/lng/time
// so the demo is stable even without a real API key.
function mockTemperature(lat: number, lng: number, hourOffset = 0): TemperaturePoint {
  const now = new Date();
  now.setHours(now.getHours() + hourOffset);
  const hour = now.getHours();

  // Diurnal curve: min at 5am, max at 15:00
  const diurnal = Math.sin(((hour - 9) / 24) * Math.PI * 2);
  const diurnalBoost = (diurnal + 1) / 2; // 0..1

  // Lat-based baseline: warmer further south (US only)
  const latBaseline = 90 - Math.abs(lat); // crude
  const base = 55 + latBaseline * 0.4 + diurnalBoost * 25;

  // Lng-based variation (desert west = hotter/drier)
  const lngMod = lng < -100 ? 6 : lng < -90 ? 2 : -2;

  // Deterministic noise based on coords (so same place always gets same result)
  const coordHash = (Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453) % 1;
  const noise = (coordHash - 0.5) * 6;

  const tempF = Math.round((base + lngMod + noise) * 10) / 10;
  const tempC = Math.round(((tempF - 32) * (5 / 9)) * 10) / 10;

  return {
    lat,
    lng,
    tempF,
    tempC,
    timestamp: now.toISOString(),
    tileMinF: Math.round((tempF - 2 - Math.abs(noise)) * 10) / 10,
    tileMaxF: Math.round((tempF + 3 + Math.abs(noise)) * 10) / 10,
    tileAvgF: tempF,
  };
}

export async function getTemperature(
  lat: number,
  lng: number,
  label = "Selected location",
): Promise<TemperatureForecast> {
  if (FORTYGUARD_API_KEY) {
    try {
      const url = `${FORTYGUARD_BASE}/temperature?lat=${lat}&lng=${lng}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${FORTYGUARD_API_KEY}` },
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const data = await res.json();
        // Adapt to our shape — FortyGuard API response fields may differ slightly.
        return {
          location: { lat, lng, label },
          current: {
            lat,
            lng,
            tempF: data.tempF ?? data.temperatureF ?? 80,
            tempC: data.tempC ?? data.temperatureC ?? 27,
            timestamp: data.timestamp ?? new Date().toISOString(),
            tileMinF: data.tileMinF,
            tileMaxF: data.tileMaxF,
            tileAvgF: data.tileAvgF,
          },
          hourly: (data.hourly ?? []).map((h: any) => ({
            hour: h.hour ?? h.time,
            tempF: h.tempF ?? h.temperatureF,
          })),
          peakF: data.peakF ?? 90,
          peakHour: data.peakHour ?? "15:00",
          heatIslandDeltaF: data.heatIslandDeltaF ?? 4,
        };
      }
      // fall through to mock on error
    } catch (e) {
      console.warn("FortyGuard API failed, using mock:", e);
    }
  }

  // Mock path
  const current = mockTemperature(lat, lng, 0);
  const hourly = Array.from({ length: 12 }, (_, i) => {
    const pt = mockTemperature(lat, lng, i + 1);
    const dt = new Date();
    dt.setHours(dt.getHours() + i + 1);
    return {
      hour: dt.toISOString(),
      tempF: pt.tempF,
    };
  });

  const peak = hourly.reduce((max, h) => (h.tempF > max.tempF ? h : max), hourly[0]);
  const peakHour = new Date(peak.hour).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });

  return {
    location: { lat, lng, label },
    current,
    hourly,
    peakF: peak.tempF,
    peakHour,
    heatIslandDeltaF: Math.round((Math.abs(((lat * 7 + lng * 3) % 7) - 3) + 1) * 10) / 10,
  };
}

// A handful of representative US cities for the Heat Pulse widget
export const PULSE_CITIES = [
  { label: "Phoenix, AZ", lat: 33.4484, lng: -112.074 },
  { label: "Las Vegas, NV", lat: 36.1699, lng: -115.1398 },
  { label: "Dallas, TX", lat: 32.7767, lng: -96.797 },
  { label: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { label: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { label: "Atlanta, GA", lat: 33.749, lng: -84.388 },
  { label: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { label: "New York, NY", lat: 40.7128, lng: -74.006 },
  { label: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { label: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  { label: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  { label: "Salt Lake City, UT", lat: 40.7608, lng: -111.891 },
];
