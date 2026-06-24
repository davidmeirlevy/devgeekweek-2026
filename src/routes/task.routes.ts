import { Router } from "express";
import {
  listTasks,
  getTask,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/task.controller";

const router = Router();

router.get("/tasks", listTasks);
router.get("/tasks/:id", getTask);
router.post("/tasks", createTaskHandler);
router.patch("/tasks/:id", updateTaskHandler);
router.delete("/tasks/:id", deleteTaskHandler);

export default router;
