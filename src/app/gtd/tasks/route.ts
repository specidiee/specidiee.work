import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateTaskDTO, Task } from '@/types/gtd';

export async function GET() {
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch dependencies
    const { data: dependencies, error: depError } = await supabase
        .from('task_dependencies')
        .select('successor_id, predecessor_id');

    if (depError) {
        console.error('Error fetching dependencies', depError);
        // Return tasks without dependencies if error? Or fail?
        // Let's just return tasks for robustness, but log error.
        return NextResponse.json(tasks);
    }

    // Map dependencies
    const tasksWithDeps = tasks.map((task: any) => {
        const predecessors = dependencies
            .filter((d: any) => d.successor_id === task.id)
            .map((d: any) => d.predecessor_id);

        return {
            ...task,
            predecessors
        };
    });

    return NextResponse.json(tasksWithDeps);
}

export async function POST(request: Request) {
    try {
        const body: CreateTaskDTO = await request.json();

        // Basic validation
        if (!body.title || !body.type || !body.estimated_minutes) {
            return NextResponse.json(
                { error: 'Missing required fields: title, type, estimated_minutes' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    title: body.title,
                    description: body.description,
                    type: body.type,
                    priority: body.priority || 3,
                    estimated_minutes: body.estimated_minutes,
                    status: body.status || 'TODO',
                    deadline: body.deadline,
                    travel_time_minutes: body.travel_time_minutes || 0,
                    updated_at: new Date().toISOString(),
                    scheduled_start: body.scheduled_start,
                    scheduled_end: body.scheduled_end
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const newTask = data as Task;

        // Handle Dependencies
        if (body.predecessors && body.predecessors.length > 0) {
            const depsToInsert = body.predecessors.map(predId => ({
                predecessor_id: predId,
                successor_id: newTask.id
            }));

            const { error: depError } = await supabase
                .from('task_dependencies')
                .insert(depsToInsert);

            if (depError) {
                // If dependency insertion fails, should we delete the task? 
                // For MVP, just return error but task exists. 
                // Ideally use transaction (RPC).
                console.error('Failed to insert dependencies', depError);
                return NextResponse.json({ ...newTask, predecessors: [], error: 'Task created but dependencies failed' }, { status: 201 });
            }

            newTask.predecessors = body.predecessors;
        }

        return NextResponse.json(newTask, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
