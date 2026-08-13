import { Router } from "express";
import { authRateLimiter } from "../../middleware/rate-limit.middleware.js";
import { customerAuthMiddleware } from "../../middleware/customer-auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import * as controller from "./customer-auth.controller.js";
import { customerLoginSchema, customerRegisterSchema, customerVerifyEmailSchema, resendCustomerVerificationSchema } from "./customer-auth.validation.js";

export const customerAuthRoutes = Router({ mergeParams: true });

customerAuthRoutes.post("/register", authRateLimiter, validate({ body: customerRegisterSchema }), asyncHandler(controller.register));
customerAuthRoutes.post("/login", authRateLimiter, validate({ body: customerLoginSchema }), asyncHandler(controller.login));
customerAuthRoutes.post("/verify-email", authRateLimiter, validate({ body: customerVerifyEmailSchema }), asyncHandler(controller.verifyEmail));
customerAuthRoutes.post("/resend-verification", authRateLimiter, validate({ body: resendCustomerVerificationSchema }), asyncHandler(controller.resendVerification));
customerAuthRoutes.get("/me", customerAuthMiddleware, asyncHandler(controller.me));
customerAuthRoutes.get("/orders", customerAuthMiddleware, asyncHandler(controller.orders));
