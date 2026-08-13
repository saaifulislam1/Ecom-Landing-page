import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

export async function getMarketing(req: Request, res: Response) {
  const data = await prisma.marketingSettings.findUnique({ where: { storeId: req.params.storeId } });
  return successResponse(res, "Marketing settings fetched", serialize(data));
}
export async function updateMarketing(req: Request, res: Response) {
  // TODO: Wire real Meta Pixel, Conversions API, and Meta Marketing API integrations.
  const data = await prisma.marketingSettings.upsert({ where: { storeId: req.params.storeId }, update: req.body, create: { ...req.body, storeId: req.params.storeId } });
  return successResponse(res, "Marketing settings updated", serialize(data));
}
export async function getProductFeed(req: Request, res: Response) {
  const products = await prisma.product.findMany({ where: { storeId: req.params.storeId, status: "PUBLISHED" } });
  return successResponse(res, "Product feed fetched", serialize({ count: products.length, products }));
}
export async function createCampaignLink(req: Request, res: Response) {
  const url = new URL(req.body.destinationUrl);
  url.searchParams.set("utm_source", req.body.source);
  url.searchParams.set("utm_medium", req.body.medium);
  url.searchParams.set("utm_campaign", req.body.campaign);
  if (req.body.content) url.searchParams.set("utm_content", req.body.content);
  const data = await prisma.campaignLink.create({ data: { ...req.body, generatedUrl: url.toString(), storeId: req.params.storeId } });
  return successResponse(res, "Campaign link created", serialize(data), 201);
}
export async function listCampaignLinks(req: Request, res: Response) {
  const data = await prisma.campaignLink.findMany({ where: { storeId: req.params.storeId }, orderBy: { createdAt: "desc" } });
  return successResponse(res, "Campaign links fetched", serialize(data));
}
