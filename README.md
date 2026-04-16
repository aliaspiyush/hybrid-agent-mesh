<div align="center">

# 🏟️ Hybrid Agent Mesh

### A multi-agent smart stadium platform for large-scale sporting venues

**Built with Google Antigravity · Next.js · TypeScript · Zustand**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Zustand](https://img.shields.io/badge/Zustand-state-orange?style=flat-square)](https://zustand-demo.pmnd.rs)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Built with Antigravity](https://img.shields.io/badge/Built%20with-Google%20Antigravity-4285F4?style=flat-square&logo=google)](https://antigravity.google)

</div>

---

## 🧠 The Problem

Large sporting venues host tens of thousands of people in a compressed time window. That creates three hard, linked problems:

| Problem | What happens | Impact |
|---|---|---|
| **Crowd movement** | Fans choose the same gates, routes, and exits simultaneously | Dangerous bottlenecks and slow entry |
| **Waiting times** | Food, restrooms, and merch spike at halftime with no load balancing | Frustration, missed game time, poor reviews |
| **Real-time coordination** | Staff, security, and operations teams work in silos | Late reactions, unclear priorities, avoidable incidents |

The root cause is not the number of people. It's that **no one in the venue has a shared, live picture** of what is happening across all zones at the same time.

---

## 💡 The Solution

**Hybrid Agent Mesh** is a multi-role, multi-agent web platform that gives stadiums a shared operational brain.

Instead of one monolithic system, five specialized agents cooperate:

```
┌─────────────────────────────────────────────────────────────┐
│                     HYBRID AGENT MESH                       │
│                                                             │
│  🌊 Crowd Flow Agent      →  monitors zone density          │
│  ⏱️  Queue Optimizer Agent →  balances wait times           │
│  👷 Staff Dispatch Agent  →  assigns tasks by proximity     │
│  🚨 Incident Coord Agent  →  classifies and escalates       │
│  ⭐ Fan Experience Agent  →  generates attendee tips        │
│                                                             │
│         All running in-browser · No backend infra           │
└─────────────────────────────────────────────────────────────┘
```

Each agent has a single job. Together, they power **three synchronized interfaces** that keep fans, staff, and operations in sync.

---

## 🎭 Three Interfaces, One System

### 📱 Attendee App *(mobile-first)*
The fan's personal event guide. Shows the best gate to enter, fastest food stand nearby, least busy restroom, real-time crowd alerts, and the smartest exit after the final whistle. All recommendations are explained in plain language.

### 🗂️ Staff Dispatch View *(tablet-optimized)*
A lightweight task board for on-ground staff and supervisors. Shows assigned tasks with priority and zone location, incident acknowledgements, and completion tracking — designed for speed, not complexity.

### 🖥️ Venue Operations Dashboard *(desktop)*
The command center. A live SVG stadium heatmap with color-coded crowd density, queue monitoring panels, incident feed, agent health indicators, and an analytics suite covering density trends, queue curves, and flow rates.

---

## ⚙️ How It Works

The system runs on a **scenario engine** — a master clock that simulates a real match day from gates-open to post-event emptying.

```
Pre-Event → Ingress → Normal Play → Halftime Rush → Second Half → Egress
```

On every tick, each mock agent evaluates current venue state and:
- Updates zone density and congestion levels
- Recalculates queue wait times
- Auto-assigns staff tasks to the nearest available personnel
- Triggers incidents at appropriate scenario phases
- Generates new fan recommendations based on live conditions

**Every piece of intelligence runs deterministically in the browser.** No Redis, no database, no microservices — just clean TypeScript logic that produces a convincing, presentation-grade experience.

---

## 🗺️ Interactive Stadium Map

A custom SVG top-down stadium map shows live venue state at a glance:

- **Heatmap overlay** — zone colors shift from green → lime → amber → orange → red as density increases
- **Queue badges** — wait times rendered directly on service points
- **Staff pins** — live position of on-ground personnel
- **Zone tooltips** — click any zone for detailed capacity, queue, and incident data

---

## 🎬 Demo Scenarios

Use the floating **Scenario Bar** to jump between event phases live:

| Scenario | What you'll see |
|---|---|
| **Ingress** | Gate queues spike, crowd flows toward sections, staff dispatched to entry |
| **Normal Play** | Concourses quiet, concessions moderate, all systems stable |
| **Halftime Rush** | All queues peak simultaneously, restrooms overwhelmed, agent recommendations fire |
| **Egress** | Exit gates surge, parking bottleneck detected, fan app shows fastest routes out |

The scenario bar supports **1x, 2x, 5x, and 10x speed** plus skip-to-phase for sharp demo control.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| State | Zustand (5 stores) |
| Charts | Recharts |
| Map | Custom SVG (inline) |
| Styling | CSS Modules + Design Tokens |
| Build Tool | Built with Google Antigravity |
| Deployment | Vercel |

---

## 📁 Project Structure

```
hybrid-agent-mesh/
├── src/
│   ├── app/
│   │   ├── attendee/       # Fan view — home, map, queues, suggestions
│   │   ├── staff/          # Staff view — dashboard, map, task queue
│   │   └── ops/            # Ops view — command center, zones, analytics
│   ├── components/
│   │   ├── map/            # SVG stadium map, heatmap, overlays
│   │   ├── panels/         # Alert feed, agent status, recommendations
│   │   ├── charts/         # Density, queue, and flow charts
│   │   ├── layout/         # Shells, navs, scenario bar
│   │   └── ui/             # Design system — Button, Card, Badge, KpiCard
│   └── lib/
│       ├── agents/         # 5 mock agent logic files
│       ├── store/          # 5 Zustand stores
│       ├── scenario/       # Scenario engine + phase definitions
│       ├── data/           # Mock venue, staff, queue, incident data
│       └── types/          # Shared TypeScript interfaces
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/aliaspiyush/hybrid-agent-mesh.git

# Navigate into the project
cd hybrid-agent-mesh

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and select your role.

---

## 🗺️ Role Navigation

| Path | Interface | Optimized for |
|---|---|---|
| `/` | Role selector | All users |
| `/attendee` | Fan app | Mobile (375px) |
| `/staff` | Staff dispatch | Tablet (768px+) |
| `/ops` | Operations dashboard | Desktop (1280px+) |

---

## 💭 Why This Approach

Most stadium tech is reactive — staff radio each other when problems are already visible. Hybrid Agent Mesh is **proactive**: agents anticipate bottlenecks before fans feel them, and surface the right action to the right person before the situation escalates.

The architecture is intentionally flat for Phase 1. Every agent is a pure TypeScript function with no side effects — easy to understand, easy to demo, and designed to be extracted into real services as the platform scales. The folder structure mirrors a real microservice split so the path to production is clear.

---

## 🔮 Future Roadmap

- **Real sensor integration** — turnstile APIs, CCTV crowd counting, IoT restroom occupancy
- **Live ticketing sync** — section-aware routing from ticket data
- **Staff radio integration** — push tasks directly to handheld devices
- **ML-based predictions** — trained on historical venue data per event type
- **Multi-venue support** — one platform across an entire sports organization

---

## 👤 Built By

**Piyush Ghosh** — [Gravity Labs](https://thegravitylabs.in) · Kolkata, India

*Built using Google Antigravity as part of the agentic development challenge.*

---

<div align="center">

**Hybrid Agent Mesh** — Because great events don't happen by accident.

[View Repo](https://github.com/aliaspiyush/hybrid-agent-mesh) · [Report Issue](https://github.com/aliaspiyush/hybrid-agent-mesh/issues)

</div>
