'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import type { UserRole } from '@/lib/types';

// ═══════════════════════════════════════════
// ROLE SELECTOR — Landing page role picker
// ═══════════════════════════════════════════

const roles: { id: UserRole; label: string; icon: string; description: string; path: string; gradient: string }[] = [
  { id: 'attendee', label: 'Attendee', icon: '📱', description: 'Fan experience — map, queues, and recommendations', path: '/attendee', gradient: 'linear-gradient(135deg, hsl(270, 76%, 62%), hsl(217, 91%, 60%))' },
  { id: 'staff', label: 'Staff', icon: '📋', description: 'Dispatch tasks, incident response, and zone patrol', path: '/staff', gradient: 'linear-gradient(135deg, hsl(38, 92%, 55%), hsl(28, 90%, 55%))' },
  { id: 'ops', label: 'Operations', icon: '🖥️', description: 'Command center — full venue monitoring and control', path: '/ops', gradient: 'linear-gradient(135deg, hsl(152, 69%, 50%), hsl(188, 90%, 55%))' },
];

export function RoleSelector() {
  return (
    <div className={styles.roleGrid}>
      {roles.map((role, i) => (
        <Link href={role.path} key={role.id} className={styles.roleCard} style={{ animationDelay: `${i * 100}ms` }}>
          <div className={styles.roleIconWrap} style={{ background: role.gradient }}>
            <span className={styles.roleIcon}>{role.icon}</span>
          </div>
          <h3 className={styles.roleLabel}>{role.label}</h3>
          <p className={styles.roleDesc}>{role.description}</p>
          <span className={styles.roleArrow}>→</span>
        </Link>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// MOBILE NAV — Attendee bottom tab bar
// ═══════════════════════════════════════════

const attendeeLinks = [
  { href: '/attendee', label: 'Home', icon: '🏠' },
  { href: '/attendee/map', label: 'Map', icon: '🗺️' },
  { href: '/attendee/queues', label: 'Queues', icon: '⏱️' },
  { href: '/attendee/suggestions', label: 'Tips', icon: '💡' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.mobileNav}>
      {attendeeLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`}>
            <span className={styles.mobileNavIcon}>{link.icon}</span>
            <span className={styles.mobileNavLabel}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════
// TABLET NAV — Staff top navigation
// ═══════════════════════════════════════════

const staffLinks = [
  { href: '/staff', label: 'Dashboard', icon: '📊' },
  { href: '/staff/map', label: 'Map', icon: '🗺️' },
  { href: '/staff/tasks', label: 'Tasks', icon: '📋' },
];

export function TabletNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.tabletNav}>
      <div className={styles.tabletNavBrand}>
        <span className={styles.tabletNavLogo}>👷</span>
        <span className={styles.tabletNavTitle}>Staff Dispatch</span>
      </div>
      <div className={styles.tabletNavLinks}>
        {staffLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`${styles.tabletNavLink} ${isActive ? styles.tabletNavLinkActive : ''}`}>
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
      <div className={styles.tabletNavStatus}>
        <span className={styles.onDutyDot} />
        <span>On Duty</span>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════
// SIDEBAR — Ops dashboard navigation
// ═══════════════════════════════════════════

const opsLinks = [
  { href: '/ops', label: 'Command Center', icon: '📡' },
  { href: '/ops/zones', label: 'Zones', icon: '🏟️' },
  { href: '/ops/staff', label: 'Staff', icon: '👥' },
  { href: '/ops/incidents', label: 'Incidents', icon: '🚨' },
  { href: '/ops/analytics', label: 'Analytics', icon: '📈' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <div className={styles.sidebarLogo}>
          <span>⬡</span>
        </div>
        <div>
          <div className={styles.sidebarTitle}>Hybrid Agent Mesh</div>
          <div className={styles.sidebarSubtitle}>Venue Operations</div>
        </div>
      </div>
      <nav className={styles.sidebarNav}>
        {opsLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}>
              <span className={styles.sidebarLinkIcon}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={styles.sidebarFooter}>
        <Link href="/" className={styles.sidebarBackLink}>
          ← Switch Role
        </Link>
      </div>
    </aside>
  );
}
