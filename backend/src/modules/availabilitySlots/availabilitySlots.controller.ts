import type { NextFunction, Request, Response } from "express";
import { getAvailableSlots } from "./availabilitySlots.service.js";

export async function getAvailableSlotsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employeeId = req.query.employeeId;
    const serviceId = req.query.serviceId;
    const date = req.query.date;

    if (
      typeof employeeId !== "string" ||
      typeof serviceId !== "string" ||
      typeof date !== "string"
    ) {
      return res.status(400).json({
        error: "employeeId, serviceId and date are required",
      });
    }

    const slots = await getAvailableSlots(
      employeeId,
      serviceId,
      date
    );

    return res.status(200).json(slots);
  } catch (error) {
    next(error);
  }
}