import {date, z} from 'zod';

export const TaskSchema = z.object({
  title : z.string().optional() , 
  description : z.string().optional() , 
  type : z.enum(["day", "week", "month", "quick_task"]).optional(), 
  status : z.enum(["in_progress", "completed", "uncompleted"]).optional(), 
  urgent : z.boolean().optional(), 
  important : z.boolean().optional(), 
  expected_pomodoro : z.number().int().positive().optional()
})

export type TaskType = z.infer<typeof TaskSchema>

export const RecurrenceSchema = z.object({
  base_task_id : z.string().optional(), 
  frequency : z.enum(["daily", "weekly", "monthly", "yearly"]).optional(), 
  interval : z.number().int().positive().optional(), 
  days_of_week : z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(), 
  start_date : z.date().optional() , 
  end_date : z.date().optional(),
  exception : z.array(z.date()).optional()
})

export type RecurrenceType = z.infer<typeof RecurrenceSchema>