import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { paginatedResponse, successResponse } from "../../utils/api-response.js";
import { getPagination } from "../../utils/pagination.js";
import { serialize } from "../../utils/serializers.js";
import { slugify } from "../../utils/slugify.js";

export async function listProducts(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req);
  const where: Prisma.ProductWhereInput = { storeId: req.params.storeId };
  if (req.query.search) where.title = { contains: String(req.query.search), mode: "insensitive" };
  if (req.query.category) where.category = { slug: String(req.query.category) };
  if (req.query.status) where.status = req.query.status as never;
  if (req.query.featured) where.featured = req.query.featured === "true";
  if (req.query.bestSeller) where.bestSeller = req.query.bestSeller === "true";
  if (req.query.minPrice || req.query.maxPrice) where.price = { gte: req.query.minPrice ? Number(req.query.minPrice) : undefined, lte: req.query.maxPrice ? Number(req.query.maxPrice) : undefined };
  const orderBy = req.query.sort === "price_asc" ? { price: "asc" as const } : req.query.sort === "price_desc" ? { price: "desc" as const } : { createdAt: "desc" as const };
  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, skip, take: limit, orderBy }),
    prisma.product.count({ where }),
  ]);
  return paginatedResponse(res, "Products fetched", serialize(data), { page, limit, total });
}

export async function createProduct(req: Request, res: Response) {
  const slug = slugify(req.body.slug?.trim() ? req.body.slug : req.body.title);
  const existing = await prisma.product.findUnique({ where: { storeId_slug: { storeId: req.params.storeId, slug } } });
  if (existing) throw new AppError("A product with this slug already exists", 409);

  const product = await prisma.product.create({ data: { ...req.body, slug, storeId: req.params.storeId } });
  return successResponse(res, "Product created", serialize(product), 201);
}

export async function getProduct(req: Request, res: Response) {
  const product = await prisma.product.findFirstOrThrow({ where: { id: req.params.productId, storeId: req.params.storeId }, include: { category: true } });
  return successResponse(res, "Product fetched", serialize(product));
}

export async function getProductBySlug(req: Request, res: Response) {
  const store = await prisma.store.findUniqueOrThrow({ where: { slug: req.params.storeSlug } });
  const product = await prisma.product.findFirstOrThrow({ where: { storeId: store.id, slug: req.params.slug }, include: { category: true } });
  return successResponse(res, "Product fetched", serialize(product));
}

export async function updateProduct(req: Request, res: Response) {
  const data = { ...req.body, ...(req.body.slug ? { slug: slugify(req.body.slug) } : {}) };
  const existing = data.slug
    ? await prisma.product.findUnique({ where: { storeId_slug: { storeId: req.params.storeId, slug: data.slug } } })
    : null;
  if (existing && existing.id !== req.params.productId) throw new AppError("A product with this slug already exists", 409);

  const product = await prisma.product.update({ where: { id: req.params.productId, storeId: req.params.storeId }, data });
  return successResponse(res, "Product updated", serialize(product));
}

export async function deleteProduct(req: Request, res: Response) {
  await prisma.product.delete({ where: { id: req.params.productId, storeId: req.params.storeId } });
  return successResponse(res, "Product deleted", null);
}
