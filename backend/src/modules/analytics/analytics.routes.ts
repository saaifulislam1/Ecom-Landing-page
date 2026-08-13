import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./analytics.controller.js";

export const analyticsRoutes = Router({ mergeParams: true });
analyticsRoutes.use(authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles));
analyticsRoutes.get("/overview", asyncHandler(controller.overview));
analyticsRoutes.get("/sales", asyncHandler(controller.sales));
analyticsRoutes.get("/products", asyncHandler(controller.products));
analyticsRoutes.get("/customers", asyncHandler(controller.customers));
analyticsRoutes.get("/marketing", asyncHandler(controller.marketing));
