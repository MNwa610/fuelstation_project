import { Router } from "express";
import { getStations } from "../controllers/station.controller.js";

const router = Router();

router.get("/", getStations);

export default router;
