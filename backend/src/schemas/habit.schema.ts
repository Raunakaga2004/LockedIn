import { z } from 'zod';

// user_id is deliberately not part of this schema: it's derived from the
// verified JWT on the server, never sent by the client. Requiring it here
// meant every real request failed validation with 400.
export const HabitSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  interval: z.number().int().positive().optional(),
  days_of_week: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])).optional(),
})

export type HabitType = z.infer<typeof HabitSchema>

export const HabitLogSchema = z.object({
  habit_id: z.string().optional(),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
})

export type HabitLogType = z.infer<typeof HabitLogSchema>
