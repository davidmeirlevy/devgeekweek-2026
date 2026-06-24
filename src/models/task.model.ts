import { randomUUID } from "crypto";
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from "../types";

const tasks: Map<string, Task> = new Map();

export function findAll(): Task[] {
  return Array.from(tasks.values());
}

export function findById(id: string): Task | undefined {
  return tasks.get(id);
}

export function insert(input: CreateTaskInput): Task {
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

export function update(id: string, input: UpdateTaskInput): Task | null {
  const existing = tasks.get(id);
  if (!existing) return null;

  const changes: Partial<Task> = {};
  if (input.title !== undefined) changes.title = input.title;
  if (input.description !== undefined) changes.description = input.description;
  if (input.status !== undefined) changes.status = input.status;
  if (input.priority !== undefined) changes.priority = input.priority;
  if (input.tags !== undefined) changes.tags = input.tags;

  const updated: Task = {
    ...existing,
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  tasks.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return tasks.delete(id);
}

export function filter(filters: TaskFilters): Task[] {
  let result = Array.from(tasks.values());
  if (filters.status) {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters.priority) {
    result = result.filter((t) => t.priority === filters.priority);
  }
  if (filters.tag) {
    result = result.filter((t) => t.tags.includes(filters.tag!));
  }
  return result;
}

export function clear(): void {
  tasks.clear();
}
