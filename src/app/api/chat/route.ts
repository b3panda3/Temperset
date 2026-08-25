// Per-category chatbot — uses Z.ai GLM via z-ai-web-dev-sdk when configured,
// falls back to Groq (free, OpenAI-compatible) when Z.ai is unavailable.
// Falls back to a deterministic response if both are unavailable.

import { NextRequest, NextResponse } from "next/server";
import { getCategory } from "@/lib/categories";
import { getRole } from "@/lib/roles";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ChatRequestBody {
  category: string;
  roleId?: string;
  location?: string;
  temperature?: number;
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

function buildSystemPrompt(category: any, role: any, body: ChatRequestBody): string {
  return [
    category.chatbotPersona,
    role
      ? `The user is a ${role.label}. Prioritize insights relevant to their role: ${role.description}. Their priority categories are: ${role.priorityCategories.join(", ")}. Their key temperature thresholds: ${role.thresholds.map((t: any) => `${t.label} at ${t.value}${t.label.includes("WBGT") || t.label.includes("altitude") ? "" : "°F"} → ${t.action}`).join("; ")}.`
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
}

// --- Z.ai path ---
async function callZai(messages: any[]): Promise<string | null> {
  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });
    return completion.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.warn("Z.ai unavailable:", e instanceof Error ? e.message : e);
    return null;
  }
}

// --- Groq path (free, OpenAI-compatible) ---
async function callGroq(messages: any[]): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      console.warn("Groq API error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.warn("Groq unavailable:", e instanceof Error ? e.message : e);
    return null;
  }
}

// --- Deterministic fallback ---
function fallbackReply(category: any, role: any): string {
  const roleHint = role ? ` For a ${role.label}: ${role.sampleInsight}` : "";
  return `Temperset's ${category.name} analyst is warming up. Here's the headline insight: limit outdoor heat exposure between 12:00–16:00, hydrate every 20 minutes, and reroute via shaded corridors where possible.${roleHint} Re-ask your question in a moment for a tailored breakdown.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const category = getCategory(body.category);
    if (!category) {
      return NextResponse.json({ error: "Unknown category" }, { status: 400 });
    }
    const role = body.roleId ? getRole(body.roleId) : undefined;
    const systemPrompt = buildSystemPrompt(category, role, body);

    const messages = [
      { role: "system", content: systemPrompt },
      ...(body.history || []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: body.message },
    ];

    // Try Z.ai first, then Groq, then deterministic fallback
    let reply = await callZai(messages);
    if (!reply) reply = await callGroq(messages);
    if (!reply) reply = fallbackReply(category, role);

    return NextResponse.json({
      reply,
      category: body.category,
      timestamp: new Date().toISOString(),
      provider: process.env.GROQ_API_KEY && !reply.includes("warming up") ? "groq" : "zai",
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    const category = getCategory((await req.clone().json().catch(() => ({})).category));
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
