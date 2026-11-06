import { z } from "zod";

export const createAppointmentSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(6).max(30),
  customerEmail: z.string().email().optional(),

  startAt: z.iso.datetime({offset:true}),

  businessId: z.string().uuid(),
  serviceId: z.string().uuid(),
  employeeId: z.string().uuid(),
});

export type CreateAppointmentInput =
  z.infer<typeof createAppointmentSchema>;                             