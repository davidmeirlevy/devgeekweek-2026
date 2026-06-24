import { Router } from "express";
import * as healthController from "../controllers/health.controller";
import taskRoutes from "./task.route";

const router = Router();

router.get("/health", healthController.getHealth);
router.use(taskRoutes);

export default router;
