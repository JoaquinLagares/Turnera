import prisma from "../../config/prisma.js";

type CreateBusinessInput = {
  name: string;
  slug: string;
  phone?: string;
  email?: string;
  address?: string;
};

export async function createBusiness(data: CreateBusinessInput) {
  return prisma.business.create({
    data,
  });
}