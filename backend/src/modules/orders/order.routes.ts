import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./order.controller.js";
import { orderCreateSchema, orderStatusSchema, orderUpdateSchema, paymentStatusSchema } from "./order.validation.js";

export const orderRoutes = Router({ mergeParams: true });
orderRoutes.get("/", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), asyncHandler(controller.listOrders));
orderRoutes.post("/", validate({ body: orderCreateSchema }), asyncHandler(controller.createOrder));
orderRoutes.get("/:orderId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), asyncHandler(controller.getOrder));
orderRoutes.patch("/:orderId", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: orderUpdateSchema }), asyncHandler(controller.updateOrder));
orderRoutes.patch("/:orderId/status", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: orderStatusSchema }), asyncHandler(controller.updateOrderStatus));
orderRoutes.patch("/:orderId/payment-status", authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles), validate({ body: paymentStatusSchema }), asyncHandler(controller.updatePaymentStatus));
