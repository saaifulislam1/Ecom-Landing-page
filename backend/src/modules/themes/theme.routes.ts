import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./theme.controller.js";
import { themeUpdateSchema } from "./theme.validation.js";

export const themeRoutes = Router({ mergeParams: true });
themeRoutes.get("/", asyncHandler(controller.getTheme));
themeRoutes.put("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: themeUpdateSchema }), asyncHandler(controller.updateTheme));
