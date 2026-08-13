import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rate-limit.middleware.js";
import * as controller from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimiter, validate({ body: registerSchema }), asyncHandler(controller.register));
authRoutes.post("/login", authRateLimiter, validate({ body: loginSchema }), asyncHandler(controller.login));
authRoutes.get("/me", authMiddleware, asyncHandler(controller.me));
authRoutes.post("/logout", authMiddleware, asyncHandler(controller.logout));
