'use client';

import { Sidebar } from '@/components/layout';
import styles from './ops.module.css';

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.opsShell}>
      <Sidebar />
      <main className={styles.opsMain}>{children}</main>
    </div>
  );
}
