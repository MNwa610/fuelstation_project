import { distanceKm } from "./geo.js";

export function uniqueFuelTypes(stations) {
  const map = new Map();
  stations.forEach((s) =>
    s.fuels.forEach((f) => map.set(f.fuelType.code, f.fuelType))
  );
  return [...map.values()];
}

export function filterStations(stations, filters, userPoint) {
  return stations.filter((station) => {
    if (
      filters.address &&
      !station.address.toLowerCase().includes(filters.address.toLowerCase())
    ) {
      return false;
    }

    const needFuel = Boolean(filters.fuelType || filters.status);
    if (needFuel) {
      const match = station.fuels.some((fuel) => {
        if (filters.fuelType && fuel.fuelType.code !== filters.fuelType) {
          return false;
        }
        if (filters.status && fuel.status !== filters.status) {
          return false;
        }
        return true;
      });
      if (!match) return false;
    }

    if (filters.radiusKm && userPoint) {
      const km = distanceKm(userPoint, { lat: station.lat, lng: station.lng });
      if (km > Number(filters.radiusKm)) return false;
    }

    return true;
  });
}
