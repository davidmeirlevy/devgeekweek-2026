import { randomUUID } from "crypto";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: Task["status"];
  priority?: Priority;
  tags?: string[];
}

export interface TaskFilters {
  status?: Task["status"];
  priority?: Priority;
  tag?: string;
}

const tasks: Map<string, Task> = new Map();

export function getAllTasks(): Task[] {
  return Array.from(tasks.values());
}

export function getFilteredTasks(filters: TaskFilters): Task[] {
  return Array.from(tasks.values()).filter((task) => {
    if (filters.status !== undefined && task.status !== filters.status) {
      return false;
    }
    if (filters.priority !== undefined && task.priority !== filters.priority) {
      return false;
    }
    if (filters.tag !== undefined && !task.tags.includes(filters.tag)) {
      return false;
    }
    return true;
  });
}

export function getTaskById(id: string): Task | undefined {
  return tasks.get(id);
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description ?? "",
    status: "todo",
    priority: input.priority ?? "medium",
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | null {
  const existing = tasks.get(id);
  if (!existing) return null;

  const definedInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as UpdateTaskInput;

  const updated: Task = {
    ...existing,
    ...definedInput,
    updatedAt: new Date().toISOString(),
  };
  tasks.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}

export function getTasksByPriority(): Task[] {
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  return Array.from(tasks.values()).sort(
    (a, b) => order[a.priority] - order[b.priority]
  );
}

export function clearAll(): void {
  tasks.clear();
}
