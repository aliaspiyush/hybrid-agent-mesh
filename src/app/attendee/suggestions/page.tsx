'use client';

import { Badge } from '@/components/ui';
import { useRecommendationStore } from '@/lib/store';
import styles from './suggestionsPage.module.css';

const impactColor = { high: 'success' as const, medium: 'info' as const, low: 'neutral' as const };

export default function SuggestionsPage() {
  const recommendations = useRecommendationStore((s) => s.recommendations);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>💡 Smart Tips</h1>
        <p className={styles.subtitle}>AI-powered suggestions to enhance your experience</p>
      </div>
      <div className={styles.list}>
        {recommendations.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>💡</span>
            <p>Press ▶ on the scenario bar to start generating tips</p>
          </div>
        )}
        {recommendations.map((rec, i) => (
          <div key={rec.id} className={styles.recCard} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={styles.recIcon}>{rec.icon}</div>
            <div className={styles.recContent}>
              <div className={styles.recHeader}>
                <h3 className={styles.recTitle}>{rec.title}</h3>
                <Badge variant={impactColor[rec.impact]}>{rec.impact} impact</Badge>
              </div>
              <p className={styles.recDesc}>{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.feedback}>
        <p className={styles.feedbackLabel}>How&apos;s your experience?</p>
        <div className={styles.emojiRow}>
          {['😍', '😊', '😐', '😕', '😤'].map((emoji) => (
            <button key={emoji} className={styles.emojiBtn}>{emoji}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
