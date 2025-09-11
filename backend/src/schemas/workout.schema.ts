import {z} from 'zod';

export const WorkoutPlanSchema = z.object({
  user_id : z.string(),
  title : z.string().optional(),
  description : z.string().optional(),
})

export type WorkoutPlanType = z.infer<typeof WorkoutPlanSchema>

export const WorkoutPlanExerciseSchema = z.object({
  user_id : z.string(),
  workout_plan_id : z.string().optional(),
  exercise_name : z.string().optional(),
  description : z.string().optional(),
  order : z.number().positive(),
  notes : z.string().optional(),
})

export type WorkoutPlanExerciseType = z.infer<typeof WorkoutPlanExerciseSchema>