import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";
import app from "../src/app.js";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-secret-for-jest";
}

async function ensureFixture() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@gazprom.ru" },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: "admin@gazprom.ru",
      passwordHash,
      fullName: "Администратор",
      role: "ADMIN",
    },
  });

  let fuel = await prisma.stationFuel.findFirst();
  if (fuel) {
    return fuel;
  }

  const network = await prisma.network.create({
    data: { name: "Тест сеть" },
  });
  const fuelType = await prisma.fuelType.create({
    data: { code: "TEST92", name: "Тест АИ-92" },
  });
  const station = await prisma.station.create({
    data: {
      networkId: network.id,
      name: "Тестовая АЗС",
      address: "Тестовая улица, 1",
      lat: 55.75,
      lng: 37.62,
    },
  });
  fuel = await prisma.stationFuel.create({
    data: {
      stationId: station.id,
      fuelTypeId: fuelType.id,
      status: "AVAILABLE",
      price: 55,
      capacityLiters: 10000,
      currentLiters: 8000,
    },
  });
  return fuel;
}

describe("auth and station fuel", () => {
  let fuelId;

  beforeAll(async () => {
    const fuel = await ensureFixture();
    fuelId = fuel.id;
  });

  it("регистрирует нового пользователя", async () => {
    const email = `user${Date.now()}@test.ru`;
    const res = await request(app).post("/api/v1/auth/register").send({
      email,
      password: "123456",
      fullName: "Тест",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.role).toBe("USER");
    expect(res.body.passwordHash).toBeUndefined();
  });

  it("логинит администратора и выдаёт JWT", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gazprom.ru",
      password: "admin123",
    });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token.split(".").length).toBe(3);
    expect(res.body.user.role).toBe("ADMIN");
  });

  it("PATCH без токена возвращает 401", async () => {
    const res = await request(app)
      .patch(`/api/v1/station-fuels/${fuelId}`)
      .send({ currentLiters: 1000 });

    expect(res.status).toBe(401);
  });

  it("PATCH с токеном USER возвращает 403", async () => {
    const email = `plain${Date.now()}@test.ru`;
    await request(app).post("/api/v1/auth/register").send({
      email,
      password: "123456",
      fullName: "Пользователь",
    });
    const login = await request(app).post("/api/v1/auth/login").send({
      email,
      password: "123456",
    });

    const res = await request(app)
      .patch(`/api/v1/station-fuels/${fuelId}`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ currentLiters: 1000 });

    expect(res.status).toBe(403);
  });

  it("PATCH с токеном ADMIN возвращает 200 и создаёт FuelEvent", async () => {
    const login = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gazprom.ru",
      password: "admin123",
    });

    const res = await request(app)
      .patch(`/api/v1/station-fuels/${fuelId}`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ currentLiters: 500 });

    expect(res.status).toBe(200);
    expect(res.body.currentLiters).toBe(500);
    expect(res.body.status).toBe("LOW");

    const events = await prisma.fuelEvent.findMany({
      where: { stationFuelId: fuelId, eventType: "MANUAL" },
      orderBy: { createdAt: "desc" },
    });
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].newLiters).toBe(500);
  });
});
