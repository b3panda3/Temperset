# Temperset — Temperature, Translated.

> **The Operating System for Heat.**
> One heat data layer. Infinite operational decisions. Temperset translates the same hyperlocal temperature into role-specific actions — for logistics, data centers, city planners, architects, airlines, and everyone in between.

Built for **FortyGuard Hackathon '26 — Building the World's Temperature AI**.

---

## Table of Contents

1. [The Problem](#the-problem)
2. [Our Solution: Temperset](#our-solution-temperset)
3. [How It Works](#how-it-works)
4. [Features](#features)
5. [Tech Stack](#tech-stack)
6. [APIs Used (All Free)](#apis-used-all-free)
7. [Quick Start](#quick-start)
8. [Local Development](#local-development)
9. [Deploy to Vercel](#deploy-to-vercel)
10. [Environment Variables Reference](#environment-variables-reference)
11. [Project Structure](#project-structure)
12. [Submission Checklist](#submission-checklist)
13. [License](#license)

---

## The Problem

Weather apps tell you the temperature of your city. They can't tell you that one side of the street is 8°F hotter than the other, that driver heat-stress risk peaks between 12pm and 4pm on the I-10 corridor, or that density altitude at Phoenix SkyHarbor will exceed 5,500ft after 2pm — restricting flight payloads.

Existing heat data is either:
- **Too coarse** — city-wide averages that miss the street-level reality
- **Too generic** — the same 100°F means completely different things to a truck driver, an architect, and a city planner, but every platform treats it the same
- **Too siloed** — logistics teams, building operators, and government planners each buy separate tools that all use the same underlying data

Meanwhile, the **FortyGuard Temperature API®** delivers hyperlocal, 2-meter-above-ground, near-real-time ambient temperature at 10mi² resolution — but the data alone doesn't make decisions. It needs translation.

### The Hackathon Context

FortyGuard's Hackathon '26 challenges builders to create AI applications across 7 tracks:

1. **Resilient Cities & Infrastructure** — AI agents that route people around heat
2. **Future Buildings & Energy** — predictive models that optimize cooling
3. **Industrial & Enterprise** — dashboards turning heat data into decisions
4. **Government & Environment** — interactive heat maps for planning and safety
5. **Model Designing** — ML models that transform raw temperature into insights
6. **Agentic AI** — autonomous agents that decide and act on heat workflows
7. **Data Analysis & Correlation** — surface insights linking heat to outcomes

Most teams will pick one track and build a narrow tool. We built **all seven into one platform** — because the same heat data is relevant to all of them, and the value multiplies when you let it flow across roles.

---

## Our Solution: Temperset

**Temperset is a role-aware thermal intelligence platform.** It takes FortyGuard's hyperlocal temperature data and translates the same number into different operational decisions depending on who's looking.

### The Core Insight

> **Same temperature, different decisions.**

| Who's Looking | What 100°F Translates To |
|---|---|
| Logistics Manager | "Driver heat-stress windows 12pm–4pm, reroute via I-8, save 2.3 hrs cooling breaks" |
| Architect | "Spec changes: thermal expansion +0.8mm on south facade, recommend albedo 0.65 coating" |
| City Planner | "Heat equity gap: District 7 runs 6°F hotter, 3 cooling centers needed within 0.5mi" |
| Airline Ops | "Density altitude at PHX exceeds 5,500ft after 14:00, payload restrict flight 2241" |
| Road Contractor | "Asphalt curing window closes 13:30, reschedule paving to 05:00–10:30" |
| Data Center Ops | "Free cooling available 02:00–06:00, save $4,200 in chiller load tonight" |
| Public Health | "ER visits projected up 23% in Zip 85003, declare heat advisory by 11:00" |

This is genuinely novel — no existing platform does role-aware heat translation. It also explains why we merged all 7 tracks: each track is one translation perspective on the same thermal truth.

### Tagline

**Temperature, Translated.** — short, defensible, instantly explains the product.

---

## How It Works

### 1. The Wheel as Metaphor

The landing page centers on a slowly rotating wheel with all 7 hackathon tracks as nodes orbiting a thermal core. The wheel isn't just navigation — it's the brand: *"Heat is the center. You orbit it. Pick your angle."*

- **Slow rotation** (~80 seconds per full turn) — readable, hypnotic, on-brand
- **Hover pauses** the wheel on that category
- **Click** spins into a deep-dive view with role-curated insights
- **Pointer at top** indicates the "current" position (like a roulette)
- **Tick marks** around the perimeter add depth and precision

### 2. The Onboarding Lens

On first visit, users pick from 16 roles across 5 groups:

- **Individual** — Resident
- **Enterprise** — Logistics, Data Center, Retail, Airline, Energy, Real Estate, Agriculture
- **Government** — Urban Planner, Public Health, Emergency Services
- **Non-Profit** — Climate NGO
- **Professional** — Architect, Road Constructor, ML Researcher

Each role has priority categories, temperature thresholds, and sample insights. The platform remembers the role (via `localStorage`) and tailors every subsequent view.

### 3. Role-Aware Translation

When a user opens a category deep-dive, Temperset shows the same temperature data with role-specific translations. If the user is a Logistics Operator opening Industrial & Enterprise, the platform highlights the logistics translation with a "Your lens" badge and the AI chatbot persona incorporates logistics-specific thresholds (driver heat stress at 95°F, cargo risk at 110°F).

### 4. Per-Category AI Analyst

Each of the 7 tracks has its own chatbot persona powered by an LLM (Z.ai GLM-4.5 or Groq's Llama 3.3 70B as fallback). The system prompt combines:
- The category's persona (e.g., "Industrial & Enterprise analyst — translate temperature into dollars, hours, and risk thresholds")
- The user's role thresholds
- The user's current location and temperature
- Strict formatting rules (max 180 words, lead with actionable insight, cite specific numbers, end with a 4-hour recommendation)

### 5. Real-Time Data Layer

- **Temperature** — FortyGuard API (real when key is configured, deterministic mock otherwise)
- **News** — GDELT Project API (free, no key) with mock fallback
- **Maps** — OpenStreetMap + Leaflet (free, open source) for heat visualization

---

## Features

### Landing Page
- **Dynamic sky background** — shifts by time-of-day (dawn/day/sunset/night) with sun arc, drifting clouds, twinkling stars, and a city skyline silhouette with lit windows at night
- **Manual sky override** — "Next Sky" button beside the wheel cycles through dawn → day → sunset → night → auto
- **Rotating category wheel** — 7 tracks orbit a thermal core, slow rotation, hover-pause, click-to-dive, tick marks, top pointer, click-spin effect
- **Top-left Heat Pulse widget** — live ticker of 12 US cities (Phoenix, Las Vegas, Miami, etc.) with expandable panel showing peak temps and heat-island deltas
- **Top-right News Radar widget** — aggregates heat news across all 7 tracks via GDELT
- **Onboarding modal** — 16 roles across 5 groups, 4-step flow (welcome → role → details → sample insight)

### Category Deep-Dive (per track)
- **Hero band** with track gradient, icon, track number, and tagline
- **Live temperature readout** — current, peak, and heat-island delta
- **Role-curated translations** — same temperature, different decisions per role (user's role highlighted with "Your lens" badge)
- **Interactive heat map** (Track 1: Resilient Cities & Track 4: Government only) — Leaflet + OpenStreetMap with concentric heat tiles, cool corridor suggestions, and vulnerability zones
- **Per-category news feed** — GDELT-sourced headlines relevant to the track
- **Floating AI chatbot** — per-track LLM persona with role-tuned system prompt and quick-suggestion chips

### Persistence
- **Profile saved** via Zustand `persist` middleware (localStorage)
- **Database** — Prisma + SQLite for chat history, saved searches, and heat alerts
- **API caching** — temperature cached 5min, news cached 30min

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (New York style) + Lucide icons |
| Animations | Framer Motion |
| State | Zustand (client) + TanStack Query (server) |
| Database | Prisma ORM + SQLite |
| Maps | Leaflet + react-leaflet + OpenStreetMap |
| LLM | Z.ai GLM-4.5 (primary) + Groq Llama 3.3 70B (fallback) |
| Temperature Data | FortyGuard Temperature API® |
| News | GDELT Project API |
| Auth | NextAuth.js v4 (available, not yet wired) |
| Deployment | Vercel |

---

## APIs Used (All Free)

Temperset is built entirely on free-tier APIs. **Total cash outlay: $0.**

### Required

| API | Purpose | Env Var | Free Tier Limit | Estimated Usage |
|---|---|---|---|---|
| **FortyGuard Temperature API®** | Core heat data (2m ambient, 10mi², real-time + 12hr forecast) | `FORTYGUARD_API_KEY` | Free during 2-week hackathon + trial credits | ~10,000 calls |
| **Z.ai GLM-4.5** | 7 category chatbots + role curation | `ZAI_API_KEY` + `ZAI_BASE_URL` | Free in dev env (proprietary, has free tier) | ~50,000 calls |

### LLM Fallback (pick one if Z.ai unavailable)

| API | Purpose | Env Var | Free Tier | Notes |
|---|---|---|---|---|
| **Groq** | LLM fallback (Llama 3.3 70B) | `GROQ_API_KEY` | Free, ~30 req/min | OpenAI-compatible, very fast |

> **Is Z.ai GLM open source?** No. Z.ai GLM is a proprietary LLM service from Z.ai (the team behind ChatGLM). The `z-ai-web-dev-sdk` reads credentials from a `.z-ai-config` JSON file (not env vars). It works in this dev environment because the platform pre-provisions the config at `/etc/.z-ai-config`. For local development or Vercel deployment, you need to either:
> 1. Register at https://chat.z.ai or https://open.bigmodel.cn to get your own Z.ai credentials, create a `.z-ai-config` file in your project root
> 2. **OR** use Groq as a fully free, open-source-compatible alternative — just set `GROQ_API_KEY` and the chat API will auto-fallback to Groq's Llama 3.3 70B

### Supplementary (all optional, have free fallbacks built in)

| API | Purpose | Env Var | Free Tier | Required? |
|---|---|---|---|---|
| GDELT Project | Primary news source | (no key) | Unlimited | Used by default |
| Open-Meteo | Supplementary weather | (no key) | 10,000/day | Backup only |
| OpenStreetMap + Leaflet | Map rendering | (no key) | Unlimited | Used for tracks 1 & 4 |
| Nominatim (OSM) | Address → coordinates | (no key) | 1 req/sec | Optional |
| Overpass API | Infrastructure queries | (no key) | Rate-limited | Optional |
| NOAA NWS API | Official weather alerts | (no key) | Unlimited | Optional |
| NASA POWER API | Solar radiation, historical | (no key) | Unlimited | Optional |
| NewsAPI.org | Backup news | `NEWS_API_KEY` | 100 req/day | Optional backup |
| EPA AirNow | Air quality ↔ heat | `AIRNOW_API_KEY` | 5,000/hr | Optional |
| US Census | Demographics for equity | `CENSUS_API_KEY` | Unlimited | Optional |
| OpenRouteService | Cool route planning | `ORS_API_KEY` | 2,000/day | Optional |
| Resend | Heat alert emails | `RESEND_API_KEY` | 3,000/month | Optional |

### Infrastructure

| Service | Purpose | Free Tier |
|---|---|---|
| Supabase | Optional Postgres (SQLite used by default) | 500MB DB, 50k MAU |
| Vercel | Hosting & deployment | 100GB bandwidth |

---

## Quick Start

```bash
# 1. Clone your fork (after the hackathon repo is pushed to GitHub)
git clone https://github.com/<your-username>/temperset.git
cd temperset

# 2. Install dependencies
bun install

# 3. Copy env example
cp .env.example .env

# 4. (Optional) Add your FortyGuard API key to .env
# Without it, the app runs on deterministic mock data — still fully demo-able
echo 'FORTYGUARD_API_KEY=your_key_here' >> .env

# 5. (Optional) Add an LLM key — pick one:
#   Z.ai: create .z-ai-config (see below) OR
#   Groq: echo 'GROQ_API_KEY=your_key_here' >> .env

# 6. Initialize the database
bun run db:push

# 7. Start the dev server
bun run dev
```

Open http://localhost:3000 — you should see the rotating wheel with a dynamic sky background.

### Z.ai Config File (alternative to env vars)

If you want to use Z.ai GLM locally, create a file named `.z-ai-config` in the project root:

```json
{
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
  "apiKey": "your_zai_api_key",
  "chatId": "optional",
  "userId": "optional"
}
```

Get your key at https://open.bigmodel.cn after registering.

### Groq Setup (recommended for Vercel)

1. Go to https://console.groq.com/keys
2. Create a free account
3. Generate an API key
4. Add to `.env`: `GROQ_API_KEY=gsk_your_key_here`

Groq hosts Llama 3.3 70B (open source) and is OpenAI-compatible. Free tier: ~30 requests/min, no credit card required.

---

## Local Development

### Prerequisites

- **Node.js 20+** or **Bun 1.3+** (recommended — faster installs)
- A terminal with bash

### Commands

```bash
# Install dependencies
bun install

# Start dev server (auto-runs on port 3000)
bun run dev

# Lint check
bun run lint

# Push Prisma schema to SQLite (run after changing prisma/schema.prisma)
bun run db:push

# Generate Prisma client (auto-runs on db:push)
bun run db:generate

# Production build (NOT recommended in dev — use Vercel for prod)
bun run build

# Start production server (after build)
bun run start
```

### Verifying It Works

After `bun run dev`, open http://localhost:3000. You should see:

1. A dynamic sky background (changes by time of day)
2. A slowly rotating wheel with 7 category nodes
3. Top-left: Heat Pulse widget showing live US city temps
4. Top-right: News Radar widget showing heat headlines
5. A "Next Sky" button beside the wheel to cycle backgrounds
6. After ~1.5 seconds, an onboarding modal appears prompting role selection

### Testing Core Flows

```bash
# 1. Open the app
open http://localhost:3000  # macOS
# xdg-open http://localhost:3000  # Linux

# 2. Click "Get Started" → pick a role → fill details → click "See My Insights"

# 3. Click "Enter Temperset" → you're back on the wheel with your role active

# 4. Click any wheel category (e.g., "Industrial & Enterprise") to open the deep-dive:
#    - Live temperature readout for your location
#    - Role-curated translations (your role is highlighted with "Your lens" badge)
#    - For Resilient Cities & Government tracks: interactive heat map
#    - Per-category news feed
#    - Floating chatbot button (bottom-right) — click to chat with the track's AI analyst

# 5. Try the chatbot — ask "Reroute my drivers around heat today" as a Logistics Operator

# 6. Hover the "Next Sky" button to see the expanded sky picker (Dawn/Day/Sunset/Night/Auto)

# 7. Scroll down to see the "Why Temperset is different" section with the API credits
```

### Troubleshooting

| Issue | Fix |
|---|---|
| Port 3000 already in use | `lsof -i :3000` then kill the process, or set `PORT=3001` |
| Prisma errors | `bun run db:push` to resync schema |
| Chatbot returns fallback message | Check `.z-ai-config` exists OR `GROQ_API_KEY` is set in `.env` |
| Map doesn't render | Disable browser extensions; check console for Leaflet errors |
| Sky mode stuck on auto | Click "Next Sky" to lock to a specific mode, or hover and pick "Auto" |
| Lint errors | `bun run lint` to see them, then fix |

---

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Temperset — Temperature, Translated."

# Create a public GitHub repo named "temperset" at https://github.com/new
# Then push:
git remote add origin https://github.com/<your-username>/temperset.git
git branch -M main
git push -u origin main
```

### Step 2: Add FortyGuard as a Collaborator

> Hackathon requirement: add `fortyguard` as a collaborator on your repo.

1. Go to your repo on GitHub → Settings → Collaborators
2. Click "Add people" → enter `fortyguard`
3. Send invitation

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your `temperset` repo
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: `./` (default)
5. **Build Command**: `bun run build` (auto-detected) or `next build`
6. **Install Command**: `bun install` (auto-detected)
7. **Environment Variables** — add these (see `.env.example` for full list):

| Variable | Value | Required? |
|---|---|---|
| `DATABASE_URL` | `file:./db/custom.db` | Yes (SQLite) — Vercel will use a local file |
| `FORTYGUARD_API_KEY` | Your FortyGuard key | Yes for real data |
| `GROQ_API_KEY` | Your Groq key | Recommended (for chatbot on Vercel) |

> **Note on Z.ai**: The `z-ai-web-dev-sdk` reads from a `.z-ai-config` file, not env vars. To use Z.ai on Vercel, you'd need to add a build step that writes the config file from env vars. **Recommendation**: Use Groq on Vercel — it's simpler (just set `GROQ_API_KEY`) and equally free.

8. Click **Deploy**

### Step 4: Set Up Database (Vercel)

SQLite won't persist across Vercel serverless invocations reliably. For production:

**Option A: Keep SQLite (demo only)** — Works for the hackathon demo since profiles also persist via `localStorage`. Database writes may be ephemeral on Vercel.

**Option B: Switch to Supabase Postgres (free, recommended for production)**:
1. Create a free Supabase project at https://supabase.com
2. Get the `DATABASE_URL` from Supabase dashboard
3. Update `prisma/schema.prisma` datasource to `postgresql`
4. Set `DATABASE_URL` env var on Vercel to your Supabase connection string
5. Run `bun run db:push` locally to create tables
6. Redeploy

### Step 5: Verify Deployment

```bash
# After Vercel deploy completes, you'll get a URL like:
# https://temperset-xxx.vercel.app

# Test these flows:
# 1. Landing page loads with rotating wheel
# 2. Onboarding works
# 3. Heat Pulse widget shows city temps
# 4. News Radar shows headlines
# 5. Category deep-dive opens
# 6. Chatbot responds (uses Groq)
# 7. Maps render on Resilient Cities & Government tracks
```

### Step 6: Submit

Submit three things to FortyGuard (per hackathon rules):
1. **Public GitHub repo URL** — `https://github.com/<your-username>/temperset`
2. **Live demo URL** — your Vercel deployment URL
3. **Collaborator** — add `fortyguard` to your repo (Step 2 above)

**Deadline: 30 August 2026 (GST) — no late submissions.**

---

## Environment Variables Reference

Create a `.env` file in the project root. See `.env.example` for the full template.

### Required

```bash
# Database (SQLite by default — no setup needed)
DATABASE_URL=file:./db/custom.db

# FortyGuard Temperature API
FORTYGUARD_API_KEY=your_key_here
FORTYGUARD_BASE_URL=https://api.fortyguard.com/v1
```

### LLM Provider (pick at least one)

```bash
# Option A: Z.ai GLM-4.5 (uses .z-ai-config file, not env vars)
# Create .z-ai-config in project root:
# {
#   "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
#   "apiKey": "your_zai_key",
#   "chatId": "optional",
#   "userId": "optional"
# }

# Option B: Groq (recommended for Vercel — uses env var)
GROQ_API_KEY=your_groq_key_here
```

### Optional (all have free fallbacks)

```bash
NEWS_API_KEY=optional_backup_news
AIRNOW_API_KEY=optional_air_quality
CENSUS_API_KEY=optional_demographics
ORS_API_KEY=optional_route_planning
RESEND_API_KEY=optional_email_alerts
```

---

## Project Structure

```
temperset/
├── prisma/
│   └── schema.prisma                  # UserProfile, ChatMessage, SavedSearch, HeatAlert
├── public/
│   └── leaflet-images/                # Map marker assets
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Temperset metadata, dark theme
│   │   ├── page.tsx                   # Single-page orchestrator (the only route)
│   │   ├── globals.css                # Custom scrollbar, reduced-motion support
│   │   └── api/
│   │       ├── chat/route.ts          # LLM chatbot (Z.ai → Groq → fallback)
│   │       ├── temperature/route.ts  # FortyGuard proxy (with mock fallback)
│   │       ├── news/route.ts          # GDELT news fetcher
│   │       └── profile/route.ts       # Profile persistence (Prisma)
│   ├── components/
│   │   ├── ui/                         # shadcn/ui component library
│   │   └── temperset/
│   │       ├── SkyBackground.tsx       # Dynamic time-of-day sky + skyline
│   │       ├── BackgroundSwitcher.tsx  # "Next Sky" button + picker
│   │       ├── CategoryWheel.tsx       # Rotating 7-track centerpiece
│   │       ├── HeatPulseWidget.tsx     # Top-left live US heat ticker
│   │       ├── NewsRadarWidget.tsx     # Top-right heat news radar
│   │       ├── OnboardingModal.tsx     # 16-role selector flow
│   │       ├── CategoryDeepDive.tsx    # Track-specific deep view
│   │       ├── TrackMap.tsx            # Leaflet map for tracks 1 & 4
│   │       ├── ChatbotWidget.tsx       # Per-category AI analyst
│   │       └── NewsSection.tsx        # Per-category news feed
│   └── lib/
│       ├── categories.ts               # 7 track definitions (personas, translations, colors)
│       ├── roles.ts                    # 16 role taxonomy (thresholds, priority categories)
│       ├── fortyguard.ts               # API client + deterministic mock
│       ├── news.ts                     # GDELT fetcher + mock fallback
│       ├── store.ts                    # Zustand persisted state
│       ├── db.ts                       # Prisma client
│       └── utils.ts                    # shadcn/ui utilities
├── .env.example                        # Full env var template
├── .env                                # Your local env (not committed)
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── Caddyfile                           # Gateway config (sandbox only)
└── README.md                           # This file
```

---

## Submission Checklist

Per the hackathon rules:

- [ ] Public GitHub repo created
- [ ] `fortyguard` added as a collaborator on the repo
- [ ] Live demo deployed on Vercel (or similar)
- [ ] FortyGuard Temperature API® is **central** to the project (not just a side feature)
- [ ] Combined multiple tracks (we combined all 7 — qualifies for "combine multiple" rule)
- [ ] Submitted before **30 August 2026 (GST)**
- [ ] Project has genuine real-world value (a client would adopt it)
- [ ] Original work (not copied from another team)

### Judging Criteria (and how we score)

| Criterion | Weight | How Temperset Scores |
|---|---|---|
| Impact & Relevance | 40% | Role-aware translation = real client value across 12+ sectors |
| Technical Execution | 35% | Next.js 16 + FortyGuard + LLM agents + 7 chatbots + maps + onboarding |
| Innovation | 15% | "Thermal Empathy Engine" — role-aware translation is genuinely novel |
| Communication | 10% | The wheel metaphor is instantly demo-able; this README is comprehensive |

---

## License

MIT — you keep ownership of your project per hackathon rules. FortyGuard receives a license to showcase it.

---

## Credits

- **FortyGuard** — Temperature API®, hyperlocal urban heat intelligence (NVIDIA-recognized)
- **Z.ai** — GLM-4.5 LLM via `z-ai-web-dev-sdk`
- **Groq** — Llama 3.3 70B (LLM fallback, OpenAI-compatible)
- **GDELT Project** — Free global news API
- **OpenStreetMap** — Free, open-source map data
- **Leaflet** — Open-source JavaScript map library
- **Next.js** — React framework
- **shadcn/ui** — Component library
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Prisma** — ORM
- **Vercel** — Deployment platform

---

**Built for FortyGuard Hackathon '26 — Building the World's Temperature AI.**
