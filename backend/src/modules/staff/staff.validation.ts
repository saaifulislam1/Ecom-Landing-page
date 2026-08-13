import { z } from "zod";

export const staffCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["OWNER", "MANAGER", "DIGITAL_MARKETER", "MARKETING_OFFICER"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
export const staffUpdateSchema = z.object({
  role: z.enum(["OWNER", "MANAGER", "DIGITAL_MARKETER", "MARKETING_OFFICER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
