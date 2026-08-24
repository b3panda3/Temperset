// Per-category chatbot — powered by Z.ai GLM via z-ai-web-dev-sdk (server-side only).
// Each category has its own persona + role-aware curation.

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { getCategory } from "@/lib/categories";
import { getRole } from "@/lib/roles";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ChatRequestBody {
  category: string;
  roleId?: string;
  location?: string;
  temperature?: number; // current temp °F, passed in for context
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const category = getCategory(body.category);
    if (!category) {
      return NextResponse.json({ error: "Unknown category" }, { status: 400 });
    }

    const role = body.roleId ? getRole(body.roleId) : undefined;

    const systemPrompt = [
      category.chatbotPersona,
      role
        ? `The user is a ${role.label}. Prioritize insights relevant to their role: ${role.description}. Their priority categories are: ${role.priorityCategories.join(", ")}. Their key temperature thresholds: ${role.thresholds.map((t) => `${t.label} at ${t.value}${t.label.includes("WBGT") || t.label.includes("altitude") ? "" : "°F"} → ${t.action}`).join("; ")}.`
        : "The user has not specified a role — keep insights general but actionable.",
      body.location ? `User location: ${body.location}.` : "",
      typeof body.temperature === "number"
        ? `Current ambient temperature at user location: ${body.temperature}°F.`
        : "",
      `STRICT FORMAT RULES:`,
      `1. Be concise — maximum 180 words per response.`,
      `2. Always lead with the single most actionable insight.`,
      `3. Cite a specific number, time, or dollar figure whenever possible.`,
      `4. End with one concrete recommendation the user can act on in the next 4 hours.`,
      `5. If the question is unrelated to heat or this category, politely redirect.`,
      `6. Never use emojis.`,
      `7. Never claim you have real-time data unless the temperature was provided above.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const messages = [
      { role: "system", content: systemPrompt },
      ...(body.history || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: body.message },
    ];

    // Use Z.ai GLM via the SDK
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "I couldn't process that request. Please try again.";

    return NextResponse.json({
      reply,
      category: body.category,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      {
        error: "Chat service unavailable",
        reply:
          "Temperset's analyst is warming up. Here's the headline: ambient temperature at your location is elevated — limit outdoor exposure between 12:00 and 16:00, hydrate every 20 minutes, and reroute via shaded corridors where possible. Re-ask your question in a moment for a tailored breakdown.",
      },
      { status: 200 },
    );
  }
}
