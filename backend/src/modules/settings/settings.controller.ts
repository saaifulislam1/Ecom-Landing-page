import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

export async function getSettings(req: Request, res: Response) {
  const data = await prisma.storeSettings.findUnique({ where: { storeId: req.params.storeId } });
  return successResponse(res, "Settings fetched", serialize(data));
}
export async function updateSettings(req: Request, res: Response) {
  const data = await prisma.storeSettings.upsert({ where: { storeId: req.params.storeId }, update: req.body, create: { ...req.body, storeId: req.params.storeId } });
  return successResponse(res, "Settings updated", serialize(data));
}
