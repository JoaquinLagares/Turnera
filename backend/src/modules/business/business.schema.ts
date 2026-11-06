import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(100),

  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  phone: z.string().min(6).max(30).optional(),

  email: z.string().email().optional(),

  address: z.string().max(200).optional(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;