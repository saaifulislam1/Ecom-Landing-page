import { Response } from "express";

export function successResponse<T>(res: Response, message: string, data?: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function paginatedResponse<T>(
  res: Response,
  message: string,
  data: T[],
  meta: { page: number; limit: number; total: number },
) {
  return res.json({
    success: true,
    message,
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  });
}

export function errorResponse(res: Response, message: string, errors: unknown[] = [], statusCode = 500) {
  return res.status(statusCode).json({ success: false, message, errors });
}
