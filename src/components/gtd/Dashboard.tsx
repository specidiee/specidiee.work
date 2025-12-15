'use client';

import { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import WeeklyCalendar from './WeeklyCalendar';
import ExcludedTimeManager from './ExcludedTimeManager';
import { Task } from '@/types/gtd';
import styles from './Dashboard.module.css'; // Added import for CSS Modules



export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<any>(undefined);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await fetch('/gtd/tasks');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskCreated = () => {
        fetchTasks();
        setEditingTask(undefined);
    };

    const handleStatusToggle = async (task: Task) => {
        const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
        try {
            await fetch(`/gtd/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    const [viewDate, setViewDate] = useState(new Date());

    const handleNextWeek = () => {
        const next = new Date(viewDate);
        next.setDate(viewDate.getDate() + 7);
        setViewDate(next);
    };

    const handlePrevWeek = () => {
        const prev = new Date(viewDate);
        prev.setDate(viewDate.getDate() - 7);
        setViewDate(prev);
    };

    const handleToday = () => {
        setViewDate(new Date());
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className={styles.title}>Specidiee GTD Dashboard</h1>
                <a href="/gtd/settings" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>⚙️</a>
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                <TaskForm onTaskCreated={handleTaskCreated} taskToEdit={editingTask} />
                {editingTask && (
                    <button
                        onClick={() => setEditingTask(undefined)}
                        style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Cancel Edit
                    </button>
                )}
            </div>

            <div className={styles.section}>
                <ExcludedTimeManager />
            </div>

            <div className={styles.section}>
                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <div className={styles.dashboardGrid}>
                        <div>
                            <h3 className={styles.subtitle}>Backlog (Unscheduled)</h3>
                            <TaskList
                                tasks={tasks.filter(t => t.type === 'FLEXIBLE' && !t.scheduled_start)}
                                onRefresh={fetchTasks}
                                onEdit={setEditingTask}
                                onToggleStatus={handleStatusToggle}
                            />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 className={styles.subtitle} style={{ marginBottom: 0 }}>Weekly Schedule</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={handlePrevWeek} className={styles.navButton}>&lt;</button>
                                    <button onClick={handleToday} className={styles.navButton}>Today</button>
                                    <button onClick={handleNextWeek} className={styles.navButton}>&gt;</button>
                                </div>
                            </div>
                            <WeeklyCalendar
                                tasks={tasks}
                                startDate={viewDate}
                                onEdit={setEditingTask}
                                onToggleStatus={handleStatusToggle}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
