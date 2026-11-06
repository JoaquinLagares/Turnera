import type { NextFunction, Request, Response } from "express";
import {
  createSchedule,
  getSchedulesByEmployee,
} from "./schedule.service.js";

export async function createScheduleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const schedule = await createSchedule(req.body);

    return res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
}

export async function getSchedulesByEmployeeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employeeId = req.params.employeeId;

    if (typeof employeeId !== "string" || !employeeId) {
      return res.status(400).json({
        error: "Employee ID is required",
      });
    }

    const schedules = await getSchedulesByEmployee(employeeId);

    return res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
}
