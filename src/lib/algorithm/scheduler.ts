import { Task } from '@/types/gtd';
import { TimeSlot, canFitTask, occupySlots, TIME_SLOT_DURATION } from './timeSlots';
import { addMinutes, compareAsc } from 'date-fns';

export interface SchedulerResult {
    scheduledTasks: Task[];
    postponedTasks: Task[];
}

/**
 * Schedules tasks using A3 Algorithm with Phase 2 enhancements:
 * 1. Sequential Tasks: Dependencies are respected within the same priority block.
 * 2. Topological Sort: Tasks are scheduled in dependency order.
 */
export function scheduleTasks(tasks: Task[], timeSlots: TimeSlot[]): SchedulerResult {
    const scheduledTasks: Task[] = [];
    const postponedTasks: Task[] = [];

    // 1. Group Tasks by Priority (5 -> 1)
    // We process high priority tasks first.
    const tasksByPriority: Record<number, Task[]> = {};
    for (const task of tasks) {
        if (!tasksByPriority[task.priority]) {
            tasksByPriority[task.priority] = [];
        }
        tasksByPriority[task.priority].push(task);
    }

    const priorities = Object.keys(tasksByPriority).map(Number).sort((a, b) => b - a);

    // 2. Process each priority group
    for (const priority of priorities) {
        const groupTasks = tasksByPriority[priority];

        // Filter out tasks that are already done or fixed
        const activeTasks = groupTasks.filter(t => t.status !== 'DONE' && t.type !== 'FIXED');

        // a. Build Dependency Graph for this group
        const adj: Record<string, string[]> = {};
        const inDegree: Record<string, number> = {};

        // Initialize graph
        for (const t of activeTasks) {
            adj[t.id] = [];
            inDegree[t.id] = 0;
        }

        // Fill Start Node -> End Node edges
        // A (predecessor) -> B (successor)
        for (const t of activeTasks) {
            if (t.predecessors && t.predecessors.length > 0) {
                for (const predId of t.predecessors) {
                    // Only consider dependencies strictly within this active group
                    // If A is PRI 5 and B is PRI 5, and A->B, then valid.
                    // If A is PRI 3, it's ignored here (User Requirement: same Priority block only)
                    if (adj[predId] !== undefined) {
                        adj[predId].push(t.id);
                        inDegree[t.id]++;
                    }
                }
            }
        }

        // b. Topological Sort Preparation
        // Available Queue: Nodes with In-Degree 0
        let availableQueue = activeTasks.filter(t => inDegree[t.id] === 0);

        // We will process tasks one by one from the queue.
        // When a task is scheduled (or postponed), we 'complete' it and unlock successors.

        // Use a loop to simulate the queue process
        // Ideally we want to pick the "best" available task at each step

        while (availableQueue.length > 0) {
            // Sort Available Queue:
            // 1. Deadline (closest first)
            // 2. Estimated Minutes (shortest first - greedy)
            availableQueue.sort((a, b) => {
                if (a.deadline && b.deadline) {
                    return compareAsc(new Date(a.deadline), new Date(b.deadline));
                }
                if (a.deadline) return -1;
                if (b.deadline) return 1;
                return a.estimated_minutes - b.estimated_minutes;
            });

            const task = availableQueue.shift()!; // Pick the best candidate

            // Try to schedule
            let placed = false;

            // Note: For strict sequential tasks, maybe we should constrain 'start time' based on predecessor?
            // "Task A -> Task B: A must be strictly before B"
            // Since we process in topological order, A is already scheduled (or postponed).
            // We need to find the MAX end time of all its predecessors *in this group* to set a lower bound for B's start.

            let minStartBound: Date | null = null;
            if (task.predecessors) {
                for (const predId of task.predecessors) {
                    // Check if predecessor is in the scheduled list
                    const predTask = scheduledTasks.find(t => t.id === predId);
                    if (predTask && predTask.scheduled_end) {
                        const predEnd = new Date(predTask.scheduled_end);
                        if (!minStartBound || predEnd > minStartBound) {
                            minStartBound = predEnd;
                        }
                    }
                }
            }

            const travel = task.travel_time_minutes || 0;
            const totalDuration = task.estimated_minutes + (travel * 2);

            for (let i = 0; i < timeSlots.length; i++) {
                const slotStart = timeSlots[i].start;
                const potentialTaskStart = addMinutes(slotStart, travel);

                // Constraint: Must start after predecessors
                if (minStartBound && potentialTaskStart < minStartBound) {
                    continue;
                }

                if (canFitTask(timeSlots, i, totalDuration)) {
                    // Found a spot!
                    // Task starts after 'travel' minutes from the slot start
                    // Task ends after 'estimated' minutes from task start
                    // Total occupied includes post-travel

                    const startTime = potentialTaskStart;
                    const endTime = addMinutes(startTime, task.estimated_minutes);

                    occupySlots(timeSlots, i, totalDuration);

                    scheduledTasks.push({
                        ...task,
                        scheduled_start: startTime.toISOString(),
                        scheduled_end: endTime.toISOString(),
                    });

                    placed = true;
                    break;
                }
            }

            if (placed) {
                // If placed, unlock successors
                if (adj[task.id]) {
                    for (const successorId of adj[task.id]) {
                        inDegree[successorId]--;
                        if (inDegree[successorId] === 0) {
                            const successor = activeTasks.find(t => t.id === successorId);
                            if (successor) availableQueue.push(successor);
                        }
                    }
                }
            } else {
                // If postponed
                // Note: If A is postponed, B (successor) cannot be scheduled today?
                // Or B can be schedule but ignoring A?
                // Logic: "A must be BEFORE B". If A is not done today, B cannot be done today.
                // So we recursively postpone successors.

                postponedTasks.push({ ...task, status: 'POSTPONED' });

                // Automatically postpone all successors that depend on this task
                if (adj[task.id]) {
                    // Use a BFS/DFS to find all distinct reachable successors and force postpone
                    // For simplicity here, we just don't add them to availableQueue.
                    // But we MUST move them to postponedTasks eventually.

                    // Actually, since they will never reach inDegree 0 (we don't decrement),
                    // they will remain in 'activeTasks' but never enter 'availableQueue'.
                    // At the end of the loop, checks for remaining tasks.
                }
            }
        }

        // Any task remaining in activeTasks that was NOT scheduled or explicitly postponed
        // (i.e. was stuck with InDegree > 0 because a predecessor was postponed)
        // needs to be added to postponedTasks.

        const handledIds = new Set([...scheduledTasks.map(t => t.id), ...postponedTasks.map(t => t.id)]);
        for (const t of activeTasks) {
            if (!handledIds.has(t.id)) {
                postponedTasks.push({ ...t, status: 'POSTPONED' });
            }
        }
    }

    // Add any tasks with unknown priority or status (shouldn't happen with correct inputs)
    // ...

    return { scheduledTasks, postponedTasks };
}
