'use client';

import { VenueMap } from '@/components/map/VenueMap';
import { useVenueStore, useQueueStore } from '@/lib/store';
import { useState } from 'react';
import type { Zone } from '@/lib/types';
import styles from './mapPage.module.css';

export default function AttendeeMapPage() {
  const zones = useVenueStore((s) => s.zones);
  const queues = useQueueStore((s) => s.queues);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Venue Map</h1>
      <div className={styles.mapContainer}>
        <VenueMap
          zones={zones}
          queuePoints={queues}
          showHeatmap
          showQueues
          onZoneClick={setSelectedZone}
          selectedZoneId={selectedZone?.id}
          compact
        />
      </div>
      {selectedZone && (
        <div className={styles.zoneDetail}>
          <div className={styles.detailHeader}>
            <h3>{selectedZone.name}</h3>
            <button className={styles.closeBtn} onClick={() => setSelectedZone(null)}>✕</button>
          </div>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Density</span>
              <span className={`${styles.detailValue} ${styles[`val-${selectedZone.congestionLevel}`]}`}>
                {selectedZone.densityPct}%
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>People</span>
              <span className={styles.detailValue}>{selectedZone.currentCount.toLocaleString()}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Capacity</span>
              <span className={styles.detailValue}>{selectedZone.capacity.toLocaleString()}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={`${styles.detailValue} ${styles[`val-${selectedZone.congestionLevel}`]}`}>
                {selectedZone.congestionLevel}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
