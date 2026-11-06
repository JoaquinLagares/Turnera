import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (
    err instanceof Error &&
    err.message === "APPOINTMENT_OVERLAP"
  ) {
    return res.status(409).json({
      error: "This time slot is already occupied",
    });
  }

  if (
    err instanceof Error &&
    err.message === "SCHEDULE_OVERLAP"
  ) {
    return res.status(409).json({
      error: "Schedule overlaps with an existing schedule",
    });
  }

  if (
    err instanceof Error &&
    err.message === "INVALID_APPOINTMENT_SLOT"
  ) {
    return res.status(409).json({
      error: "The selected appointment slot is not available",
    });
  }

  if (
    err instanceof Error &&
    err.message === "SERVICE_NOT_FOUND"
  ) {
    return res.status(404).json({
      error: "Service not found",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Resource already exists",
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        error: "Related resource does not exist",
      });
    }
  }
  if (
    err instanceof Error &&
    err.message === "EMPLOYEE_NOT_FOUND"
  ) {
    return res.status(404).json({
      error: "Employee not found",
    });
  }

  if (
    err instanceof Error &&
    err.message === "INVALID_APPOINTMENT_DATE"
  ) {
    return res.status(400).json({
      error: "Invalid appointment date",
    });
  }

  if (
    err instanceof Error &&
    err.message === "OUTSIDE_WORKING_HOURS"
  ) {
    return res.status(409).json({
      error: "Appointment is outside employee working hours",
    });
  }

  if (
    err instanceof Error &&
    err.message === "EMPLOYEE_UNAVAILABLE"
  ) {
    return res.status(409).json({
      error: "Employee is unavailable at this time",
    });
  }
  // Solo errores inesperados
  console.error(err);

  return res.status(500).json({
    error: "Internal server error",
  });
}
