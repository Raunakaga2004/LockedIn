/*
  Warnings:

  - The `days_of_week` column on the `Habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `task_completed_count` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `task_id` on the `Recurrence` table. All the data in the column will be lost.
  - You are about to drop the column `repeat` on the `Task` table. All the data in the column will be lost.
  - Added the required column `base_task_id` to the `Recurrence` table without a default value. This is not possible if the table is not empty.
  - Made the column `start_date` on table `Recurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `Recurrence` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Recurrence" DROP CONSTRAINT "Recurrence_task_id_fkey";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "days_of_week",
ADD COLUMN     "days_of_week" "WeekDays"[] DEFAULT ARRAY[]::"WeekDays"[];

-- AlterTable
ALTER TABLE "Recurrence" DROP COLUMN "task_completed_count",
DROP COLUMN "task_id",
ADD COLUMN     "base_task_id" TEXT NOT NULL,
ADD COLUMN     "last_occurence" TIMESTAMP(3),
ALTER COLUMN "start_date" SET NOT NULL,
ALTER COLUMN "occurence_count" SET DEFAULT 0,
ALTER COLUMN "exceptions" SET DEFAULT ARRAY[]::TIMESTAMP(3)[],
ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "repeat",
ADD COLUMN     "createdFromRecurrence" BOOLEAN DEFAULT false,
ADD COLUMN     "recurrence_id" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurrence_id_fkey" FOREIGN KEY ("recurrence_id") REFERENCES "Recurrence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrence" ADD CONSTRAINT "Recurrence_base_task_id_fkey" FOREIGN KEY ("base_task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
