import prisma from "../../config/prisma.js";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

function getDayOfWeek(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export async function getAvailableSlots(
  employeeId: string,
  serviceId: string,
  date: string
) {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new Error("EMPLOYEE_NOT_FOUND");
  }

  const dayOfWeek = getDayOfWeek(date);

  // Horario habitual
  const schedules = await prisma.schedule.findMany({
    where: {
      employeeId,
      dayOfWeek,
    },
  });

  // Excepciones
  const allOverrides =
    await prisma.availabilityOverride.findMany({
      where: {
        employeeId,
      },
    });

  const overrides = allOverrides.filter(
    (override) =>
      override.date.toISOString().slice(0, 10) === date
  );

  // Día entero bloqueado
  const fullDayUnavailable = overrides.some(
    (override) =>
      override.type === "UNAVAILABLE" &&
      !override.startTime &&
      !override.endTime
  );

  if (fullDayUnavailable) {
    return [];
  }

  // AVAILABLE específico reemplaza horario habitual
  const availableOverrides = overrides.filter(
    (override) =>
      override.type === "AVAILABLE" &&
      override.startTime &&
      override.endTime
  );

  const availableWindows =
    availableOverrides.length > 0
      ? availableOverrides.map((override) => ({
          start: timeToMinutes(override.startTime!),
          end: timeToMinutes(override.endTime!),
        }))
      : schedules.map((schedule) => ({
          start: timeToMinutes(schedule.startTime),
          end: timeToMinutes(schedule.endTime),
        }));

  if (availableWindows.length === 0) {
    return [];
  }

  // Bloqueos parciales
  const unavailableWindows = overrides
    .filter(
      (override) =>
        override.type === "UNAVAILABLE" &&
        override.startTime &&
        override.endTime
    )
    .map((override) => ({
      start: timeToMinutes(override.startTime!),
      end: timeToMinutes(override.endTime!),
    }));

  // Turnos ya ocupados
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  const appointments = await prisma.appointment.findMany({
    where: {
      employeeId,

      status: {
        in: ["PENDING_PAYMENT", "CONFIRMED"],
      },

      startAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const occupiedWindows = appointments.map((appointment) => {
    const localStart = new Date(
      appointment.startAt.getTime() - 3 * 60 * 60 * 1000
    );

    const localEnd = new Date(
      appointment.endAt.getTime() - 3 * 60 * 60 * 1000
    );

    return {
      start:
        localStart.getUTCHours() * 60 +
        localStart.getUTCMinutes(),

      end:
        localEnd.getUTCHours() * 60 +
        localEnd.getUTCMinutes(),
    };
  });

  const slots: string[] = [];

  for (const window of availableWindows) {
    for (
      let current = window.start;
      current + service.durationMinutes <= window.end;
      current += service.durationMinutes
    ) {
      const slotStart = current;
      const slotEnd = current + service.durationMinutes;

      const blocked = unavailableWindows.some(
        (blockedWindow) =>
          slotStart < blockedWindow.end &&
          slotEnd > blockedWindow.start
      );

      if (blocked) {
        continue;
      }

      const occupied = occupiedWindows.some(
        (appointment) =>
          slotStart < appointment.end &&
          slotEnd > appointment.start
      );

      if (occupied) {
        continue;
      }

      slots.push(minutesToTime(current));
    }
  }

  return slots;
}