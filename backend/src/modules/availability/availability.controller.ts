import type { NextFunction, Request, Response } from "express";

import {
  createAvailabilityOverride,
  getAvailabilityOverridesByEmployee,
} from "./availability.service.js";

export async function createAvailabilityOverrideController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const override = await createAvailabilityOverride(req.body);

    return res.status(201).json(override);
  } catch (error) {
    next(error);
  }
}

export async function getAvailabilityOverridesByEmployeeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employeeId = req.params.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        error: "Employee ID is required",
      });
    }

    const overrides =
      await getAvailabilityOverridesByEmployee(employeeId);

    return res.status(200).json(overrides);
  } catch (error) {
    next(error);
  }
}