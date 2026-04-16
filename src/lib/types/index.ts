// ── Venue & Zones ──
export interface Zone {
  id: string;
  name: string;
  type: 'entry_gate' | 'concourse' | 'seating' | 'concession' | 'restroom' | 'exit' | 'vip';
  capacity: number;
  currentCount: number;
  densityPct: number;
  congestionLevel: CongestionLevel;
  svgPathId: string;
  floor: string;
  position: { x: number; y: number };
}

export type CongestionLevel = 'low' | 'moderate' | 'high' | 'critical';

// ── Queue Points ──
export interface QueuePoint {
  id: string;
  zoneId: string;
  name: string;
  type: 'food' | 'beverage' | 'restroom' | 'merch' | 'entry';
  currentLength: number;
  estimatedWaitSec: number;
  status: 'normal' | 'busy' | 'overloaded';
  position: { x: number; y: number };
}

// ── Staff ──
export interface StaffMember {
  id: string;
  name: string;
  role: 'security' | 'medical' | 'usher' | 'maintenance' | 'concessions';
  avatar: string;
  shiftStatus: 'on_duty' | 'off_duty' | 'break';
  availability: 'idle' | 'en_route' | 'busy' | 'offline';
  currentZoneId: string;
  position: { x: number; y: number };
}

// ── Tasks ──
export interface Task {
  id: string;
  type: 'dispatch' | 'inspection' | 'maintenance' | 'escort' | 'restock';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'completed';
  description: string;
  zoneId: string;
  assignedTo: string | null;
  createdAt: number;
  completedAt: number | null;
  agentSource: AgentType;
}

// ── Incidents ──
export interface Incident {
  id: string;
  type: 'medical' | 'security' | 'facility' | 'crowd' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'escalated';
  description: string;
  zoneId: string;
  reportedBy: string;
  createdAt: number;
  resolvedAt: number | null;
}

// ── Agents ──
export type AgentType = 'crowd_flow' | 'queue_opt' | 'staff_dispatch' | 'incident_coord' | 'fan_experience';

export interface AgentStatus {
  id: AgentType;
  name: string;
  status: 'running' | 'paused' | 'error';
  lastAction: string;
  lastActionTime: number;
  actionsCount: number;
  icon: string;
}

// ── Alerts ──
export interface Alert {
  id: string;
  agentId: AgentType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  zoneId: string | null;
  timestamp: number;
  acknowledged: boolean;
}

// ── Scenario ──
export type ScenarioPhase =
  | 'pre_event'
  | 'ingress'
  | 'normal_play'
  | 'halftime_rush'
  | 'second_half'
  | 'egress'
  | 'post_event';

export interface ScenarioState {
  phase: ScenarioPhase;
  elapsedMinutes: number;
  speed: 1 | 2 | 5 | 10;
  isPaused: boolean;
  totalAttendees: number;
  arrivedCount: number;
  eventName: string;
}

// ── Recommendations ──
export interface Recommendation {
  id: string;
  agentId: AgentType;
  type: 'route' | 'queue' | 'timing' | 'safety' | 'experience';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  icon: string;
  targetZoneId: string | null;
}

// ── User Role ──
export type UserRole = 'attendee' | 'staff' | 'ops';
