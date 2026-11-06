import { Router } from "express";

import {
  createAvailabilityOverrideController,
  getAvailabilityOverridesByEmployeeController,
} from "./availability.controller.js";

import { createAvailabilityOverrideSchema } from "./availability.schema.js";
import { validateBody } from "../../middleware/validate.js";

const router = Router();

router.post(
  "/",
  validateBody(createAvailabilityOverrideSchema),
  createAvailabilityOverrideController
);

router.get(
  "/employee/:employeeId",
  getAvailabilityOverridesByEmployeeController
);

export default router;