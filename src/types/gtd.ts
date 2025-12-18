export type TaskType = 'FIXED' | 'FLEXIBLE';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'POSTPONED';

export interface Task {
    id: string;
    title: string;
    description?: string;
    type: TaskType;
    priority: number; // 1-5
    estimated_minutes: number;
    status: TaskStatus;
    deadline?: string; // ISO String
    scheduled_start?: string; // ISO String
    scheduled_end?: string; // ISO String
    travel_time_minutes?: number;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    predecessors?: string[]; // IDs of predecessor tasks
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    type: TaskType;
    priority?: number;
    estimated_minutes: number;
    status?: TaskStatus;
    deadline?: string;
    predecessors?: string[];
    travel_time_minutes?: number;
    scheduled_start?: string;
    scheduled_end?: string;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
    scheduled_start?: string;
    scheduled_end?: string;
    completed_at?: string;
}
