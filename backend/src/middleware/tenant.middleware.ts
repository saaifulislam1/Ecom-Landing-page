import { NextFunction, Request, Response } from "express";
import { StaffRole, UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "./error.middleware.js";

declare global {
  namespace Express {
    interface Request {
      storeAccess?: { storeId: string; role: StaffRole; isOwner: boolean };
    }
  }
}

export async function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const storeId = req.params.storeId;
    if (!storeId) return next();
    const store = await prisma.store.findUnique({ where: { id: storeId }, include: { staffMembers: true } });
    if (!store) throw new AppError("Store not found", 404);
    if (!req.user) throw new AppError("Authentication required for this store", 401);

    if (req.user.role === UserRole.SUPER_ADMIN || store.ownerId === req.user.id) {
      req.storeAccess = { storeId, role: StaffRole.OWNER, isOwner: true };
      return next();
    }

    const staffMember = store.staffMembers.find((member) => member.userId === req.user?.id);
    if (staffMember?.status === "ACTIVE") {
      req.storeAccess = { storeId, role: staffMember.role, isOwner: false };
      return next();
    }

    throw new AppError("You do not have access to this store", 403);
  } catch (error) {
    next(error);
  }
}
