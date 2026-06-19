import type { Zone, QueuePoint, Recommendation, ScenarioPhase } from '@/lib/types';

/**
 * Fan Experience Agent — generates personalized recommendations based on current venue state.
 */

export function evaluateFanExperience(
  zones: Zone[],
  queues: QueuePoint[],
  phase: ScenarioPhase
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Find the least crowded gate
  const gates = zones.filter(z => z.type === 'entry_gate').sort((a, b) => a.densityPct - b.densityPct);
  const busiestGate = zones.filter(z => z.type === 'entry_gate').sort((a, b) => b.densityPct - a.densityPct)[0];
  const quietGate = gates[0];

  if (busiestGate && quietGate && busiestGate.densityPct - quietGate.densityPct > 20) {
    recs.push({
      id: 'rec-gate', agentId: 'fan_experience', type: 'route',
      title: `Use ${quietGate.name} instead`,
      description: `${busiestGate.name} is at ${busiestGate.densityPct}% capacity. ${quietGate.name} is only ${quietGate.densityPct}%. Save ~${Math.round((busiestGate.densityPct - quietGate.densityPct) / 8)} minutes.`,
      impact: 'high', icon: '🚪', targetZoneId: quietGate.id,
    });
  }

  // Find shortest food queue
  const foodQueues = queues.filter(q => q.type === 'food').sort((a, b) => a.estimatedWaitSec - b.estimatedWaitSec);
  const longestFood = queues.filter(q => q.type === 'food').sort((a, b) => b.estimatedWaitSec - a.estimatedWaitSec)[0];
  const shortestFood = foodQueues[0];

  if (longestFood && shortestFood && longestFood.estimatedWaitSec - shortestFood.estimatedWaitSec > 120) {
    recs.push({
      id: 'rec-food', agentId: 'fan_experience', type: 'queue',
      title: `${shortestFood.name} is faster`,
      description: `Wait at ${longestFood.name}: ${Math.round(longestFood.estimatedWaitSec / 60)}min. ${shortestFood.name}: ${Math.round(shortestFood.estimatedWaitSec / 60)}min.`,
      impact: 'high', icon: '🍔', targetZoneId: shortestFood.zoneId,
    });
  }

  // Restroom recommendation
  const restrooms = queues.filter(q => q.type === 'restroom').sort((a, b) => a.estimatedWaitSec - b.estimatedWaitSec);
  if (restrooms.length >= 2 && restrooms[restrooms.length - 1].estimatedWaitSec - restrooms[0].estimatedWaitSec > 60) {
    const best = restrooms[0];
    const worst = restrooms[restrooms.length - 1];
    recs.push({
      id: 'rec-restroom', agentId: 'fan_experience', type: 'queue',
      title: `${best.name} has shorter line`,
      description: `${worst.name}: ${worst.currentLength} people. ${best.name}: only ${best.currentLength} people.`,
      impact: 'medium', icon: '🚻', targetZoneId: best.zoneId,
    });
  }

  // Timing recommendations based on phase
  if (phase === 'normal_play') {
    recs.push({
      id: 'rec-timing', agentId: 'fan_experience', type: 'timing',
      title: 'Beat the halftime rush',
      description: 'Grab food and drinks now — concessions will be 3x busier at halftime.',
      impact: 'high', icon: '⏰', targetZoneId: null,
    });
  }

  if (phase === 'halftime_rush') {
    recs.push({
      id: 'rec-wait', agentId: 'fan_experience', type: 'timing',
      title: 'Wait 10 minutes for shorter lines',
      description: 'Queue peak usually passes within 10 minutes of halftime. Consider waiting for the rush to clear.',
      impact: 'medium', icon: '⏳', targetZoneId: null,
    });
  }

  if (phase === 'egress') {
    const bestExit = zones.filter(z => z.type === 'entry_gate').sort((a, b) => a.densityPct - b.densityPct)[0];
    if (bestExit) {
      recs.push({
        id: 'rec-exit', agentId: 'fan_experience', type: 'route',
        title: `Exit via ${bestExit.name}`,
        description: `${bestExit.name} has the least congestion at ${bestExit.densityPct}%. Fastest route to parking.`,
        impact: 'high', icon: '🚗', targetZoneId: bestExit.id,
      });
    }
  }

  // Beverage suggestion
  const bevQueues = queues.filter(q => q.type === 'beverage').sort((a, b) => a.estimatedWaitSec - b.estimatedWaitSec);
  if (bevQueues.length > 0 && bevQueues[0].estimatedWaitSec < 180) {
    recs.push({
      id: 'rec-bev', agentId: 'fan_experience', type: 'queue',
      title: `Quick drinks at ${bevQueues[0].name}`,
      description: `Only ${Math.round(bevQueues[0].estimatedWaitSec / 60)} min wait. ${bevQueues[0].currentLength} in line.`,
      impact: 'low', icon: '🍺', targetZoneId: bevQueues[0].zoneId,
    });
  }

  return recs.slice(0, 6); // Max 6 recommendations
}

export async function fetchFanAiInsight(params: { currentZone: string; eventPhase: string; queueData: { food: number; restroom: number; merch: number }; crowdLevel: string }) {
  const res = await fetch('/api/agents/fan-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to fetch AI insight');
  return res.json() as Promise<{ tips: string[]; generatedAt: string }>;
}

