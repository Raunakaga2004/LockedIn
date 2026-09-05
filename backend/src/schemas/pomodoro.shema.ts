import { z } from 'zod';

// user_id intentionally omitted - see habit.schema.ts for why.
export const PomodoroSessionSchema = z.object({
  task_id: z.string().optional(),
  notes: z.string().optional(),
  start_time: z.coerce.date().optional(),
  end_time: z.coerce.date().optional(),
  number_focus: z.number().int().nonnegative().optional(),
  number_short_break: z.number().int().nonnegative().optional(),
  number_long_break: z.number().int().nonnegative().optional(),
  focus_time: z.number().int().positive().optional(),
  short_break_time: z.number().int().positive().optional(),
  long_break_time: z.number().int().positive().optional(),
  number_of_focus_session_before_longBreak: z.number().int().positive().optional(),
  interruption_time: z.number().int().nonnegative().optional()
})

export type PomodoroSessionType = z.infer<typeof PomodoroSessionSchema>
