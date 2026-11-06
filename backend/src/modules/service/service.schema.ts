import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(300).optional(),

  durationMinutes: z
    .number()
    .int()
    .positive(),

  priceCents: z
    .number()
    .int()
    .nonnegative(),

  depositCents: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  businessId: z.string().uuid(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;