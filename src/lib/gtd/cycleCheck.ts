import { SupabaseClient } from '@supabase/supabase-js';

export async function hasCycle(
    supabase: SupabaseClient,
    taskId: string,
    newPredecessorIds: string[]
): Promise<boolean> {
    if (newPredecessorIds.length === 0) return false;

    // Trivial check: self-reference
    if (newPredecessorIds.includes(taskId)) return true;

    // Fetch ALL dependencies to build the graph
    // (Optimization: In a real large-scale system, we might limit depth or scope, 
    // but for GTD personal app, fetching all 100-1000 deps is fine)
    const { data: deps, error } = await supabase
        .from('task_dependencies')
        .select('predecessor_id, successor_id');

    if (error || !deps) {
        console.error('Cycle check failed to fetch deps', error);
        return false; // Fail open? Or closed? Let's assume false to not block unless sure.
    }

    // Build Adjacency List: pred -> succ[]
    // We want to check if any of the newPredecessorIds depends on taskId.
    // i.e., is there a path taskId -> ... -> newPredecessorId ?

    const graph: Record<string, string[]> = {};
    for (const d of deps) {
        if (!graph[d.predecessor_id]) graph[d.predecessor_id] = [];
        graph[d.predecessor_id].push(d.successor_id);
    }

    // DFS for Reachability from taskId
    const visited = new Set<string>();
    const stack = [taskId];

    while (stack.length > 0) {
        const current = stack.pop()!;

        if (visited.has(current)) continue;
        visited.add(current);

        // If we reached one of the proposed predecessors, it's a cycle!
        // Because we are proposing newPredecessor -> taskId.
        // And we just found taskId -> ... -> newPredecessor.
        if (newPredecessorIds.includes(current)) {
            return true;
        }

        const neighbors = graph[current] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
        }
    }

    return false;
}
