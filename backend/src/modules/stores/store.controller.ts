import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import { slugify } from "../../utils/slugify.js";
import { defaultHomepageSettings } from "../homepage/homepage.defaults.js";

export async function listStores(_req: Request, res: Response) {
  const stores = await prisma.store.findMany({ include: { owner: true } });
  return successResponse(res, "Stores fetched", serialize(stores));
}

export async function createStore(req: Request, res: Response) {
  const store = await prisma.store.create({
    data: {
      ...req.body,
      slug: req.body.slug ?? slugify(req.body.name),
      ownerId: req.user!.id,
      themeSettings: { create: { themeName: "Modern Blue", primaryColor: "#111827", secondaryColor: "#047857", accentColor: "#F97316", backgroundColor: "#F7F7F2", surfaceColor: "#FFFFFF", textColor: "#111827", mutedColor: "#6B7280", borderColor: "#E5E7EB", headingFont: "Manrope", bodyFont: "Manrope" } },
      marketingSettings: { create: {} },
      storeSettings: { create: { enableCOD: true } },
      homepageSettings: { create: defaultHomepageSettings },
    },
  });
  return successResponse(res, "Store created", serialize(store), 201);
}

export async function getStore(req: Request, res: Response) {
  const store = await prisma.store.findUniqueOrThrow({ where: { id: req.params.storeId } });
  return successResponse(res, "Store fetched", serialize(store));
}

export async function getStoreBySlug(req: Request, res: Response) {
  const store = await prisma.store.findUniqueOrThrow({ where: { slug: req.params.slug } });
  return successResponse(res, "Store fetched", serialize(store));
}

export async function updateStore(req: Request, res: Response) {
  const store = await prisma.store.update({ where: { id: req.params.storeId }, data: req.body });
  return successResponse(res, "Store updated", serialize(store));
}

export async function deleteStore(req: Request, res: Response) {
  await prisma.store.delete({ where: { id: req.params.storeId } });
  return successResponse(res, "Store deleted", null);
}
