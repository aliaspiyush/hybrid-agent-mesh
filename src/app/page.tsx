import { RoleSelector } from '@/components/layout';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.landing}>
      <div className={styles.heroGlow} />
      <header className={styles.header}>
        <div className={styles.logoMark}>
          <span>⬡</span>
        </div>
        <h1 className={styles.title}>
          <span className={styles.titleGradient}>Hybrid Agent Mesh</span>
        </h1>
        <p className={styles.subtitle}>
          Multi-agent cooperative platform for real-time venue management
        </p>
        <div className={styles.eventBanner}>
          <span className={styles.liveDot} />
          <span className={styles.eventName}>City FC vs United — Championship Final</span>
          <span className={styles.eventTime}>Today · 7:30 PM</span>
        </div>
      </header>
      <section className={styles.roleSection}>
        <h2 className={styles.sectionLabel}>Select your role</h2>
        <RoleSelector />
      </section>
    </main>
  );
}
