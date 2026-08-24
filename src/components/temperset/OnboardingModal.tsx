"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLES, ROLE_GROUPS } from "@/lib/roles";
import { useTemperset } from "@/lib/store";
import { X, ArrowRight, ArrowLeft, Check, MapPin, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "welcome" | "role" | "details" | "insights" | "done";

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { setProfile } = useTemperset();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const role = ROLES.find((r) => r.id === selectedRole);
  const Icon = role ? ((Icons as any)[role.icon] ?? Icons.User) : Icons.User;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          name,
          email,
          organization,
          industry: role?.group,
          location,
        }),
      });
      const data = await res.json();
      const p = data.profile;
      setProfile({
        id: p.id,
        role: p.role,
        label: role?.label || p.role,
        name: p.name,
        email: p.email,
        organization: p.organization,
        industry: p.industry,
        location: p.location,
        onboarded: true,
      });
      setStep("done");
    } catch (e) {
      // Save locally even if backend fails
      setProfile({
        role: selectedRole || "individual",
        label: role?.label || "Individual",
        name,
        email,
        organization,
        industry: role?.group,
        location,
        onboarded: true,
      });
      setStep("done");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setStep("welcome");
    setSelectedRole(null);
    setName("");
    setEmail("");
    setOrganization("");
    setLocation("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-orange-400" />
                <span className="text-sm font-semibold uppercase tracking-widest text-white/90">
                  Temperset Onboarding
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <AnimatePresence mode="wait">
                {step === "welcome" && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center py-8"
                  >
                    <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <ThermoIcon />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Temperature, Translated.
                    </h2>
                    <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
                      Temperset doesn't just show you temperature — it translates the same heat data
                      into decisions, specific to your role. Whether you route trucks, design
                      buildings, plan cities, or run data centers, we tailor insights to what you
                      actually do.
                    </p>
                    <p className="text-white/50 mt-3 text-sm">
                      Take 30 seconds to tell us who you are. We'll curate the platform around your
                      lens.
                    </p>
                    <button
                      onClick={() => setStep("role")}
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                    >
                      Get Started <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}

                {step === "role" && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-1">
                      Who are you?
                    </h3>
                    <p className="text-white/60 text-sm mb-5">
                      Your role determines how we translate temperature for you.
                    </p>
                    <div className="space-y-4">
                      {ROLE_GROUPS.map((group) => {
                        const groupRoles = ROLES.filter((r) => r.group === group.id);
                        if (groupRoles.length === 0) return null;
                        return (
                          <div key={group.id}>
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                              {group.label}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {groupRoles.map((r) => {
                                const RoleIcon = (Icons as any)[r.icon] ?? Icons.User;
                                const isSel = selectedRole === r.id;
                                return (
                                  <button
                                    key={r.id}
                                    onClick={() => setSelectedRole(r.id)}
                                    className={`flex items-start gap-2 rounded-xl border p-2.5 text-left transition-all ${
                                      isSel
                                        ? "border-orange-400 bg-orange-500/15"
                                        : "border-white/10 hover:border-white/30 hover:bg-white/5"
                                    }`}
                                  >
                                    <RoleIcon
                                      size={16}
                                      className={isSel ? "text-orange-300 mt-0.5" : "text-white/60 mt-0.5"}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-medium text-white leading-tight">
                                        {r.label}
                                      </div>
                                    </div>
                                    {isSel && (
                                      <Check size={14} className="text-orange-300 flex-shrink-0 mt-0.5" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => setStep("welcome")}
                        className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        disabled={!selectedRole}
                        onClick={() => setStep("details")}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                      >
                        Continue <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "details" && role && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                        <Icon size={22} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{role.label}</h3>
                        <p className="text-xs text-white/60">{role.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Field label="Name (optional)">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Reyes"
                          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-400"
                        />
                      </Field>
                      <Field label="Email (optional, for alerts)">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@org.com"
                          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-400"
                        />
                      </Field>
                      <Field label="Organization (optional)">
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Acme Logistics"
                          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-400"
                        />
                      </Field>
                      <Field label="Primary US City (helps tailor heat data)">
                        <div className="relative">
                          <MapPin
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                          />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Phoenix, AZ"
                            className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-400"
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-white/40">
                          FortyGuard covers the United States only. Enter a US city for best results.
                        </p>
                      </Field>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => setStep("role")}
                        className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        disabled={saving}
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:scale-105 transition-transform"
                      >
                        {saving ? "Saving…" : "See My Insights"} <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "done" && role && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Check size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      You're set, {name?.split(" ")[0] || "explorer"}.
                    </h3>
                    <p className="text-white/70 mb-6">
                      Your Temperset lens is now tuned for{" "}
                      <span className="text-orange-300 font-semibold">{role.label}</span>.
                    </p>

                    {/* Sample insight preview */}
                    <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4 text-left mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-orange-300" />
                        <span className="text-[10px] uppercase tracking-widest text-orange-300 font-semibold">
                          Sample Insight — {role.label}
                        </span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {role.sampleInsight}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        reset();
                        onClose();
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                    >
                      Enter Temperset <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/60 mb-1.5 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function ThermoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4a4 4 0 0 0-4 4v22.5a8 8 0 1 0 8 0V8a4 4 0 0 0-4-4z"
        stroke="white"
        strokeWidth="2.5"
      />
      <rect x="22" y="10" width="4" height="22" rx="2" fill="white" />
      <circle cx="24" cy="34" r="5" fill="white" />
    </svg>
  );
}
