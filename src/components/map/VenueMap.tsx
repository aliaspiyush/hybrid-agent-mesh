'use client';

import React, { useState, useCallback } from 'react';
import styles from './map.module.css';
import type { Zone, QueuePoint, StaffMember } from '@/lib/types';

// ═══════════════════════════════════════════
// SVG STADIUM MAP — Top-down oval venue
// ═══════════════════════════════════════════

interface VenueMapProps {
  zones: Zone[];
  queuePoints?: QueuePoint[];
  staffMembers?: StaffMember[];
  showHeatmap?: boolean;
  showQueues?: boolean;
  showStaff?: boolean;
  onZoneClick?: (zone: Zone) => void;
  selectedZoneId?: string | null;
  compact?: boolean;
}

// Heatmap color scale
function densityToColor(pct: number): string {
  if (pct < 20) return 'hsla(152, 69%, 50%, 0.35)';
  if (pct < 40) return 'hsla(82, 70%, 50%, 0.4)';
  if (pct < 60) return 'hsla(48, 90%, 55%, 0.45)';
  if (pct < 80) return 'hsla(28, 90%, 55%, 0.5)';
  return 'hsla(0, 84%, 55%, 0.55)';
}

function densityBorderColor(pct: number): string {
  if (pct < 20) return 'hsla(152, 69%, 50%, 0.6)';
  if (pct < 40) return 'hsla(82, 70%, 50%, 0.6)';
  if (pct < 60) return 'hsla(48, 90%, 55%, 0.6)';
  if (pct < 80) return 'hsla(28, 90%, 55%, 0.6)';
  return 'hsla(0, 84%, 55%, 0.7)';
}

function queueStatusColor(status: string): string {
  if (status === 'overloaded') return 'var(--accent-red)';
  if (status === 'busy') return 'var(--accent-amber)';
  return 'var(--accent-green)';
}

