import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

export async function getTheme(req: Request, res: Response) {
  const data = await prisma.themeSettings.findUnique({ where: { storeId: req.params.storeId } });
  return successResponse(res, "Theme fetched", serialize(data));
}
export async function updateTheme(req: Request, res: Response) {
  const data = await prisma.themeSettings.upsert({ where: { storeId: req.params.storeId }, update: req.body, create: { ...req.body, storeId: req.params.storeId } });
  return successResponse(res, "Theme updated", serialize(data));
}
