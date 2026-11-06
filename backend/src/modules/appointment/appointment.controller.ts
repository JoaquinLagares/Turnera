import type { NextFunction, Request, Response } from "express";
import { createAppointment } from "./appointment.service.js";

export async function createAppointmentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const appointment = await createAppointment(req.body);

    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
}