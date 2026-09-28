/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,eventKey]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Notification_userId_type_eventKey_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_type_eventKey_key" ON "Notification"("userId", "type", "eventKey");
