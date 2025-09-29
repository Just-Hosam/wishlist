-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('NINTENDO', 'PLAYSTATION');

-- CreateTable
CREATE TABLE "GamePrice" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalId" TEXT NOT NULL,
    "countryCode" CHAR(2),
    "currencyCode" CHAR(3),
    "regularPrice" DECIMAL(10,2),
    "currentPrice" DECIMAL(10,2),
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GamePrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GamePrice_gameId_idx" ON "GamePrice"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GamePrice_gameId_platform_key" ON "GamePrice"("gameId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "GamePrice_platform_externalId_key" ON "GamePrice"("platform", "externalId");

-- AddForeignKey
ALTER TABLE "GamePrice" ADD CONSTRAINT "GamePrice_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
