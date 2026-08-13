import { z } from "zod";

export const customerCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});
export const customerUpdateSchema = customerCreateSchema.partial();
