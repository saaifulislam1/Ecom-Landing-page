import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import { slugify } from "../../utils/slugify.js";

export async function listCategories(req: Request, res: Response) {
  const data = await prisma.category.findMany({ where: { storeId: req.params.storeId }, include: { _count: { select: { products: true } } } });
  return successResponse(res, "Categories fetched", serialize(data));
}
export async function createCategory(req: Request, res: Response) {
  const data = await prisma.category.create({ data: { ...req.body, slug: req.body.slug ?? slugify(req.body.name), storeId: req.params.storeId } });
  return successResponse(res, "Category created", serialize(data), 201);
}
export async function updateCategory(req: Request, res: Response) {
  const data = await prisma.category.update({ where: { id: req.params.categoryId, storeId: req.params.storeId }, data: req.body });
  return successResponse(res, "Category updated", serialize(data));
}
export async function deleteCategory(req: Request, res: Response) {
  await prisma.category.delete({ where: { id: req.params.categoryId, storeId: req.params.storeId } });
  return successResponse(res, "Category deleted", null);
}
