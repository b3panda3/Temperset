// Temperset category taxonomy — merges all 7 FortyGuard tracks into one platform.
// Each category has its own color, icon, prompt personality, news query, and role translations.

export type CategoryId =
  | "resilient-cities"
  | "future-buildings"
  | "industrial-enterprise"
  | "government-environment"
  | "model-designing"
  | "agentic-ai"
  | "data-analysis";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  // Track number from the hackathon brief
  trackNumber: number;
  // Tailwind gradient stops — thermal/earthy palette
  gradient: { from: string; to: string; ring: string };
  // lucide icon name
  icon: string;
  // Short one-liner shown on the wheel
  blurb: string;
  // The full description shown on the category landing
  description: string;
  // News query terms used by GDELT/NewsAPI
  newsQuery: string;
  // Build examples from the brief
  examples: string[];
  // Role translations — same temperature, different decisions
  translations: { role: string; insight: string }[];
  // Tech stack listed in the brief
  technologies: string[];
  // System prompt for the per-category chatbot
  chatbotPersona: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "resilient-cities",
    name: "Resilient Cities",
    tagline: "Design cooler, smarter cities",
    trackNumber: 1,
    gradient: { from: "#22D3EE", to: "#0E7490", ring: "#67E8F9" },
    icon: "Building2",
    blurb: "Cool routes, asset audits, digital twins",
    description:
      "Hyperlocal temperature intelligence for urban planners, residents, and emergency services. Identify heat islands, design cool corridors, and route people around thermal stress at the street level.",
    newsQuery: "urban heat island OR cool corridor OR city heat resilience",
    examples: ["Cool Route Planner", "Public Asset Heat Audit", "Digital Twin Simulation"],
    translations: [
      { role: "City Planner", insight: "Heat equity gap of 6°F between District 7 and District 3 — three cooling centers needed within 0.5mi of high-vulnerability zones." },
      { role: "Resident", insight: "Your walk to the transit hub crosses a 7°F thermal spike at 2pm — cool route via Oak St saves 3 minutes of heat exposure." },
      { role: "Emergency Services", insight: "EMS response times in Zone B degrade 18% above 95°F — pre-position cooling towels and add unit at 14:00." },
    ],
    technologies: ["Temperature API®", "GIS", "Urban AI", "Climate Intelligence"],
    chatbotPersona:
      "You are Temperset's Resilient Cities analyst. You translate hyperlocal temperature data into urban planning decisions: cool corridors, heat-vulnerable populations, asset risk audits, EMS response optimization. Be concrete, cite street/block scale, and always end with one actionable recommendation.",
  },
  {
    id: "future-buildings",
    name: "Future Buildings",
    tagline: "Optimize cooling, retrofit smartly",
    trackNumber: 2,
    gradient: { from: "#FCD34D", to: "#D97706", ring: "#FDE68A" },
    icon: "Building",
    blurb: "HVAC, energy forecasting, retrofit ROI",
    description:
      "AI-driven heat insights for buildings, cooling systems, and energy use. Predict demand, optimize HVAC schedules, and quantify retrofit returns with thermal precision.",
    newsQuery: "HVAC efficiency OR building cooling OR retrofit energy",
    examples: ["HVAC Optimization", "Energy Forecasting", "Retrofit ROI"],
    translations: [
      { role: "Facility Manager", insight: "Free cooling window 02:00–06:00 tonight — pre-cool building by 2°F to shave 14% off peak chiller load." },
      { role: "Energy Analyst", insight: "Demand peak shifts 90 min earlier this week — adjust TOU scheduling to capture $4,200 in savings." },
      { role: "Architect", insight: "South facade thermal expansion +0.8mm at forecast peak — recommend albedo 0.65 coating on new build." },
    ],
    technologies: ["Temperature API®", "ML Models", "Energy Systems", "IoT"],
    chatbotPersona:
      "You are Temperset's Future Buildings analyst. You translate temperature data into HVAC, energy, and retrofit decisions. Quantify savings in kWh, dollars, or ROI when possible. Always specify the time window for any optimization.",
  },
  {
    id: "industrial-enterprise",
    name: "Industrial & Enterprise",
    tagline: "Heat into operational decisions",
    trackNumber: 3,
    gradient: { from: "#FB923C", to: "#9A3412", ring: "#FDBA74" },
    icon: "Factory",
    blurb: "Logistics, data centers, worker safety",
    description:
      "The flagship track. Turn heat intelligence into operational and business decisions for logistics, data centers, and industrial risk. Worker safety dashboards, route thermal analysis, and cooling cost forecasting — all in one operational layer.",
    newsQuery: "data center cooling OR logistics heat OR worker safety heat stress",
    examples: ["Logistics Heat Risk", "Data Center Cooling", "Worker Safety Dashboard"],
    translations: [
      { role: "Logistics Manager", insight: "I-10 corridor hits 108°F between 12:00–16:00 — driver heat-stress risk HIGH. Reroute via I-8 or schedule break windows at 14:30." },
      { role: "Data Center Ops", insight: "Free cooling available 02:00–06:00 — chiller bypass saves $4,200 tonight. Rack inlet temps will hold under 75°F." },
      { role: "Construction Foreman", insight: "WBGT index hits 86°F (extreme) at 13:00 — limit outdoor work to 05:00–10:30, mandatory 30min breaks, hydration every 20min." },
      { role: "Airline Ops", insight: "Density altitude at PHX exceeds 5,500ft after 14:00 — payload-restrict Flight 2241 by 8% or delay departure to 18:30." },
    ],
    technologies: ["Temperature API®", "AI", "Risk Analysis", "Operations"],
    chatbotPersona:
      "You are Temperset's Industrial & Enterprise analyst — the flagship persona. You translate temperature into dollars, hours, and risk thresholds. Always cite a specific dollar figure, time window, or risk score. Treat each user role differently: logistics managers care about routes and drivers, data center ops care about chiller loads and dollars, construction foremen care about WBGT and worker safety.",
  },
  {
    id: "government-environment",
    name: "Government & Environment",
    tagline: "Public safety, planning, resilience",
    trackNumber: 4,
    gradient: { from: "#34D399", to: "#047857", ring: "#6EE7B7" },
    icon: "Landmark",
    blurb: "Heat vulnerability, ag stress, resilience",
    description:
      "Tools for policymakers and city agencies. Interactive heat maps for planning, agricultural stress monitoring, and climate resilience programs backed by real-time and predictive thermal data.",
    newsQuery: "heat vulnerability OR climate resilience OR agricultural stress heat",
    examples: ["Heat Vulnerability Map", "Agricultural Stress Monitor", "Climate Resilience Planner"],
    translations: [
      { role: "Policy Maker", insight: "Heat-related ER visits up 23% in Zip 85003 — declare heat advisory, allocate $50k cooling center funding through weekend." },
      { role: "Public Health Official", insight: "Vulnerable population density: 1,847 elderly residents in Zone B without AC — prioritize outreach today." },
      { role: "Agricultural Agent", insight: "Citrus groves in Yuma enter stress threshold at 14:00 — increase irrigation by 15% through evening." },
    ],
    technologies: ["Temperature API®", "Policy AI", "GIS", "Open Data"],
    chatbotPersona:
      "You are Temperset's Government & Environment analyst. You translate temperature data into public safety and policy actions. Cite specific populations, dollars, or ordinance thresholds. Be neutral, evidence-based, and outcome-focused.",
  },
  {
    id: "model-designing",
    name: "Model Designing",
    tagline: "Forecasting, anomaly, risk ML",
    trackNumber: 5,
    gradient: { from: "#A78BFA", to: "#6D28D9", ring: "#C4B5FD" },
    icon: "BrainCircuit",
    blurb: "Forecasting, anomaly, risk classifier",
    description:
      "Build ML models that transform raw temperature into actionable insights. Forecasting engines, anomaly detectors, and risk classifiers powered by FortyGuard's hyperlocal feed.",
    newsQuery: "temperature forecasting model OR anomaly detection climate OR heat risk model",
    examples: ["Heat Forecasting Model", "Anomaly Detector", "Risk Classifier"],
    translations: [
      { role: "ML Engineer", insight: "Forecast skill (RMSE) of 0.42°F on 6-hour horizon — model ready for production. Add WBGT feature for worker safety use case." },
      { role: "Risk Analyst", insight: "Anomaly detected: Zone B running 4.2σ above 5-year norm — flag for investigation, possible sensor drift or microclimate shift." },
    ],
    technologies: ["Temperature API®", "Machine Learning", "Forecasting", "Python"],
    chatbotPersona:
      "You are Temperset's Model Designing analyst. You discuss ML architecture, feature engineering, model evaluation, and deployment. Be technical — cite metrics (RMSE, MAE, F1), algorithms, and best practices for time-series temperature forecasting.",
  },
  {
    id: "agentic-ai",
    name: "Agentic AI",
    tagline: "Autonomous heat workflows",
    trackNumber: 6,
    gradient: { from: "#F472B6", to: "#BE185D", ring: "#FBCFE8" },
    icon: "Bot",
    blurb: "Heat response agent, alert automation",
    description:
      "Autonomous AI agents that use FortyGuard APIs to analyze, decide, and automate heat-related workflows without human intervention. Alert engines, API orchestration, and end-to-end response automation.",
    newsQuery: "AI agent autonomous OR workflow automation OR LLM agent API",
    examples: ["Heat Response Agent", "API Orchestration Bot", "Alert Automation Engine"],
    translations: [
      { role: "Operations Lead", insight: "Agent auto-triggered: 4 cooling centers opened, 3 SMS alerts sent to vulnerable residents, EMS pre-positioned. No human action required." },
      { role: "DevOps Engineer", insight: "Agent orchestrating 7 APIs in sequence — FortyGuard → Census → NWS → EPA → Twilio. End-to-end latency: 4.2s." },
    ],
    technologies: ["Temperature API®", "AI Agents", "LLMs", "Workflow Automation"],
    chatbotPersona:
      "You are Temperset's Agentic AI persona. You discuss autonomous agent design, tool orchestration, and workflow automation. Be specific about which APIs to chain, what triggers each step, and how agents decide without human input.",
  },
  {
    id: "data-analysis",
    name: "Data Analysis & Correlation",
    tagline: "Surface insights, quantify impact",
    trackNumber: 7,
    gradient: { from: "#60A5FA", to: "#1E40AF", ring: "#93C5FD" },
    icon: "BarChart3",
    blurb: "Heat equity, economic impact, productivity",
    description:
      "Discover how temperature influences people, infrastructure, and business outcomes through rigorous data analysis. Surface insights that inform better policy, product, and planning decisions.",
    newsQuery: "heat economic impact OR productivity temperature OR heat equity analysis",
    examples: ["Heat Equity Analysis", "Economic Impact Study", "Productivity Correlation"],
    translations: [
      { role: "Data Scientist", insight: "Pearson r=0.78 between ambient temp and worker productivity drop — every 1°F above 85°F costs $0.42/hr per worker in output." },
      { role: "Economist", insight: "Heat-related productivity loss: $2.8M/yr for Phoenix metro — 0.3% of regional GDP." },
    ],
    technologies: ["Temperature API®", "Data Science", "Statistics", "Visualization"],
    chatbotPersona:
      "You are Temperset's Data Analysis & Correlation analyst. You surface statistical relationships between temperature and outcomes. Cite correlations, p-values, sample sizes, and effect sizes when possible. Distinguish correlation from causation explicitly.",
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
