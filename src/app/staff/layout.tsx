'use client';

import { TabletNav } from '@/components/layout';
import styles from './staff.module.css';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.staffShell}>
      <TabletNav />
      <main className={styles.staffMain}>{children}</main>
    </div>
  );
}
