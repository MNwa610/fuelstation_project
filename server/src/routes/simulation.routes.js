import { Router } from "express";
import { runSimulation } from "../controllers/simulation.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/run", authMiddleware, requireRole("ADMIN"), runSimulation);

export default router;
