import { scheduleTasks } from './scheduler';
import { generateTimeSlots } from './timeSlots';
import { Task } from '@/types/gtd';

const now = new Date('2025-12-16T08:00:00Z');
const timeSlots = generateTimeSlots(now, 8, 20); // 12 hours = 48 slots

function createTask(id: string, pri: number, mins: number, preds: string[] = []): Task {
    return {
        id,
        title: `Task ${id}`,
        type: 'FLEXIBLE',
        priority: pri,
        estimated_minutes: mins,
        status: 'TODO',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        predecessors: preds
    } as Task;
}

function runTest() {
    console.log('--- Test 1: Simple Dependency (A -> B) ---');
    const t1 = createTask('A', 5, 30);
    const t2 = createTask('B', 5, 30, ['A']);
    const res1 = scheduleTasks([t2, t1], [...timeSlots]); // Pass in reverse order to test sort

    // Expect: A first, then B
    const sA = res1.scheduledTasks.find(t => t.id === 'A');
    const sB = res1.scheduledTasks.find(t => t.id === 'B');
    console.log(`A: ${sA?.scheduled_start} - ${sA?.scheduled_end}`);
    console.log(`B: ${sB?.scheduled_start} - ${sB?.scheduled_end}`);

    if (sA && sB && new Date(sA.scheduled_end!) <= new Date(sB.scheduled_start!)) {
        console.log('PASS: A finishes before/at B start');
    } else {
        console.log('FAIL: Sequence violation');
    }

    console.log('\n--- Test 2: Dependency Propagation (A postponed -> B postponed) ---');
    // Task A takes 13 hours (too long for 12h slots), B depends on A
    const t3 = createTask('LongA', 5, 13 * 60);
    const t4 = createTask('DepB', 5, 30, ['LongA']);
    const res2 = scheduleTasks([t3, t4], [...timeSlots]);

    const pA = res2.postponedTasks.find(t => t.id === 'LongA');
    const pB = res2.postponedTasks.find(t => t.id === 'DepB');

    if (pA && pB) {
        console.log('PASS: Both Postponed');
    } else {
        console.log(`FAIL: A=${pA ? 'Postponed' : 'Scheduled'}, B=${pB ? 'Postponed' : 'Scheduled'}`);
    }

    console.log('\n--- Test 3: Cross Priority Ignored (C[Pri 3] -> D[Pri 5]) ---');
    // D is logic "dependent" on C, but C is lower priority.
    // In our logic, D (Pri 5) runs in Priority 5 group. C (Pri 3) runs later.
    // D should NOT see C as a predecessor in its group graph.
    // D should schedule purely on its own merits.

    const tC = createTask('C', 3, 30);
    const tD = createTask('D', 5, 30, ['C']);
    const res3 = scheduleTasks([tC, tD], [...timeSlots]);

    const sD = res3.scheduledTasks.find(t => t.id === 'D');
    const sC = res3.scheduledTasks.find(t => t.id === 'C');

    // D should be scheduled first (Pri 5).
    // If D waited for C, C needs to be scheduled. But C is Pri 3.
    // If logic ignores cross-pri, D schedules immediately at start.
    // C schedules after all Pri 5 (so after D).

    console.log(`D Start: ${sD?.scheduled_start}`);
    console.log(`C Start: ${sC?.scheduled_start}`);

    if (sD && sC && new Date(sD.scheduled_start!) <= new Date(sC.scheduled_start!)) {
        console.log('PASS: D scheduled before or same as C (Cross-priority dependency ignored)');
    } else {
        console.log('FAIL: D waited for C?');
    }
}

runTest();
