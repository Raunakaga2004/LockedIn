/*
  Warnings:

  - The `days_of_week` column on the `Recurrence` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- AlterTable
ALTER TABLE "Recurrence" DROP COLUMN "days_of_week",
ADD COLUMN     "days_of_week" "WeekDays"[] DEFAULT ARRAY[]::"WeekDays"[];
