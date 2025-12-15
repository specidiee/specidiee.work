'use client';

import { Task } from '@/types/gtd';
import { format } from 'date-fns';
import styles from './TaskList.module.css';

import { useToast } from '@/contexts/ToastContext';

interface TaskListProps {
    tasks: Task[];
    onRefresh: () => void;
    onEdit: (task: Task) => void;
    onToggleStatus?: (task: Task) => void;
}

export default function TaskList({ tasks, onRefresh, onEdit, onToggleStatus }: TaskListProps) {
    const { showToast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const res = await fetch(`/gtd/tasks/${id}`, { method: 'DELETE' });
            if (res.ok) {
                onRefresh();
                showToast('Task deleted', 'info');
            } else {
                showToast('Failed to delete task', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Error deleting task', 'error');
        }
    };


    const handleSchedule = async () => {
        try {
            const res = await fetch('/gtd/schedule', { method: 'POST' });
            const data = await res.json();
            showToast(`Scheduled ${data.scheduled} tasks, Postponed ${data.postponed} tasks`, 'success');
            onRefresh();
        } catch (e) {
            showToast('Scheduling failed', 'error');
        }
    };

    // The statusColors object is no longer needed as CSS module classes are used directly.
    // It has been removed as per the instruction's implied change.

    return (
        <div className={styles.list}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Current Tasks</h2>
                <button
                    onClick={handleSchedule}
                    className={styles.scheduleButton}
                >
                    Run Auto-Schedule
                </button>
            </div>

            <div className={styles.taskList}> {/* Changed from styles.list to styles.taskList to avoid conflict with outer div */}
                {tasks.map((task) => (
                    <div key={task.id} className={styles.card}>
                        <div className={styles.cardContent}>
                            <div className={styles.titleRow}>
                                {onToggleStatus && (
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'DONE'}
                                        onChange={() => onToggleStatus(task)}
                                        style={{ marginRight: '0.5rem', width: '1.2rem', height: '1.2rem' }}
                                    />
                                )}
                                <span className={`${styles.status} ${styles['status_' + task.status]}`}>
                                    {task.status}
                                </span>
                                <h3 className={styles.taskTitle} style={{ textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>
                                    {task.title}
                                </h3>
                            </div>
                            <div className={styles.meta}>
                                <span>Priority: {task.priority}</span>
                                <span>Est: {task.estimated_minutes}m</span>
                                <span>Type: {task.type}</span>
                            </div>
                            {(task.scheduled_start && task.scheduled_end) && (
                                <div className={styles.scheduled}>
                                    Scheduled: {format(new Date(task.scheduled_start), 'HH:mm')} - {format(new Date(task.scheduled_end), 'HH:mm')}
                                </div>
                            )}
                            {task.predecessors && task.predecessors.length > 0 && (
                                <div className={styles.dependencies}>
                                    Requires: {task.predecessors.map(predId => tasks.find(t => t.id === predId)?.title || 'Unknown').join(', ')}
                                </div>
                            )}
                        </div>
                        <div className={styles.actions}>
                            <button onClick={() => onEdit(task)} className={styles.editButton}>Edit</button>
                            <button onClick={() => handleDelete(task.id)} className={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className={styles.emptyState}>No tasks found. Add one above!</p>
                )}
            </div>
        </div>
    );
}
