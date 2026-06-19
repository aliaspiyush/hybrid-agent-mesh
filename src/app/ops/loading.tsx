import React from 'react';
import { KpiCard } from '@/components/ui';
import styles from './opsPage.module.css';

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div style={{ height: '32px', width: '250px', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px' }} />
          <div style={{ height: '16px', width: '200px', background: 'var(--border)', borderRadius: '4px' }} />
        </div>
      </div>

      <div className={styles.kpiRow}>
        <KpiCard label="Loading..." value="--" isLoading={true} />
        <KpiCard label="Loading..." value="--" isLoading={true} />
        <KpiCard label="Loading..." value="--" isLoading={true} />
        <KpiCard label="Loading..." value="--" isLoading={true} />
      </div>
    </div>
  );
}
