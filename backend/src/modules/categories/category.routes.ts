import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, productAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./category.controller.js";
import { categoryCreateSchema, categoryUpdateSchema } from "./category.validation.js";

export const categoryRoutes = Router({ mergeParams: true });
categoryRoutes.get("/", authMiddleware, tenantMiddleware, requireStoreRoles(productAccessRoles), asyncHandler(controller.listCategories));
categoryRoutes.post("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: categoryCreateSchema }), asyncHandler(controller.createCategory));
categoryRoutes.patch("/:categoryId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: categoryUpdateSchema }), asyncHandler(controller.updateCategory));
categoryRoutes.delete("/:categoryId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), asyncHandler(controller.deleteCategory));
