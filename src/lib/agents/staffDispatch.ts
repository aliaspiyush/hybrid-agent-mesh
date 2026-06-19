import type { StaffMember, Task, Zone, Alert } from '@/lib/types';

/**
 * Staff Dispatch Agent — auto-assigns tasks when zones go critical, manages staff positions.
 */

let taskIdCounter = 100;

function generateTaskId(): string {
  return `task-${++taskIdCounter}`;
}

function generateAlertId(): string {
  return `alert-staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const taskTemplates: Record<string, { description: string; type: Task['type']; priority: Task['priority'] }> = {
  crowd_critical: { description: 'Critical crowd density — assist with flow control', type: 'dispatch', priority: 'urgent' },
  crowd_high: { description: 'High crowd density — monitor and redirect', type: 'dispatch', priority: 'high' },
  queue_overload: { description: 'Queue overloaded — open additional service lane', type: 'restock', priority: 'high' },
  restroom_issue: { description: 'Restroom capacity exceeded — maintenance check needed', type: 'maintenance', priority: 'medium' },
};

export function evaluateStaffDispatch(
  staff: StaffMember[],
  tasks: Task[],
  zones: Zone[]
): { staff: StaffMember[]; tasks: Task[]; newAlerts: Alert[] } {
  const newAlerts: Alert[] = [];
  const newTasks = [...tasks];
  const updatedStaff = staff.map(s => ({ ...s }));

  // Auto-complete old tasks (simulate completion after some ticks)
  for (const task of newTasks) {
    if (task.status === 'in_progress' && task.createdAt < Date.now() - 30000) {
      task.status = 'completed';
      task.completedAt = Date.now();
      const assignee = updatedStaff.find(s => s.id === task.assignedTo);
      if (assignee) assignee.availability = 'idle';
    }
    if (task.status === 'accepted') {
      task.status = 'in_progress';
    }
    if (task.status === 'assigned' && task.createdAt < Date.now() - 5000) {
      task.status = 'accepted';
      const assignee = updatedStaff.find(s => s.id === task.assignedTo);
      if (assignee) assignee.availability = 'busy';
    }
  }

  // Generate new tasks for critical zones (limit to avoid spam)
  const pendingOrActive = newTasks.filter(t => t.status !== 'completed').length;
  if (pendingOrActive < 6) {
    const criticalZones = zones.filter(z =>
      z.congestionLevel === 'critical' &&
      z.id !== 'field' &&
      !newTasks.some(t => t.zoneId === z.id && t.status !== 'completed')
    );

    for (const zone of criticalZones.slice(0, 2)) {
      const template = taskTemplates.crowd_critical;
      const idleStaff = updatedStaff.find(s =>
        s.availability === 'idle' && s.shiftStatus === 'on_duty'
      );

      const task: Task = {
        id: generateTaskId(),
        type: template.type,
        priority: template.priority,
        status: idleStaff ? 'assigned' : 'pending',
        description: `${template.description} at ${zone.name}`,
        zoneId: zone.id,
        assignedTo: idleStaff?.id || null,
        createdAt: Date.now(),
        completedAt: null,
        agentSource: 'staff_dispatch',
      };

      newTasks.push(task);

      if (idleStaff) {
        idleStaff.availability = 'en_route';
        idleStaff.currentZoneId = zone.id;
      }

      newAlerts.push({
        id: generateAlertId(),
        agentId: 'staff_dispatch',
        severity: 'warning',
        message: `Task dispatched: ${zone.name} — ${template.description}`,
        zoneId: zone.id,
        timestamp: Date.now(),
        acknowledged: false,
      });
    }
  }

  // Keep only recent tasks (last 20)
  const sortedTasks = newTasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);

  return { staff: updatedStaff, tasks: sortedTasks, newAlerts };
}
