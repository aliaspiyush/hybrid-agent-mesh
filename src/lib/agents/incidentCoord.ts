import type { Incident, Zone, Alert, ScenarioPhase } from '@/lib/types';
import { sampleIncidents } from '@/lib/data/venue';

/**
 * Incident Coordination Agent — triggers incidents at specific phases, auto-classifies severity.
 */

// Which incidents trigger at which phase (by elapsed minutes threshold)
const incidentTriggers: { minMinutes: number; incidentIndex: number }[] = [
  { minMinutes: 25, incidentIndex: 0 },  // Gate A crowding during ingress
  { minMinutes: 55, incidentIndex: 1 },  // Medical in normal play
  { minMinutes: 70, incidentIndex: 2 },  // Restroom issue
  { minMinutes: 95, incidentIndex: 3 },  // Security at halftime
  { minMinutes: 155, incidentIndex: 4 }, // Egress bottleneck
  { minMinutes: 100, incidentIndex: 5 }, // POS down at halftime
];

function generateAlertId(): string {
  return `alert-inc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function evaluateIncidentCoord(
  currentIncidents: Incident[],
  zones: Zone[],
  phase: ScenarioPhase,
  elapsedMinutes: number
): { incidents: Incident[]; newAlerts: Alert[] } {
  const newAlerts: Alert[] = [];
  const incidents = [...currentIncidents];

  // Trigger incidents based on elapsed time
  for (const trigger of incidentTriggers) {
    if (elapsedMinutes >= trigger.minMinutes && elapsedMinutes < trigger.minMinutes + 2) {
      const template = sampleIncidents[trigger.incidentIndex];
      if (!template) continue;
      if (incidents.some(i => i.id === template.id)) continue;

      const incident: Incident = {
        ...template,
        createdAt: Date.now(),
        status: 'reported',
      };
      incidents.push(incident);

      newAlerts.push({
        id: generateAlertId(),
        agentId: 'incident_coord',
        severity: incident.severity === 'critical' ? 'critical' : incident.severity === 'high' ? 'warning' : 'info',
        message: `Incident: ${incident.description}`,
        zoneId: incident.zoneId,
        timestamp: Date.now(),
        acknowledged: false,
      });
    }
  }

  // Auto-progress incident lifecycle
  for (const inc of incidents) {
    const age = Date.now() - inc.createdAt;
    if (inc.status === 'reported' && age > 10000) {
      inc.status = 'acknowledged';
    } else if (inc.status === 'acknowledged' && age > 20000) {
      inc.status = 'in_progress';
    } else if (inc.status === 'in_progress' && age > 45000) {
      inc.status = 'resolved';
      inc.resolvedAt = Date.now();
    }
  }

  return { incidents, newAlerts };
}
