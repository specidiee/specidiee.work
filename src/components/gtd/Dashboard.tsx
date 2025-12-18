'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import WeeklyCalendar from './WeeklyCalendar';
import TodaySchedule from './TodaySchedule';
import ExcludedTimeModal from './ExcludedTimeModal';
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

    const { showToast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const res = await fetch(`/gtd/tasks/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchTasks();
                showToast('Task deleted', 'info');
            } else {
                showToast('Failed to delete task', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Error deleting task', 'error');
        }
    };

    const [showBreaks, setShowBreaks] = useState(false);

    const handleAutoSchedule = async () => {
        try {
            const res = await fetch('/gtd/schedule', { method: 'POST' });
            const data = await res.json();
            showToast(`Scheduled ${data.scheduled} tasks, Postponed ${data.postponed} tasks`, 'success');
            fetchTasks();
        } catch (e) {
            showToast('Scheduling failed', 'error');
        }
    };

    const handleSync = async () => {
        try {
            const res = await fetch('/gtd/settings/sync', { method: 'POST' });
            if (res.ok) {
                showToast('Sync successful', 'success');
                fetchTasks();
            } else {
                showToast('Sync failed', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Sync failed', 'error');
        }
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.title} style={{ marginBottom: 0 }}>Specidiee GTD Dashboard</h1>
                <div className={styles.headerActions}>
                    <button onClick={handleAutoSchedule} className={`${styles.actionButton} ${styles.btnPrimary}`}>
                        Autoschedule
                    </button>
                    <button onClick={handleSync} className={`${styles.actionButton} ${styles.btnSecondary}`}>
                        Google Calendar Sync
                    </button>
                    <button onClick={() => setShowBreaks(true)} className={`${styles.actionButton} ${styles.btnOutline}`}>
                        Configure Breaks
                    </button>
                </div>
            </div>

            <ExcludedTimeModal isOpen={showBreaks} onClose={() => setShowBreaks(false)} />

            <div className={styles.section}>
                <h2 className={styles.subtitle}>{editingTask ? (editingTask.id ? 'Edit Task' : 'New Fixed Task') : 'Add New Task'}</h2>
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
                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <>
                        <div className={styles.splitRow}>
                            <div className={styles.todayCol}>
                                <TodaySchedule
                                    tasks={tasks}
                                    onEdit={setEditingTask}
                                    onToggleStatus={handleStatusToggle}
                                    onDelete={handleDelete}
                                />
                            </div>
                            <div className={styles.backlogCol}>
                                <h3 className={styles.subtitle}>Backlog (Unscheduled)</h3>
                                <TaskList
                                    tasks={tasks.filter(t => t.type === 'FLEXIBLE' && !t.scheduled_start)}
                                    onRefresh={fetchTasks}
                                    onEdit={(task) => {
                                        setEditingTask(task);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    onAdd={() => {
                                        setEditingTask(undefined);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    onToggleStatus={handleStatusToggle}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>

                        <div className={styles.calendarRow}>
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
                                onEmptySlotClick={(date) => {
                                    setEditingTask({
                                        title: '',
                                        type: 'FIXED',
                                        estimated_minutes: 30,
                                        scheduled_start: date.toISOString(),
                                        // scheduled_end will be calc in TaskForm or we can set it here?
                                        // TaskForm logic handles 'scheduled_start' prop now.
                                        status: 'TODO'
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
