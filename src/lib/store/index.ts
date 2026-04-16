import { create } from 'zustand';
import type { Zone, QueuePoint, StaffMember, Incident, Alert, AgentStatus, ScenarioPhase } from '@/lib/types';
import { venueZones, queuePoints, staffRoster, initialAgentStatuses, sampleIncidents } from '@/lib/data/venue';
import { evaluateCrowdFlow } from '@/lib/agents/crowdFlow';
import { evaluateQueueOptimizer } from '@/lib/agents/queueOptimizer';
import { evaluateStaffDispatch } from '@/lib/agents/staffDispatch';
import { evaluateIncidentCoord } from '@/lib/agents/incidentCoord';
import { evaluateFanExperience } from '@/lib/agents/fanExperience';
import type { Recommendation } from '@/lib/types';

// ═══════════════════════════════════════════
// SCENARIO STORE — Master clock
// ═══════════════════════════════════════════

interface ScenarioStore {
  phase: ScenarioPhase;
  elapsedMinutes: number;
  speed: 1 | 2 | 5 | 10;
  isPaused: boolean;
  totalAttendees: number;
  arrivedCount: number;
  intervalId: ReturnType<typeof setInterval> | null;

  start: () => void;
  pause: () => void;
  resume: () => void;
  setSpeed: (speed: 1 | 2 | 5 | 10) => void;
  skipToPhase: (phase: ScenarioPhase) => void;
  tick: () => void;
  reset: () => void;
}

function phaseFromMinutes(m: number): ScenarioPhase {
  if (m < 15) return 'pre_event';
  if (m < 45) return 'ingress';
  if (m < 90) return 'normal_play';
  if (m < 110) return 'halftime_rush';
  if (m < 150) return 'second_half';
  if (m < 180) return 'egress';
  return 'post_event';
}

function minutesForPhase(phase: ScenarioPhase): number {
  const map: Record<ScenarioPhase, number> = {
    pre_event: 0, ingress: 15, normal_play: 45, halftime_rush: 90,
    second_half: 110, egress: 150, post_event: 180,
  };
  return map[phase];
}

export const useScenarioStore = create<ScenarioStore>((set, get) => ({
  phase: 'pre_event',
  elapsedMinutes: 0,
  speed: 1,
  isPaused: true,
  totalAttendees: 28000,
  arrivedCount: 0,
  intervalId: null,

  start: () => {
    const state = get();
    if (state.intervalId) clearInterval(state.intervalId);
    const id = setInterval(() => {
      const s = get();
      if (!s.isPaused) s.tick();
    }, 2000);
    set({ intervalId: id, isPaused: false });
  },

  pause: () => set({ isPaused: true }),
  resume: () => {
    const state = get();
    if (!state.intervalId) {
      get().start();
    } else {
      set({ isPaused: false });
    }
  },

  setSpeed: (speed) => set({ speed }),

  skipToPhase: (phase) => {
    const minutes = minutesForPhase(phase);
    set({ phase, elapsedMinutes: minutes });
    get().tick();
  },

  tick: () => {
    const state = get();
    const newElapsed = state.elapsedMinutes + state.speed * 0.5;
    const newPhase = phaseFromMinutes(newElapsed);

    // Calculate arrived count based on phase
    let arrived = state.arrivedCount;
    if (newPhase === 'ingress') {
      const progress = (newElapsed - 15) / 30;
      arrived = Math.min(Math.round(state.totalAttendees * progress * 0.95), state.totalAttendees);
    } else if (newPhase === 'normal_play' || newPhase === 'halftime_rush' || newPhase === 'second_half') {
      arrived = Math.round(state.totalAttendees * 0.95);
    } else if (newPhase === 'egress') {
      const progress = (newElapsed - 150) / 30;
      arrived = Math.max(Math.round(state.totalAttendees * 0.95 * (1 - progress)), 0);
    } else if (newPhase === 'post_event') {
      arrived = Math.round(state.totalAttendees * 0.02);
    }

    set({ elapsedMinutes: newElapsed, phase: newPhase, arrivedCount: arrived });

    // Run all agents
    const venueState = useVenueStore.getState();
    const queueState = useQueueStore.getState();

    const newZones = evaluateCrowdFlow(venueState.zones, newPhase, arrived, state.totalAttendees);
    useVenueStore.setState({ zones: newZones });

    const newQueues = evaluateQueueOptimizer(queueState.queues, newPhase, newZones);
    useQueueStore.setState({ queues: newQueues });

    const staffState = useStaffStore.getState();
    const { staff: newStaff, tasks: newTasks, newAlerts: staffAlerts } = evaluateStaffDispatch(
      staffState.staff, staffState.tasks, newZones, newPhase
    );
    useStaffStore.setState({ staff: newStaff, tasks: newTasks });

    const incState = useIncidentStore.getState();
    const { incidents: newIncidents, newAlerts: incAlerts } = evaluateIncidentCoord(
      incState.incidents, newZones, newPhase, newElapsed
    );
    useIncidentStore.setState({ incidents: newIncidents });

    const newRecs = evaluateFanExperience(newZones, newQueues, newPhase);
    useRecommendationStore.setState({ recommendations: newRecs });

    // Merge new alerts
    const allNewAlerts = [...staffAlerts, ...incAlerts];
    if (allNewAlerts.length > 0) {
      const alertState = useAlertStore.getState();
      useAlertStore.setState({
        alerts: [...allNewAlerts, ...alertState.alerts].slice(0, 50),
      });
    }

    // Update agent statuses
    useAgentStore.setState({
      agents: initialAgentStatuses.map(a => ({
        ...a,
        actionsCount: a.actionsCount + 1,
        lastActionTime: Date.now(),
        lastAction: getAgentActionLabel(a.id, newPhase),
      })),
    });
  },

  reset: () => {
    const state = get();
    if (state.intervalId) clearInterval(state.intervalId);
    set({
      phase: 'pre_event', elapsedMinutes: 0, speed: 1, isPaused: true,
      arrivedCount: 0, intervalId: null,
    });
    useVenueStore.setState({ zones: venueZones.map(z => ({ ...z, currentCount: 0, densityPct: 0, congestionLevel: 'low' as const })) });
    useQueueStore.setState({ queues: queuePoints.map(q => ({ ...q, currentLength: 0, estimatedWaitSec: 0, status: 'normal' as const })) });
    useStaffStore.setState({ staff: [...staffRoster], tasks: [] });
    useIncidentStore.setState({ incidents: [] });
    useAlertStore.setState({ alerts: [] });
    useRecommendationStore.setState({ recommendations: [] });
  },
}));

