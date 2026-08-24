// Temperature proxy — calls FortyGuard API (with mock fallback) so we never expose keys client-side.

import { NextRequest, NextResponse } from "next/server";
import { getTemperature, PULSE_CITIES } from "@/lib/fortyguard";

export const runtime = "nodejs";
export const revalidate = 300; // 5-min cache

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const mode = searchParams.get("mode"); // "pulse" returns all pulse cities

  if (mode === "pulse") {
    const results = await Promise.all(
      PULSE_CITIES.map(async (c) => {
        const t = await getTemperature(c.lat, c.lng, c.label);
        return {
          label: c.label,
          lat: c.lat,
          lng: c.lng,
          tempF: t.current.tempF,
          tempC: t.current.tempC,
          peakF: t.peakF,
          peakHour: t.peakHour,
          heatIslandDeltaF: t.heatIslandDeltaF,
        };
      }),
    );
    return NextResponse.json({ cities: results, timestamp: new Date().toISOString() });
  }

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  // US-only check (FortyGuard limitation)
  if (lat < 24 || lat > 50 || lng < -125 || lng > -66) {
    return NextResponse.json(
      {
        error:
          "FortyGuard covers the United States only. Please pick a US location.",
      },
      { status: 400 },
    );
  }

  const forecast = await getTemperature(lat, lng);
  return NextResponse.json(forecast);
}
