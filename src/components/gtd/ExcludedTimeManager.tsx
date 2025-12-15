'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Assumes client-side supabase is available or we use API. 
// Using direct supabase client for simplicity in component per previous patterns? 
// No, previous patterns used API routes usually. 
// But we don't have an API route for excluded_times yet!
// I should use direct Client Supabase or create an API route. 
// Given the prompt "Create ... component", I'll use Client Supabase for speed if configured, 
// OR I can quickly scaffold an API route. 
// Let's use Client Component with `createClientComponentClient` if available, 
// OR simple fetch if I create the API.
// Wait, `src/lib/supabase.ts` exists. Let's assume it exports a client.
// Actually, it's safer to create a simple API route for this to abstract DB logic.

// Let's stick to the plan: "UI: ExcludedTimeManager component".
// I will fetch from a new API `/gtd/excluded`. 

import { useToast } from '@/contexts/ToastContext';

// Temporary: implementing client-side logic to call API.

import styles from './ExcludedTimeManager.module.css';

interface ExcludedTime {
    id: string;
    type: 'SLEEP' | 'MEAL' | 'TRAVEL' | 'OTHER';
    start_time: string;
    end_time: string;
}

export default function ExcludedTimeManager() {
    const { showToast } = useToast();
    const [items, setItems] = useState<ExcludedTime[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [type, setType] = useState<'SLEEP' | 'MEAL' | 'TRAVEL' | 'OTHER'>('MEAL');
    const [start, setStart] = useState('12:00');
    const [end, setEnd] = useState('13:00');

    const fetchItems = async () => {
        try {
            const res = await fetch('/gtd/excluded');
            if (res.ok) setItems(await res.json());
        } catch (e) {
            console.error(e);
            showToast('Failed to load excluded times', 'error');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!start || !end) return;
        await createExclusion(type, start, end);
        showToast('Exclusion added', 'success');
    };

    const createExclusion = async (t: string, s: string, e: string) => {
        setLoading(true);
        try {
            await fetch('/gtd/excluded', {
                method: 'POST',
                body: JSON.stringify({ type: t, start_time: s, end_time: e }),
                headers: { 'Content-Type': 'application/json' }
            });
            fetchItems();
        } catch (err) {
            console.error(err);
            showToast('Failed to add exclusion', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addDefaults = async () => {
        if (!confirm('Add default Lunch (12-13) and Dinner (18-19)?')) return;
        await createExclusion('MEAL', '12:00', '13:00');
        await createExclusion('MEAL', '18:00', '19:00');
        showToast('Default meals added', 'success');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this time?')) return;
        try {
            await fetch(`/gtd/excluded?id=${id}`, { method: 'DELETE' });
            fetchItems();
            showToast('Exclusion removed', 'info');
        } catch (e) {
            showToast('Failed to remove exclusion', 'error');
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                Excluded Times (Breaks)
                <button
                    onClick={addDefaults}
                    style={{ marginLeft: '1rem', fontSize: '0.8rem', padding: '2px 8px', cursor: 'pointer' }}
                >
                    + Add Default Meals
                </button>
            </h3>

            <div className={styles.list}>
                {items.map(item => (
                    <div key={item.id} className={styles.item}>
                        <span>{item.type == 'MEAL' ? '🍱' : item.type == 'SLEEP' ? '🛌' : '🚗'} {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</span>
                        <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>&times;</button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAdd} className={styles.form}>
                <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className={styles.select}
                >
                    <option value="MEAL">Meal</option>
                    <option value="TRAVEL">Travel</option>
                    <option value="SLEEP">Sleep</option>
                    <option value="OTHER">Other</option>
                </select>
                <input
                    type="time"
                    value={start}
                    onChange={e => setStart(e.target.value)}
                    className={styles.input}
                    required
                />
                <span>to</span>
                <input
                    type="time"
                    value={end}
                    onChange={e => setEnd(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" disabled={loading} className={styles.addBtn}>Add</button>
            </form>
        </div>
    );
}
