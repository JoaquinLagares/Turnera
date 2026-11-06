import prisma from "../../config/prisma.js";
import type { CreateServiceInput } from "./service.schema.js";

export async function createService(data: CreateServiceInput) {
  return prisma.service.create({
    data,
  });
}

export async function getServicesByBusiness(businessId: string) {
  return prisma.service.findMany({
    where: {
      businessId,
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}