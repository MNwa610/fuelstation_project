import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const networks = [
  { name: "Газпромнефть", description: "Сеть АЗС Газпромнефть" },
  { name: "Лукойл", description: "Сеть АЗС Лукойл" },
  { name: "Роснефть", description: "Сеть АЗС Роснефть" },
  { name: "Татнефть", description: "Сеть АЗС Татнефть" },
  { name: "Shell", description: "Международная сеть Shell" },
];

const fuelTypes = [
  { code: "AI92", name: "АИ-92" },
  { code: "AI95", name: "АИ-95" },
  { code: "AI98", name: "АИ-98" },
  { code: "DT", name: "Дизель" },
  { code: "GAS", name: "Газ" },
];

const stations = [
  { name: "АЗС Сокольники", address: "ул. Сокольнический Вал, 1", lat: 55.789, lng: 37.679, networkIndex: 0 },
  { name: "АЗС ВДНХ", address: "пр. Мира, 119", lat: 55.827, lng: 37.632, networkIndex: 1 },
  { name: "АЗС Кузнецкий мост", address: "ул. Кузнецкий мост, 7", lat: 55.761, lng: 37.624, networkIndex: 2 },
  { name: "АЗС Таганка", address: "ул. Таганская, 26", lat: 55.741, lng: 37.653, networkIndex: 3 },
  { name: "АЗС Юго-Западная", address: "пр. Вернадского, 86", lat: 55.663, lng: 37.483, networkIndex: 4 },
  { name: "АЗС Ленинский", address: "Ленинский пр., 75", lat: 55.691, lng: 37.553, networkIndex: 0 },
  { name: "АЗС Сити", address: "Пресненская наб., 12", lat: 55.749, lng: 37.539, networkIndex: 1 },
  { name: "АЗС Измайлово", address: "ул. Первомайская, 42", lat: 55.794, lng: 37.799, networkIndex: 2 },
  { name: "АЗС Химки", address: "Ленинградское ш., 25", lat: 55.897, lng: 37.429, networkIndex: 3 },
  { name: "АЗС Марьино", address: "ул. Люблинская, 153", lat: 55.650, lng: 37.743, networkIndex: 4 },
];

const statuses = ["AVAILABLE", "LOW", "OUT"];

function randomStatus() {
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function litersForStatus(status, capacity) {
  if (status === "OUT") return 0;
  if (status === "LOW") return capacity * (0.05 + Math.random() * 0.15);
  return capacity * (0.4 + Math.random() * 0.55);
}

function calcStatus(current, capacity) {
  if (current <= 0) return "OUT";
  const ratio = current / capacity;
  if (ratio < 0.15) return "LOW";
  return "AVAILABLE";
}

async function main() {
  await prisma.fuelEvent.deleteMany();
  await prisma.stationFuel.deleteMany();
  await prisma.station.deleteMany();
  await prisma.fuelType.deleteMany();
  await prisma.network.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@gazprom.ru",
      passwordHash,
      fullName: "Администратор",
      role: "ADMIN",
    },
  });

  const createdNetworks = [];
  for (const n of networks) {
    createdNetworks.push(await prisma.network.create({ data: n }));
  }

  const createdFuelTypes = [];
  for (const ft of fuelTypes) {
    createdFuelTypes.push(await prisma.fuelType.create({ data: ft }));
  }

  const fuelCodesForStation = ["AI92", "AI95", "DT"];

  for (const s of stations) {
    const station = await prisma.station.create({
      data: {
        networkId: createdNetworks[s.networkIndex].id,
        name: s.name,
        address: s.address,
        lat: s.lat,
        lng: s.lng,
        phone: "+7 (495) 000-00-00",
        isActive: true,
      },
    });

    for (const code of fuelCodesForStation) {
      const fuelType = createdFuelTypes.find((f) => f.code === code);
      const capacity = 20000 + Math.floor(Math.random() * 10000);
      let status = randomStatus();
      let currentLiters = litersForStatus(status, capacity);
      status = calcStatus(currentLiters, capacity);
      const basePrice =
        code === "AI92" ? 52 : code === "AI95" ? 56 : code === "DT" ? 58 : 55;

      await prisma.stationFuel.create({
        data: {
          stationId: station.id,
          fuelTypeId: fuelType.id,
          status,
          price: basePrice + Math.random() * 3,
          capacityLiters: capacity,
          currentLiters: Math.round(currentLiters),
        },
      });
    }
  }

  console.log("Seed completed: 5 networks, 10 stations, 5 fuel types, admin user");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
