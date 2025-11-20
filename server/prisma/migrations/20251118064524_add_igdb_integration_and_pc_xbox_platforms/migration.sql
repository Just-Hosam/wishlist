-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Platform" ADD VALUE 'PC';
ALTER TYPE "Platform" ADD VALUE 'XBOX';

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "igdbGameId" TEXT;

-- CreateTable
CREATE TABLE "IGDBGame" (
    "id" TEXT NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alternativeNames" TEXT[],
    "summary" TEXT NOT NULL,
    "coverImageId" TEXT NOT NULL,
    "screenshotImageIds" TEXT[],
    "videoId" TEXT,
    "genreIds" INTEGER[],
    "platforms" "Platform"[],
    "firstReleaseDate" INTEGER NOT NULL,
    "hypes" INTEGER DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "ratingCount" INTEGER DEFAULT 0,
    "aggregatedRating" DOUBLE PRECISION,
    "aggregatedRatingCount" INTEGER DEFAULT 0,
    "playstationUrlSegment" TEXT,
    "nintendoUrlSegment" TEXT,
    "steamUrlSegment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IGDBGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IGDBGame_igdbId_key" ON "IGDBGame"("igdbId");

-- CreateIndex
CREATE INDEX "IGDBGame_name_idx" ON "IGDBGame"("name");

-- CreateIndex
CREATE INDEX "IGDBGame_igdbId_idx" ON "IGDBGame"("igdbId");
