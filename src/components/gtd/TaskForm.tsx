'use client';

import { useState, useEffect } from 'react';
import { CreateTaskDTO, Task } from '@/types/gtd';
import styles from './TaskForm.module.css';
import { format } from 'date-fns';
import { useToast } from '@/contexts/ToastContext';

export default function TaskForm({ onTaskCreated, taskToEdit }: { onTaskCreated: () => void; taskToEdit?: CreateTaskDTO & { id?: string } }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'FLEXIBLE' | 'FIXED'>('FLEXIBLE');
    const [priority, setPriority] = useState(3);
    const [estimated, setEstimated] = useState(30);
    const [travel, setTravel] = useState(0);
    const [scheduledStart, setScheduledStart] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedPredecessors, setSelectedPredecessors] = useState<string[]>([]);
    const [showPredecessors, setShowPredecessors] = useState(false);
    const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setType(taskToEdit.type as any);
            setPriority(taskToEdit.priority || 3);
            setEstimated(taskToEdit.estimated_minutes);
            setTravel((taskToEdit as any).travel_time_minutes || 0);
            setScheduledStart(taskToEdit.scheduled_start ? format(new Date(taskToEdit.scheduled_start), "yyyy-MM-dd'T'HH:mm") : '');
            setDeadline(taskToEdit.deadline ? format(new Date(taskToEdit.deadline), "yyyy-MM-dd'T'HH:mm") : '');
            setSelectedPredecessors(taskToEdit.predecessors || []);
            if (taskToEdit.predecessors && taskToEdit.predecessors.length > 0) {
                setShowPredecessors(true);
            }
        } else {
            setTitle('');
            setDescription('');
            setType('FLEXIBLE');
            setPriority(3);
            setEstimated(30);
            setTravel(0);
            setScheduledStart('');
            setDeadline('');
            setSelectedPredecessors([]);
            setShowPredecessors(false);
        }
    }, [taskToEdit]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/gtd/tasks');
                if (res.ok) {
                    const data: Task[] = await res.json();
                    setAvailableTasks(data);
                }
            } catch (error) {
                console.error('Failed to load tasks', error);
                showToast('Failed to load tasks', 'error');
            }
        };
        fetchTasks();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: Partial<CreateTaskDTO> = {
            title,
            description,
            type,
            priority,
            estimated_minutes: estimated,
            travel_time_minutes: travel,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            scheduled_start: (type === 'FIXED' && scheduledStart) ? new Date(scheduledStart).toISOString() : undefined,
            scheduled_end: (type === 'FIXED' && scheduledStart) ? new Date(new Date(scheduledStart).getTime() + estimated * 60000).toISOString() : undefined,
            predecessors: selectedPredecessors,
            status: (taskToEdit && taskToEdit.id) ? undefined : 'TODO'
        };

        try {
            const isEdit = taskToEdit && taskToEdit.id;
            const url = isEdit ? `/gtd/tasks/${taskToEdit.id}` : '/gtd/tasks';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || `Failed to ${isEdit ? 'update' : 'create'} task`);
            }

            if (!isEdit) {
                setTitle('');
                setDescription('');
                setType('FLEXIBLE');
                setPriority(3);
                setEstimated(30);
                setTravel(0);
                setScheduledStart('');
                setDeadline('');
                setSelectedPredecessors([]);
                setShowPredecessors(false);
            }

            onTaskCreated();
            showToast(`Task ${taskToEdit ? 'updated' : 'created'} successfully`, 'success');

            const tasksRes = await fetch('/gtd/tasks');
            if (tasksRes.ok) setAvailableTasks(await tasksRes.json());

        } catch (error: any) {
            console.error(error);
            showToast(error.message || `Error ${taskToEdit ? 'updating' : 'creating'} task`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const predecessorOptions = availableTasks.filter(t =>
        t.type === 'FLEXIBLE' &&
        t.priority === priority &&
        t.status !== 'DONE'
    );

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Task Title</label>
                    <input
                        type="text"
                        required
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        placeholder="What needs to be done?"
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className={styles.select}
                    >
                        <option value="FLEXIBLE">Flexible (Auto-Scheduled)</option>
                        <option value="FIXED">Fixed (Time-Constrained)</option>
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Priority (1-5)</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value))}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Est. Minutes</label>
                    <input
                        type="number"
                        step="15"
                        value={estimated}
                        onChange={(e) => setEstimated(parseInt(e.target.value))}
                        className={styles.input}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {Math.floor(estimated / 60)}h {estimated % 60}m
                    </div>
                </div>
            </div>

            <div className={styles.row}>
                {type === 'FIXED' ? (
                    <div className={styles.field}>
                        <label className={styles.label}>Start Time</label>
                        <input
                            type="datetime-local"
                            value={scheduledStart}
                            onChange={(e) => setScheduledStart(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                ) : (
                    <div className={styles.field}>
                        <label className={styles.label}>Deadline (Optional)</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                )}
                <div className={styles.field}>
                    <label className={styles.label}>Travel Buffer (min) - Before & After</label>
                    <input
                        type="number"
                        min="0"
                        step="15"
                        value={travel}
                        onChange={(e) => setTravel(parseInt(e.target.value))}
                        className={styles.input}
                    />
                </div>
            </div>

            {
                type === 'FLEXIBLE' && predecessorOptions.length > 0 && (
                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            onClick={() => setShowPredecessors(!showPredecessors)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}
                        >
                            <span>Prerequisites (Same Priority Only)</span>
                            <span style={{ fontSize: '0.75rem' }}>{showPredecessors ? '▲' : '▼'}</span>
                        </label>
                        {showPredecessors && (
                            <div className={styles.chipContainer}>
                                {predecessorOptions.map(t => {
                                    const isSelected = selectedPredecessors.includes(t.id);
                                    return (
                                        <div
                                            key={t.id}
                                            className={`${styles.chip} ${isSelected ? styles.selected : ''}`}
                                            onClick={() => {
                                                const current = selectedPredecessors;
                                                const next = current.includes(t.id)
                                                    ? current.filter(id => id !== t.id)
                                                    : [...current, t.id];
                                                setSelectedPredecessors(next);
                                            }}
                                        >
                                            {t.title}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )
            }

            <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.textarea}
                    placeholder="Cmd+Enter to submit"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
            >
                {loading ? 'Creating...' : 'Add Task'}
            </button>
        </form >
    );
}
