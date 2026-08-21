import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

type CouponClient = Pick<typeof prisma, "coupon">;

export async function getValidCouponDiscount(storeId: string, code: string, subtotal: number, deliveryCharge = 0, db: CouponClient = prisma) {
  const coupon = await db.coupon.findUnique({ where: { storeId_code: { storeId, code: code.trim().toUpperCase() } } });
  if (!coupon || coupon.status !== "ACTIVE") throw new AppError("Coupon is invalid", 400);
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError("Coupon has expired", 400);
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError("Coupon usage limit reached", 400);
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount.toNumber()) throw new AppError("Minimum order amount not met", 400);

  const discountAmount =
    coupon.discountType === "PERCENTAGE"
      ? subtotal * (coupon.discountValue.toNumber() / 100)
      : coupon.discountType === "FIXED_AMOUNT"
        ? coupon.discountValue.toNumber()
        : deliveryCharge;

  return {
    coupon,
    discountAmount: Math.min(Math.max(discountAmount, 0), subtotal + deliveryCharge),
  };
}

export async function listCoupons(req: Request, res: Response) {
  const data = await prisma.coupon.findMany({ where: { storeId: req.params.storeId }, orderBy: { createdAt: "desc" } });
  return successResponse(res, "Coupons fetched", serialize(data));
}
export async function createCoupon(req: Request, res: Response) {
  const code = req.body.code.trim().toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { storeId_code: { storeId: req.params.storeId, code } } });
  if (existing) throw new AppError("A coupon with this code already exists", 409);

  const data = await prisma.coupon.create({ data: { ...req.body, code, storeId: req.params.storeId } });
  return successResponse(res, "Coupon created", serialize(data), 201);
}
export async function updateCoupon(req: Request, res: Response) {
  const body = { ...req.body, ...(req.body.code ? { code: req.body.code.trim().toUpperCase() } : {}) };
  const existing = body.code
    ? await prisma.coupon.findUnique({ where: { storeId_code: { storeId: req.params.storeId, code: body.code } } })
    : null;
  if (existing && existing.id !== req.params.couponId) throw new AppError("A coupon with this code already exists", 409);

  const data = await prisma.coupon.update({ where: { id: req.params.couponId, storeId: req.params.storeId }, data: body });
  return successResponse(res, "Coupon updated", serialize(data));
}
export async function deleteCoupon(req: Request, res: Response) {
  await prisma.coupon.delete({ where: { id: req.params.couponId, storeId: req.params.storeId } });
  return successResponse(res, "Coupon deleted", null);
}
export async function validateCoupon(req: Request, res: Response) {
  const subtotal = Number(req.body.subtotal);
  const deliveryCharge = Number(req.body.deliveryCharge ?? 0);
  const { coupon, discountAmount } = await getValidCouponDiscount(req.params.storeId, req.body.code, subtotal, deliveryCharge);
  return successResponse(res, "Coupon validated", serialize({ coupon, discountAmount }));
}
