-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WISHLIST_GAMES_ON_SALE', 'WISHLIST_GAMES_NOW_AVAILABLE', 'PLAYSTATION_PLUS_MONTHLY_GAMES', 'PLAYSTATION_PLUS_GAME_CATALOG', 'NEW_FEATURE');

-- DropIndex
DROP INDEX "SearchKeyword_nameNormalized_trgm_idx";

-- DropIndex
DROP INDEX "SearchKeyword_searchDocumentNormalized_trgm_idx";

-- DropIndex
DROP INDEX "SearchKeyword_slugNormalized_trgm_idx";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
