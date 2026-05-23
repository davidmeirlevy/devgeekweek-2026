import { randomUUID } from "crypto";
import { Task, CreateTaskInput, UpdateTaskInput, Priority } from "./types";

const tasks: Map<string, Task> = new Map();

export function getAllTasks(): Task[] {
  return Array.from(tasks.values());
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
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | null {
  const existing = tasks.get(id);
  if (!existing) return null;

  const updated: Task = {
    ...existing,
    ...input,
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
