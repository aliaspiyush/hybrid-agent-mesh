'use client';

import { KpiCard, Badge } from '@/components/ui';
import { useScenarioStore, useVenueStore } from '@/lib/store';
import styles from './analyticsPage.module.css';

export default function AnalyticsPage() {
  const elapsed = useScenarioStore(s => s.elapsedMinutes);
  const totalRaw = useScenarioStore(s => s.arrivedCount);
  const zones = useVenueStore(s => s.zones);

  const congestedCount = zones.filter(z => z.congestionLevel === 'critical' || z.congestionLevel === 'high').length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Venue Analytics</h1>
          <p className={styles.subtitle}>Historical data and predictive modeling</p>
        </div>
        <Badge variant="info">Beta</Badge>
      </div>

      <div className={styles.kpiRow}>
        <KpiCard label="Peak Flow Rate" value="1,240/min" icon="📈" accentColor="var(--accent-cyan)" />
        <KpiCard label="Active Bottlenecks" value={String(congestedCount)} icon="⚠️" accentColor="var(--accent-amber)" />
        <KpiCard label="Avg Dwell Time" value="45m" icon="⏱️" accentColor="var(--accent-blue)" />
      </div>

      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon}>📊</span>
        <h3>Real-time Charts Coming Soon</h3>
        <p>The analytics module (Recharts integration) will be available in the next release.</p>
        <p className={styles.elapsed}>Elapsed Scenario Time: {elapsed.toFixed(1)} mins</p>
      </div>
    </div>
  );
}
