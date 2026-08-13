import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { productAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./product.controller.js";
import { productCreateSchema, productUpdateSchema } from "./product.validation.js";

export const productRoutes = Router({ mergeParams: true });
productRoutes.get("/", authMiddleware, tenantMiddleware, requireStoreRoles(productAccessRoles), asyncHandler(controller.listProducts));
productRoutes.post("/", authMiddleware, tenantMiddleware, requireStoreRoles(productAccessRoles), validate({ body: productCreateSchema }), asyncHandler(controller.createProduct));
productRoutes.get("/:productId", authMiddleware, tenantMiddleware, requireStoreRoles(productAccessRoles), asyncHandler(controller.getProduct));
productRoutes.patch("/:productId", authMiddleware, tenantMiddleware, requireStoreRoles(productAccessRoles), validate({ body: productUpdateSchema }), asyncHandler(controller.updateProduct));
productRoutes.delete("/:productId", authMiddleware, tenantMiddleware, requireStoreRoles(productAccessRoles), asyncHandler(controller.deleteProduct));
