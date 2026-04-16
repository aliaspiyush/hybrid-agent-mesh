import type { Zone, QueuePoint, StaffMember, Incident, AgentStatus } from '@/lib/types';

// ═══════════════════════════════════════════
// VENUE ZONES — 20 zones in a modern oval stadium
// ═══════════════════════════════════════════

export const venueZones: Zone[] = [
  // Entry Gates
  { id: 'gate-a', name: 'Gate A (North)', type: 'entry_gate', capacity: 800, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-gate-a', floor: 'ground', position: { x: 400, y: 40 } },
  { id: 'gate-b', name: 'Gate B (East)', type: 'entry_gate', capacity: 800, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-gate-b', floor: 'ground', position: { x: 760, y: 300 } },
  { id: 'gate-c', name: 'Gate C (South)', type: 'entry_gate', capacity: 800, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-gate-c', floor: 'ground', position: { x: 400, y: 560 } },
  { id: 'gate-d', name: 'Gate D (West)', type: 'entry_gate', capacity: 800, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-gate-d', floor: 'ground', position: { x: 40, y: 300 } },

  // Concourses
  { id: 'concourse-n', name: 'North Concourse', type: 'concourse', capacity: 2000, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-concourse-n', floor: 'ground', position: { x: 400, y: 120 } },
  { id: 'concourse-e', name: 'East Concourse', type: 'concourse', capacity: 1500, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-concourse-e', floor: 'ground', position: { x: 660, y: 300 } },
  { id: 'concourse-s', name: 'South Concourse', type: 'concourse', capacity: 2000, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-concourse-s', floor: 'ground', position: { x: 400, y: 480 } },
  { id: 'concourse-w', name: 'West Concourse', type: 'concourse', capacity: 1500, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-concourse-w', floor: 'ground', position: { x: 140, y: 300 } },

  // Seating Sections
  { id: 'seating-n', name: 'North Stand', type: 'seating', capacity: 5000, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-seating-n', floor: 'upper', position: { x: 400, y: 190 } },
  { id: 'seating-e', name: 'East Stand', type: 'seating', capacity: 3500, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-seating-e', floor: 'upper', position: { x: 580, y: 300 } },
  { id: 'seating-s', name: 'South Stand', type: 'seating', capacity: 5000, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-seating-s', floor: 'upper', position: { x: 400, y: 410 } },
  { id: 'seating-w', name: 'West Stand', type: 'seating', capacity: 3500, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-seating-w', floor: 'upper', position: { x: 220, y: 300 } },

  // Concessions
  { id: 'food-n', name: 'North Food Court', type: 'concession', capacity: 300, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-food-n', floor: 'ground', position: { x: 280, y: 100 } },
  { id: 'food-s', name: 'South Food Court', type: 'concession', capacity: 300, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-food-s', floor: 'ground', position: { x: 280, y: 500 } },
  { id: 'beverage-e', name: 'East Drinks Bar', type: 'concession', capacity: 200, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-beverage-e', floor: 'ground', position: { x: 680, y: 220 } },
  { id: 'merch-w', name: 'West Merch Store', type: 'concession', capacity: 150, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-merch-w', floor: 'ground', position: { x: 120, y: 220 } },

  // Restrooms
  { id: 'restroom-ne', name: 'NE Restrooms', type: 'restroom', capacity: 100, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-restroom-ne', floor: 'ground', position: { x: 580, y: 130 } },
  { id: 'restroom-sw', name: 'SW Restrooms', type: 'restroom', capacity: 100, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-restroom-sw', floor: 'ground', position: { x: 220, y: 470 } },

  // VIP
  { id: 'vip-lounge', name: 'VIP Lounge', type: 'vip', capacity: 500, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-vip', floor: 'upper', position: { x: 530, y: 480 } },

  // Field
  { id: 'field', name: 'Playing Field', type: 'seating', capacity: 0, currentCount: 0, densityPct: 0, congestionLevel: 'low', svgPathId: 'zone-field', floor: 'ground', position: { x: 400, y: 300 } },
];

export const TOTAL_VENUE_CAPACITY = venueZones.reduce((sum, z) => sum + z.capacity, 0);
export const EVENT_EXPECTED_ATTENDANCE = 28000;

// ═══════════════════════════════════════════
// QUEUE POINTS
// ═══════════════════════════════════════════

export const queuePoints: QueuePoint[] = [
  { id: 'q-food-n', zoneId: 'food-n', name: 'Burgers & Fries', type: 'food', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 270, y: 90 } },
  { id: 'q-food-s', zoneId: 'food-s', name: 'Pizza & Grill', type: 'food', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 270, y: 510 } },
  { id: 'q-bev-e', zoneId: 'beverage-e', name: 'Draft Beer Bar', type: 'beverage', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 690, y: 210 } },
  { id: 'q-bev-n', zoneId: 'food-n', name: 'Soft Drinks', type: 'beverage', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 310, y: 110 } },
  { id: 'q-merch', zoneId: 'merch-w', name: 'Team Store', type: 'merch', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 110, y: 230 } },
  { id: 'q-rest-ne', zoneId: 'restroom-ne', name: 'NE Restrooms', type: 'restroom', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 590, y: 120 } },
  { id: 'q-rest-sw', zoneId: 'restroom-sw', name: 'SW Restrooms', type: 'restroom', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 210, y: 480 } },
  { id: 'q-gate-a', zoneId: 'gate-a', name: 'Gate A Entry', type: 'entry', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 390, y: 30 } },
  { id: 'q-gate-b', zoneId: 'gate-b', name: 'Gate B Entry', type: 'entry', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 770, y: 290 } },
  { id: 'q-gate-c', zoneId: 'gate-c', name: 'Gate C Entry', type: 'entry', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 390, y: 570 } },
  { id: 'q-gate-d', zoneId: 'gate-d', name: 'Gate D Entry', type: 'entry', currentLength: 0, estimatedWaitSec: 0, status: 'normal', position: { x: 30, y: 290 } },
];

// ═══════════════════════════════════════════
// STAFF ROSTER
// ═══════════════════════════════════════════

export const staffRoster: StaffMember[] = [
  { id: 'staff-1', name: 'Alex Rivera', role: 'security', avatar: '🛡️', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'gate-a', position: { x: 380, y: 50 } },
  { id: 'staff-2', name: 'Jordan Lee', role: 'security', avatar: '🛡️', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'gate-c', position: { x: 420, y: 550 } },
  { id: 'staff-3', name: 'Sam Patel', role: 'security', avatar: '🛡️', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'concourse-e', position: { x: 650, y: 280 } },
  { id: 'staff-4', name: 'Morgan Chen', role: 'medical', avatar: '🏥', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'concourse-n', position: { x: 440, y: 130 } },
  { id: 'staff-5', name: 'Taylor Kim', role: 'medical', avatar: '🏥', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'concourse-s', position: { x: 360, y: 470 } },
  { id: 'staff-6', name: 'Casey Brooks', role: 'usher', avatar: '🎫', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'seating-n', position: { x: 370, y: 200 } },
  { id: 'staff-7', name: 'Riley Foster', role: 'usher', avatar: '🎫', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'seating-s', position: { x: 430, y: 400 } },
  { id: 'staff-8', name: 'Avery Singh', role: 'usher', avatar: '🎫', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'seating-e', position: { x: 570, y: 320 } },
  { id: 'staff-9', name: 'Dakota Reyes', role: 'maintenance', avatar: '🔧', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'concourse-w', position: { x: 150, y: 310 } },
  { id: 'staff-10', name: 'Quinn Novak', role: 'maintenance', avatar: '🔧', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'restroom-ne', position: { x: 590, y: 140 } },
  { id: 'staff-11', name: 'Jamie Ortiz', role: 'concessions', avatar: '🍔', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'food-n', position: { x: 290, y: 95 } },
  { id: 'staff-12', name: 'Skyler Wang', role: 'concessions', avatar: '🍔', shiftStatus: 'on_duty', availability: 'idle', currentZoneId: 'food-s', position: { x: 290, y: 505 } },
];

// ═══════════════════════════════════════════
// SAMPLE INCIDENTS (triggered by scenario engine)
// ═══════════════════════════════════════════

export const sampleIncidents: Incident[] = [
  { id: 'inc-1', type: 'crowd', severity: 'high', status: 'reported', description: 'Gate A experiencing dangerous crowding — density above 90%', zoneId: 'gate-a', reportedBy: 'Crowd Flow Agent', createdAt: 0, resolvedAt: null },
  { id: 'inc-2', type: 'medical', severity: 'medium', status: 'reported', description: 'Fan reports feeling unwell in North Stand section 12', zoneId: 'seating-n', reportedBy: 'Attendee Report', createdAt: 0, resolvedAt: null },
  { id: 'inc-3', type: 'facility', severity: 'low', status: 'reported', description: 'NE Restroom sink overflow — requires maintenance', zoneId: 'restroom-ne', reportedBy: 'Staff Report', createdAt: 0, resolvedAt: null },
  { id: 'inc-4', type: 'security', severity: 'high', status: 'reported', description: 'Altercation reported near East Drinks Bar', zoneId: 'beverage-e', reportedBy: 'Staff Report', createdAt: 0, resolvedAt: null },
  { id: 'inc-5', type: 'crowd', severity: 'critical', status: 'reported', description: 'South Concourse capacity exceeded — egress bottleneck forming', zoneId: 'concourse-s', reportedBy: 'Crowd Flow Agent', createdAt: 0, resolvedAt: null },
  { id: 'inc-6', type: 'facility', severity: 'medium', status: 'reported', description: 'South Food Court POS system down — long manual processing', zoneId: 'food-s', reportedBy: 'Concessions Staff', createdAt: 0, resolvedAt: null },
];

// ═══════════════════════════════════════════
// AGENT STATUS
// ═══════════════════════════════════════════

export const initialAgentStatuses: AgentStatus[] = [
  { id: 'crowd_flow', name: 'Crowd Flow Agent', status: 'running', lastAction: 'Monitoring zone density', lastActionTime: Date.now(), actionsCount: 0, icon: '🚶' },
  { id: 'queue_opt', name: 'Queue Optimizer', status: 'running', lastAction: 'Tracking wait times', lastActionTime: Date.now(), actionsCount: 0, icon: '⏱️' },
  { id: 'staff_dispatch', name: 'Staff Dispatch', status: 'running', lastAction: 'Awaiting tasks', lastActionTime: Date.now(), actionsCount: 0, icon: '👷' },
  { id: 'incident_coord', name: 'Incident Coordinator', status: 'running', lastAction: 'All clear', lastActionTime: Date.now(), actionsCount: 0, icon: '🚨' },
  { id: 'fan_experience', name: 'Fan Experience', status: 'running', lastAction: 'Generating suggestions', lastActionTime: Date.now(), actionsCount: 0, icon: '🎉' },
];

// ═══════════════════════════════════════════
// EVENT DATA
// ═══════════════════════════════════════════

export const currentEvent = {
  id: 'evt-1',
  name: 'City FC vs United — Championship Final',
  venue: 'MetroSphere Arena',
  date: 'Saturday, Apr 19, 2026',
  kickoff: '7:30 PM',
  expectedAttendance: EVENT_EXPECTED_ATTENDANCE,
  status: 'active' as const,
};
