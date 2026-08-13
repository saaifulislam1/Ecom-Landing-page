import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "./error.middleware.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole; email: string };
    }
  }
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new AppError("Authentication required", 401);
    const token = header.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, email: true, role: true, status: true } });
    if (!user || user.status !== "ACTIVE") throw new AppError("Invalid user session", 401);
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}
