import type { QueuePoint, Zone, ScenarioPhase } from '@/lib/types';

/**
 * Queue Optimization Agent — evaluates queue wait times based on phase and zone density.
 * Pure function: takes queues + phase + zones → returns updated queues.
 */

const phaseQueueMultiplier: Record<ScenarioPhase, Record<string, number>> = {
  pre_event: { food: 0.05, beverage: 0.05, restroom: 0.05, merch: 0.1, entry: 0.3 },
  ingress: { food: 0.15, beverage: 0.1, restroom: 0.15, merch: 0.2, entry: 0.9 },
  normal_play: { food: 0.45, beverage: 0.5, restroom: 0.35, merch: 0.3, entry: 0.05 },
  halftime_rush: { food: 0.95, beverage: 0.9, restroom: 0.95, merch: 0.5, entry: 0.05 },
  second_half: { food: 0.35, beverage: 0.4, restroom: 0.3, merch: 0.2, entry: 0.05 },
  egress: { food: 0.05, beverage: 0.05, restroom: 0.1, merch: 0.05, entry: 0.02 },
  post_event: { food: 0.02, beverage: 0.02, restroom: 0.02, merch: 0.02, entry: 0.01 },
};

// Max wait times in seconds by queue type
const maxWaitSec: Record<string, number> = {
  food: 900, beverage: 600, restroom: 720, merch: 480, entry: 300,
};

// Max queue lengths
const maxLength: Record<string, number> = {
  food: 45, beverage: 35, restroom: 40, merch: 25, entry: 60,
};

function seededVariation(id: string): number {
  let hash = 0;
  const str = id + Math.round(Date.now() / 3000).toString();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 0.7 + (Math.abs(hash % 60) / 100); // 0.7 to 1.3
}

export function evaluateQueueOptimizer(
  queues: QueuePoint[],
  phase: ScenarioPhase,
  zones: Zone[]
): QueuePoint[] {
  const multipliers = phaseQueueMultiplier[phase];

  return queues.map(q => {
    const baseMult = multipliers[q.type] || 0.1;
    const variation = seededVariation(q.id);

    // Factor in parent zone density
    const parentZone = zones.find(z => z.id === q.zoneId);
    const zoneFactor = parentZone ? (0.5 + 0.5 * (parentZone.densityPct / 100)) : 1;

    const intensity = Math.min(baseMult * variation * zoneFactor, 1);
    const length = Math.round((maxLength[q.type] || 30) * intensity);
    const waitSec = Math.round((maxWaitSec[q.type] || 600) * intensity);

    let status: 'normal' | 'busy' | 'overloaded' = 'normal';
    if (intensity > 0.7) status = 'overloaded';
    else if (intensity > 0.4) status = 'busy';

    return {
      ...q,
      currentLength: length,
      estimatedWaitSec: waitSec,
      status,
    };
  });
}

export async function fetchQueueAiInsight(params: { stands: { id: string; name: string; waitMins: number }[]; zone: string }) {
  const res = await fetch('/api/agents/queue-optimizer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to fetch AI insight');
  return res.json() as Promise<{ recommended: string; reason: string; estimatedWait: number }>;
}

