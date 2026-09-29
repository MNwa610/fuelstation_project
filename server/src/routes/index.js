import { Router } from "express";
import stationRoutes from "./station.routes.js";

const router = Router();

router.use("/stations", stationRoutes);

export default router;
