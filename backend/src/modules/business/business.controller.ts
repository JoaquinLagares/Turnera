import type { Request, Response, NextFunction } from "express";
import { createBusiness } from "./business.service.js";

export async function createBusinessController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const business = await createBusiness(req.body);

    res.status(201).json(business);
  } catch (error) {
    next(error)
  }
}