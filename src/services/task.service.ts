import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from "../types";
import * as taskModel from "../models/task.model";

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
  return taskModel.findByPriority();
}

export function filterTasks(filters: TaskFilters): Task[] {
  return taskModel.filter(filters);
}
