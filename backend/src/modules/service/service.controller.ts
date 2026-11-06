import type { NextFunction, Request, Response } from "express";
import { createService } from "./service.service.js";
import { getServicesByBusiness } from "./service.service.js";


export async function createServiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const service = await createService(req.body);

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
}

export async function getServicesByBusinessController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { businessId } = req.params;

    if (typeof businessId !== "string" || !businessId){
        return res.status(400).json({
            error: "Business ID required",
        })
    }

    const services = await getServicesByBusiness(businessId);
    
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
}
