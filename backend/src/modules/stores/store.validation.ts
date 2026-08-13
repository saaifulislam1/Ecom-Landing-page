import { z } from "zod";

export const storeCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().nullish(),
  logo: z.string().nullish(),
  email: z.string().email().nullish(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  currency: z.string().default("BDT"),
  subdomain: z.string().nullish(),
  customDomain: z.string().nullish(),
});

export const storeUpdateSchema = storeCreateSchema.partial();
