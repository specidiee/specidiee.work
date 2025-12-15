import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchCalendarEvents } from '@/lib/google';
import { Task } from '@/types/gtd';

export async function POST() {
    try {
        const now = new Date();

        const past = new Date();
        past.setDate(now.getDate() - 28);

        const future = new Date();
        future.setDate(now.getDate() + 28);

        const events = await fetchCalendarEvents(past, future);

        const upserts = events.map((event: any) => {
            const start = event.start.dateTime || event.start.date; // dateTime for timed, date for all-day
            const end = event.end.dateTime || event.end.date;

            // Skip all-day events for now if they don't have time? 
            // Or treat them as 00:00-23:59? 
            // All-day usually comes as YYYY-MM-DD.
            // Let's assume we focus on timed events for scheduling blocks. 
            // If it's all-day, maybe ignore or block whole day?
            // For MVP, let's ignore all-day events if they lack dateTime to avoid timezone complexity mess for now, 
            // unless user wants them. Let's include them but with care.
            // Actually, `event.start.dateTime` is present for non-all-day.

            if (!event.start.dateTime) {
                return null; // Skip all-day events for this prototype to avoid blocking whole day accidentally
            }

            return {
                title: event.summary || '(No Title)',
                description: event.description || '',
                type: 'FIXED',
                priority: 5, // Fixed tasks are high priority constraints
                estimated_minutes: (new Date(end).getTime() - new Date(start).getTime()) / 60000,
                status: 'TODO',
                scheduled_start: start,
                scheduled_end: end,
                // We use google_event_id to deduplicate/update
                google_event_id: event.id,
                updated_at: new Date().toISOString(),
                // If it's a new task, we need created_at. Upsert handles this if we include it? 
                // Supabase upsert needs a conflict target. We'll verify this shortly.
            };
        }).filter(Boolean);

        if (upserts.length === 0) {
            return NextResponse.json({ message: 'No events to sync', count: 0 });
        }

        // We need to upsert. 
        // Supabase `upsert` works if we satisfy a UNIQUE constraint.
        // We added `google_event_id` but didn't make it UNIQUE in SQL (just indexed).
        // Wait, the SQL was: `ALTER TABLE tasks ADD COLUMN google_event_id TEXT; CREATE INDEX ...`
        // It is NOT unique. So `upsert` won't work on `google_event_id` unless we check existing.
        // We should have made it Unique.
        // Strategy: 
        // 1. Fetch existing fixed tasks with google_event_id.
        // 2. Map them.
        // 3. Prepare updates vs inserts.

        // Alternatively, I can ask user to run SQL to make it unique? 
        // Or just handle it in code:

        const googleEventIds = upserts.map((u: any) => u.google_event_id);

        const { data: existingTasks, error: fetchError } = await supabase
            .from('tasks')
            .select('id, google_event_id')
            .in('google_event_id', googleEventIds);

        if (fetchError) throw fetchError;

        const existingMap = new Map(existingTasks?.map(t => [t.google_event_id, t.id]));

        const toInsert = [];
        const toUpdate = [];

        for (const up of upserts) {
            if (existingMap.has(up.google_event_id)) {
                // Update
                toUpdate.push({
                    ...up,
                    id: existingMap.get(up.google_event_id)
                });
            } else {
                // Insert
                toInsert.push({
                    ...up,
                    created_at: new Date().toISOString()
                });
            }
        }

        const errors = [];

        if (toInsert.length > 0) {
            const { error } = await supabase.from('tasks').insert(toInsert);
            if (error) errors.push(error);
        }

        // Update one by one? Or bulk upsert if we had ID?
        // We have ID now for updates. We can upsert them!
        if (toUpdate.length > 0) {
            const { error } = await supabase.from('tasks').upsert(toUpdate);
            if (error) errors.push(error);
        }

        if (errors.length > 0) {
            return NextResponse.json({ error: 'Some updates failed', details: errors }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Sync successful',
            inserted: toInsert.length,
            updated: toUpdate.length
        });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
