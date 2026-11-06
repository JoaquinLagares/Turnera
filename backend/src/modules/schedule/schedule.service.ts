import prisma from "../../config/prisma.js";
import type { CreateScheduleInput } from "./schedule.schema.js";

export async function createSchedule(data: CreateScheduleInput) {
  const overlappingSchedule = await prisma.schedule.findFirst({
    where: {
      employeeId: data.employeeId,
      dayOfWeek: data.dayOfWeek,

      startTime: {
        lt: data.endTime,
      },

      endTime: {
        gt: data.startTime,
      },
    },
  });

  if (overlappingSchedule) {
    throw new Error("SCHEDULE_OVERLAP");
  }

  return prisma.schedule.create({
    data,
  });
}

export async function getSchedulesByEmployee(employeeId: string) {
  return prisma.schedule.findMany({
    where: {
      employeeId,
    },
    orderBy: [
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });
}