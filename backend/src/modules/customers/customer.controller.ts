import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

export async function listCustomers(req: Request, res: Response) {
  const data = await prisma.customer.findMany({ where: { storeId: req.params.storeId }, orderBy: { createdAt: "desc" } });
  return successResponse(res, "Customers fetched", serialize(data));
}
export async function createCustomer(req: Request, res: Response) {
  const data = await prisma.customer.create({ data: { ...req.body, storeId: req.params.storeId } });
  return successResponse(res, "Customer created", serialize(data), 201);
}
export async function getCustomer(req: Request, res: Response) {
  const data = await prisma.customer.findFirstOrThrow({ where: { id: req.params.customerId, storeId: req.params.storeId }, include: { orders: true } });
  return successResponse(res, "Customer fetched", serialize(data));
}
export async function updateCustomer(req: Request, res: Response) {
  const data = await prisma.customer.update({ where: { id: req.params.customerId, storeId: req.params.storeId }, data: req.body });
  return successResponse(res, "Customer updated", serialize(data));
}
export async function deleteCustomer(req: Request, res: Response) {
  await prisma.customer.delete({ where: { id: req.params.customerId, storeId: req.params.storeId } });
  return successResponse(res, "Customer deleted", null);
}
