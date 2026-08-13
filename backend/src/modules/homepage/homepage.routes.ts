import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./homepage.controller.js";
import { homepageUpdateSchema } from "./homepage.validation.js";

export const homepageRoutes = Router({ mergeParams: true });
homepageRoutes.get("/", asyncHandler(controller.getHomepage));
homepageRoutes.put("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: homepageUpdateSchema }), asyncHandler(controller.updateHomepage));
