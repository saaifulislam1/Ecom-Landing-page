import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { marketingAccessRoles, requireStoreRoles } from "../../middleware/staff-role.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./marketing.controller.js";
import { campaignLinkSchema, marketingUpdateSchema } from "./marketing.validation.js";

export const marketingRoutes = Router({ mergeParams: true });
marketingRoutes.use(authMiddleware, tenantMiddleware, requireStoreRoles(marketingAccessRoles));
marketingRoutes.get("/", asyncHandler(controller.getMarketing));
marketingRoutes.put("/", validate({ body: marketingUpdateSchema }), asyncHandler(controller.updateMarketing));
marketingRoutes.get("/product-feed", asyncHandler(controller.getProductFeed));
marketingRoutes.post("/campaign-links", validate({ body: campaignLinkSchema }), asyncHandler(controller.createCampaignLink));
marketingRoutes.get("/campaign-links", asyncHandler(controller.listCampaignLinks));
