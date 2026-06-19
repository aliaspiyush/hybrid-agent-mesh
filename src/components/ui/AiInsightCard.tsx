import React from 'react';
import styles from './AiInsightCard.module.css';

interface AiInsightCardProps {
  title?: string;
  content: string | React.ReactNode;
  confidence?: 'high' | 'medium' | 'low';
  alertLevel?: string;
  onDismiss: () => void;
}

export function AiInsightCard({ title = 'AI Insight', content, confidence, alertLevel, onDismiss }: AiInsightCardProps) {
  
  // Determine color based on confidence or alertLevel
  let colorClass = styles.borderBlue;
  if (confidence === 'high') colorClass = styles.borderGreen;
  if (confidence === 'medium') colorClass = styles.borderAmber;
  if (confidence === 'low') colorClass = styles.borderBlue;
  
  if (alertLevel === 'red') colorClass = styles.borderRed;
  if (alertLevel === 'amber') colorClass = styles.borderAmber;
  if (alertLevel === 'green') colorClass = styles.borderGreen;

  return (
    <div className={`${styles.card} ${colorClass}`}>
      <div className={styles.header}>
        <span className={styles.label}>✦ {title}</span>
        <button onClick={onDismiss} className={styles.dismissBtn} aria-label="Dismiss AI Insight">
          &times;
        </button>
      </div>
      <div className={styles.content}>
        {content}
      </div>
    </div>
  );
}
