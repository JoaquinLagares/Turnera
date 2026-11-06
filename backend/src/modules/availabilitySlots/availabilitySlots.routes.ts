import { Router } from "express";
import { getAvailableSlotsController } from "./availabilitySlots.controller.js";

const router = Router();

router.get("/", getAvailableSlotsController);

export default router;