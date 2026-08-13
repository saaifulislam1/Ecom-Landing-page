import { z } from "zod";

export const couponCreateSchema = z.object({
  code: z.string().min(2),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  discountValue: z.coerce.number().min(0),
  minOrderAmount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
export const couponUpdateSchema = couponCreateSchema.partial();
export const couponValidateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.coerce.number().min(0),
  deliveryCharge: z.coerce.number().min(0).default(0),
});
