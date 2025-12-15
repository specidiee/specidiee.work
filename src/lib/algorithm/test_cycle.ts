
// This script simulates API calls to test cycle detection
// Usage: npx tsx src/lib/algorithm/test_cycle.ts

const BASE_URL = 'http://localhost:3000/gtd/tasks';

async function testCycle() {
    console.log('--- Cycle Detection Test ---');

    // 1. Create Task A
    const resA = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
            title: 'Cycle Task A', type: 'FLEXIBLE', estimated_minutes: 30, priority: 3
        })
    });
    const taskA = await resA.json();
    console.log('Created A:', taskA.id);

    // 2. Create Task B (Depends on A)
    const resB = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
            title: 'Cycle Task B', type: 'FLEXIBLE', estimated_minutes: 30, priority: 3,
            predecessors: [taskA.id]
        })
    });
    const taskB = await resB.json();
    console.log('Created B (Depends on A):', taskB.id);

    // 3. Update Task A to depend on B (Cycle!)
    console.log('Attempting to make A depend on B...');
    const resUpdate = await fetch(`${BASE_URL}/${taskA.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            predecessors: [taskB.id] // A -> B -> A
        })
    });

    if (resUpdate.status === 400) {
        const err = await resUpdate.json();
        console.log('PASS: Update rejected with error:', err.error);
    } else {
        console.log('FAIL: Update Status:', resUpdate.status);
    }

    // Cleanup
    await fetch(`${BASE_URL}/${taskA.id}`, { method: 'DELETE' });
    await fetch(`${BASE_URL}/${taskB.id}`, { method: 'DELETE' });
}

testCycle();
