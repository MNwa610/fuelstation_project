import * as stationService from "../services/station.service.js";

export async function getStations(_req, res, next) {
  try {
    const stations = await stationService.getAllStations();
    res.json(stations);
  } catch (err) {
    next(err);
  }
}
