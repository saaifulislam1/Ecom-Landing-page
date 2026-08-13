import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./store.controller.js";
import { storeCreateSchema, storeUpdateSchema } from "./store.validation.js";

export const storeRoutes = Router();
storeRoutes.get("/", authMiddleware, asyncHandler(controller.listStores));
storeRoutes.post("/", authMiddleware, validate({ body: storeCreateSchema }), asyncHandler(controller.createStore));
storeRoutes.get("/slug/:slug", asyncHandler(controller.getStoreBySlug));
storeRoutes.get("/:storeId", authMiddleware, tenantMiddleware, asyncHandler(controller.getStore));
storeRoutes.patch("/:storeId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: storeUpdateSchema }), asyncHandler(controller.updateStore));
storeRoutes.delete("/:storeId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), asyncHandler(controller.deleteStore));
