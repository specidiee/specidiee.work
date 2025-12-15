
// Usage: npx tsx src/lib/algorithm/test_travel.ts
const BASE_URL = 'http://localhost:3000/gtd/tasks';

async function testTravel() {
    console.log('--- Travel Time Test ---');

    const clean = async () => {
        // Find tasks with 'Travel Test' in title and delete
        // Not implemented, but let's just create new ones and assume manual cleanup or ignore
    };

    // 1. Create Flexible Task with Travel Time
    // Est: 30m, Travel: 15m. Needs 15+30+15 = 60m slot.
    // If we schedule it, it should be placed with buffers.

    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
            title: 'Travel Test Task',
            type: 'FLEXIBLE',
            estimated_minutes: 30,
            travel_time_minutes: 15,
            priority: 5
        })
    });
    const task = await res.json();
    console.log('Created Task Response:', task);
    if (task.error) {
        console.error('Task Creation Failed:', task.error);
        return;
    }
    console.log('Created Task:', task.id, 'Travel:', task.travel_time_minutes);

    // 2. Trigger Schedule
    console.log('Running Schedule...');
    const scheduleRes = await fetch('http://localhost:3000/gtd/schedule', { method: 'POST' });
    const scheduleData = await scheduleRes.json();
    console.log('Schedule Result:', scheduleData);

    // 3. Check Task Details
    const checkRes = await fetch(`${BASE_URL}/${task.id}`);
    const updatedTask = await checkRes.json();

    console.log('Task Schedule:',
        updatedTask.scheduled_start ? updatedTask.scheduled_start.slice(11, 16) : 'Not Scheduled',
        '-',
        updatedTask.scheduled_end ? updatedTask.scheduled_end.slice(11, 16) : ''
    );

    // Expected: If slots start at 8:00 (due to default route logic).
    // Buffer: 8:00-8:15. Task: 8:15-8:45. Buffer: 8:45-9:00.
    // Task Start should be 08:15.

    // Cleanup
    await fetch(`${BASE_URL}/${task.id}`, { method: 'DELETE' });
}

testTravel();
