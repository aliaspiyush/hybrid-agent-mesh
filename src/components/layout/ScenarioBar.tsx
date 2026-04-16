'use client';

import React from 'react';
import { useScenarioStore } from '@/lib/store';
import type { ScenarioPhase } from '@/lib/types';
import styles from './scenarioBar.module.css';

const phaseLabels: Record<ScenarioPhase, string> = {
  pre_event: '🏟️ Pre-Event',
  ingress: '🚪 Ingress',
  normal_play: '⚽ Normal Play',
  halftime_rush: '🔥 Halftime Rush',
  second_half: '⚽ Second Half',
  egress: '🚶 Egress',
  post_event: '🏁 Post-Event',
};

const phaseOrder: ScenarioPhase[] = [
  'pre_event', 'ingress', 'normal_play', 'halftime_rush', 'second_half', 'egress', 'post_event',
];

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function ScenarioBar() {
  const { phase, elapsedMinutes, speed, isPaused, arrivedCount, totalAttendees, start, pause, resume, setSpeed, skipToPhase, reset } = useScenarioStore();

  const progress = Math.min((elapsedMinutes / 195) * 100, 100);
  const phaseIndex = phaseOrder.indexOf(phase);

  return (
    <div className={styles.bar}>
      <div className={styles.barInner}>
        {/* Phase & Time */}
        <div className={styles.phaseSection}>
          <span className={styles.phaseLabel}>{phaseLabels[phase]}</span>
          <span className={styles.elapsed}>{formatTime(elapsedMinutes)}</span>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            {phaseOrder.map((p, i) => (
              <button
                key={p}
                className={`${styles.phaseDot} ${i <= phaseIndex ? styles.phaseDotActive : ''} ${p === phase ? styles.phaseDotCurrent : ''}`}
                style={{ left: `${(i / (phaseOrder.length - 1)) * 100}%` }}
                onClick={() => skipToPhase(p)}
                title={phaseLabels[p]}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {isPaused ? (
            <button className={styles.playBtn} onClick={elapsedMinutes === 0 ? start : resume} title="Play">
              ▶
            </button>
          ) : (
            <button className={styles.pauseBtn} onClick={pause} title="Pause">
              ⏸
            </button>
          )}

          <div className={styles.speedGroup}>
            {([1, 2, 5, 10] as const).map((s) => (
              <button
                key={s}
                className={`${styles.speedBtn} ${speed === s ? styles.speedBtnActive : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>

          <button className={styles.resetBtn} onClick={reset} title="Reset">
            ↺
          </button>
        </div>

        {/* Attendance Counter */}
        <div className={styles.attendance}>
          <span className={styles.attendanceIcon}>👥</span>
          <span className={styles.attendanceValue}>
            {arrivedCount.toLocaleString()}
          </span>
          <span className={styles.attendanceTotal}>/ {totalAttendees.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
