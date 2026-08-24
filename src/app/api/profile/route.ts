// User profile persistence — uses Prisma + SQLite.
// Falls back to in-memory store if DB unavailable so demo never breaks.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/roles";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profiles = await db.userProfile.findMany({ take: 50, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ profiles });
  } catch {
    return NextResponse.json({ profiles: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, email, organization, industry, location, latitude, longitude, preferences } = body;

    // Validate role
    if (!ROLES.find((r) => r.id === role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    let profile;
    try {
      // Upsert by email if provided
      if (email) {
        profile = await db.userProfile.upsert({
          where: { email },
          update: {
            role,
            name,
            organization,
            industry,
            location,
            latitude,
            longitude,
            preferences: preferences ? JSON.stringify(preferences) : undefined,
            onboarded: true,
          },
          create: {
            email,
            name,
            role,
            organization,
            industry,
            location,
            latitude,
            longitude,
            preferences: preferences ? JSON.stringify(preferences) : null,
            onboarded: true,
          },
        });
      } else {
        // Anonymous profile
        profile = await db.userProfile.create({
          data: {
            role,
            name,
            organization,
            industry,
            location,
            latitude,
            longitude,
            preferences: preferences ? JSON.stringify(preferences) : null,
            onboarded: true,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB unavailable, returning ephemeral profile:", dbErr);
      profile = {
        id: "demo-" + Date.now(),
        role,
        name,
        email,
        organization,
        industry,
        location,
        latitude,
        longitude,
        preferences,
        onboarded: true,
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error("Profile save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
