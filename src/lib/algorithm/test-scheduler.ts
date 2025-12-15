import { scheduleTasks } from './scheduler';
import { generateTimeSlots } from './timeSlots';
import { Task } from '../../types/gtd';

const now = new Date(); // Use a fixed date for consistency if needed, but now is fine for relative checks

// Mock Tasks
const tasks: Task[] = [
    {
        id: '1',
        title: 'Urgent Task',
        type: 'FLEXIBLE',
        priority: 5,
        estimated_minutes: 30,
        status: 'TODO',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
    },
    {
        id: '2',
        title: 'Low Priority Long Task',
        type: 'FLEXIBLE',
        priority: 1,
        estimated_minutes: 60,
        status: 'TODO',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
    },
    {
        id: '3',
        title: 'Deadline Task',
        type: 'FLEXIBLE',
        priority: 3,
        estimated_minutes: 30,
        status: 'TODO',
        deadline: new Date(now.getTime() + 1000 * 60 * 60 * 5).toISOString(), // 5 hours from now
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
    }
];

// Generate Slots for today 6am - 12pm
const slots = generateTimeSlots(now, 8, 12); // Reduced range for logging

console.log(`Generated ${slots.length} slots from 8:00 to 12:00`);

const result = scheduleTasks(tasks, slots);

console.log('--- Scheduled Tasks ---');
result.scheduledTasks.forEach(t => {
    console.log(`[${t.title}] Start: ${t.scheduled_start}, End: ${t.scheduled_end}`);
});

console.log('--- Postponed Tasks ---');
result.postponedTasks.forEach(t => {
    console.log(`[${t.title}] Priority: ${t.priority}`);
});
