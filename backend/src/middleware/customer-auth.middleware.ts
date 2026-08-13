import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "./error.middleware.js";

declare global {
  namespace Express {
    interface Request {
      customerAccount?: { id: string; storeId: string; email: string };
    }
  }
}

export async function customerAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new AppError("Customer login required", 401);
    const customer = await getCustomerFromHeader(header);
    req.customerAccount = customer;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalCustomerAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      req.customerAccount = await getCustomerFromHeader(header);
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function getCustomerFromHeader(header: string) {
  const token = header.slice(7);
  const payload = jwt.verify(token, env.JWT_SECRET) as { customerId?: string; type?: string };
  if (payload.type !== "customer" || !payload.customerId) throw new AppError("Invalid customer session", 401);

  const customer = await prisma.customer.findUnique({
    where: { id: payload.customerId },
    select: { id: true, storeId: true, email: true, emailVerifiedAt: true, password: true },
  });
  if (!customer?.email || !customer.password || !customer.emailVerifiedAt) throw new AppError("Invalid customer session", 401);

  return { id: customer.id, storeId: customer.storeId, email: customer.email };
}
