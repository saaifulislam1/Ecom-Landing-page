import { Request, Response } from "express";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";
import * as service from "./customer-auth.service.js";

export async function register(req: Request, res: Response) {
  const result = await service.registerCustomer(req.params.slug, req.body);
  return successResponse(res, "Customer registered. Please verify your email.", serialize(result), 201);
}

export async function login(req: Request, res: Response) {
  const result = await service.loginCustomer(req.params.slug, req.body.email, req.body.password);
  return successResponse(res, "Customer logged in", serialize(result));
}

export async function verifyEmail(req: Request, res: Response) {
  const result = await service.verifyCustomerEmail(req.body.token);
  return successResponse(res, "Email verified", serialize(result));
}

export async function resendVerification(req: Request, res: Response) {
  const result = await service.resendVerification(req.params.slug, req.body.email);
  return successResponse(res, "Verification email sent", serialize(result));
}

export async function me(req: Request, res: Response) {
  const customer = await service.getCurrentCustomer(req.customerAccount!.id);
  return successResponse(res, "Current customer fetched", serialize(customer));
}

export async function orders(req: Request, res: Response) {
  const orders = await service.listCurrentCustomerOrders(req.customerAccount!.id);
  return successResponse(res, "Customer orders fetched", serialize(orders));
}
