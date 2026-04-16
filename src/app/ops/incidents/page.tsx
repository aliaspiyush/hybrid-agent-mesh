'use client';

import { Badge } from '@/components/ui';
import { useIncidentStore } from '@/lib/store';
import styles from './incidentsPage.module.css';

const severityVariant = { low: 'info' as const, medium: 'warning' as const, high: 'danger' as const, critical: 'danger' as const };
const statusVariant = { reported: 'warning' as const, acknowledged: 'info' as const, in_progress: 'purple' as const, resolved: 'success' as const, escalated: 'danger' as const };
const typeIcon: Record<string, string> = { medical: '🏥', security: '🛡️', facility: '🔧', crowd: '🚶', other: '📌' };

export default function IncidentsPage() {
  const incidents = useIncidentStore((s) => s.incidents);
  const active = incidents.filter(i => i.status !== 'resolved').length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Incident Management</h1>
        <div className={styles.stats}>
          {active > 0 && <Badge variant="danger" pulse>{active} Active</Badge>}
          {resolved > 0 && <Badge variant="success">{resolved} Resolved</Badge>}
        </div>
      </div>
      {incidents.length === 0 && (
        <div className={styles.empty}>
          <span>✅</span>
          <p>No incidents — press ▶ to start scenario simulation</p>
        </div>
      )}
      <div className={styles.list}>
        {incidents.map((inc) => (
          <div key={inc.id} className={styles.incCard}>
            <div className={styles.incIcon}>{typeIcon[inc.type] || '📌'}</div>
            <div className={styles.incContent}>
              <div className={styles.incHeader}>
                <span className={styles.incId}>#{inc.id}</span>
                <Badge variant={severityVariant[inc.severity]}>{inc.severity}</Badge>
                <Badge variant={statusVariant[inc.status]}>{inc.status}</Badge>
              </div>
              <p className={styles.incDesc}>{inc.description}</p>
              <div className={styles.incMeta}>
                <span>Zone: {inc.zoneId}</span>
                <span>·</span>
                <span>{inc.reportedBy}</span>
                {inc.resolvedAt && <><span>·</span><span>Resolved</span></>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
