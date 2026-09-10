import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface TaskItem {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Overdue';
  leadName?: string;
  type?: 'call' | 'followup' | 'demo' | 'proposal';
}

interface TodaysTasksCardProps {
  initialTasks?: TaskItem[];
  onViewAll?: () => void;
}

export const TodaysTasksCard: React.FC<TodaysTasksCardProps> = ({
  initialTasks = [
    { id: '1', title: 'Call Rahul Sharma', subtitle: 'Acme Technologies', time: '10:30 AM', status: 'Completed', leadName: 'Rahul Sharma', type: 'call' },
    { id: '2', title: 'Follow up with Priya', subtitle: 'TechNova Solutions', time: '11:30 AM', status: 'Pending', leadName: 'Priya Mehta', type: 'followup' },
    { id: '3', title: 'Demo with FinCorp', subtitle: 'Arjun Patel', time: '02:00 PM', status: 'Pending', leadName: 'Arjun Patel', type: 'demo' },
    { id: '4', title: 'Send proposal to Neha', subtitle: 'StartupX', time: '04:00 PM', status: 'Pending', leadName: 'Neha Shah', type: 'proposal' }
  ],
  onViewAll
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      )
    );
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        backgroundColor: isLight ? '#FFFFFF' : undefined,
        border: isLight ? '1px solid #E2E8F0' : undefined,
        boxShadow: isLight ? '0 2px 12px rgba(0, 0, 0, 0.03)' : undefined
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Today's Tasks
        </div>
        <a
          href="#/staff/calls"
          onClick={e => {
            if (onViewAll) {
              e.preventDefault();
              onViewAll();
            }
          }}
          className="btn-ghost btn-sm"
          style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.45rem',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none'
          }}
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </a>
      </div>

      {/* Task Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {tasks.map(task => {
          const isCompleted = task.status === 'Completed';

          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isCompleted
                  ? (isLight ? '#ECFDF5' : 'rgba(79, 242, 176, 0.04)')
                  : (isLight ? '#F8FAF9' : 'rgba(255, 255, 255, 0.02)'),
                border: isCompleted
                  ? (isLight ? '1px solid #A7F3D0' : '1px solid rgba(79, 242, 176, 0.2)')
                  : (isLight ? '1px solid #E2E8F0' : '1px solid var(--border-subtle)'),
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Circular checkbox */}
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: isCompleted
                      ? '1.5px solid var(--brand-primary)'
                      : (isLight ? '1.5px solid #CBD5E1' : '1.5px solid var(--border-medium)'),
                    backgroundColor: isCompleted ? 'var(--brand-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isLight ? '#FFFFFF' : '#06110F',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    boxShadow: isCompleted ? '0 0 6px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  {isCompleted && <Check size={11} strokeWidth={3} />}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: isCompleted ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </div>
                  {task.subtitle && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {task.subtitle}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {task.time}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor:
                      task.status === 'Completed'
                        ? (isLight ? '#D1FAE5' : 'rgba(16, 185, 129, 0.15)')
                        : task.status === 'Overdue'
                        ? (isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)')
                        : (isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.05)'),
                    color:
                      task.status === 'Completed'
                        ? (isLight ? '#065F46' : '#10b981')
                        : task.status === 'Overdue'
                        ? (isLight ? '#DC2626' : '#ef4444')
                        : (isLight ? '#64748B' : 'var(--text-muted)')
                  }}
                >
                  {task.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
