import { prisma } from "../lib/prisma.js";
import { calcFuelStatus } from "../lib/fuelStatus.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function runSimulation() {
  const fuels = await prisma.stationFuel.findMany();
  const results = [];

  for (const fuel of fuels) {
    const cars = randomInt(0, 30);
    const litersPerCar = cars === 0 ? 0 : randomInt(5, 40);
    const spent = cars * litersPerCar;
    const oldLiters = fuel.currentLiters;
    const newLiters = Math.max(0, oldLiters - spent);
    const status = calcFuelStatus(newLiters, fuel.capacityLiters);

    const updated = await prisma.stationFuel.update({
      where: { id: fuel.id },
      data: { currentLiters: newLiters, status },
    });

    await prisma.fuelEvent.create({
      data: {
        stationFuelId: fuel.id,
        eventType: "SIMULATION",
        oldLiters,
        newLiters,
        comment: `машин: ${cars}, литров на машину: ${litersPerCar}`,
      },
    });

    results.push(updated);
  }

  return { updated: results.length };
}
