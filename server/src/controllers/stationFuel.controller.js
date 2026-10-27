import * as stationFuelService from "../services/stationFuel.service.js";

export async function updateStationFuel(req, res, next) {
  try {
    const fuel = await stationFuelService.updateStationFuel(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json(fuel);
  } catch (err) {
    next(err);
  }
}

export async function getEvents(req, res, next) {
  try {
    const events = await stationFuelService.getEvents(req.params.id);
    res.json(events);
  } catch (err) {
    next(err);
  }
}
