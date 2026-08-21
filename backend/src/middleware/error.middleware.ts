import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { errorResponse } from "../utils/api-response.js";

export class AppError extends Error {
  statusCode: number;
  errors: unknown[];

  constructor(message: string, statusCode = 500, errors: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return errorResponse(res, "Validation failed", error.errors, 422);
  }
  if (error instanceof AppError) {
    return errorResponse(res, error.message, error.errors, error.statusCode);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return errorResponse(res, "A record with this value already exists", [{ code: error.code, meta: error.meta }], 409);
    }
    if (error.code === "P2025") {
      return errorResponse(res, "Record not found", [{ code: error.code, meta: error.meta }], 404);
    }
    return errorResponse(res, "Database request failed", [{ code: error.code, meta: error.meta }], 400);
  }
  const message = error instanceof Error ? error.message : "Something went wrong";
  return errorResponse(res, message, [], 500);
}
