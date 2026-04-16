'use client';

import { MobileNav } from '@/components/layout';
import styles from './attendee.module.css';

export default function AttendeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.attendeeShell}>
      <header className={styles.attendeeHeader}>
        <span className={styles.headerIcon}>📱</span>
        <span className={styles.headerTitle}>MetroSphere Arena</span>
      </header>
      <main className={styles.attendeeMain}>{children}</main>
      <MobileNav />
    </div>
  );
}
