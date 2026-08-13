import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

export async function overview(req: Request, res: Response) {
  const [orders, products, customers] = await Promise.all([
    prisma.order.findMany({ where: { storeId: req.params.storeId } }),
    prisma.product.count({ where: { storeId: req.params.storeId } }),
    prisma.customer.count({ where: { storeId: req.params.storeId } }),
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total.toNumber(), 0);
  return successResponse(res, "Analytics overview fetched", serialize({ revenue, orders: orders.length, products, customers, conversionRate: orders.length ? 3.8 : 0 }));
}
export async function sales(req: Request, res: Response) {
  const orders = await prisma.order.findMany({ where: { storeId: req.params.storeId }, orderBy: { createdAt: "desc" } });
  return successResponse(res, "Sales analytics fetched", serialize({ orders, totalRevenue: orders.reduce((sum, order) => sum + order.total.toNumber(), 0) }));
}
export async function products(req: Request, res: Response) {
  const products = await prisma.product.findMany({ where: { storeId: req.params.storeId }, orderBy: [{ bestSeller: "desc" }, { stock: "asc" }] });
  return successResponse(res, "Product analytics fetched", serialize(products));
}
export async function customers(req: Request, res: Response) {
  const customers = await prisma.customer.findMany({ where: { storeId: req.params.storeId }, orderBy: { totalSpent: "desc" } });
  return successResponse(res, "Customer analytics fetched", serialize(customers));
}
export async function marketing(req: Request, res: Response) {
  const links = await prisma.campaignLink.findMany({ where: { storeId: req.params.storeId }, orderBy: { revenue: "desc" } });
  return successResponse(res, "Marketing analytics fetched", serialize(links));
}
