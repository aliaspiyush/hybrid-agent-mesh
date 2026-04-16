'use client';

import { KpiCard } from '@/components/ui';
import { useScenarioStore, useQueueStore, useVenueStore } from '@/lib/store';
import { currentEvent } from '@/lib/data/venue';
import styles from './attendeePage.module.css';

export default function AttendeePage() {
  const arrivedCount = useScenarioStore((s) => s.arrivedCount);
  const totalAttendees = useScenarioStore((s) => s.totalAttendees);
  const queues = useQueueStore((s) => s.queues);

  const capacityPct = totalAttendees > 0 ? Math.round((arrivedCount / totalAttendees) * 100) : 0;
  const avgWaitMin = queues.length > 0
    ? Math.round(queues.reduce((s, q) => s + q.estimatedWaitSec, 0) / queues.length / 60)
    : 0;

  return (
    <div className={styles.page}>
      <section className={styles.eventCard}>
        <div className={styles.eventLive}>
          <span className={styles.liveDot} />
          <span>LIVE EVENT</span>
        </div>
        <h1 className={styles.eventName}>{currentEvent.name}</h1>
        <p className={styles.eventMeta}>
          {currentEvent.venue} · {currentEvent.date} · {currentEvent.kickoff}
        </p>
      </section>

      <section className={styles.kpiRow}>
        <KpiCard label="Venue Capacity" value={`${capacityPct}%`} icon="🏟️" accentColor="var(--accent-cyan)" />
        <KpiCard label="Avg Wait" value={`${avgWaitMin} min`} icon="⏱️" accentColor="var(--accent-amber)" />
      </section>

      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/attendee/map" className={styles.actionCard}>
            <span className={styles.actionIcon}>🗺️</span>
            <span className={styles.actionLabel}>Venue Map</span>
          </a>
          <a href="/attendee/queues" className={styles.actionCard}>
            <span className={styles.actionIcon}>⏱️</span>
            <span className={styles.actionLabel}>Wait Times</span>
          </a>
          <a href="/attendee/suggestions" className={styles.actionCard}>
            <span className={styles.actionIcon}>💡</span>
            <span className={styles.actionLabel}>Smart Tips</span>
          </a>
          <a href="/attendee/map" className={styles.actionCard}>
            <span className={styles.actionIcon}>🚻</span>
            <span className={styles.actionLabel}>Restrooms</span>
          </a>
        </div>
      </section>
    </div>
  );
}
