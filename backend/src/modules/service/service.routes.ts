import { Router } from "express";
import { createServiceController, getServicesByBusinessController } from "./service.controller.js";
import { createServiceSchema } from "./service.schema.js";
import { validateBody } from "../../middleware/validate.js";


const router = Router();

router.post(
  "/",
  validateBody(createServiceSchema),
  createServiceController
);

router.get(
  "/business/:businessId",
  getServicesByBusinessController
);
export default router;