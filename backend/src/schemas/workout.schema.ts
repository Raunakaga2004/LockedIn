import { z } from "zod";

export const WorkoutPlanSchema = z.object({
  user_id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export type WorkoutPlanType = z.infer<typeof WorkoutPlanSchema>;

export const WorkoutPlanExerciseSchema = z.object({
  user_id: z.string(),
  workout_plan_id: z.string().optional(),
  exercise_name: z.string().optional(),
  description: z.string().optional(),
  order: z.number().positive(),
  notes: z.string().optional(),
});

export type WorkoutPlanExerciseType = z.infer<typeof WorkoutPlanExerciseSchema>;

export const WorkoutSessionLogSchema = z.object({
  user_id: z.string(),
  workout_plan_id: z.string().optional(),
  notes: z.string().optional(),
  start_time: z.date().optional(),
  end_time: z.date().optional(),
});

export type WorkoutSessionLogType = z.infer<typeof WorkoutSessionLogSchema>;

export const WorkoutExerciseLogSchema = z.object({
  user_id: z.string(),
  workout_session_log_id: z.string().optional(),
  workout_plan_exercise_id: z.string().optional(),
  set: z.array(z.number().positive()).optional(),
  reps: z.array(z.number().positive()).optional(),
  rest: z.array(z.number().positive()).optional(),
  start_time: z.date().optional(),
  end_time: z.date().optional(),
  max_weight: z.float32().optional(),
  notes: z.string().optional(),
});

export type WorkoutExerciseLogType = z.infer<typeof WorkoutExerciseLogSchema>;