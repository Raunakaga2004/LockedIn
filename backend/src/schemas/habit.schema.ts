import {z} from 'zod';

export const HabitSchema = z.object({
  user_id : z.string(),
  title : z.string().optional(),
  description : z.string().optional(),
  start_date : z.date().optional(),
  end_date : z.date().optional(),
  frequency : z.string().optional(),
  interval : z.number().positive().optional(),
  days_of_week : z.array(z.string()).optional(),
})

export type HabitType = z.infer<typeof HabitSchema>