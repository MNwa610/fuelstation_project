import { prisma } from "../lib/prisma.js";

export async function getAllStations() {
  return prisma.station.findMany({
    where: { isActive: true },
    include: {
      network: true,
      fuels: {
        include: {
          fuelType: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}
