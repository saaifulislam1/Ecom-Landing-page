import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { Customer } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { sendCustomerVerificationEmail } from "./email.service.js";

const verificationTokenHours = 24;

function signCustomerToken(customerId: string) {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ customerId, type: "customer" }, env.JWT_SECRET, options);
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function publicCustomer(customer: Customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    emailVerifiedAt: customer.emailVerifiedAt,
    totalOrders: customer.totalOrders,
    totalSpent: customer.totalSpent,
    createdAt: customer.createdAt,
  };
}

export async function registerCustomer(storeSlug: string, data: { name: string; email: string; password: string; phone: string; address?: string; city?: string }) {
  const store = await prisma.store.findFirstOrThrow({ where: { slug: storeSlug, status: "ACTIVE" } });
  const normalizedEmail = data.email.toLowerCase();

  const existingByEmail = await prisma.customer.findFirst({ where: { storeId: store.id, email: normalizedEmail } });
  if (existingByEmail?.password) throw new AppError("Email is already registered", 409);

  const password = await bcrypt.hash(data.password, 12);
  const existingByPhone = await prisma.customer.findUnique({ where: { storeId_phone: { storeId: store.id, phone: data.phone } } });
  if (existingByPhone?.password) throw new AppError("Phone number is already registered", 409);

  const customer = existingByPhone
    ? await prisma.customer.update({
        where: { id: existingByPhone.id },
        data: {
          name: data.name,
          email: normalizedEmail,
          password,
          address: data.address,
          city: data.city,
        },
      })
    : await prisma.customer.create({
        data: {
          storeId: store.id,
          name: data.name,
          email: normalizedEmail,
          password,
          phone: data.phone,
          address: data.address,
          city: data.city,
          tags: ["Registered"],
        },
      });

  await createAndSendVerification(customer, store.slug);
  return { customer: publicCustomer(customer), emailVerificationRequired: true };
}

export async function loginCustomer(storeSlug: string, email: string, password: string) {
  const store = await prisma.store.findFirstOrThrow({ where: { slug: storeSlug, status: "ACTIVE" } });
  const customer = await prisma.customer.findFirst({ where: { storeId: store.id, email: email.toLowerCase() } });
  if (!customer?.password) throw new AppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) throw new AppError("Invalid credentials", 401);
  if (!customer.emailVerifiedAt) throw new AppError("Please verify your email before signing in", 403);

  return { customer: publicCustomer(customer), token: signCustomerToken(customer.id) };
}

export async function verifyCustomerEmail(token: string) {
  const tokenHash = hashToken(token);
  const verification = await prisma.customerEmailVerificationToken.findUnique({ where: { tokenHash }, include: { customer: true } });
  if (!verification || verification.usedAt) throw new AppError("Verification link is invalid", 400);
  if (verification.expiresAt < new Date()) throw new AppError("Verification link has expired", 400);

  const customer = await prisma.customer.update({
    where: { id: verification.customerId },
    data: { emailVerifiedAt: new Date(), emailVerificationTokens: { update: { where: { id: verification.id }, data: { usedAt: new Date() } } } },
  });

  return { customer: publicCustomer(customer), token: signCustomerToken(customer.id) };
}

export async function resendVerification(storeSlug: string, email: string) {
  const store = await prisma.store.findFirstOrThrow({ where: { slug: storeSlug, status: "ACTIVE" } });
  const customer = await prisma.customer.findFirst({ where: { storeId: store.id, email: email.toLowerCase() } });
  if (!customer?.password) throw new AppError("Customer account not found", 404);
  if (customer.emailVerifiedAt) return { customer: publicCustomer(customer), emailVerificationRequired: false };

  await createAndSendVerification(customer, store.slug);
  return { customer: publicCustomer(customer), emailVerificationRequired: true };
}

export async function getCurrentCustomer(customerId: string) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) throw new AppError("Customer account not found", 404);
  return publicCustomer(customer);
}

export async function listCurrentCustomerOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { orderItems: true },
    orderBy: { createdAt: "desc" },
  });
}

async function createAndSendVerification(customer: Customer, storeSlug: string) {
  if (!customer.email) throw new AppError("Customer email is required", 400);

  await prisma.customerEmailVerificationToken.updateMany({
    where: { customerId: customer.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.customerEmailVerificationToken.create({
    data: {
      customerId: customer.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + verificationTokenHours * 60 * 60 * 1000),
    },
  });

  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}&store=${encodeURIComponent(storeSlug)}`;
  await sendCustomerVerificationEmail(customer.email, customer.name, verificationUrl);
}
