import type { Zone, ScenarioPhase, CongestionLevel } from '@/lib/types';

/**
 * Crowd Flow Agent — evaluates zone densities based on scenario phase.
 * Pure function: takes zones + phase → returns updated zones.
 */

// Phase-specific density profiles (base density % for each zone type)
const phaseProfiles: Record<ScenarioPhase, Record<string, { min: number; max: number }>> = {
  pre_event: {
    entry_gate: { min: 0, max: 5 }, concourse: { min: 0, max: 3 }, seating: { min: 0, max: 2 },
    concession: { min: 0, max: 2 }, restroom: { min: 0, max: 2 }, vip: { min: 0, max: 5 }, exit: { min: 0, max: 0 },
  },
  ingress: {
    entry_gate: { min: 55, max: 95 }, concourse: { min: 40, max: 75 }, seating: { min: 20, max: 60 },
    concession: { min: 10, max: 30 }, restroom: { min: 15, max: 35 }, vip: { min: 20, max: 45 }, exit: { min: 0, max: 5 },
  },
  normal_play: {
    entry_gate: { min: 5, max: 15 }, concourse: { min: 15, max: 35 }, seating: { min: 75, max: 95 },
    concession: { min: 25, max: 50 }, restroom: { min: 20, max: 45 }, vip: { min: 60, max: 80 }, exit: { min: 0, max: 5 },
  },
  halftime_rush: {
    entry_gate: { min: 5, max: 15 }, concourse: { min: 65, max: 95 }, seating: { min: 30, max: 50 },
    concession: { min: 75, max: 98 }, restroom: { min: 80, max: 98 }, vip: { min: 50, max: 70 }, exit: { min: 0, max: 5 },
  },
  second_half: {
    entry_gate: { min: 3, max: 10 }, concourse: { min: 18, max: 38 }, seating: { min: 70, max: 92 },
    concession: { min: 20, max: 45 }, restroom: { min: 18, max: 40 }, vip: { min: 55, max: 75 }, exit: { min: 0, max: 5 },
  },
  egress: {
    entry_gate: { min: 5, max: 15 }, concourse: { min: 55, max: 85 }, seating: { min: 10, max: 30 },
    concession: { min: 5, max: 15 }, restroom: { min: 10, max: 25 }, vip: { min: 10, max: 25 }, exit: { min: 60, max: 95 },
  },
  post_event: {
    entry_gate: { min: 0, max: 3 }, concourse: { min: 0, max: 8 }, seating: { min: 0, max: 3 },
    concession: { min: 0, max: 2 }, restroom: { min: 0, max: 3 }, vip: { min: 0, max: 3 }, exit: { min: 0, max: 5 },
  },
};

// Deterministic "random" using zone id as seed — gives consistent but varied results
function seededRandom(seed: string, tick: number): number {
  let hash = 0;
  const str = seed + tick.toString();
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return Math.abs(hash % 100) / 100;
}

function getCongestionLevel(pct: number): CongestionLevel {
  if (pct < 40) return 'low';
  if (pct < 65) return 'moderate';
  if (pct < 85) return 'high';
  return 'critical';
}

export function evaluateCrowdFlow(
  zones: Zone[],
  phase: ScenarioPhase,
  arrivedCount: number,
  totalAttendees: number
): Zone[] {
  const profile = phaseProfiles[phase];
  const fillRatio = totalAttendees > 0 ? arrivedCount / totalAttendees : 0;
  const tick = Math.round(Date.now() / 2000); // changes every 2s

  return zones.map(zone => {
    if (zone.id === 'field') return { ...zone, densityPct: 0, congestionLevel: 'low' as CongestionLevel, currentCount: 0 };

    const range = profile[zone.type] || { min: 0, max: 20 };
    const variation = seededRandom(zone.id, tick);

    // Base density from phase profile, modulated by fill ratio and randomness
    let density = range.min + (range.max - range.min) * (0.3 + 0.4 * fillRatio + 0.3 * variation);

    // Add some zone-specific character: Gate A and NE Restroom tend to be busier
    if (zone.id === 'gate-a' && phase === 'ingress') density = Math.min(density * 1.15, 99);
    if (zone.id === 'restroom-ne' && phase === 'halftime_rush') density = Math.min(density * 1.2, 99);
    if (zone.id === 'concourse-s' && phase === 'egress') density = Math.min(density * 1.1, 99);

    density = Math.round(Math.max(0, Math.min(99, density)));
    const currentCount = Math.round(zone.capacity * density / 100);

    return {
      ...zone,
      densityPct: density,
      congestionLevel: getCongestionLevel(density),
      currentCount,
    };
  });
}

export async function fetchCrowdFlowAiInsight(params: { zoneId: string; density: number; capacityPercent: number; adjacentZones: string[] }) {
  const res = await fetch('/api/agents/crowd-flow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to fetch AI insight');
  return res.json() as Promise<{ recommendation: string; confidence: string; timestamp: string }>;
}

