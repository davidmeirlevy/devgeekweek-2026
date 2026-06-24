import {
  getFilteredTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByPriority,
  CreateTaskInput,
  Task,
  TaskFilters,
  UpdateTaskInput,
} from "../models/task.model";

export function listTasks(filters: TaskFilters = {}): Task[] {
  return getFilteredTasks(filters);
}

export function findTaskById(id: string): Task | undefined {
  return getTaskById(id);
}

export function createNewTask(input: CreateTaskInput): Task {
  return createTask(input);
}

export function updateExistingTask(
  id: string,
  input: UpdateTaskInput
): Task | null {
  return updateTask(id, input);
}

export function removeTask(id: string): boolean {
  return deleteTask(id);
}

export function listTasksByPriority(): Task[] {
  return getTasksByPriority();
}
