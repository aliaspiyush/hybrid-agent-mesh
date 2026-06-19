'use client';

import { useState, useEffect } from 'react';

import { KpiCard, Badge, StatusDot, AiInsightCard } from '@/components/ui';
import { VenueMap } from '@/components/map/VenueMap';
import { useVenueStore, useQueueStore, useStaffStore, useScenarioStore, useAgentStore, useAlertStore, useIncidentStore } from '@/lib/store';
import styles from './opsPage.module.css';

const phaseLabels: Record<string, string> = {
  pre_event: 'Pre-Event', ingress: 'Ingress', normal_play: 'Normal Play',
  halftime_rush: 'Halftime Rush', second_half: 'Second Half', egress: 'Egress', post_event: 'Post-Event',
};

export default function OpsCommandCenter() {
  const zones = useVenueStore((s) => s.zones);
  const queues = useQueueStore((s) => s.queues);
  const staff = useStaffStore((s) => s.staff);
  const phase = useScenarioStore((s) => s.phase);
  const arrivedCount = useScenarioStore((s) => s.arrivedCount);
  const totalAttendees = useScenarioStore((s) => s.totalAttendees);
  const agents = useAgentStore((s) => s.agents);
  const alerts = useAlertStore((s) => s.alerts);
  const incidents = useIncidentStore((s) => s.incidents);

  const capacityPct = totalAttendees > 0 ? Math.round((arrivedCount / totalAttendees) * 100) : 0;
  const avgWait = queues.length > 0
    ? (queues.reduce((s, q) => s + q.estimatedWaitSec, 0) / queues.length / 60).toFixed(1)
    : '0';
  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;

  const venueInsight = useVenueStore(s => s.aiInsight);
  const clearVenueInsight = useVenueStore(s => s.clearAiInsight);
  const incidentInsight = useIncidentStore(s => s.aiInsight);
  const clearIncidentInsight = useIncidentStore(s => s.clearAiInsight);

  const venueLoading = useVenueStore(s => s.aiLoading);
  const incidentLoading = useIncidentStore(s => s.aiLoading);
  const aiLoading = venueLoading || incidentLoading;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Command Center</h1>
          <p className={styles.subtitle}>MetroSphere Arena — Live Operations</p>
        </div>
        <div className={styles.headerStatus}>
          <Badge variant="success" pulse>LIVE</Badge>
          <span className={styles.headerTime}>Phase: {phaseLabels[phase]}</span>
        </div>
      </div>

      {venueInsight && (
        <AiInsightCard
          title="Crowd Flow AI"
          content={venueInsight.recommendation}
          confidence={venueInsight.confidence as 'high' | 'medium' | 'low'}
          onDismiss={clearVenueInsight}
        />
      )}

      {incidentInsight && (
        <AiInsightCard
          title="Incident Classification AI"
          content={`Suggested Action: ${incidentInsight.suggestedAction} ${incidentInsight.escalate ? '(ESCALATE)' : ''}`}
          alertLevel={incidentInsight.alertLevel}
          onDismiss={clearIncidentInsight}
        />
      )}

      <div className={styles.kpiRow}>
        <KpiCard label="Attendance" value={arrivedCount.toLocaleString()} icon="👥" accentColor="var(--accent-cyan)" isLoading={aiLoading} />
        <KpiCard label="Venue Capacity" value={`${capacityPct}%`} icon="🏟️" accentColor="var(--accent-blue)" isLoading={aiLoading} />
        <KpiCard label="Avg Wait Time" value={`${avgWait}m`} icon="⏱️" accentColor="var(--accent-amber)" isLoading={aiLoading} />
        <KpiCard label="Active Incidents" value={String(activeIncidents)} icon="🚨" accentColor="var(--accent-red)" isLoading={aiLoading} />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mapArea}>
          <VenueMap
            zones={zones}
            queuePoints={queues}
            staffMembers={staff}
            showHeatmap
            showQueues
            showStaff
          />
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.panelSection}>
            <h3 className={styles.panelTitle}>Agent Status</h3>
            <div className={styles.agentList}>
              {agents.map((agent) => (
                <div key={agent.id} className={styles.agentItem}>
                  <span className={styles.agentIcon}>{agent.icon}</span>
                  <div className={styles.agentInfo}>
                    <span className={styles.agentName}>{agent.name}</span>
                    <span className={styles.agentAction}>{agent.lastAction}</span>
                  </div>
                  <StatusDot status={agent.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panelSection}>
            <h3 className={styles.panelTitle}>Recent Alerts ({alerts.filter(a => !a.acknowledged).length} new)</h3>
            <div className={styles.alertList}>
              {alerts.length === 0 && (
                <div className={styles.emptyState}>Press ▶ to start the scenario</div>
              )}
              {alerts.slice(0, 8).map((alert) => (
                <div key={alert.id} className={`${styles.alertItem} ${styles[`alertItem-${alert.severity}`]}`}>
                  <span>{alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <div className={styles.alertContent}>
                    <span className={styles.alertMsg}>{alert.message}</span>
                    <span className={styles.alertTime}>
                      {Math.round((now - alert.timestamp) / 1000)}s ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
