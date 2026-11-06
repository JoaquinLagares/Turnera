import { Router } from "express";

import { createAppointmentController } from "./appointment.controller.js";
import { createAppointmentSchema } from "./appointment.schema.js";
import { validateBody } from "../../middleware/validate.js";

const router = Router();

router.post(
  "/",
  validateBody(createAppointmentSchema),
  createAppointmentController
);

export default router;