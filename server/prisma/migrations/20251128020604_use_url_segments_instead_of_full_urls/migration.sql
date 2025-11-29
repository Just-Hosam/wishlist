/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `igdbGameId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `IGDBGame` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[igdbId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Game_name_idx";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "coverImageUrl",
DROP COLUMN "description",
DROP COLUMN "igdbGameId",
DROP COLUMN "name",
ADD COLUMN     "igdbCoverImageId" TEXT,
ADD COLUMN     "igdbFirstReleaseDate" INTEGER,
ADD COLUMN     "igdbId" INTEGER,
ADD COLUMN     "igdbName" TEXT,
ADD COLUMN     "igdbNintendoUrlSegment" TEXT,
ADD COLUMN     "igdbPlatformIds" INTEGER[],
ADD COLUMN     "igdbPlaystationUrlSegment" TEXT,
ADD COLUMN     "igdbScreenshotIds" TEXT[],
ADD COLUMN     "igdbSlug" TEXT,
ADD COLUMN     "igdbSteamUrlSegment" TEXT,
ADD COLUMN     "igdbSummary" TEXT,
ADD COLUMN     "igdbVideoId" TEXT;

-- DropTable
DROP TABLE "IGDBGame";

-- CreateIndex
CREATE UNIQUE INDEX "Game_igdbId_key" ON "Game"("igdbId");

-- CreateIndex
CREATE INDEX "Game_igdbName_idx" ON "Game"("igdbName");

-- CreateIndex
CREATE INDEX "Game_igdbId_idx" ON "Game"("igdbId");
