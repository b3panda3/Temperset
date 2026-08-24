// Temperset role taxonomy — covers the whole ecosystem of heat-data users.
// Each role has a curated lens that translates temperature into role-specific decisions.

export type RoleId =
  | "individual"
  | "enterprise-logistics"
  | "enterprise-datacenter"
  | "enterprise-retail"
  | "government-planner"
  | "government-public-health"
  | "ngo-climate"
  | "architect"
  | "logistics-operator"
  | "road-constructor"
  | "airline-ops"
  | "energy-utility"
  | "real-estate-developer"
  | "agriculture"
  | "emergency-services"
  | "ml-researcher";

export interface Role {
  id: RoleId;
  label: string;
  group: "individual" | "enterprise" | "government" | "ngo" | "professional";
  icon: string;
  description: string;
  // The categories this role cares about most, in priority order
  priorityCategories: string[];
  // The temperature thresholds that matter to them (in °F)
  thresholds: { label: string; value: number; action: string }[];
  // Sample insight shown during onboarding
  sampleInsight: string;
}

export const ROLES: Role[] = [
  {
    id: "individual",
    label: "Individual / Resident",
    group: "individual",
    icon: "User",
    description: "Personal heat-aware decisions — commute, exercise, errands.",
    priorityCategories: ["resilient-cities", "government-environment"],
    thresholds: [
      { label: "Outdoor activity caution", value: 90, action: "Avoid direct sun exposure for >30 min" },
      { label: "Heat stress risk", value: 100, action: "Stay indoors 11:00–16:00, hydrate hourly" },
    ],
    sampleInsight:
      "Your 1pm jog route crosses a 7°F thermal spike at mile 2 — shift to morning or reroute via Elm St for shade.",
  },
  {
    id: "enterprise-logistics",
    label: "Logistics Operator",
    group: "enterprise",
    icon: "Truck",
    description: "Fleet routing, driver safety, cargo heat exposure.",
    priorityCategories: ["industrial-enterprise", "resilient-cities", "agentic-ai"],
    thresholds: [
      { label: "Driver heat stress", value: 95, action: "Mandatory 30min break, hydration every 20min" },
      { label: "Cargo risk (pharma/food)", value: 110, action: "Reefer temp audit, reroute via cooler corridor" },
    ],
    sampleInsight:
      "I-10 corridor hits 108°F between 12:00–16:00 today. Reroute via I-8 or schedule mandatory breaks at 14:30. Saves 2.3 hrs of driver heat exposure.",
  },
  {
    id: "enterprise-datacenter",
    label: "Data Center Operations",
    group: "enterprise",
    icon: "Server",
    description: "Cooling efficiency, chiller loads, PUE optimization.",
    priorityCategories: ["industrial-enterprise", "future-buildings", "data-analysis"],
    thresholds: [
      { label: "Free cooling window", value: 70, action: "Enable economizer, bypass chiller" },
      { label: "Chiller peak", value: 95, action: "Pre-cool by 2°F, shift non-critical load" },
    ],
    sampleInsight:
      "Free cooling window 02:00–06:00 tonight — chiller bypass saves $4,200. Pre-cool facility by 2°F starting 01:30.",
  },
  {
    id: "enterprise-retail",
    label: "Retail / Commercial",
    group: "enterprise",
    icon: "ShoppingBag",
    description: "Foot traffic forecasting, HVAC, merchandising by heat.",
    priorityCategories: ["industrial-enterprise", "future-buildings", "data-analysis"],
    thresholds: [
      { label: "Foot traffic surge", value: 95, action: "Increase staff, stock cold beverages near entrance" },
      { label: "HVAC peak", value: 100, action: "Pre-cool by 3°F, close dock doors aggressively" },
    ],
    sampleInsight:
      "Foot traffic up 18% at your Scottsdale location today — pre-stage cold beverage endcap and add 2 cashiers at 14:00.",
  },
  {
    id: "government-planner",
    label: "City / Urban Planner",
    group: "government",
    icon: "Map",
    description: "Heat equity, cool corridors, infrastructure prioritization.",
    priorityCategories: ["resilient-cities", "government-environment", "data-analysis"],
    thresholds: [
      { label: "Heat island threshold", value: 95, action: "Activate cool corridor plan, deploy misting stations" },
      { label: "Vulnerable zone alert", value: 100, action: "Open cooling centers, dispatch outreach teams" },
    ],
    sampleInsight:
      "Heat equity gap of 6°F between District 7 and District 3 — three cooling centers needed within 0.5mi of high-vulnerability zones.",
  },
  {
    id: "government-public-health",
    label: "Public Health Official",
    group: "government",
    icon: "HeartPulse",
    description: "ER visit forecasting, vulnerable population outreach.",
    priorityCategories: ["government-environment", "resilient-cities", "data-analysis"],
    thresholds: [
      { label: "ER surge risk", value: 100, action: "Notify hospitals, pre-position cooling supplies" },
      { label: "Elderly exposure", value: 95, action: "Outreach to 65+ residents in zone, wellness checks" },
    ],
    sampleInsight:
      "Heat-related ER visits projected up 23% in Zip 85003 today — declare heat advisory, alert hospitals by 11:00.",
  },
  {
    id: "ngo-climate",
    label: "Climate NGO",
    group: "ngo",
    icon: "Leaf",
    description: "Advocacy, equity analysis, community resilience.",
    priorityCategories: ["government-environment", "data-analysis", "resilient-cities"],
    thresholds: [
      { label: "Equity threshold", value: 95, action: "Publish heat equity report, mobilize volunteers" },
      { label: "Community risk", value: 100, action: "Open community cooling spaces, distribute water" },
    ],
    sampleInsight:
      "Heat equity analysis: low-income Zip 85004 runs 5.4°F hotter than wealthy 85253 — publish briefing, target advocacy.",
  },
  {
    id: "architect",
    label: "Architect / Engineer",
    group: "professional",
    icon: "Ruler",
    description: "Material spec, thermal bridging, albedo design.",
    priorityCategories: ["future-buildings", "resilient-cities", "data-analysis"],
    thresholds: [
      { label: "Thermal expansion", value: 95, action: "Spec expansion joints, albedo 0.65+ coating" },
      { label: "Material stress", value: 110, action: "Redesign facade, add shading structure" },
    ],
    sampleInsight:
      "South facade thermal expansion +0.8mm at forecast peak — recommend albedo 0.65 coating and 12mm expansion joints.",
  },
  {
    id: "logistics-operator",
    label: "Logistics Operations Manager",
    group: "enterprise",
    icon: "PackageCheck",
    description: "Same-day delivery, last-mile heat risk, fleet scheduling.",
    priorityCategories: ["industrial-enterprise", "agentic-ai", "resilient-cities"],
    thresholds: [
      { label: "Last-mile risk", value: 100, action: "Shift deliveries to 06:00–10:00 window" },
      { label: "Driver heat stress", value: 95, action: "AC cabin audit, hydration kit, mandatory breaks" },
    ],
    sampleInsight:
      "Same-day deliveries in Phoenix surface lots will expose drivers to 105°F+ between 13:00–17:00 — shift window to 06:00–10:30.",
  },
  {
    id: "road-constructor",
    label: "Road Constructor",
    group: "professional",
    icon: "HardHat",
    description: "Asphalt curing windows, worker WBGT, paving schedules.",
    priorityCategories: ["industrial-enterprise", "future-buildings", "government-environment"],
    thresholds: [
      { label: "Asphalt curing", value: 90, action: "Paving window closes — reschedule to 05:00–10:30" },
      { label: "Worker WBGT extreme", value: 86, action: "Stop outdoor work, mandatory hydration every 20min" },
    ],
    sampleInsight:
      "Asphalt curing window closes 13:30 today — reschedule paving to 05:00–10:30. WBGT hits 86°F (extreme) at 13:00.",
  },
  {
    id: "airline-ops",
    label: "Airline Operations",
    group: "enterprise",
    icon: "Plane",
    description: "Density altitude, tarmac crew safety, payload optimization.",
    priorityCategories: ["industrial-enterprise", "agentic-ai", "government-environment"],
    thresholds: [
      { label: "Density altitude", value: 5500, action: "Payload restrict flight, delay to cooler window" },
      { label: "Tarmac crew safety", value: 100, action: "Limit tarmac exposure to 30min, rotate crews" },
    ],
    sampleInsight:
      "Density altitude at PHX exceeds 5,500ft after 14:00 — payload-restrict Flight 2241 by 8% or delay departure to 18:30.",
  },
  {
    id: "energy-utility",
    label: "Energy Utility",
    group: "enterprise",
    icon: "Zap",
    description: "Demand forecasting, grid stress, demand response triggers.",
    priorityCategories: ["future-buildings", "industrial-enterprise", "data-analysis"],
    thresholds: [
      { label: "Peak demand", value: 100, action: "Trigger demand response, activate peaker plants" },
      { label: "Grid stress", value: 105, action: "Issue conservation alert, prepare rolling blackout protocol" },
    ],
    sampleInsight:
      "Peak demand forecast: 18,400 MW at 16:00 — trigger demand response program, 2,100 MW shed potential from enrolled customers.",
  },
  {
    id: "real-estate-developer",
    label: "Real Estate Developer",
    group: "enterprise",
    icon: "BuildingIcon2",
    description: "Site selection, cooling ROI, asset value thermal risk.",
    priorityCategories: ["future-buildings", "resilient-cities", "data-analysis"],
    thresholds: [
      { label: "Asset heat exposure", value: 100, action: "Add cooling amenity, increase shading budget by 8%" },
      { label: "Insurance risk", value: 105, action: "Flag for reinsurance review, add cool-roof upgrade" },
    ],
    sampleInsight:
      "Site B runs 4°F hotter than Site A — projected 12% higher cooling costs, 8% lower summer footfall. Recommend Site A.",
  },
  {
    id: "agriculture",
    label: "Agricultural Enterprise",
    group: "enterprise",
    icon: "Sprout",
    description: "Crop stress, irrigation scheduling, frost/heat windows.",
    priorityCategories: ["government-environment", "data-analysis", "future-buildings"],
    thresholds: [
      { label: "Crop stress", value: 95, action: "Increase irrigation by 15%, deploy shade cloth" },
      { label: "Harvest risk", value: 100, action: "Reschedule harvest to dawn, increase worker breaks" },
    ],
    sampleInsight:
      "Citrus groves in Yuma enter stress threshold at 14:00 — increase irrigation by 15% through evening, harvest window 05:00–09:30.",
  },
  {
    id: "emergency-services",
    label: "Emergency Services",
    group: "government",
    icon: "Siren",
    description: "EMS response, wildfire risk, heat-related call forecasting.",
    priorityCategories: ["government-environment", "agentic-ai", "resilient-cities"],
    thresholds: [
      { label: "EMS call surge", value: 100, action: "Pre-position units, add 2 ambulances in Zone B" },
      { label: "Wildfire risk", value: 105, action: "Stage strike teams, red-flag warning protocol" },
    ],
    sampleInsight:
      "EMS response times in Zone B degrade 18% above 95°F — pre-position cooling towels, add unit at 14:00.",
  },
  {
    id: "ml-researcher",
    label: "ML Researcher / Engineer",
    group: "professional",
    icon: "Cpu",
    description: "Model architecture, feature engineering, anomaly detection.",
    priorityCategories: ["model-designing", "data-analysis", "agentic-ai"],
    thresholds: [
      { label: "Forecast horizon", value: 6, action: "6hr forecast skill (RMSE) 0.42°F — production-ready" },
      { label: "Anomaly threshold", value: 4, action: "4.2σ above norm — flag for investigation" },
    ],
    sampleInsight:
      "Forecast skill (RMSE) of 0.42°F on 6-hour horizon — model ready for production. Add WBGT feature for worker safety use case.",
  },
];

export function getRole(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export const ROLE_GROUPS: { id: Role["group"]; label: string }[] = [
  { id: "individual", label: "Individual" },
  { id: "enterprise", label: "Enterprise" },
  { id: "government", label: "Government" },
  { id: "ngo", label: "Non-Profit" },
  { id: "professional", label: "Professional" },
];
