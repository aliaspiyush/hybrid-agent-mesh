import React from 'react';
import { KpiCard } from '@/components/ui';
import styles from './attendeePage.module.css';

export default function Loading() {
  return (
    <div className={styles.page}>
      <section className={styles.eventCard} style={{ opacity: 0.7 }}>
        <div style={{ height: '24px', width: '30%', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '32px', width: '80%', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '16px', width: '50%', background: 'var(--border)', borderRadius: '4px' }} />
      </section>

      <section className={styles.kpiRow}>
        <KpiCard label="Loading..." value="--" isLoading={true} />
        <KpiCard label="Loading..." value="--" isLoading={true} />
      </section>
    </div>
  );
}
