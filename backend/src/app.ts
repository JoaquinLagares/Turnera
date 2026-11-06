import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import serviceRoutes from "./modules/service/service.routes.js";
import businessRoutes from "./modules/business/business.routes.js";
import employeeRoutes from "./modules/employee/employee.routes.js";
import scheduleRoutes from "./modules/schedule/schedule.routes.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
import appointmentRoutes from "./modules/appointment/appointment.routes.js";
import availabilitySlotsRoutes from "./modules/availabilitySlots/availabilitySlots.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/businesses", businessRoutes)
app.use("/services", serviceRoutes)
app.use("/employees",employeeRoutes)
app.use("/schedules", scheduleRoutes)
app.use("/availability", availabilityRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/availability-slots", availabilitySlotsRoutes);
app.use(errorHandler);



export default app;