import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import {
  isNonEmptyString,
  isStringArray,
  isValidPriority,
  isValidStatus,
} from "../validation";

export function listTasks(req: Request, res: Response): void {
  const filters: {
    status?: "todo" | "in-progress" | "done";
    priority?: "low" | "medium" | "high";
    tag?: string;
  } = {};

  if (typeof req.query.status === "string") {
    filters.status = req.query.status as "todo" | "in-progress" | "done";
  }
  if (typeof req.query.priority === "string") {
    filters.priority = req.query.priority as "low" | "medium" | "high";
  }
  if (typeof req.query.tag === "string") {
    filters.tag = req.query.tag;
  }

  res.json(taskService.listTasks(filters));
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
  const { title, description, priority, tags } = req.body;
  if (!isNonEmptyString(title)) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (priority && !isValidPriority(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }
  if (tags !== undefined && !isStringArray(tags)) {
    res.status(400).json({ error: "Invalid tags" });
    return;
  }
  const task = taskService.createNewTask({ title, description, priority, tags });
  res.status(201).json(task);
}

export function updateTask(req: Request, res: Response): void {
  const { title, description, status, priority, tags } = req.body;

  if (status && !isValidStatus(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (priority && !isValidPriority(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }

  if (tags !== undefined && !isStringArray(tags)) {
    res.status(400).json({ error: "Invalid tags" });
    return;
  }

  const task = taskService.updateExistingTask(req.params.id, {
    title,
    description,
    status,
    priority,
    tags,
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
