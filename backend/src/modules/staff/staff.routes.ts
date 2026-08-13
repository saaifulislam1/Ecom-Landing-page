import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireStoreRoles, staffManagementRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./staff.controller.js";
import { staffCreateSchema, staffUpdateSchema } from "./staff.validation.js";

export const staffRoutes = Router({ mergeParams: true });
staffRoutes.use(authMiddleware, tenantMiddleware, requireStoreRoles(staffManagementRoles));
staffRoutes.get("/", asyncHandler(controller.listStaff));
staffRoutes.post("/", validate({ body: staffCreateSchema }), asyncHandler(controller.createStaff));
staffRoutes.patch("/:staffId", validate({ body: staffUpdateSchema }), asyncHandler(controller.updateStaff));
staffRoutes.delete("/:staffId", asyncHandler(controller.deleteStaff));
