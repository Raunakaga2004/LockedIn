-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('day', 'week', 'month', 'quick_task');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('in_progress', 'completed', 'uncompleted');

-- CreateEnum
CREATE TYPE "RecurrenceHabitFrequency" AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "otp_expires" TIMESTAMP(3) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TaskType" NOT NULL DEFAULT 'quick_task',
    "status" "TaskStatus" NOT NULL DEFAULT 'uncompleted',
    "urgent" BOOLEAN DEFAULT false,
    "important" BOOLEAN DEFAULT false,
    "repeat" BOOLEAN DEFAULT false,
    "expected_pomodoro" INTEGER,
    "actual_pomodoro" INTEGER,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recurrence" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "frequency" "RecurrenceHabitFrequency" NOT NULL DEFAULT 'daily',
    "interval" INTEGER NOT NULL DEFAULT 1,
    "days_of_week" TEXT[],
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "occurence_count" INTEGER NOT NULL,
    "task_completed_count" INTEGER NOT NULL,
    "exceptions" TIMESTAMP(3)[],
    "is_active" BOOLEAN DEFAULT true,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pomodoro_Session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "number_focus" INTEGER NOT NULL,
    "number_short_break" INTEGER NOT NULL,
    "number_long_break" INTEGER NOT NULL,
    "focus_time" INTEGER NOT NULL DEFAULT 25,
    "short_break_time" INTEGER NOT NULL DEFAULT 5,
    "long_break_time" INTEGER NOT NULL DEFAULT 15,
    "number_of_focus_session_before_longBreak" INTEGER NOT NULL DEFAULT 4,
    "interruption_time" INTEGER NOT NULL,
    "notes" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pomodoro_Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "frequency" "RecurrenceHabitFrequency" NOT NULL DEFAULT 'daily',
    "interval" INTEGER NOT NULL DEFAULT 1,
    "days_of_week" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit_Log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "completed" BOOLEAN DEFAULT false,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time_Blocking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "habit_id" TEXT,
    "task_id" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Time_Blocking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tag_name" TEXT NOT NULL,
    "description" TEXT,
    "color_code" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task_Tag" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "Task_Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Plan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Workout_Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Plan_Exercise" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_plan_id" TEXT NOT NULL,
    "exercise_name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "notes" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Workout_Plan_Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Session_Log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_plan_id" TEXT NOT NULL,
    "notes" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_Session_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Exercise_Log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_session_log_id" TEXT NOT NULL,
    "workout_plan_exercise_id" TEXT NOT NULL,
    "set" INTEGER[],
    "reps" INTEGER[],
    "rest" INTEGER[],
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "max_weight" DOUBLE PRECISION,
    "notes" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_Exercise_Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrence" ADD CONSTRAINT "Recurrence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrence" ADD CONSTRAINT "Recurrence_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pomodoro_Session" ADD CONSTRAINT "Pomodoro_Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pomodoro_Session" ADD CONSTRAINT "Pomodoro_Session_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit_Log" ADD CONSTRAINT "Habit_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit_Log" ADD CONSTRAINT "Habit_Log_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time_Blocking" ADD CONSTRAINT "Time_Blocking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time_Blocking" ADD CONSTRAINT "Time_Blocking_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time_Blocking" ADD CONSTRAINT "Time_Blocking_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Tag" ADD CONSTRAINT "Task_Tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Tag" ADD CONSTRAINT "Task_Tag_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Tag" ADD CONSTRAINT "Task_Tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Plan" ADD CONSTRAINT "Workout_Plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Plan_Exercise" ADD CONSTRAINT "Workout_Plan_Exercise_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Plan_Exercise" ADD CONSTRAINT "Workout_Plan_Exercise_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "Workout_Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Session_Log" ADD CONSTRAINT "Workout_Session_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Session_Log" ADD CONSTRAINT "Workout_Session_Log_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "Workout_Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Exercise_Log" ADD CONSTRAINT "Workout_Exercise_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Exercise_Log" ADD CONSTRAINT "Workout_Exercise_Log_workout_session_log_id_fkey" FOREIGN KEY ("workout_session_log_id") REFERENCES "Workout_Session_Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Exercise_Log" ADD CONSTRAINT "Workout_Exercise_Log_workout_plan_exercise_id_fkey" FOREIGN KEY ("workout_plan_exercise_id") REFERENCES "Workout_Plan_Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