function getAgentActionLabel(agentId: string, phase: ScenarioPhase): string {
  const labels: Record<string, Record<ScenarioPhase, string>> = {
    crowd_flow: {
      pre_event: 'Monitoring gates', ingress: 'Tracking gate surges', normal_play: 'Stable density',
      halftime_rush: '⚠️ Concourse overload', second_half: 'Monitoring flow', egress: 'Managing exit flow', post_event: 'All clear',
    },
    queue_opt: {
      pre_event: 'Queues idle', ingress: 'Gate queue balancing', normal_play: 'Optimizing concessions',
      halftime_rush: '⚠️ Queue surge detected', second_half: 'Queues normalizing', egress: 'No queue activity', post_event: 'Idle',
    },
    staff_dispatch: {
      pre_event: 'Staff positioned', ingress: 'Gate reinforcement', normal_play: 'Routine patrol',
      halftime_rush: 'Dispatching to queues', second_half: 'Reassigning zones', egress: 'Exit management', post_event: 'Shift ending',
    },
    incident_coord: {
      pre_event: 'All clear', ingress: 'Monitoring entry', normal_play: 'Low activity',
      halftime_rush: 'Active incidents', second_half: 'Tracking resolution', egress: 'Crowd safety watch', post_event: 'Final sweep',
    },
    fan_experience: {
      pre_event: 'Welcome messages', ingress: 'Gate suggestions', normal_play: 'Sending food tips',
      halftime_rush: 'Rush guidance active', second_half: 'Experience scoring', egress: 'Exit navigation', post_event: 'Collecting feedback',
    },
  };
  return labels[agentId]?.[phase] || 'Processing...';
}

// ═══════════════════════════════════════════
// VENUE STORE — Zone state
// ═══════════════════════════════════════════

interface VenueStore {
  zones: Zone[];
}

export const useVenueStore = create<VenueStore>(() => ({
  zones: venueZones.map(z => ({ ...z })),
}));

// ═══════════════════════════════════════════
// QUEUE STORE
// ═══════════════════════════════════════════

interface QueueStore {
  queues: QueuePoint[];
}

export const useQueueStore = create<QueueStore>(() => ({
  queues: queuePoints.map(q => ({ ...q })),
}));

// ═══════════════════════════════════════════
// STAFF STORE
// ═══════════════════════════════════════════

interface StaffStore {
  staff: StaffMember[];
  tasks: import('@/lib/types').Task[];
}

export const useStaffStore = create<StaffStore>(() => ({
  staff: staffRoster.map(s => ({ ...s })),
  tasks: [],
}));

// ═══════════════════════════════════════════
// INCIDENT STORE
// ═══════════════════════════════════════════

interface IncidentStore {
  incidents: Incident[];
}

export const useIncidentStore = create<IncidentStore>(() => ({
  incidents: [],
}));

// ═══════════════════════════════════════════
// ALERT STORE
// ═══════════════════════════════════════════

interface AlertStore {
  alerts: Alert[];
  acknowledge: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  acknowledge: (id) => set((s) => ({
    alerts: s.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a),
  })),
}));

// ═══════════════════════════════════════════
// AGENT STATUS STORE
// ═══════════════════════════════════════════

interface AgentStore {
  agents: AgentStatus[];
}

export const useAgentStore = create<AgentStore>(() => ({
  agents: initialAgentStatuses.map(a => ({ ...a })),
}));

// ═══════════════════════════════════════════
// RECOMMENDATION STORE
// ═══════════════════════════════════════════

interface RecommendationStore {
  recommendations: Recommendation[];
}

export const useRecommendationStore = create<RecommendationStore>(() => ({
  recommendations: [],
}));
