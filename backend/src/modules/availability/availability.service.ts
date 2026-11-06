import prisma from "../../config/prisma.js";
import type { CreateAvailabilityOverrideInput } from "./availability.schema.js";

export async function createAvailabilityOverride(
  data: CreateAvailabilityOverrideInput
) {
  return prisma.availabilityOverride.create({
    data: {
      ...data,
      date: new Date(`${data.date}T00:00:00`),
    },
  });
}

export async function getAvailabilityOverridesByEmployee(
  employeeId: string
) {
  return prisma.availabilityOverride.findMany({
    where: {
      employeeId,
    },
    orderBy: {
      date: "asc",
    },
  });
}