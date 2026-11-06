import prisma from "../../config/prisma.js";
import type { CreateEmployeeInput } from "./employee.schema.js";

export async function createEmployee(data: CreateEmployeeInput) {
  return prisma.employee.create({
    data,
  });
}

export async function getEmployeesByBusiness(businessId: string) {
  return prisma.employee.findMany({
    where: {
      businessId,
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}