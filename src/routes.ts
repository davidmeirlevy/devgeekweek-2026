import { Router, Request, Response } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./store";

const router = Router();

router.get("/tasks", (_req: Request, res: Response) => {
  res.json(getAllTasks());
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
  const { title, description } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const task = createTask({ title, description });
  res.status(201).json(task);
});

router.patch("/tasks/:id", (req: Request, res: Response) => {
  const { title, description, status } = req.body;

  if (status && !["todo", "in-progress", "done"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const task = updateTask(req.params.id, { title, description, status });
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