export function VenueMap({
  zones,
  queuePoints = [],
  staffMembers = [],
  showHeatmap = true,
  showQueues = true,
  showStaff = false,
  onZoneClick,
  selectedZoneId,
  compact = false,
}: VenueMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ zone: Zone; x: number; y: number } | null>(null);

  const handleZoneHover = useCallback((zone: Zone, e: React.MouseEvent) => {
    setHoveredZone(zone.id);
    const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect();
    setTooltip({
      zone,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleZoneLeave = useCallback(() => {
    setHoveredZone(null);
    setTooltip(null);
  }, []);

  const getZone = (id: string) => zones.find(z => z.id === id);

  const viewBox = '0 0 800 600';

  return (
    <div className={`${styles.mapWrapper} ${compact ? styles.mapCompact : ''}`}>
      <svg viewBox={viewBox} className={styles.mapSvg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradient for field */}
          <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(120, 50%, 30%, 0.3)" />
            <stop offset="100%" stopColor="hsla(120, 50%, 20%, 0.15)" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Drop shadow */}
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>

        {/* ═══ OUTER STADIUM RING ═══ */}
        <ellipse cx="400" cy="300" rx="370" ry="270" fill="hsla(222, 35%, 10%, 0.9)" stroke="hsla(220, 30%, 25%, 0.6)" strokeWidth="2" />

        {/* ═══ CONCOURSE RING ═══ */}
        <ellipse cx="400" cy="300" rx="330" ry="240" fill="none" stroke="hsla(220, 30%, 20%, 0.4)" strokeWidth="1" strokeDasharray="4 4" />

        {/* ═══ ENTRY GATES ═══ */}
        {[
          { id: 'gate-a', x: 340, y: 20, w: 120, h: 40, label: 'GATE A' },
          { id: 'gate-b', x: 730, y: 260, w: 40, h: 80, label: 'B' },
          { id: 'gate-c', x: 340, y: 540, w: 120, h: 40, label: 'GATE C' },
          { id: 'gate-d', x: 30, y: 260, w: 40, h: 80, label: 'D' },
        ].map(gate => {
          const zone = getZone(gate.id);
          const isHovered = hoveredZone === gate.id;
          const isSelected = selectedZoneId === gate.id;
          return (
            <g key={gate.id} className={styles.zoneGroup}
              onMouseEnter={(e) => zone && handleZoneHover(zone, e)}
              onMouseLeave={handleZoneLeave}
              onClick={() => zone && onZoneClick?.(zone)}>
              <rect
                x={gate.x} y={gate.y} width={gate.w} height={gate.h} rx={6}
                fill={zone && showHeatmap ? densityToColor(zone.densityPct) : 'hsla(222, 35%, 18%, 0.8)'}
                stroke={isHovered || isSelected ? 'var(--accent-cyan)' : zone && showHeatmap ? densityBorderColor(zone.densityPct) : 'hsla(220, 30%, 30%, 0.5)'}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                className={styles.zonePath}
              />
              <text x={gate.x + gate.w / 2} y={gate.y + gate.h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                className={styles.zoneLabel} fontSize={gate.w > 50 ? 11 : 9}>{gate.label}</text>
            </g>
          );
        })}

        {/* ═══ CONCOURSES ═══ */}
        {[
          { id: 'concourse-n', d: 'M 140,80 Q 400,30 660,80 L 620,130 Q 400,85 180,130 Z', label: 'North Concourse', lx: 400, ly: 105 },
          { id: 'concourse-s', d: 'M 140,520 Q 400,570 660,520 L 620,470 Q 400,515 180,470 Z', label: 'South Concourse', lx: 400, ly: 495 },
          { id: 'concourse-e', d: 'M 660,80 Q 750,300 660,520 L 610,470 Q 690,300 610,130 Z', label: 'East', lx: 660, ly: 300 },
          { id: 'concourse-w', d: 'M 140,80 Q 50,300 140,520 L 190,470 Q 110,300 190,130 Z', label: 'West', lx: 140, ly: 300 },
        ].map(conc => {
          const zone = getZone(conc.id);
          const isHovered = hoveredZone === conc.id;
          const isSelected = selectedZoneId === conc.id;
          return (
            <g key={conc.id} className={styles.zoneGroup}
              onMouseEnter={(e) => zone && handleZoneHover(zone, e)}
              onMouseLeave={handleZoneLeave}
              onClick={() => zone && onZoneClick?.(zone)}>
              <path d={conc.d}
                fill={zone && showHeatmap ? densityToColor(zone.densityPct) : 'hsla(222, 35%, 16%, 0.7)'}
                stroke={isHovered || isSelected ? 'var(--accent-cyan)' : zone && showHeatmap ? densityBorderColor(zone.densityPct) : 'hsla(220, 30%, 28%, 0.5)'}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                className={styles.zonePath}
              />
              <text x={conc.lx} y={conc.ly} textAnchor="middle" dominantBaseline="middle"
                className={styles.zoneLabel} fontSize={10}>{conc.label}</text>
            </g>
          );
        })}

        {/* ═══ SEATING SECTIONS ═══ */}
        {[
          { id: 'seating-n', d: 'M 190,135 Q 400,90 610,135 L 575,200 Q 400,160 225,200 Z', label: 'North Stand', lx: 400, ly: 170 },
          { id: 'seating-s', d: 'M 190,465 Q 400,510 610,465 L 575,400 Q 400,440 225,400 Z', label: 'South Stand', lx: 400, ly: 430 },
          { id: 'seating-e', d: 'M 615,135 Q 695,300 615,465 L 575,400 Q 640,300 575,200 Z', label: 'East', lx: 610, ly: 300 },
          { id: 'seating-w', d: 'M 185,135 Q 105,300 185,465 L 225,400 Q 160,300 225,200 Z', label: 'West', lx: 190, ly: 300 },
        ].map(seat => {
          const zone = getZone(seat.id);
          const isHovered = hoveredZone === seat.id;
          const isSelected = selectedZoneId === seat.id;
          return (
            <g key={seat.id} className={styles.zoneGroup}
              onMouseEnter={(e) => zone && handleZoneHover(zone, e)}
              onMouseLeave={handleZoneLeave}
              onClick={() => zone && onZoneClick?.(zone)}>
              <path d={seat.d}
                fill={zone && showHeatmap ? densityToColor(zone.densityPct) : 'hsla(222, 35%, 14%, 0.8)'}
                stroke={isHovered || isSelected ? 'var(--accent-cyan)' : zone && showHeatmap ? densityBorderColor(zone.densityPct) : 'hsla(220, 30%, 25%, 0.4)'}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                className={styles.zonePath}
              />
              <text x={seat.lx} y={seat.ly} textAnchor="middle" dominantBaseline="middle"
                className={styles.zoneLabel} fontSize={10}>{seat.label}</text>
            </g>
          );
        })}

        {/* ═══ PLAYING FIELD ═══ */}
        <rect x="240" y="210" width="320" height="180" rx="16" fill="url(#fieldGradient)" stroke="hsla(120, 40%, 35%, 0.4)" strokeWidth="1.5" />
        <line x1="400" y1="210" x2="400" y2="390" stroke="hsla(120, 40%, 40%, 0.25)" strokeWidth="1" />
        <circle cx="400" cy="300" r="35" fill="none" stroke="hsla(120, 40%, 40%, 0.25)" strokeWidth="1" />
        <text x="400" y="300" textAnchor="middle" dominantBaseline="middle" className={styles.fieldLabel}>⚽ PITCH</text>

        {/* ═══ CONCESSIONS & FACILITIES ═══ */}
        {[
          { id: 'food-n', x: 230, y: 70, w: 56, h: 28, label: '🍔 Food', icon: true },
          { id: 'food-s', x: 230, y: 502, w: 56, h: 28, label: '🍕 Food', icon: true },
          { id: 'beverage-e', x: 675, y: 190, w: 36, h: 48, label: '🍺', icon: true },
          { id: 'merch-w', x: 88, y: 190, w: 36, h: 48, label: '🏪', icon: true },
          { id: 'restroom-ne', x: 555, y: 70, w: 50, h: 28, label: '🚻 WC', icon: true },
          { id: 'restroom-sw', x: 195, y: 502, w: 50, h: 28, label: '🚻 WC', icon: true },
          { id: 'vip-lounge', x: 520, y: 502, w: 60, h: 28, label: '⭐ VIP', icon: true },
        ].map(fac => {
          const zone = getZone(fac.id);
          const isHovered = hoveredZone === fac.id;
          const isSelected = selectedZoneId === fac.id;
          return (
            <g key={fac.id} className={styles.zoneGroup}
              onMouseEnter={(e) => zone && handleZoneHover(zone, e)}
              onMouseLeave={handleZoneLeave}
              onClick={() => zone && onZoneClick?.(zone)}>
              <rect x={fac.x} y={fac.y} width={fac.w} height={fac.h} rx={5}
                fill={zone && showHeatmap ? densityToColor(zone.densityPct) : 'hsla(222, 35%, 20%, 0.9)'}
                stroke={isHovered || isSelected ? 'var(--accent-cyan)' : zone && showHeatmap ? densityBorderColor(zone.densityPct) : 'hsla(220, 30%, 30%, 0.6)'}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                className={styles.zonePath}
              />
              <text x={fac.x + fac.w / 2} y={fac.y + fac.h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                className={styles.facilityLabel} fontSize={9}>{fac.label}</text>
            </g>
          );
        })}

        {/* ═══ QUEUE BADGES ═══ */}
        {showQueues && queuePoints.filter(q => q.estimatedWaitSec > 0).map(q => (
          <g key={q.id} className={styles.queueBadge}>
            <rect x={q.position.x - 22} y={q.position.y - 10} width={44} height={20} rx={10}
              fill={queueStatusColor(q.status)} fillOpacity={0.9}
              stroke="rgba(0,0,0,0.3)" strokeWidth={0.5}
              filter="url(#shadow)" />
            <text x={q.position.x} y={q.position.y + 1} textAnchor="middle" dominantBaseline="middle"
              className={styles.queueText}>{Math.round(q.estimatedWaitSec / 60)}m</text>
          </g>
        ))}

        {/* ═══ STAFF PINS ═══ */}
        {showStaff && staffMembers.filter(s => s.availability !== 'offline').map(s => (
          <g key={s.id} className={styles.staffPin}>
            <circle cx={s.position.x} cy={s.position.y} r={12}
              fill={s.availability === 'idle' ? 'var(--accent-green)' : s.availability === 'busy' ? 'var(--accent-amber)' : 'var(--accent-blue)'}
              fillOpacity={0.85} stroke="white" strokeWidth={1.5} filter="url(#shadow)" />
            <text x={s.position.x} y={s.position.y + 1} textAnchor="middle" dominantBaseline="middle"
              className={styles.staffEmoji}>{s.avatar}</text>
          </g>
        ))}
      </svg>

      {/* ═══ TOOLTIP ═══ */}
      {tooltip && (
        <div className={styles.tooltip}
          style={{ left: tooltip.x + 16, top: tooltip.y - 10 }}>
          <div className={styles.tooltipTitle}>{tooltip.zone.name}</div>
          <div className={styles.tooltipRow}>
            <span>Capacity</span>
            <span>{Math.round(tooltip.zone.capacity * tooltip.zone.densityPct / 100)} / {tooltip.zone.capacity}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Density</span>
            <span className={styles[`density-${tooltip.zone.congestionLevel}`]}>{tooltip.zone.densityPct}%</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Status</span>
            <span className={styles[`density-${tooltip.zone.congestionLevel}`]}>{tooltip.zone.congestionLevel}</span>
          </div>
        </div>
      )}

      {/* ═══ LEGEND ═══ */}
      {!compact && (
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Density:</span>
          <div className={styles.legendScale}>
            {[
              { color: 'var(--heat-0)', label: 'Low' },
              { color: 'var(--heat-1)', label: '' },
              { color: 'var(--heat-2)', label: 'Med' },
              { color: 'var(--heat-3)', label: '' },
              { color: 'var(--heat-4)', label: 'Critical' },
            ].map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: item.color }} />
                {item.label && <span className={styles.legendText}>{item.label}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
