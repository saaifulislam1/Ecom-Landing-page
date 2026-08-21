import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import { serialize } from "../../utils/serializers.js";

export async function listStaff(req: Request, res: Response) {
  const data = await prisma.staffMember.findMany({ where: { storeId: req.params.storeId }, include: { user: true } });
  return successResponse(res, "Staff fetched", serialize(data));
}
export async function createStaff(req: Request, res: Response) {
  const email = req.body.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email }, include: { staffMembers: true } });
  if (existingUser && existingUser.role !== UserRole.STAFF) throw new AppError("A user with this email already exists", 409);
  if (existingUser?.staffMembers.some((member) => member.storeId === req.params.storeId)) throw new AppError("A staff member with this email already exists", 409);
  if (existingUser?.staffMembers.length) throw new AppError("A user with this email already exists", 409);

  const password = await bcrypt.hash(req.body.password, 10);
  const data = await prisma.$transaction(async (tx) => {
    const user = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: req.body.name,
            email,
            password,
            status: "ACTIVE",
          },
        })
      : await tx.user.create({
          data: {
            name: req.body.name,
            email,
            password,
            role: UserRole.STAFF,
            status: "ACTIVE",
          },
        });
    return tx.staffMember.create({
      data: {
        storeId: req.params.storeId,
        userId: user.id,
        role: req.body.role,
        status: req.body.status,
      },
      include: { user: true },
    });
  });
  return successResponse(res, "Staff member created", serialize(data), 201);
}
export async function updateStaff(req: Request, res: Response) {
  const data = await prisma.staffMember.update({
    where: { id: req.params.staffId, storeId: req.params.storeId },
    data: req.body,
    include: { user: true },
  });
  return successResponse(res, "Staff member updated", serialize(data));
}
export async function deleteStaff(req: Request, res: Response) {
  await prisma.$transaction(async (tx) => {
    const staffMember = await tx.staffMember.delete({ where: { id: req.params.staffId, storeId: req.params.storeId }, include: { user: true } });
    if (staffMember.user.role !== UserRole.STAFF) return;

    const remainingStaffMemberships = await tx.staffMember.count({ where: { userId: staffMember.userId } });
    if (remainingStaffMemberships === 0) {
      await tx.user.delete({ where: { id: staffMember.userId } });
    }
  });
  return successResponse(res, "Staff member deleted", null);
}
