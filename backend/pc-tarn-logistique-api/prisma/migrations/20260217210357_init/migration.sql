-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'BENEVOLE');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('BILAN', 'TRAUMA', 'PLAIE', 'HYGIENE', 'MALAISE', 'OXY', 'KITS', 'FORMATION', 'LOGISTIQUE');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('BON', 'MOYEN', 'A_CHANGER', 'HS');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('OPERATIONAL', 'WARNING', 'NON_COMPLIANT');

-- CreateEnum
CREATE TYPE "LotStatus" AS ENUM ('DISPONIBLE', 'NON_OPERATIONNEL');

-- CreateEnum
CREATE TYPE "CheckType" AS ENUM ('DEPARTURE', 'RETURN', 'PERIODIC');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReportUrgency" AS ENUM ('LOW', 'MEDIUM', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "birthdate" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'BENEVOLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
