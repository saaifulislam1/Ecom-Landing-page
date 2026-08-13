import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import { defaultHomepageSettings } from "./homepage.defaults.js";

export async function getHomepage(req: Request, res: Response) {
  const data = await prisma.homepageSettings.upsert({
    where: { storeId: req.params.storeId },
    update: {},
    create: { ...defaultHomepageSettings, storeId: req.params.storeId },
  });
  return successResponse(res, "Homepage settings fetched", serialize(data));
}

export async function updateHomepage(req: Request, res: Response) {
  const data = await prisma.homepageSettings.upsert({
    where: { storeId: req.params.storeId },
    update: req.body,
    create: { ...defaultHomepageSettings, ...req.body, storeId: req.params.storeId },
  });
  return successResponse(res, "Homepage settings updated", serialize(data));
}
