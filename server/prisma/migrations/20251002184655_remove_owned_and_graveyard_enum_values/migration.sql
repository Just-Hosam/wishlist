/*
  Warnings:

  - The values [OWNED,GRAVEYARD] on the enum `GameCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameCategory_new" AS ENUM ('WISHLIST', 'LIBRARY', 'COMPLETED', 'ARCHIVED');
ALTER TABLE "Game" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "category" TYPE "GameCategory_new" USING ("category"::text::"GameCategory_new");
ALTER TYPE "GameCategory" RENAME TO "GameCategory_old";
ALTER TYPE "GameCategory_new" RENAME TO "GameCategory";
DROP TYPE "GameCategory_old";
ALTER TABLE "Game" ALTER COLUMN "category" SET DEFAULT 'WISHLIST';
COMMIT;
