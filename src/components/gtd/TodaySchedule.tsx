'use client';

import { Task } from '@/types/gtd';
import { format, isSameDay } from 'date-fns';
import styles from './TaskList.module.css'; // Reusing TaskList styles for consistency

interface TodayScheduleProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onToggleStatus?: (task: Task) => void;
    onDelete?: (id: string) => void;
}

export default function TodaySchedule({ tasks, onEdit, onToggleStatus, onDelete }: TodayScheduleProps) {
    const today = new Date();

    // Filter and sort tasks for today
    const todayTasks = tasks
        .filter(t => t.scheduled_start && isSameDay(new Date(t.scheduled_start), today))
        .sort((a, b) => new Date(a.scheduled_start!).getTime() - new Date(b.scheduled_start!).getTime());

    return (
        <div className={styles.list}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Today's Schedule</h2>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {format(today, 'MMM dd, yyyy')}
                </div>
            </div>

            <div className={styles.taskList}>
                {todayTasks.map((task) => (
                    <div key={task.id} className={styles.card} style={{ borderLeft: `4px solid ${task.type === 'FIXED' ? '#2196F3' : '#4CAF50'}` }}>
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
                                <span className={styles.timeSlot} style={{ fontWeight: 'bold', marginRight: '0.5rem', minWidth: '80px', display: 'inline-block' }}>
                                    {format(new Date(task.scheduled_start!), 'HH:mm')}
                                </span>
                                <h3 className={styles.taskTitle} style={{ textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>
                                    {task.title}
                                </h3>
                            </div>
                            <div className={styles.meta} style={{ marginLeft: '1.7rem' }}>
                                <span>~ {format(new Date(task.scheduled_end!), 'HH:mm')}</span>
                                {task.type === 'FIXED' && <span style={{ marginLeft: '10px', color: '#2196F3' }}>[Fixed]</span>}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button onClick={() => onEdit(task)} className={styles.editButton}>Edit</button>
                            {onDelete && <button onClick={() => onDelete(task.id)} className={styles.deleteButton}>Delete</button>}
                        </div>
                    </div>
                ))}
                {todayTasks.length === 0 && (
                    <p className={styles.emptyState}>No tasks scheduled for today.</p>
                )}
            </div>
        </div>
    );
}
