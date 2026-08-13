import { StaffRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware.js";

const fullAccessRoles = [StaffRole.OWNER, StaffRole.MANAGER];
const broadAccessRoles = [...fullAccessRoles, StaffRole.MARKETING_OFFICER];

export function requireStoreRoles(allowedRoles: StaffRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.storeAccess?.role;
    if (!role) throw new AppError("Store access role was not resolved", 403);
    if (allowedRoles.includes(role)) return next();
    throw new AppError("You do not have permission for this admin section", 403);
  };
}

export const productAccessRoles = [...broadAccessRoles, StaffRole.DIGITAL_MARKETER];
export const marketingAccessRoles = [...broadAccessRoles, StaffRole.DIGITAL_MARKETER];
export const broadAdminAccessRoles = broadAccessRoles;
export const staffManagementRoles = fullAccessRoles;
