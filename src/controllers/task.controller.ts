import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { TaskFilters } from "../types";

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["todo", "in-progress", "done"];

export function list(req: Request, res: Response): void {
  const { status, priority, tag } = req.query;
  const filters: TaskFilters = {};

  if (status) {
    if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status filter" });
      return;
    }
    filters.status = status as TaskFilters["status"];
  }
  if (priority) {
    if (typeof priority !== "string" || !VALID_PRIORITIES.includes(priority)) {
      res.status(400).json({ error: "Invalid priority filter" });
      return;
    }
    filters.priority = priority as TaskFilters["priority"];
  }
  if (tag && typeof tag === "string") {
    filters.tag = tag;
  }

  if (Object.keys(filters).length > 0) {
    res.json(taskService.filterTasks(filters));
    return;
  }
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
  const { title, description, priority, tags } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }
  if (tags !== undefined && (!Array.isArray(tags) || !tags.every((t: unknown) => typeof t === "string"))) {
    res.status(400).json({ error: "tags must be an array of strings" });
    return;
  }
  const task = taskService.createTask({ title, description, priority, tags });
  res.status(201).json(task);
}

export function update(req: Request, res: Response): void {
  const { title, description, status, priority, tags } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }

  if (tags !== undefined && (!Array.isArray(tags) || !tags.every((t: unknown) => typeof t === "string"))) {
    res.status(400).json({ error: "tags must be an array of strings" });
    return;
  }

  const task = taskService.updateTask(req.params.id, { title, description, status, priority, tags });
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
