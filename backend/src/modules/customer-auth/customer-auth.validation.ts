import { z } from "zod";

export const customerRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(5),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const customerVerifyEmailSchema = z.object({
  token: z.string().min(20),
});

export const resendCustomerVerificationSchema = z.object({
  email: z.string().email(),
});
