import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["day", "week", "month", "quick_task"]).optional(),
  status: z.enum(["in_progress", "completed", "uncompleted"]).optional(),
  urgent: z.boolean().optional(),
  important: z.boolean().optional(),
  expected_pomodoro: z.number().int().positive().optional()
})

export type TaskType = z.infer<typeof TaskSchema>

// Coerces the string query params a GET request actually carries (?urgent=true)
// into real booleans, instead of z.coerce.boolean() which treats "false" as truthy.
const booleanQueryParam = z.preprocess((val) => {
  if (typeof val === "string") return val === "true";
  return val;
}, z.boolean()).optional();

// Used to validate ?query params on GET /getTasks - kept separate from TaskSchema
// because TaskSchema doesn't declare these filter-only fields, so validating
// against TaskSchema silently stripped every filter out of the request.
export const TaskFilterSchema = z.object({
  status: z.enum(["in_progress", "completed", "uncompleted"]).optional(),
  urgent: booleanQueryParam,
  important: booleanQueryParam,
  type: z.enum(["day", "week", "month", "quick_task"]).optional(),
  search_name: z.string().optional(),
  tag_id: z.string().optional(),
})

export type TaskFilterType = z.infer<typeof TaskFilterSchema>

export const RecurrenceSchema = z.object({
  base_task_id: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  interval: z.number().int().positive().optional(),
  days_of_week: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])).optional(),
  // z.date() only accepts real Date instances; JSON bodies carry dates as
  // strings, so every request would fail validation without coerce.
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  exceptions: z.array(z.coerce.date()).optional()
})

export type RecurrenceType = z.infer<typeof RecurrenceSchema>
