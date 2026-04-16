'use client';

import { Badge } from '@/components/ui';
import { useQueueStore } from '@/lib/store';
import styles from './queuesPage.module.css';

const statusVariant = { normal: 'success' as const, busy: 'warning' as const, overloaded: 'danger' as const };
const typeIcon: Record<string, string> = { food: '🍔', beverage: '🍺', restroom: '🚻', merch: '🏪', entry: '🚪' };

function formatWait(sec: number): string {
  const m = Math.round(sec / 60);
  return m < 1 ? '<1 min' : `${m} min`;
}

export default function QueuesPage() {
  const queues = useQueueStore((s) => s.queues);
  const sorted = [...queues].sort((a, b) => b.estimatedWaitSec - a.estimatedWaitSec);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Queue Wait Times</h1>
      <p className={styles.subtitle}>Real-time estimates across the venue</p>
      <div className={styles.queueList}>
        {sorted.map((q) => (
          <div key={q.id} className={styles.queueItem}>
            <span className={styles.queueIcon}>{typeIcon[q.type] || '📍'}</span>
            <div className={styles.queueInfo}>
              <span className={styles.queueName}>{q.name}</span>
              <span className={styles.queueMeta}>{q.currentLength} people in line</span>
            </div>
            <div className={styles.queueRight}>
              <span className={styles.queueWait}>{formatWait(q.estimatedWaitSec)}</span>
              <Badge variant={statusVariant[q.status]}>{q.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
