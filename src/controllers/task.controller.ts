import { Request, Response } from "express";
import * as taskService from "../services/task.service";

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["todo", "in-progress", "done"];

export function listTasks(_req: Request, res: Response): void {
  res.json(taskService.listTasks());
}

export function listTasksByPriority(_req: Request, res: Response): void {
  res.json(taskService.listTasksByPriority());
}

export function getTask(req: Request, res: Response): void {
  const task = taskService.findTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
}

export function createTask(req: Request, res: Response): void {
  const { title, description, priority } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }
  const task = taskService.createNewTask({ title, description, priority });
  res.status(201).json(task);
}

export function updateTask(req: Request, res: Response): void {
  const { title, description, status, priority } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }

  const task = taskService.updateExistingTask(req.params.id, {
    title,
    description,
    status,
    priority,
  });
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
}

export function deleteTask(req: Request, res: Response): void {
  const deleted = taskService.removeTask(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(204).send();
}
