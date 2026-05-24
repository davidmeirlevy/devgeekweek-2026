import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { isValidPriority, isValidStatus, isNonEmptyString, isStringArray } from "../validation";
import { TaskFilters } from "../types";

export function list(req: Request, res: Response): void {
  const { status, priority, tag } = req.query;
  const filters: TaskFilters = {};

  if (status) {
    if (!isValidStatus(status)) {
      res.status(400).json({ error: "Invalid status filter" });
      return;
    }
    filters.status = status;
  }
  if (priority) {
    if (!isValidPriority(priority)) {
      res.status(400).json({ error: "Invalid priority filter" });
      return;
    }
    filters.priority = priority;
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
  if (!isNonEmptyString(title)) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (priority !== undefined && !isValidPriority(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }
  if (tags !== undefined && !isStringArray(tags)) {
    res.status(400).json({ error: "tags must be an array of strings" });
    return;
  }
  const task = taskService.createTask({ title, description, priority, tags });
  res.status(201).json(task);
}

export function update(req: Request, res: Response): void {
  const { title, description, status, priority, tags } = req.body;

  if (title !== undefined && !isNonEmptyString(title)) {
    res.status(400).json({ error: "title cannot be empty" });
    return;
  }

  if (status !== undefined && !isValidStatus(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (priority !== undefined && !isValidPriority(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }

  if (tags !== undefined && !isStringArray(tags)) {
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
