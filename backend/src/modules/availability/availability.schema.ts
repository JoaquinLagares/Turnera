import { z } from "zod";

export const createAvailabilityOverrideSchema = z
  .object({
    date: z.string().date(),

    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),

    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),

    type: z.enum(["AVAILABLE", "UNAVAILABLE"]),

    employeeId: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && !data.endTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time is required when start time is provided",
      });
    }

    if (!data.startTime && data.endTime) {
      ctx.addIssue({
        code: "custom",
        path: ["startTime"],
        message: "Start time is required when end time is provided",
      });
    }

    if (
      data.startTime &&
      data.endTime &&
      data.startTime >= data.endTime
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }
  });

export type CreateAvailabilityOverrideInput =
  z.infer<typeof createAvailabilityOverrideSchema>;