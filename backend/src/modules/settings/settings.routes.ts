import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./settings.controller.js";
import { settingsUpdateSchema } from "./settings.validation.js";

export const settingsRoutes = Router({ mergeParams: true });
settingsRoutes.get("/", asyncHandler(controller.getSettings));
settingsRoutes.put("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: settingsUpdateSchema }), asyncHandler(controller.updateSettings));
