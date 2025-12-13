/*
  Warnings:

  - You are about to drop the column `currencyCode` on the `Price` table. All the data in the column will be lost.
  - You are about to alter the column `regularPrice` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `currentPrice` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "currencyCode",
ALTER COLUMN "regularPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "currentPrice" SET DATA TYPE DOUBLE PRECISION;
