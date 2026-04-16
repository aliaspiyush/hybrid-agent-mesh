'use client';

import { Badge } from '@/components/ui';
import { useStaffStore } from '@/lib/store';
import styles from './staffListPage.module.css';

const roleIcon: Record<string, string> = { security: '🛡️', medical: '🏥', usher: '🎫', maintenance: '🔧', concessions: '🍔' };
const statusVariant = { on_duty: 'success' as const, off_duty: 'neutral' as const, break: 'warning' as const };

export default function StaffListPage() {
  const staff = useStaffStore(s => s.staff);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Staff Roster</h1>
        <Badge variant="info">Total: {staff.length}</Badge>
      </div>

      <div className={styles.grid}>
        {staff.map(member => (
          <div key={member.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.avatar}>{roleIcon[member.role] || member.avatar || '👤'}</span>
              <div className={styles.info}>
                <span className={styles.name}>{member.name}</span>
                <span className={styles.role}>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
              </div>
            </div>
            <div className={styles.meta}>
              <div className={styles.metaRow}>
                <span>Location:</span>
                <span className={styles.zoneId}>{member.currentZoneId}</span>
              </div>
              <div className={styles.metaRow}>
                <span>Status:</span>
                <Badge variant={statusVariant[member.shiftStatus]}>{member.shiftStatus.replace('_', ' ')}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
