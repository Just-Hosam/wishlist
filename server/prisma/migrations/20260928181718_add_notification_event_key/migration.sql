/*
  Warnings:

  - Added the required column `eventKey` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "eventKey" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_userId_type_eventKey_idx" ON "Notification"("userId", "type", "eventKey");
