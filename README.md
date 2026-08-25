# Temperset — Temperature, Translated.

<p align="center">
  <img src="public/temperset-logo.svg" alt="Temperset" width="480" />
</p>

<p align="center">
  <strong>The Operating System for Heat.</strong><br/>
  One heat data layer. Infinite operational decisions. Temperset translates the same hyperlocal temperature into role-specific actions — for logistics, data centers, city planners, architects, airlines, and everyone in between.
</p>

<p align="center">
  <img src="public/temperset-cover.svg" alt="Temperset Cover" width="600" />
</p>

<p align="center">
  Built for <strong>FortyGuard Hackathon '26 — Building the World's Temperature AI</strong>
</p>

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
| LLM | Groq Llama 3.3 70B (free, OpenAI-compatible) |
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
| **Groq Llama 3.3 70B** | 7 category chatbots + role curation | `GROQ_API_KEY` | Free, ~30 req/min, no credit card | ~50,000 calls |

### LLM Provider

| API | Purpose | Env Var | Free Tier | Notes |
|---|---|---|---|---|
| **Groq** | LLM for all 7 chatbots | `GROQ_API_KEY` | Free, ~30 req/min | OpenAI-compatible, very fast, hosts Llama 3.3 70B (open source) |

> **Why Groq?** Groq hosts Meta's Llama 3.3 70B (open-source model) on its specialized LPU hardware. The free tier is generous (~30 req/min), no credit card needed, OpenAI-compatible API, and the response latency is industry-leading. Get a free key at https://console.groq.com/keys.

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

# 2. Install dependencies (use npm if you don't have bun)
npm install   # or: bun install

# 3. Copy env example
cp .env.example .env

# 4. Add your keys to .env (at minimum, Groq for the chatbot)
#    Get a free Groq key at https://console.groq.com/keys
#    Add: GROQ_API_KEY=gsk_your_key_here
#    (Optional) FORTYGUARD_API_KEY — without it, mock data is used

# 5. Initialize the database (SQLite, zero setup)
npx prisma generate
npx prisma db push

# 6. Start the dev server
npm run dev   # or: bun run dev
```

Open http://localhost:3000 — you should see the rotating wheel with a dynamic sky background.

### Groq Setup (the only LLM you need)

1. Go to https://console.groq.com/keys
2. Create a free account (no credit card required)
3. Generate an API key
4. Add to `.env`: `GROQ_API_KEY=gsk_your_key_here`

Groq hosts Llama 3.3 70B (open source) and is OpenAI-compatible. Free tier: ~30 requests/min.

---

## Local Development

### Prerequisites

- **Node.js 20+** (recommended) — download from https://nodejs.org
- **npm** (ships with Node.js) — or **Bun 1.3+** if you prefer faster installs
- A terminal (PowerShell, CMD, or Git Bash on Windows)

### Commands

```bash
# Install dependencies
npm install

# Start dev server (auto-runs on port 3000)
npm run dev

# Lint check
npm run lint

# Push Prisma schema to SQLite (run after changing prisma/schema.prisma)
npx prisma db push

# Generate Prisma client (auto-runs on db:push)
npx prisma generate

# Production build (use Vercel for actual prod — this is for testing only)
npm run build

# Start production server (after build)
npm run start
```

### Verifying It Works

After `npm run dev`, open http://localhost:3000. You should see:

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
| `window is not defined` error | This was a Leaflet SSR issue — already fixed via dynamic import. If you see it again, ensure `TrackMap.tsx` uses `next/dynamic` with `ssr: false` |
| Port 3000 already in use | `netstat -ano | findstr :3000` (Windows) then kill the PID, or use `PORT=3001` |
| Prisma errors | `npx prisma db push` to resync schema |
| Chatbot returns fallback message | Check `GROQ_API_KEY` is set in `.env` |
| Map doesn't render | Disable browser extensions; check browser console for Leaflet errors |
| Sky mode stuck on auto | Click "Next Sky" to lock to a specific mode, or hover and pick "Auto" |
| Lint errors | `npm run lint` to see them, then fix |
| `bun.lock` warning on Windows | Harmless — Next.js noticed a bun.lock outside the repo. Use `npm install` to ignore. |

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

> **Important**: Before committing, ensure `.env` is in `.gitignore` (it is by default — `.env*` is excluded). Never commit real API keys.

### Step 2: Add FortyGuard as a Collaborator

> Hackathon requirement: add `fortyguard` as a collaborator on your repo.

1. Go to your repo on GitHub → Settings → Collaborators
2. Click "Add people" → enter `fortyguard`
3. Send invitation

### Step 3: Set Up a Production Database (Supabase — free, recommended)

**Why not SQLite on Vercel?** Vercel serverless functions are stateless — they spin up, handle a request, then spin down. Any file written to disk (including a SQLite database) is **ephemeral** and gets wiped on the next cold start. SQLite works fine for local dev, but on Vercel you need a real hosted database.

**Supabase** provides free hosted Postgres (500MB, 50k monthly active users) and is the recommended path:

1. Go to https://supabase.com and create a free account
2. Create a new project (any name, e.g., "temperset")
3. Wait ~2 minutes for provisioning
4. Go to **Project Settings → Database → Connection string → URI**
5. Copy the connection string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you set when creating the project

### Step 4: Switch Prisma to Postgres

Edit `prisma/schema.prisma` — change the datasource provider from `sqlite` to `postgresql`:

```prisma
datasource db {
  provider = "postgresql"   // was: sqlite
  url      = env("DATABASE_URL")
}
```

Then run locally to create the tables in Supabase:

```bash
npx prisma generate
npx prisma db push
```

### Step 5: Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your `temperset` repo
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: `./` (default)
5. **Build Command**: `next build` (auto-detected)
6. **Install Command**: `npm install` (auto-detected)
7. **Environment Variables** — add these (see [Environment Variables Reference](#environment-variables-reference) below):

| Variable | Value | Required? |
|---|---|---|
| `DATABASE_URL` | Your Supabase Postgres connection string | **Yes** (Vercel won't work with SQLite) |
| `FORTYGUARD_API_KEY` | Your FortyGuard key (or leave blank to use mock) | Yes for real data |
| `GROQ_API_KEY` | Your Groq key | **Yes** (chatbot won't work without it) |
| `NEWS_API_KEY` | Your NewsAPI key | Optional (GDELT fallback works) |
| `CENSUS_API_KEY` | Your Census key | Optional |
| `ORS_API_KEY` | Your OpenRouteService key | Optional |
| `RESEND_API_KEY` | Your Resend key | Optional |

8. Click **Deploy**

### Step 6: Verify Deployment

```bash
# After Vercel deploy completes, you'll get a URL like:
# https://temperset-xxx.vercel.app

