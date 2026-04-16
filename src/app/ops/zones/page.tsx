'use client';

import { Badge } from '@/components/ui';
import { useVenueStore } from '@/lib/store';
import styles from './zonesPage.module.css';

const zoneTypeIcon: Record<string, string> = {
  entry_gate: '🚪', concourse: '🚶', seating: '💺', concession: '🍔',
  restroom: '🚻', exit: '🚪', vip: '⭐',
};

function congestionBadge(pct: number) {
  if (pct >= 85) return <Badge variant="danger" pulse>Critical</Badge>;
  if (pct >= 65) return <Badge variant="warning">High</Badge>;
  if (pct >= 40) return <Badge variant="info">Moderate</Badge>;
  return <Badge variant="success">Low</Badge>;
}

export default function ZonesPage() {
  const zones = useVenueStore((s) => s.zones);
  const filtered = zones.filter(z => z.id !== 'field');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Zone Management</h1>
      <div className={styles.grid}>
        {filtered.map((zone) => (
          <div key={zone.id} className={styles.zoneCard}>
            <div className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>{zoneTypeIcon[zone.type] || '📍'}</span>
              <span className={styles.zoneName}>{zone.name}</span>
              {congestionBadge(zone.densityPct)}
            </div>
            <div className={styles.densityBar}>
              <div className={styles.densityFill} style={{
                width: `${zone.densityPct}%`,
                background: zone.densityPct >= 85 ? 'var(--accent-red)' : zone.densityPct >= 65 ? 'var(--accent-amber)' : zone.densityPct >= 40 ? 'var(--accent-blue)' : 'var(--accent-green)',
              }} />
            </div>
            <div className={styles.zoneMeta}>
              <span>{zone.densityPct}% capacity</span>
              <span>{zone.currentCount.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
