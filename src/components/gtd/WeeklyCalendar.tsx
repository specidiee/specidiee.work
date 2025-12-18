'use client';

import { Task } from '@/types/gtd';
import styles from './WeeklyCalendar.module.css';
import { format, startOfWeek, addDays, getDay, getHours, getMinutes, differenceInMinutes, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { useMemo } from 'react';

interface WeeklyCalendarProps {
    tasks: Task[];
    startDate?: Date; // Start of the week view, default to today's week
    onEdit: (task: Task) => void;
    onToggleStatus?: (task: Task) => void;
    onEmptySlotClick?: (date: Date) => void;
}

export default function WeeklyCalendar({ tasks, startDate = new Date(), onEdit, onToggleStatus, onEmptySlotClick }: WeeklyCalendarProps) {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Process tasks into daily segments
    const daySegments = useMemo(() => {
        const segments: Record<string, { task: Task, start: Date, end: Date }[]> = {};

        // Initialize arrays
        days.forEach(d => segments[d.toISOString()] = []);

        tasks.forEach(task => {
            if (!task.scheduled_start || !task.scheduled_end) return;

            const taskStart = new Date(task.scheduled_start);
            const taskEnd = new Date(task.scheduled_end);

            // Skip if out of week range roughly (optimization)
            // But we need to handle if it starts before week and ends in week, etc.
            // For simplicity, let's just process overlapping days.

            let current = new Date(taskStart);
            while (current < taskEnd) {
                const dayStart = startOfDay(current);
                const dayEnd = endOfDay(current);
                const segmentEnd = taskEnd < dayEnd ? taskEnd : dayEnd;

                // If segment is basically 0 length (e.g. ends exactly at 00:00 of next day), skip unless it's the only segment?
                // Actually 00:00 usually belongs to the next day start.
                // If task ends at 00:00 of Day 2, we shouldn't create a segment for Day 2 of length 0.
                if (current >= segmentEnd) break;

                // Find matching day in current view
                const matchingDay = days.find(d => isSameDay(d, current));
                if (matchingDay) {
                    segments[matchingDay.toISOString()].push({
                        task,
                        start: current,
                        end: segmentEnd
                    });
                }

                // Move to next day
                current = addDays(dayStart, 1);
            }
        });

        return segments;
    }, [tasks, days]);

    const handleTaskClick = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        onEdit(task);
    };

    const handleCheckboxClick = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        if (onToggleStatus) {
            onToggleStatus(task);
        }
    };

    const getSegmentStyle = (start: Date, end: Date) => {
        const startMinutes = getHours(start) * 60 + getMinutes(start);
        const duration = differenceInMinutes(end, start);

        const top = startMinutes; // 1px per minute
        // If it goes to 23:59:59, duration might be slightly off due to ms? 
        // differenceInMinutes handles it well. 
        // If it's a full day segment (00:00 to 24:00), it's 1440 mins.

        return {
            top: `${top}px`,
            height: `${Math.max(duration, 20)}px`,
        };
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
                        <div
                            key={day.toISOString()}
                            className={styles.dayCol}
                            onClick={(e) => {
                                // Calculate time from click
                                if (onEmptySlotClick) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const y = e.clientY - rect.top;
                                    const minutes = Math.floor(y); // 1px = 1min
                                    // Round to nearest 15
                                    const roundedMinutes = Math.round(minutes / 15) * 15;

                                    const clickedDate = new Date(day);
                                    clickedDate.setHours(0, roundedMinutes, 0, 0);

                                    onEmptySlotClick(clickedDate);
                                }
                            }}
                        >
                            {daySegments[day.toISOString()]?.map((segment, idx) => (
                                <div
                                    key={`${segment.task.id}-${idx}`}
                                    className={`${styles.event} ${segment.task.type === 'FIXED' ? styles.fixed : styles.flexible}`}
                                    style={{
                                        ...getSegmentStyle(segment.start, segment.end),
                                        opacity: segment.task.status === 'DONE' ? 0.5 : 1,
                                    }}
                                    title={`${segment.task.title} (${segment.task.status})`}
                                    onClick={(e) => handleTaskClick(e, segment.task)}
                                >
                                    <div className={styles.eventTitle}>
                                        {segment.task.type === 'FLEXIBLE' && onToggleStatus && (
                                            <input
                                                type="checkbox"
                                                checked={segment.task.status === 'DONE'}
                                                onClick={(e) => handleCheckboxClick(e, segment.task)}
                                                readOnly
                                                style={{ marginRight: '4px' }}
                                            />
                                        )}
                                        <span style={{ textDecoration: segment.task.status === 'DONE' ? 'line-through' : 'none' }}>
                                            {segment.task.title}
                                        </span>
                                    </div>
                                    <div className={styles.eventTime}>
                                        {format(segment.start, 'HH:mm')} - {format(segment.end, 'HH:mm')}
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
