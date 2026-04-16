'use client';

import React from 'react';
import styles from './ui.module.css';

// ═══════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]} ${styles[`btn-${size}`]} ${className || ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {!loading && icon && <span className={styles.btnIcon}>{icon}</span>}
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════

interface CardProps {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Card({ variant = 'default', padding = 'md', onClick, children, className }: CardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={`${styles.card} ${styles[`card-${variant}`]} ${styles[`card-pad-${padding}`]} ${onClick ? styles.cardClickable : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', pulse, children, className }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[`badge-${variant}`]} ${pulse ? styles.badgePulse : ''} ${className || ''}`}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════
// STATUS DOT
// ═══════════════════════════════════════════

interface StatusDotProps {
  status: 'idle' | 'active' | 'busy' | 'offline' | 'running' | 'paused' | 'error' | 'en_route';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function StatusDot({ status, size = 'md', label }: StatusDotProps) {
  return (
    <span className={styles.statusDotWrapper}>
      <span className={`${styles.statusDot} ${styles[`dot-${status}`]} ${styles[`dot-size-${size}`]}`} />
      {label && <span className={styles.statusLabel}>{label}</span>}
    </span>
  );
}

// ═══════════════════════════════════════════
// KPI CARD
// ═══════════════════════════════════════════

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: string;
  delta?: { value: number; label: string };
  trend?: 'up' | 'down' | 'stable';
  accentColor?: string;
}

export function KpiCard({ label, value, icon, delta, trend, accentColor }: KpiCardProps) {
  return (
    <div className={styles.kpiCard} style={accentColor ? { '--kpi-accent': accentColor } as React.CSSProperties : undefined}>
      <div className={styles.kpiHeader}>
        {icon && <span className={styles.kpiIcon}>{icon}</span>}
        <span className={styles.kpiLabel}>{label}</span>
      </div>
      <div className={styles.kpiValue}>{value}</div>
      {delta && (
        <div className={`${styles.kpiDelta} ${styles[`delta-${trend || 'stable'}`]}`}>
          <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
          <span>{delta.value > 0 ? '+' : ''}{delta.value}%</span>
          <span className={styles.kpiDeltaLabel}>{delta.label}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ALERT BANNER
// ═══════════════════════════════════════════

interface AlertBannerProps {
  severity: 'info' | 'warning' | 'critical';
  message: string;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}

export function AlertBanner({ severity, message, onDismiss, action }: AlertBannerProps) {
  const icons = { info: 'ℹ️', warning: '⚠️', critical: '🚨' };
  return (
    <div className={`${styles.alertBanner} ${styles[`alert-${severity}`]}`}>
      <span className={styles.alertIcon}>{icons[severity]}</span>
      <span className={styles.alertMessage}>{message}</span>
      {action && (
        <button className={styles.alertAction} onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button className={styles.alertDismiss} onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════

interface TabsProps {
  items: { id: string; label: string; icon?: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeTab, onChange }: TabsProps) {
  return (
    <div className={styles.tabs}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`${styles.tab} ${activeTab === item.id ? styles.tabActive : ''}`}
          onClick={() => onChange(item.id)}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}
