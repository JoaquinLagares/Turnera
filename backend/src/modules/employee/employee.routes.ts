import { Router } from "express";
import {
  createEmployeeController,
  getEmployeesByBusinessController,
} from "./employee.controller.js";

import { createEmployeeSchema } from "./employee.schema.js";
import { validateBody } from "../../middleware/validate.js";

const router = Router();

router.post(
  "/",
  validateBody(createEmployeeSchema),
  createEmployeeController
);

router.get(
  "/business/:businessId",
  getEmployeesByBusinessController
);

export default router;