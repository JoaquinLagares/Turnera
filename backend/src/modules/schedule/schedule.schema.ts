import { z } from "zod";

export const createScheduleSchema = z.object({
  dayOfWeek: z
    .number()
    .int()
    .min(0)
    .max(6),

  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time"),

  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time"),

  employeeId: z.string().uuid(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;