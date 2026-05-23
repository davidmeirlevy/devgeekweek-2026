import { Request, Response } from "express";
import * as taskService from "../services/task.service";

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["todo", "in-progress", "done"];

export function list(_req: Request, res: Response): void {
  res.json(taskService.getAllTasks());
}

export function getById(req: Request, res: Response): void {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
}

export function create(req: Request, res: Response): void {
  const { title, description, priority } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }
  const task = taskService.createTask({ title, description, priority });
  res.status(201).json(task);
}

export function update(req: Request, res: Response): void {
  const { title, description, status, priority } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }

  const task = taskService.updateTask(req.params.id, { title, description, status, priority });
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
}

export function remove(req: Request, res: Response): void {
  const deleted = taskService.deleteTask(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(204).send();
}

export function listByPriority(_req: Request, res: Response): void {
  res.json(taskService.getTasksByPriority());
}
