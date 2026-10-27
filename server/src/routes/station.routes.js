import { Router } from "express";
import { getStation, getStations } from "../controllers/station.controller.js";

const router = Router();

router.get("/", getStations);
router.get("/:id", getStation);

export default router;
