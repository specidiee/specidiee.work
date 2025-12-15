import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scheduleTasks } from '@/lib/algorithm/scheduler';
import { generateTimeSlots } from '@/lib/algorithm/timeSlots';
import { Task } from '@/types/gtd';

export async function POST(request: Request) {
    try {
        // 1. Fetch ALL relevant tasks (Fixed + Flexible)
        const { data: allTasksData, error: fetchError } = await supabase
            .from('tasks')
            .select('*')
            .in('status', ['TODO', 'IN_PROGRESS', 'POSTPONED']) // Fixed tasks might be TODO? Or just active. 
        // Fixed tasks usually don't have TODO status in this simple model? 
        // Let's assume they do.
        // Actually, we need Fixed tasks even if they are 'DONE' if they are today? 
        // No, only future/today fixed tasks matter. 
        // For simplicity, let's fetch all active tasks.

        if (fetchError) throw fetchError;

        const allTasks = allTasksData as Task[];

        // Separate Fixed and Flexible
        const fixedTasks = allTasks.filter(t => t.type === 'FIXED');
        const flexibleTasks = allTasks.filter(t => t.type === 'FLEXIBLE');

        // 2. Fetch Dependencies
        const { data: deps, error: depError } = await supabase
            .from('task_dependencies')
            .select('successor_id, predecessor_id');

        if (depError) throw depError;

        // 2.5 Fetch Excluded Times
        const { data: excluded, error: exError } = await supabase
            .from('excluded_times')
            .select('*')
            .eq('is_active', true);

        if (exError) console.error('Error fetching exclusions', exError);

        // 3. Attach Dependencies to Tasks (Flexible only needs this usually, but safe for all)
        const taskList = flexibleTasks.map(t => {
            const predecessors = deps
                .filter((d: any) => d.successor_id === t.id)
                .map((d: any) => d.predecessor_id);
            return { ...t, predecessors } as Task;
        });

        // 4. Generate Time Slots
        const now = new Date();
        const rawSlots: any[] = [];

        console.log(`Scheduling started at ${now.toISOString()}`);
        console.log(`Found ${fixedTasks.length} fixed tasks`);
        console.log(`Excluded Rules:`, JSON.stringify(excluded, null, 2));

        // Generate slots for Today + 6 days (7 days total)
        for (let i = 0; i < 7; i++) {
            const day = new Date(now);
            day.setDate(now.getDate() + i);
            const daySlots = generateTimeSlots(day, 8, 24, (excluded as any[]) || []);
            console.log(`Day ${i} (${day.toLocaleDateString()}): Generated ${daySlots.length} slots`);
            rawSlots.push(...daySlots);
        }

        // Filter out past slots so we only schedule from NOW onwards
        const slots = rawSlots.filter(s => s.end > now);
        console.log(`Generated ${slots.length} valid future time slots`);

        // 4.5 Block Fixed Tasks + Travel
        // We need to map fixed task times to slots. 
        // Assuming Fixed Tasks have scheduled_start/end or some time field. 
        // The schema says `scheduled_start`. Fixed tasks imply they are already scheduled.
        for (const fixed of fixedTasks) {
            if (!fixed.scheduled_start || !fixed.scheduled_end) continue;

            const start = new Date(fixed.scheduled_start);
            const end = new Date(fixed.scheduled_end);
            const travel = fixed.travel_time_minutes || 0;

            // Apply buffer
            const blockStart = new Date(start.getTime() - travel * 60000);
            const blockEnd = new Date(end.getTime() + travel * 60000);

            // Mark slots intersecting this range as unavailable
            for (const slot of slots) {
                // Check intersection: SlotStart < BlockEnd && SlotEnd > BlockStart
                if (slot.start < blockEnd && slot.end > blockStart) {
                    slot.isAvailable = false;
                }
            }
        }

        // 5. Run Algorithm (Only for Flexible tasks)
        const { scheduledTasks, postponedTasks } = scheduleTasks(taskList, slots);

        // 6. Update Database
        const updates = [];

        for (const task of scheduledTasks) {
            updates.push(
                supabase
                    .from('tasks')
                    .update({
                        scheduled_start: task.scheduled_start,
                        scheduled_end: task.scheduled_end,
                        status: task.status === 'POSTPONED' ? 'TODO' : task.status,
                    })
                    .eq('id', task.id)
            );
        }

        for (const task of postponedTasks) {
            updates.push(
                supabase
                    .from('tasks')
                    .update({
                        status: 'POSTPONED',
                        scheduled_start: null,
                        scheduled_end: null
                    })
                    .eq('id', task.id)
            );
        }

        await Promise.all(updates);

        return NextResponse.json({
            message: 'Schedule updated',
            scheduled: scheduledTasks.length,
            postponed: postponedTasks.length
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
