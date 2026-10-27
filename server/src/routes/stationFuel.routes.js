import { Router } from "express";
import {
  getEvents,
  updateStationFuel,
} from "../controllers/stationFuel.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";
import { updateStationFuelSchema } from "../schemas/stationFuel.schema.js";

const router = Router();

router.patch(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateStationFuelSchema),
  updateStationFuel
);
router.get("/:id/events", getEvents);

export default router;
