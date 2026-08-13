import { z } from "zod";

export const orderCreateSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(5),
  customerEmail: z.string().email().optional(),
  deliveryAddress: z.string().min(5),
  city: z.string().optional(),
  notes: z.string().optional(),
  subtotal: z.coerce.number().min(0),
  deliveryCharge: z.coerce.number().min(0),
  couponCode: z.string().optional(),
  discountAmount: z.coerce.number().min(0).default(0),
  total: z.coerce.number().min(0),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "BANK_TRANSFER", "CARD"]),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]).default("UNPAID"),
  deliveryMethod: z.enum(["INSIDE_CITY", "OUTSIDE_CITY"]),
  metaEventId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    productTitle: z.string(),
    productImage: z.string().optional(),
    price: z.coerce.number(),
    quantity: z.coerce.number().int().positive(),
    total: z.coerce.number(),
    variant: z.unknown().optional(),
  })).min(1),
});
export const orderStatusSchema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]) });
export const paymentStatusSchema = z.object({ paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]) });
export const orderUpdateSchema = z.object({ notes: z.string().optional() });
