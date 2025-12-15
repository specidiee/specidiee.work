'use client';

import { Task } from '@/types/gtd';
import styles from './WeeklyCalendar.module.css';
import { format, startOfWeek, addDays, getDay, getHours, getMinutes, differenceInMinutes, isSameDay } from 'date-fns';
import { useMemo } from 'react';

interface WeeklyCalendarProps {
    tasks: Task[];
    startDate?: Date; // Start of the week view, default to today's week
    onEdit: (task: Task) => void;
    onToggleStatus?: (task: Task) => void;
}

export default function WeeklyCalendar({ tasks, startDate = new Date(), onEdit, onToggleStatus }: WeeklyCalendarProps) {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Filter tasks for this week
    const weekTasks = useMemo(() => {
        const weekEnd = addDays(weekStart, 7);
        return tasks.filter(task => {
            if (!task.scheduled_start) return false;
            const start = new Date(task.scheduled_start);
            return start >= weekStart && start < weekEnd;
        });
    }, [tasks, weekStart]);

    const getEventStyle = (task: Task) => {
        if (!task.scheduled_start || !task.scheduled_end) return {};

        const start = new Date(task.scheduled_start);
        const end = new Date(task.scheduled_end);

        // Calculate minutes from start of day (00:00)
        const startMinutes = getHours(start) * 60 + getMinutes(start);
        const duration = differenceInMinutes(end, start);

        // 1 hour = 60px
        const top = startMinutes * (60 / 60); // 1px per minute
        const height = duration * (60 / 60);

        return {
            top: `${top}px`,
            height: `${Math.max(height, 20)}px`, // Min height 20px
        };
    };

    const handleTaskClick = (e: React.MouseEvent, task: Task) => {
        if (task.type === 'FLEXIBLE') {
            onEdit(task);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        if (onToggleStatus) onToggleStatus(task);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerCell}>Time</div>
                {days.map(day => (
                    <div key={day.toISOString()} className={styles.headerCell}>
                        {format(day, 'EEE')} <br />
                        {format(day, 'MM/dd')}
                    </div>
                ))}
            </div>

            <div className={styles.scrollArea}>
                <div className={styles.grid}>
                    {/* Time Column */}
                    <div className={styles.timeCol}>
                        {hours.map(h => (
                            <div key={h} className={styles.timeLabel} style={{ top: `${h * 60}px` }}>
                                {h}:00
                            </div>
                        ))}
                    </div>

                    {/* Day Columns */}
                    {days.map(day => (
                        <div key={day.toISOString()} className={styles.dayCol}>
                            {weekTasks.filter(t => isSameDay(new Date(t.scheduled_start!), day)).map(task => (
                                <div
                                    key={task.id}
                                    className={`${styles.event} ${task.type === 'FIXED' ? styles.fixed : styles.flexible}`}
                                    style={{
                                        ...getEventStyle(task),
                                        opacity: task.status === 'DONE' ? 0.5 : 1,
                                    }}
                                    title={`${task.title} (${task.status})`}
                                    onClick={(e) => handleTaskClick(e, task)}
                                >
                                    <div className={styles.eventTitle}>
                                        {task.type === 'FLEXIBLE' && onToggleStatus && (
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'DONE'}
                                                onClick={(e) => handleCheckboxClick(e, task)}
                                                readOnly
                                                style={{ marginRight: '4px' }}
                                            />
                                        )}
                                        <span style={{ textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div className={styles.eventTime}>
                                        {format(new Date(task.scheduled_start!), 'HH:mm')} - {format(new Date(task.scheduled_end!), 'HH:mm')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
