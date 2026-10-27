import * as stationService from "../services/station.service.js";

export async function getStations(_req, res, next) {
  try {
    const stations = await stationService.getAllStations();
    res.json(stations);
  } catch (err) {
    next(err);
  }
}

export async function getStation(req, res, next) {
  try {
    const station = await stationService.getStationById(req.params.id);
    res.json(station);
  } catch (err) {
    next(err);
  }
}
