/*
  Warnings:

  - You are about to drop the column `createdFromRecurrence` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" ALTER COLUMN "start_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "createdFromRecurrence";
