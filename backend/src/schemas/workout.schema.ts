import { z } from "zod";

// user_id intentionally omitted - see habit.schema.ts for why.
export const WorkoutPlanSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export type WorkoutPlanType = z.infer<typeof WorkoutPlanSchema>;

export const WorkoutPlanExerciseSchema = z.object({
  workout_plan_id: z.string().optional(),
  exercise_name: z.string().optional(),
  description: z.string().optional(),
  order: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export type WorkoutPlanExerciseType = z.infer<typeof WorkoutPlanExerciseSchema>;

export const WorkoutSessionLogSchema = z.object({
  workout_plan_id: z.string().optional(),
  notes: z.string().optional(),
  start_time: z.coerce.date().optional(),
  end_time: z.coerce.date().optional(),
});

export type WorkoutSessionLogType = z.infer<typeof WorkoutSessionLogSchema>;

export const WorkoutExerciseLogSchema = z.object({
  workout_session_log_id: z.string().optional(),
  workout_plan_exercise_id: z.string().optional(),
  set: z.array(z.number().int().positive()).optional(),
  reps: z.array(z.number().int().positive()).optional(),
  rest: z.array(z.number().int().nonnegative()).optional(),
  start_time: z.coerce.date().optional(),
  end_time: z.coerce.date().optional(),
  max_weight: z.number().positive().optional(),
  notes: z.string().optional(),
});

export type WorkoutExerciseLogType = z.infer<typeof WorkoutExerciseLogSchema>;
