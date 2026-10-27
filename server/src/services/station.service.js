import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/httpError.js";

const stationInclude = {
  network: true,
  fuels: {
    include: {
      fuelType: true,
    },
  },
};

export async function getAllStations() {
  return prisma.station.findMany({
    where: { isActive: true },
    include: stationInclude,
    orderBy: { name: "asc" },
  });
}

export async function getStationById(id) {
  const station = await prisma.station.findUnique({
    where: { id },
    include: stationInclude,
  });
  if (!station) {
    throw new HttpError(404, "Заправка не найдена");
  }
  return station;
}
