import {z} from 'zod';

export const PomodoroSessionSchema = z.object({
  user_id : z.string(),
  task_id : z.string().optional(),
  notes : z.string().optional(),
  start_time : z.date().optional(),
  end_time : z.date().optional(),
  number_focus : z.number().positive().optional(),
  number_short_break : z.number().positive().optional(),
  number_long_break : z.number().positive().optional(),
  focus_time : z.number().positive().optional(),
  short_break_time : z.number().positive().optional(),
  long_break_time : z.number().positive().optional(),
  number_of_focus_session_before_longBreak : z.number().positive().optional(),
  interruption_time : z.number().positive().optional()
})

export type PomodoroSessionType = z.infer<typeof PomodoroSessionSchema>