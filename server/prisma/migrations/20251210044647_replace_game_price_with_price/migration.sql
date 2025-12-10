/*
  Warnings:

  - You are about to drop the `GamePrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PriceDescription" AS ENUM ('STANDARD', 'FREE_TO_PLAY', 'PS_PLUS', 'PS_PLUS_EXTRA', 'PS_PLUS_PREMIUM');

-- DropForeignKey
ALTER TABLE "GamePrice" DROP CONSTRAINT "GamePrice_gameId_fkey";

-- DropTable
DROP TABLE "GamePrice";

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "externalId" TEXT,
    "platform" "Platform" NOT NULL,
    "description" "PriceDescription",
    "countryCode" CHAR(2),
    "currencyCode" CHAR(3),
    "regularPrice" DECIMAL(10,2),
    "currentPrice" DECIMAL(10,2),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TrackedPrices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TrackedPrices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Price_storeUrl_key" ON "Price"("storeUrl");

-- CreateIndex
CREATE INDEX "Price_platform_externalId_idx" ON "Price"("platform", "externalId");

-- CreateIndex
CREATE INDEX "_TrackedPrices_B_index" ON "_TrackedPrices"("B");

-- AddForeignKey
ALTER TABLE "_TrackedPrices" ADD CONSTRAINT "_TrackedPrices_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackedPrices" ADD CONSTRAINT "_TrackedPrices_B_fkey" FOREIGN KEY ("B") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;
