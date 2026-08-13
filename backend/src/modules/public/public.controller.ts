import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import { createOrder } from "../orders/order.controller.js";
import { validateCoupon } from "../coupons/coupon.controller.js";
import { defaultHomepageSettings } from "../homepage/homepage.defaults.js";

async function getActiveStore(slug: string) {
  return prisma.store.findFirstOrThrow({ where: { slug, status: "ACTIVE" } });
}
export async function getStore(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  return successResponse(res, "Public store fetched", serialize(store));
}
export async function getProducts(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const products = await prisma.product.findMany({ where: { storeId: store.id, status: "PUBLISHED" }, include: { category: true } });
  return successResponse(res, "Public products fetched", serialize(products));
}
export async function getProduct(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const product = await prisma.product.findFirstOrThrow({ where: { storeId: store.id, slug: req.params.productSlug, status: "PUBLISHED" }, include: { category: true } });
  return successResponse(res, "Public product fetched", serialize(product));
}
export async function getCategories(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const categories = await prisma.category.findMany({ where: { storeId: store.id, status: "ACTIVE" } });
  return successResponse(res, "Public categories fetched", serialize(categories));
}
export async function getTheme(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const theme = await prisma.themeSettings.findUnique({ where: { storeId: store.id } });
  return successResponse(res, "Public theme fetched", serialize(theme));
}
export async function getSettings(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const settings = await prisma.storeSettings.findUnique({ where: { storeId: store.id } });
  return successResponse(res, "Public settings fetched", serialize(settings));
}
export async function getHomepage(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const homepage = await prisma.homepageSettings.upsert({
    where: { storeId: store.id },
    update: {},
    create: { ...defaultHomepageSettings, storeId: store.id },
  });
  return successResponse(res, "Public homepage settings fetched", serialize(homepage));
}
export async function getMarketing(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const marketing = await prisma.marketingSettings.findUnique({ where: { storeId: store.id } });
  return successResponse(res, "Public marketing settings fetched", serialize(marketing));
}
export async function createPublicOrder(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  req.params.storeId = store.id;
  return createOrder(req, res);
}
export async function getPublicOrder(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const order = await prisma.order.findFirstOrThrow({
    where: {
      storeId: store.id,
      orderNumber: req.params.orderNumber,
      ...(req.query.phone ? { customerPhone: String(req.query.phone) } : {}),
    },
    include: { orderItems: true, customer: true },
  });
  return successResponse(res, "Public order fetched", serialize(order));
}
export async function trackPublicOrder(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const identifier = req.params.identifier;
  const order = await prisma.order.findFirstOrThrow({
    where: {
      storeId: store.id,
      OR: [{ orderNumber: identifier }, { customerPhone: identifier }],
    },
    include: { orderItems: true },
    orderBy: { createdAt: "desc" },
  });
  return successResponse(res, "Order tracking fetched", serialize(order));
}
export async function validatePublicCoupon(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  req.params.storeId = store.id;
  return validateCoupon(req, res);
}
export async function metaFeedXml(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const products = await prisma.product.findMany({ where: { storeId: store.id, status: "PUBLISHED" } });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><products>${products.map((p) => `<product><id>${p.id}</id><title>${escapeXml(p.title)}</title><price>${p.salePrice ?? p.price} ${store.currency}</price><link>/products/${p.slug}</link><image_link>${p.images[0] ?? ""}</image_link></product>`).join("")}</products>`;
  res.type("application/xml").send(xml);
}
export async function metaFeedCsv(req: Request, res: Response) {
  const store = await getActiveStore(req.params.slug);
  const products = await prisma.product.findMany({ where: { storeId: store.id, status: "PUBLISHED" } });
  const rows = ["id,title,price,link,image_link", ...products.map((p) => `${p.id},"${p.title}",${p.salePrice ?? p.price} ${store.currency},/products/${p.slug},${p.images[0] ?? ""}`)];
  res.type("text/csv").send(rows.join("\n"));
}
function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[char]!));
}
