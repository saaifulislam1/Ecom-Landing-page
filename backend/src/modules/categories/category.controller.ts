import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import { slugify } from "../../utils/slugify.js";

export async function listCategories(req: Request, res: Response) {
  const data = await prisma.category.findMany({ where: { storeId: req.params.storeId }, include: { _count: { select: { products: true } } } });
  return successResponse(res, "Categories fetched", serialize(data));
}
export async function createCategory(req: Request, res: Response) {
  const slug = slugify(req.body.slug?.trim() ? req.body.slug : req.body.name);
  const existing = await prisma.category.findUnique({ where: { storeId_slug: { storeId: req.params.storeId, slug } } });
  if (existing) throw new AppError("A category with this slug already exists", 409);

  const data = await prisma.category.create({ data: { ...req.body, slug, storeId: req.params.storeId } });
  return successResponse(res, "Category created", serialize(data), 201);
}
export async function updateCategory(req: Request, res: Response) {
  const data = { ...req.body, ...(req.body.slug ? { slug: slugify(req.body.slug) } : {}) };
  const existing = data.slug
    ? await prisma.category.findUnique({ where: { storeId_slug: { storeId: req.params.storeId, slug: data.slug } } })
    : null;
  if (existing && existing.id !== req.params.categoryId) throw new AppError("A category with this slug already exists", 409);

  const category = await prisma.category.update({ where: { id: req.params.categoryId, storeId: req.params.storeId }, data });
  return successResponse(res, "Category updated", serialize(category));
}
export async function deleteCategory(req: Request, res: Response) {
  await prisma.category.delete({ where: { id: req.params.categoryId, storeId: req.params.storeId } });
  return successResponse(res, "Category deleted", null);
}
