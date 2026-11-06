import crypto from "node:crypto";
import prisma from "../../config/prisma.js";
import type { CreateAppointmentInput } from "./appointment.schema.js";
import { getAvailableSlots } from "../availabilitySlots/availabilitySlots.service.js";

function generateBookingCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours! * 60 + minutes!;
}

function getDateFromISO(dateTime: string) {
  return dateTime.slice(0, 10);
}

function getTimeFromISO(dateTime: string) {
  return dateTime.slice(11, 16);
}

function getDayOfWeek(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export async function createAppointment(
  data: CreateAppointmentInput
) {
  // 1. Verificar servicio
  const service = await prisma.service.findFirst({
    where: {
      id: data.serviceId,
      businessId: data.businessId,
      active: true,
    },
  });

  if (!service) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  // 2. Verificar empleado
  const employee = await prisma.employee.findFirst({
    where: {
      id: data.employeeId,
      businessId: data.businessId,
      active: true,
    },
  });

  if (!employee) {
    throw new Error("EMPLOYEE_NOT_FOUND");
  }

  // 3. Parsear fecha
  const startAt = new Date(data.startAt);

  if (Number.isNaN(startAt.getTime())) {
    throw new Error("INVALID_APPOINTMENT_DATE");
  }

  const endAt = new Date(
    startAt.getTime() + service.durationMinutes * 60_000
  );

  // Fecha y hora LOCAL que mandó el cliente
  const date = getDateFromISO(data.startAt);
  const requestedTime = getTimeFromISO(data.startAt);

  // 4. Pedirle al sistema cuáles son los slots realmente disponibles
  const availableSlots = await getAvailableSlots(
    data.employeeId,
    data.serviceId,
    date
  );

  // 5. La hora elegida tiene que estar entre esos slots
  if (!availableSlots.includes(requestedTime)) {
    throw new Error("INVALID_APPOINTMENT_SLOT");
  }

  // 6. Segunda comprobación contra otros turnos
  // La mantenemos como defensa adicional.
  const overlappingAppointment =
    await prisma.appointment.findFirst({
      where: {
        employeeId: data.employeeId,

        status: {
          in: ["PENDING_PAYMENT", "CONFIRMED"],
        },

        startAt: {
          lt: endAt,
        },

        endAt: {
          gt: startAt,
        },
      },
    });

  if (overlappingAppointment) {
    throw new Error("APPOINTMENT_OVERLAP");
  }

  // 7. Crear turno
  return prisma.appointment.create({
    data: {
      bookingCode: generateBookingCode(),

      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,

      startAt,
      endAt,

      businessId: data.businessId,
      serviceId: data.serviceId,
      employeeId: data.employeeId,
    },
  });
}