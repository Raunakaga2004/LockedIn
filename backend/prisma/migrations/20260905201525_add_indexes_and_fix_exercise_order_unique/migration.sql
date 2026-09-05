-- CreateIndex
CREATE INDEX "Habit_user_id_idx" ON "Habit"("user_id");

-- CreateIndex
CREATE INDEX "Habit_Log_user_id_idx" ON "Habit_Log"("user_id");

-- CreateIndex
CREATE INDEX "Habit_Log_habit_id_idx" ON "Habit_Log"("habit_id");

-- CreateIndex
CREATE INDEX "Pomodoro_Session_user_id_idx" ON "Pomodoro_Session"("user_id");

-- CreateIndex
CREATE INDEX "Pomodoro_Session_task_id_idx" ON "Pomodoro_Session"("task_id");

-- CreateIndex
CREATE INDEX "Recurrence_user_id_idx" ON "Recurrence"("user_id");

-- CreateIndex
CREATE INDEX "Recurrence_base_task_id_idx" ON "Recurrence"("base_task_id");

-- CreateIndex
CREATE INDEX "Recurrence_is_active_start_date_idx" ON "Recurrence"("is_active", "start_date");

-- CreateIndex
CREATE INDEX "Tag_user_id_delete_idx" ON "Tag"("user_id", "delete");

-- CreateIndex
CREATE INDEX "Tag_tag_name_idx" ON "Tag"("tag_name");

-- CreateIndex
CREATE INDEX "Task_user_id_delete_idx" ON "Task"("user_id", "delete");

-- CreateIndex
CREATE INDEX "Task_Tag_user_id_idx" ON "Task_Tag"("user_id");

-- CreateIndex
CREATE INDEX "Task_Tag_task_id_idx" ON "Task_Tag"("task_id");

-- CreateIndex
CREATE INDEX "Task_Tag_tag_id_idx" ON "Task_Tag"("tag_id");

-- CreateIndex
CREATE INDEX "Time_Blocking_user_id_idx" ON "Time_Blocking"("user_id");

-- CreateIndex
CREATE INDEX "Time_Blocking_habit_id_idx" ON "Time_Blocking"("habit_id");

-- CreateIndex
CREATE INDEX "Time_Blocking_task_id_idx" ON "Time_Blocking"("task_id");

-- CreateIndex
CREATE INDEX "Workout_Exercise_Log_user_id_idx" ON "Workout_Exercise_Log"("user_id");

-- CreateIndex
CREATE INDEX "Workout_Exercise_Log_workout_session_log_id_idx" ON "Workout_Exercise_Log"("workout_session_log_id");

-- CreateIndex
CREATE INDEX "Workout_Exercise_Log_workout_plan_exercise_id_idx" ON "Workout_Exercise_Log"("workout_plan_exercise_id");

-- CreateIndex
CREATE INDEX "Workout_Plan_user_id_delete_idx" ON "Workout_Plan"("user_id", "delete");

-- CreateIndex
CREATE INDEX "Workout_Plan_Exercise_user_id_idx" ON "Workout_Plan_Exercise"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_Plan_Exercise_workout_plan_id_order_key" ON "Workout_Plan_Exercise"("workout_plan_id", "order");

-- CreateIndex
CREATE INDEX "Workout_Session_Log_user_id_idx" ON "Workout_Session_Log"("user_id");

-- CreateIndex
CREATE INDEX "Workout_Session_Log_workout_plan_id_idx" ON "Workout_Session_Log"("workout_plan_id");

