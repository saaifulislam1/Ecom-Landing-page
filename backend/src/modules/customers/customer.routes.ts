import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { broadAdminAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./customer.controller.js";
import { customerCreateSchema, customerUpdateSchema } from "./customer.validation.js";

export const customerRoutes = Router({ mergeParams: true });
customerRoutes.use(authMiddleware, tenantMiddleware, requireStoreRoles(broadAdminAccessRoles));
customerRoutes.get("/", asyncHandler(controller.listCustomers));
customerRoutes.post("/", validate({ body: customerCreateSchema }), asyncHandler(controller.createCustomer));
customerRoutes.get("/:customerId", asyncHandler(controller.getCustomer));
customerRoutes.patch("/:customerId", validate({ body: customerUpdateSchema }), asyncHandler(controller.updateCustomer));
customerRoutes.delete("/:customerId", asyncHandler(controller.deleteCustomer));
