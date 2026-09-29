-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FuelStatus" AS ENUM ('AVAILABLE', 'LOW', 'OUT');

-- CreateEnum
CREATE TYPE "FuelEventType" AS ENUM ('MANUAL', 'SIMULATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FuelType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StationFuel" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "fuelTypeId" TEXT NOT NULL,
    "status" "FuelStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price" DOUBLE PRECISION NOT NULL,
    "capacityLiters" DOUBLE PRECISION NOT NULL,
    "currentLiters" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StationFuel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelEvent" (
    "id" TEXT NOT NULL,
    "stationFuelId" TEXT NOT NULL,
    "eventType" "FuelEventType" NOT NULL,
    "oldLiters" DOUBLE PRECISION NOT NULL,
    "newLiters" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FuelEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FuelType_code_key" ON "FuelType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StationFuel_stationId_fuelTypeId_key" ON "StationFuel"("stationId", "fuelTypeId");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StationFuel" ADD CONSTRAINT "StationFuel_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StationFuel" ADD CONSTRAINT "StationFuel_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelEvent" ADD CONSTRAINT "FuelEvent_stationFuelId_fkey" FOREIGN KEY ("stationFuelId") REFERENCES "StationFuel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
