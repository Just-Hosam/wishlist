/*
  Warnings:

  - You are about to drop the column `igdbVideos` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "igdbVideos",
ADD COLUMN     "igdbVideoIds" TEXT[];
