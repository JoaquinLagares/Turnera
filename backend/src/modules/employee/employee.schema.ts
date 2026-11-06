import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(100),

  businessId: z.string().uuid(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;