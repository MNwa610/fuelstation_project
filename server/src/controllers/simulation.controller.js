import * as simulationService from "../services/simulation.service.js";

export async function runSimulation(req, res, next) {
  try {
    const result = await simulationService.runSimulation();
    res.json(result);
  } catch (err) {
    next(err);
  }
}
