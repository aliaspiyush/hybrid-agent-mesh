'use client';

import { VenueMap } from '@/components/map/VenueMap';
import { useVenueStore, useStaffStore } from '@/lib/store';
import styles from './mapPage.module.css';

export default function StaffMapPage() {
  const zones = useVenueStore((s) => s.zones);
  const staff = useStaffStore((s) => s.staff);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Zone Map</h1>
      <div className={styles.mapContainer}>
        <VenueMap
          zones={zones}
          staffMembers={staff}
          showHeatmap
          showStaff
        />
      </div>
    </div>
  );
}
