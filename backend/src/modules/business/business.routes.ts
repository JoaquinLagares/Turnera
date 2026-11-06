import { Router } from "express";
import { createBusinessController } from "./business.controller.js";
import { createBusinessSchema } from "./business.schema.js";
import { validateBody } from "../../middleware/validate.js";


const router = Router();

router.post("/",
    validateBody(createBusinessSchema),
    createBusinessController);
    
    export default router;