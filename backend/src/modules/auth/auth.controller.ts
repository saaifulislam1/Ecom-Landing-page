import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import * as authService from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body);
  return successResponse(res, "Registered successfully", serialize(result), 201);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body.email, req.body.password);
  return successResponse(res, "Logged in successfully", serialize(result));
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { stores: true, staffMembers: true } });
  return successResponse(res, "Current user fetched", serialize(user));
}

export async function logout(_req: Request, res: Response) {
  return successResponse(res, "Logged out successfully", null);
}
