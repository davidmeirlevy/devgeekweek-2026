import { Router, Request, Response } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByPriority,
} from "./store";

const router = Router();

const VALID_PRIORITIES = ["low", "medium", "high"];

router.get("/tasks", (_req: Request, res: Response) => {
  res.json(getAllTasks());
});

router.get("/tasks/by-priority", (_req: Request, res: Response) => {
  res.json(getTasksByPriority());
});

router.get("/tasks/:id", (req: Request, res: Response) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

router.post("/tasks", (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }
  const task = createTask({ title, description, priority });
  res.status(201).json(task);
});

router.patch("/tasks/:id", (req: Request, res: Response) => {
  const { title, description, status, priority } = req.body;

  if (status && !["todo", "in-progress", "done"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({ error: "Invalid priority" });
    return;
  }

  const task = updateTask(req.params.id, { title, description, status, priority });
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

router.delete("/tasks/:id", (req: Request, res: Response) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(204).send();
});

export default router;
