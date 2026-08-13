import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./coupon.controller.js";
import { couponCreateSchema, couponUpdateSchema, couponValidateSchema } from "./coupon.validation.js";

export const couponRoutes = Router({ mergeParams: true });
couponRoutes.get("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), asyncHandler(controller.listCoupons));
couponRoutes.post("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: couponCreateSchema }), asyncHandler(controller.createCoupon));
couponRoutes.patch("/:couponId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: couponUpdateSchema }), asyncHandler(controller.updateCoupon));
couponRoutes.delete("/:couponId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), asyncHandler(controller.deleteCoupon));
couponRoutes.post("/validate", validate({ body: couponValidateSchema }), asyncHandler(controller.validateCoupon));
