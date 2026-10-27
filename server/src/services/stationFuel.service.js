import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/httpError.js";
import { calcFuelStatus } from "../lib/fuelStatus.js";

export async function updateStationFuel(id, data, userId) {
  const current = await prisma.stationFuel.findUnique({ where: { id } });
  if (!current) {
    throw new HttpError(404, "Запись топлива не найдена");
  }

  const currentLiters =
    data.currentLiters !== undefined ? data.currentLiters : current.currentLiters;

  let status = data.status !== undefined ? data.status : current.status;
  if (data.currentLiters !== undefined) {
    status = calcFuelStatus(currentLiters, current.capacityLiters);
  }

  const price = data.price !== undefined ? data.price : current.price;

  const updated = await prisma.stationFuel.update({
    where: { id },
    data: { status, currentLiters, price },
    include: { fuelType: true, station: true },
  });

  await prisma.fuelEvent.create({
    data: {
      stationFuelId: id,
      eventType: "MANUAL",
      oldLiters: current.currentLiters,
      newLiters: currentLiters,
      comment: userId,
    },
  });

  return updated;
}

export async function getEvents(stationFuelId) {
  const exists = await prisma.stationFuel.findUnique({
    where: { id: stationFuelId },
  });
  if (!exists) {
    throw new HttpError(404, "Запись топлива не найдена");
  }

  return prisma.fuelEvent.findMany({
    where: { stationFuelId },
    orderBy: { createdAt: "desc" },
  });
}
