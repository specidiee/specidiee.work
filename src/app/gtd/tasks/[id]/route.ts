import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { UpdateTaskDTO } from '@/types/gtd';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Fetch dependencies
    const { data: deps, error: depError } = await supabase
        .from('task_dependencies')
        .select('predecessor_id')
        .eq('successor_id', id);

    const taskWithDeps = {
        ...data,
        predecessors: deps ? deps.map((d: any) => d.predecessor_id) : []
    };

    return NextResponse.json(taskWithDeps);
}

import { hasCycle } from '@/lib/gtd/cycleCheck';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    try {
        const body: UpdateTaskDTO = await request.json();

        const { predecessors, ...taskUpdate } = body;

        // Cycle Check before any update
        if (predecessors && predecessors.length > 0) {
            const isCyclic = await hasCycle(supabase, id, predecessors);
            if (isCyclic) {
                return NextResponse.json({ error: 'Cyclic dependency detected' }, { status: 400 });
            }
        }

        // 1. Update Task Fields
        const { data, error } = await supabase
            .from('tasks')
            .update({
                ...taskUpdate,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 2. Update Dependencies
        if (predecessors !== undefined) {
            // Delete existing
            await supabase
                .from('task_dependencies')
                .delete()
                .eq('successor_id', id);

            // Insert new
            if (predecessors.length > 0) {
                const depsToInsert = predecessors.map(predId => ({
                    predecessor_id: predId,
                    successor_id: id
                }));
                const { error: depError } = await supabase
                    .from('task_dependencies')
                    .insert(depsToInsert);

                if (depError) console.error('Failed to update dependencies', depError);
            }
        }

        // Return updated object with preds
        return NextResponse.json({ ...data, predecessors: predecessors || [] });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    // Dependencies set to CASCADE in schema, so just deleting task is enough
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
}
