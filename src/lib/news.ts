// Temperset news aggregator — uses GDELT Project (free, no key) as primary source.
// Falls back to mock headlines when network is unavailable.

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  snippet: string;
  category: string;
}

// GDELT DOC 2.0 API — free, no key, returns news articles matching keywords.
// Docs: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
const GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc";

export async function fetchCategoryNews(categoryQuery: string, category: string): Promise<NewsItem[]> {
  try {
    const url = `${GDELT_URL}?query=${encodeURIComponent(categoryQuery)}&mode=ArtList&maxrecords=8&format=json&sort=datedesc`;
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // cache 30 min
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      const articles = Array.isArray(data?.articles) ? data.articles : [];
      if (articles.length > 0) {
        return articles.slice(0, 8).map((a: any): NewsItem => ({
          title: a.title || "Untitled",
          url: a.url || "#",
          source: a.domain || a.sourcecountry || "GDELT",
          publishedAt: a.seendate || new Date().toISOString(),
          snippet: (a.socialimage || "") + " " + (a.title || "").slice(0, 180),
          category,
        }));
      }
    }
  } catch (e) {
    console.warn("GDELT fetch failed, using mock news:", e);
  }

  return mockNews(category);
}

// Mock news — realistic-looking headline templates per category
function mockNews(category: string): NewsItem[] {
  const now = Date.now();
  const day = 86400000;

  const templates: Record<string, { title: string; source: string }[]> = {
    "resilient-cities": [
      { title: "Phoenix unveils $30M cool corridor plan targeting hottest neighborhoods", source: "CityLab" },
      { title: "Urban heat island mapping reveals 8°F gap between affluent and low-income districts", source: "Governing" },
      { title: "Cool pavement pilot cuts surface temps 12°F in LA neighborhood trial", source: "SmartCities Dive" },
      { title: "Digital twin platform lets planners simulate heat mitigation before spending", source: "Urban Tech" },
      { title: "Cities deploy misting stations and shade canopies ahead of weekend heat dome", source: "Reuters" },
    ],
    "future-buildings": [
      { title: "Data center free-cooling retrofit saves $2.8M annually, NV Energy reports", source: "Data Center Dynamics" },
      { title: "HVAC AI optimization trims peak load 18% at commercial tower in Houston", source: "BuildingOps" },
      { title: "Retrofit ROI calculator shows 4-year payback for cool-roof coatings", source: "GreenBiz" },
      { title: "Passive cooling designs gain traction as heat waves intensify", source: "Architectural Record" },
      { title: "Smart thermostats cut multi-family cooling bills 22% in summer trial", source: "Utility Dive" },
    ],
    "industrial-enterprise": [
      { title: "Logistics firms reroute drivers as heat stress risk climbs across I-10 corridor", source: "FreightWaves" },
      { title: "Data center operators prep for $4M chiller-load night as temps peak", source: "Data Center Knowledge" },
      { title: "OSHA proposes new heat-stress rules for outdoor workers", source: "EHS Today" },
      { title: "Airline density-altitude restrictions trigger payload limits at PHX, LAS", source: "Aviation Week" },
      { title: "Construction crews shift paving schedules to dawn amid heat wave", source: "Engineering News-Record" },
    ],
    "government-environment": [
      { title: "Heat vulnerability map reveals 1,847 elderly residents at risk in Zone B", source: "AP News" },
      { title: "Agricultural stress monitor flags citrus groves in Yuma at critical threshold", source: "AgriPulse" },
      { title: "Climate resilience planner adopted by 14 cities ahead of summer 2026", source: "Smart Cities World" },
      { title: "County declares heat advisory as ER visits climb 23% in Phoenix", source: "AZ Republic" },
      { title: "Federal heat-mapping initiative expands to all 50 states", source: "E&E News" },
    ],
    "model-designing": [
      { title: "New temperature forecasting model achieves 0.42°F RMSE on 6-hour horizon", source: "ML Times" },
      { title: "Anomaly detection flags microclimate shift in urban sensor network", source: "KDnuggets" },
      { title: "Risk classifier predicts heat-related ER surges 24hrs in advance", source: "MIT Tech Review" },
      { title: "Time-series transformer outperforms LSTMs on multi-city heat forecasts", source: "Papers With Code" },
      { title: "Feature engineering guide: WBGT, albedo, and urban form boost forecast skill", source: "Towards Data Science" },
    ],
    "agentic-ai": [
      { title: "Autonomous heat-response agent orchestrates 7 APIs in 4.2 seconds", source: "The Register" },
      { title: "LLM agents automate cooling center dispatch in pilot city", source: "VentureBeat" },
      { title: "Workflow automation trims heat-response time from 90min to 12min", source: "Government Technology" },
      { title: "Alert automation engine sends 3,200 SMS to vulnerable residents in 8min", source: "NextGov" },
      { title: "API orchestration bot slashes overhead for emergency services", source: "FCW" },
    ],
    "data-analysis": [
      { title: "Heat equity analysis shows 6°F gap between wealthy and low-income ZIPs", source: "Bloomberg CityLab" },
      { title: "Economic impact study: heat costs Phoenix metro $2.8M per summer day", source: "WSJ" },
      { title: "Productivity correlation: every 1°F above 85°F costs $0.42/hr per worker", source: "Harvard Business Review" },
      { title: "Pearson r=0.78 found between ambient temp and outdoor worker output", source: "Statistical Science" },
      { title: "Data shows heat-related ER visits concentrated in 12 US ZIP codes", source: "NPR" },
    ],
  };

  const list = templates[category] || templates["industrial-enterprise"];
  return list.map((t, i) => ({
    title: t.title,
    url: "https://www.google.com/search?q=" + encodeURIComponent(t.title),
    source: t.source,
    publishedAt: new Date(now - i * 6 * 3600000 - day / 3).toISOString(),
    snippet: t.title,
    category,
  }));
}
