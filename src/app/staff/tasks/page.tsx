'use client';

import { Badge, Tabs } from '@/components/ui';
import { useStaffStore } from '@/lib/store';
import { useState } from 'react';
import styles from './tasksPage.module.css';

const priorityVariant = { urgent: 'danger' as const, high: 'warning' as const, medium: 'info' as const, low: 'neutral' as const };
const statusIcon: Record<string, string> = { pending: '⏳', assigned: '📌', accepted: '👍', in_progress: '🔄', completed: '✅' };

export default function TasksPage() {
  const tasks = useStaffStore((s) => s.tasks);
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? tasks : tasks.filter(t => t.status === tab);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Task Queue</h1>
      <Tabs
        items={[
          { id: 'all', label: `All (${tasks.length})`, icon: '📋' },
          { id: 'pending', label: 'Pending', icon: '⏳' },
          { id: 'in_progress', label: 'Active', icon: '🔄' },
          { id: 'completed', label: 'Done', icon: '✅' },
        ]}
        activeTab={tab}
        onChange={setTab}
      />
      {filtered.length === 0 && (
        <div className={styles.empty}>
          <span>📋</span>
          <p>{tasks.length === 0 ? 'Press ▶ to start — tasks generate automatically' : 'No tasks in this category'}</p>
        </div>
      )}
      <div className={styles.taskList}>
        {filtered.map((task) => (
          <div key={task.id} className={styles.taskItem}>
            <span className={styles.taskIcon}>{statusIcon[task.status] || '📋'}</span>
            <div className={styles.taskInfo}>
              <span className={styles.taskTitle}>{task.description}</span>
              <span className={styles.taskMeta}>{task.zoneId} · {task.status} · {task.agentSource}</span>
            </div>
            <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
