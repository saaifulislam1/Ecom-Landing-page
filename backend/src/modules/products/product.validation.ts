import { z } from "zod";

export const productCreateSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  deliveryDetails: z.string().optional(),
  returnPolicy: z.string().optional(),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  badge: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).default("DRAFT"),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  variants: z.unknown().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();
