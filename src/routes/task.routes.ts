import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import * as commentController from "../controllers/comment.controller";

const router = Router();

router.get("/tasks", taskController.list);
router.get("/tasks/by-priority", taskController.listByPriority);
router.get("/tasks/:id/comments", commentController.list);
router.post("/tasks/:id/comments", commentController.create);
router.delete("/tasks/:id/comments/:commentId", commentController.remove);
router.get("/tasks/:id", taskController.getById);
router.post("/tasks", taskController.create);
router.patch("/tasks/:id", taskController.update);
router.delete("/tasks/:id", taskController.remove);

export default router;