# Test these flows:
# 1. Landing page loads with rotating wheel
# 2. Onboarding works (profile saves to Supabase)
# 3. Heat Pulse widget shows city temps
# 4. News Radar shows headlines
# 5. Category deep-dive opens
# 6. Chatbot responds (uses Groq)
# 7. Maps render on Resilient Cities & Government tracks
```

### Step 7: Submit

Submit three things to FortyGuard (per hackathon rules):
1. **Public GitHub repo URL** — `https://github.com/<your-username>/temperset`
2. **Live demo URL** — your Vercel deployment URL
3. **Collaborator** — add `fortyguard` to your repo (Step 2 above)

**Deadline: 30 August 2026 (GST) — no late submissions.**

---

## Environment Variables Reference

Create a `.env` file in the project root. See `.env.example` for the full template.

### Required for Local Dev

```bash
# Database — SQLite locally (file-based, zero setup)
DATABASE_URL=file:./db/custom.db

# FortyGuard Temperature API — blank = mock data fallback
FORTYGUARD_API_KEY=
FORTYGUARD_BASE_URL=https://api.fortyguard.com/v1

# Groq — required for chatbots to work
GROQ_API_KEY=gsk_your_key_here
```

### Required for Vercel Production

Replace `DATABASE_URL` with your Supabase Postgres connection string:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

And update `prisma/schema.prisma` to use `postgresql` instead of `sqlite` (see [Step 4 above](#step-4-switch-prisma-to-postgres)).

### Optional (all have free fallbacks built in)

```bash
NEWS_API_KEY=optional_newsapi_key       # NewsAPI primary, GDELT silent fallback
CENSUS_API_KEY=optional_census_key      # Demographics for heat equity
ORS_API_KEY=optional_ors_key            # Cool route planning (Track 1)
RESEND_API_KEY=optional_resend_key      # Email heat alerts
AIRNOW_API_KEY=optional_airnow_key      # Air quality correlation
```

### Full Vercel Environment Variables List

When deploying to Vercel, add these in **Project Settings → Environment Variables**:

| Variable | Value | Required? |
|---|---|---|
| `DATABASE_URL` | Supabase Postgres connection string | **Yes** |
| `FORTYGUARD_API_KEY` | Your FortyGuard key | Yes (or mock) |
| `GROQ_API_KEY` | Your Groq key | **Yes** |
| `NEWS_API_KEY` | Your NewsAPI key | Optional |
| `CENSUS_API_KEY` | Your Census key | Optional |
| `ORS_API_KEY` | Your ORS key | Optional |
| `RESEND_API_KEY` | Your Resend key | Optional |

> **Tip**: Set each variable for all three environments (Production, Preview, Development) in Vercel — or just Production if you only care about the live demo.

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
│   │       ├── chat/route.ts          # Groq LLM chatbot
│   │       ├── temperature/route.ts  # FortyGuard proxy (with mock fallback)
│   │       ├── news/route.ts          # NewsAPI → GDELT → mock
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
│   │       ├── TrackMap.tsx            # Leaflet wrapper (ssr: false)
│   │       ├── TrackMapInner.tsx       # Actual Leaflet map for tracks 1 & 4
│   │       ├── ChatbotWidget.tsx       # Per-category AI analyst
│   │       └── NewsSection.tsx        # Per-category news feed
│   └── lib/
│       ├── categories.ts               # 7 track definitions (personas, translations, colors)
│       ├── roles.ts                    # 16 role taxonomy (thresholds, priority categories)
│       ├── fortyguard.ts               # API client + deterministic mock
│       ├── news.ts                     # NewsAPI → GDELT → mock
│       ├── store.ts                    # Zustand persisted state
│       ├── db.ts                       # Prisma client
│       └── utils.ts                    # shadcn/ui utilities
├── public/
│   ├── temperset-logo.svg              # Full logo (README + landing)
│   ├── temperset-icon.svg              # Favicon + brand badge
│   ├── temperset-cover.svg             # OG/Twitter card image
│   └── leaflet-images/                 # Map marker assets
├── .env.example                        # Full env var template (committed)
├── .env                                # Your local env (gitignored, never commit)
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
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
- **Groq** — Free, OpenAI-compatible LLM hosting (Llama 3.3 70B)
- **Meta** — Llama 3.3 70B (open-source LLM)
- **NewsAPI.org** — News aggregation API
- **GDELT Project** — Free global news API (fallback)
- **OpenStreetMap** — Free, open-source map data
- **Leaflet** — Open-source JavaScript map library
- **Next.js** — React framework
- **shadcn/ui** — Component library
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Prisma** — ORM
- **Supabase** — Hosted Postgres (recommended for production)
- **Vercel** — Deployment platform

---

**Built for FortyGuard Hackathon '26 — Building the World's Temperature AI.**
