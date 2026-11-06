import { Router } from "express";
import {
  createScheduleController,
  getSchedulesByEmployeeController,
} from "./schedule.controller.js";

import { createScheduleSchema } from "./schedule.schema.js";
import { validateBody } from "../../middleware/validate.js";

const router = Router();

router.post(
  "/",
  validateBody(createScheduleSchema),
  createScheduleController
);

router.get(
  "/employee/:employeeId",
  getSchedulesByEmployeeController
);

export default router;