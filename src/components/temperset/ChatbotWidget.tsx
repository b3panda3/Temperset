"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, MessageSquare, Sparkles } from "lucide-react";
import { getCategory } from "@/lib/categories";
import { useTemperset } from "@/lib/store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotWidgetProps {
  categoryId: string;
}

export function ChatbotWidget({ categoryId }: ChatbotWidgetProps) {
  const cat = getCategory(categoryId);
  const { profile, chatOpen, setChatOpen } = useTemperset();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with category-specific greeting
  useEffect(() => {
    if (!cat) return;
    const roleHint = profile ? ` I see you're a ${profile.label} — I'll keep my answers tuned to your lens.` : "";
    setMessages([
      {
        role: "assistant",
        content: `Hi, I'm the ${cat.name} analyst.${roleHint} Ask me anything about heat in this domain — I'll translate temperature into decisions you can act on.`,
      },
    ]);
  }, [cat, profile]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading || !cat) return;
    const userMsg = input.trim();
    setInput("");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: cat.id,
          roleId: profile?.role,
          location: profile?.location,
          message: userMsg,
          history,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "No response." },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Here's the headline insight: limit outdoor heat exposure between 12:00–16:00, hydrate every 20min, and reroute via shaded corridors where possible.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!cat) return null;

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-white font-semibold shadow-xl transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${cat.gradient.from}, ${cat.gradient.to})`,
              boxShadow: `0 8px 32px ${cat.gradient.to}50`,
            }}
            aria-label="Open chatbot"
          >
            <Bot size={20} />
            <span className="text-sm hidden sm:inline">Ask {cat.name} AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-h-[70vh] flex flex-col rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/10"
              style={{
                background: `linear-gradient(135deg, ${cat.gradient.from}30, ${cat.gradient.to}30)`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${cat.gradient.from}, ${cat.gradient.to})`,
                  }}
                >
                  <Bot size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{cat.name} AI</div>
                  <div className="text-[10px] text-white/60">
                    {profile ? `Tuned for ${profile.label}` : "General insights"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 max-h-[50vh]"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-orange-500 text-white rounded-br-sm"
                        : "bg-white/10 text-white/90 rounded-bl-sm border border-white/10"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-sm border border-white/10 px-3 py-2 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {getSuggestions(cat.id).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => {
                        const el = document.querySelector<HTMLInputElement>(
                          'input[placeholder="Ask about heat..."]',
                        );
                        el?.focus();
                      }, 0);
                    }}
                    className="rounded-full px-2.5 py-1 text-[11px] bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/10 p-2 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about heat..."
                className="flex-1 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-400"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-full p-2 text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${cat.gradient.from}, ${cat.gradient.to})`,
                }}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getSuggestions(categoryId: string): string[] {
  const map: Record<string, string[]> = {
    "resilient-cities": [
      "Where are the hottest blocks in my city?",
      "Plan a cool walking route",
      "Which zones need cooling centers?",
    ],
    "future-buildings": [
      "Optimize my HVAC tonight",
      "When is free cooling available?",
      "What's my retrofit ROI?",
    ],
    "industrial-enterprise": [
      "Reroute my drivers around heat",
      "Is it safe for outdoor work?",
      "Cooling cost forecast tonight",
    ],
    "government-environment": [
      "Issue a heat advisory?",
      "Where are vulnerable residents?",
      "Cooling center allocation plan",
    ],
    "model-designing": [
      "Suggest a forecasting architecture",
      "How to detect anomalies?",
      "Which features matter most?",
    ],
    "agentic-ai": [
      "Automate a heat response",
      "Which APIs should I chain?",
      "Build an alert workflow",
    ],
    "data-analysis": [
      "Heat equity in my city",
      "Productivity cost of heat",
      "Economic impact analysis",
    ],
  };
  return map[categoryId] || ["What should I do today?"];
}
