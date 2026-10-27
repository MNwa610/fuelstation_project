import { Router } from "express";
import stationRoutes from "./station.routes.js";
import authRoutes from "./auth.routes.js";
import stationFuelRoutes from "./stationFuel.routes.js";
import simulationRoutes from "./simulation.routes.js";

const router = Router();

router.use("/stations", stationRoutes);
router.use("/auth", authRoutes);
router.use("/station-fuels", stationFuelRoutes);
router.use("/simulation", simulationRoutes);

export default router;
