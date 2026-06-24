import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, Priority } from "../types";
import * as taskModel from "../models/task.model";

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function getAllTasks(): Task[] {
  return taskModel.findAll();
}

export function getTaskById(id: string): Task | undefined {
  return taskModel.findById(id);
}

export function createTask(input: CreateTaskInput): Task {
  return taskModel.insert(input);
}

export function updateTask(id: string, input: UpdateTaskInput): Task | null {
  return taskModel.update(id, input);
}

export function deleteTask(id: string): boolean {
  return taskModel.remove(id);
}

export function getTasksByPriority(): Task[] {
  return taskModel.findAll().sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

export function filterTasks(filters: TaskFilters): Task[] {
  return taskModel.filter(filters);
}
