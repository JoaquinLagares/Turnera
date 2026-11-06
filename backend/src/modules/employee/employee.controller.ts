import type { NextFunction, Request, Response } from "express";
import {
  createEmployee,
  getEmployeesByBusiness,
} from "./employee.service.js";

export async function createEmployeeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employee = await createEmployee(req.body);

    return res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
}

export async function getEmployeesByBusinessController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const businessId = req.params.businessId;

    if (typeof businessId !== "string" || !businessId) {
      return res.status(400).json({
        error: "Business ID is required",
      });
    }

    const employees = await getEmployeesByBusiness(businessId);

    return res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
}
