import { Router } from "express";
import * as taskController from "../controllers/task.controller";

const router = Router();

router.get("/tasks", taskController.listTasks);
router.get("/tasks/by-priority", taskController.listTasksByPriority);
router.get("/tasks/:id", taskController.getTask);
router.post("/tasks", taskController.createTask);
router.patch("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

export default router;
