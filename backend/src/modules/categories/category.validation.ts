import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
export const categoryUpdateSchema = categoryCreateSchema.partial();
