'use client';

import { useState, useEffect } from 'react';

import { KpiCard, Badge, AiInsightCard } from '@/components/ui';
import { useStaffStore, useScenarioStore, useIncidentStore } from '@/lib/store';
import styles from './staffPage.module.css';

const priorityVariant = { urgent: 'danger' as const, high: 'warning' as const, medium: 'info' as const, low: 'neutral' as const };

export default function StaffDashboard() {
  const tasks = useStaffStore((s) => s.tasks);
  const phase = useScenarioStore((s) => s.phase);

  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const currentTask = activeTasks[0];

  const incidentInsight = useIncidentStore(s => s.aiInsight);
  const clearIncidentInsight = useIncidentStore(s => s.clearAiInsight);

  const aiLoading = useIncidentStore(s => s.aiLoading);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Good evening, Alex</h1>
          <p className={styles.subtitle}>North Zone · Security Detail</p>
        </div>
        <Badge variant="success">On Duty</Badge>
      </div>

      {incidentInsight && (
        <AiInsightCard
          title="Incident Classification AI"
          content={`Suggested Action: ${incidentInsight.suggestedAction} ${incidentInsight.escalate ? '(ESCALATE)' : ''}`}
          alertLevel={incidentInsight.alertLevel}
          onDismiss={clearIncidentInsight}
        />
      )}

      <div className={styles.kpiRow}>
        <KpiCard label="Active Tasks" value={String(activeTasks.length)} icon="📋" accentColor="var(--accent-amber)" isLoading={aiLoading} />
        <KpiCard label="Completed" value={String(completedTasks.length)} icon="✅" accentColor="var(--accent-green)" isLoading={aiLoading} />
        <KpiCard label="Pending" value={String(pendingTasks.length)} icon="⏳" accentColor="var(--accent-blue)" isLoading={aiLoading} />
      </div>

      {currentTask ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Current Assignment</h2>
          <div className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <Badge variant={priorityVariant[currentTask.priority]} pulse={currentTask.priority === 'urgent'}>
                {currentTask.priority}
              </Badge>
              <span className={styles.taskTime}>{Math.round((now - currentTask.createdAt) / 1000)}s ago</span>
            </div>
            <h3 className={styles.taskTitle}>{currentTask.description}</h3>
            <p className={styles.taskDesc}>Zone: {currentTask.zoneId} · Status: {currentTask.status}</p>
            <div className={styles.taskActions}>
              <button className={styles.taskBtn} data-variant="primary">Accept & Navigate</button>
              <button className={styles.taskBtn} data-variant="secondary">Decline</button>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Current Assignment</h2>
          <div className={styles.emptyTask}>
            <span>✅</span>
            <p>No active tasks — {phase === 'pre_event' ? 'press ▶ to start scenario' : 'standing by'}</p>
          </div>
        </section>
      )}

      {tasks.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Tasks</h2>
          <div className={styles.taskList}>
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className={styles.taskListItem}>
                <div className={styles.taskListIcon}>
                  {task.status === 'completed' ? '✅' : task.status === 'in_progress' ? '🔄' : task.status === 'assigned' ? '📌' : '⏳'}
                </div>
                <div className={styles.taskListContent}>
                  <div className={styles.taskListTitle}>{task.description}</div>
                  <div className={styles.taskListMeta}>{task.zoneId} · {task.status}</div>
                </div>
                <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
