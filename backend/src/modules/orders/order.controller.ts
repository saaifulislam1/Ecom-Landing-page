import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { paginatedResponse, successResponse } from "../../utils/api-response.js";
import { getPagination } from "../../utils/pagination.js";
import { serialize } from "../../utils/serializers.js";
import { getValidCouponDiscount } from "../coupons/coupon.controller.js";
import { sendPurchaseEvent } from "../marketing/meta-capi.service.js";

type OrderItemInput = {
  productId: string;
  quantity: number;
  variant?: unknown;
};

function nextOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${new Date().getFullYear()}-${timestamp}${suffix}`;
}

export async function listOrders(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req);
  const where: Prisma.OrderWhereInput = { storeId: req.params.storeId };
  if (req.query.search) {
    const search = String(req.query.search);
    where.OR = [{ orderNumber: { contains: search, mode: "insensitive" } }, { customerName: { contains: search, mode: "insensitive" } }, { customerPhone: { contains: search } }];
  }
  if (req.query.status) where.status = req.query.status as never;
  if (req.query.paymentMethod) where.paymentMethod = req.query.paymentMethod as never;
  if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus as never;
  if (req.query.dateFrom || req.query.dateTo) where.createdAt = { gte: req.query.dateFrom ? new Date(String(req.query.dateFrom)) : undefined, lte: req.query.dateTo ? new Date(String(req.query.dateTo)) : undefined };
  const [data, total] = await Promise.all([prisma.order.findMany({ where, include: { orderItems: true }, skip, take: limit, orderBy: { createdAt: "desc" } }), prisma.order.count({ where })]);
  return paginatedResponse(res, "Orders fetched", serialize(data), { page, limit, total });
}
export async function createOrder(req: Request, res: Response) {
  const { items, metaEventId, ...order } = req.body;
  const data = await prisma.$transaction(async (tx) => {
    const productIds = items.map((item: { productId?: string }) => item.productId).filter(Boolean) as string[];
    if (productIds.length !== items.length) throw new AppError("Every order item must reference a product", 400);

    const products = await tx.product.findMany({ where: { id: { in: productIds }, storeId: req.params.storeId, status: "PUBLISHED" } });
    if (products.length !== new Set(productIds).size) throw new AppError("One or more products are unavailable", 400);

    const productsById = new Map(products.map((product) => [product.id, product]));
    const orderItems = (items as OrderItemInput[]).map((item) => {
      const product = productsById.get(item.productId);
      if (!product) throw new AppError("One or more products are unavailable", 400);
      if (product.stock < item.quantity) throw new AppError(`${product.title} does not have enough stock`, 409);

      const price = product.salePrice ?? product.price;
      return {
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0],
        price,
        quantity: item.quantity,
        total: price.mul(item.quantity),
        variant: item.variant,
      };
    });

    const settings = await tx.storeSettings.findUnique({ where: { storeId: req.params.storeId } });
    const subtotal = orderItems.reduce((sum: number, item) => sum + item.total.toNumber(), 0);
    const configuredDeliveryCharge =
      order.deliveryMethod === "INSIDE_CITY"
        ? settings?.insideCityDeliveryCharge
        : settings?.outsideCityDeliveryCharge;
    const deliveryCharge = settings?.freeDeliveryMinAmount && subtotal >= settings.freeDeliveryMinAmount.toNumber()
      ? 0
      : Number(configuredDeliveryCharge ?? 0);
    const couponCode = order.couponCode ? String(order.couponCode).toUpperCase() : undefined;
    const discountAmount = couponCode
      ? (await getValidCouponDiscount(req.params.storeId, couponCode, subtotal, deliveryCharge, tx)).discountAmount
      : 0;
    const total = subtotal + deliveryCharge - discountAmount;
    const customerEmail = order.customerEmail ? String(order.customerEmail).trim().toLowerCase() : undefined;

    const customer = req.customerAccount?.storeId === req.params.storeId
      ? await tx.customer.update({
          where: { id: req.customerAccount.id },
          data: {
            name: order.customerName,
            phone: order.customerPhone,
            email: customerEmail,
            address: order.deliveryAddress,
            city: order.city,
          },
        })
      : order.customerId
      ? await tx.customer.findFirst({ where: { id: order.customerId, storeId: req.params.storeId } })
      : await tx.customer.upsert({
          where: { storeId_phone: { storeId: req.params.storeId, phone: order.customerPhone } },
          update: {
            name: order.customerName,
            email: customerEmail,
            address: order.deliveryAddress,
            city: order.city,
          },
          create: {
            storeId: req.params.storeId,
            name: order.customerName,
            phone: order.customerPhone,
            email: customerEmail,
            address: order.deliveryAddress,
            city: order.city,
            tags: ["New"],
          },
        });

    const createdOrder = await tx.order.create({
      data: {
        ...order,
        subtotal,
        deliveryCharge,
        couponCode,
        discountAmount,
        total,
        storeId: req.params.storeId,
        customerId: customer?.id,
        customerEmail,
        orderNumber: nextOrderNumber(),
        orderItems: { create: orderItems },
      },
      include: { orderItems: true, customer: true },
    });

    if (customer) {
      await tx.customer.update({
        where: { id: customer.id },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
        },
      });
    }

    for (const item of orderItems) {
      const stockUpdate = await tx.product.updateMany({
        where: { id: item.productId, storeId: req.params.storeId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (stockUpdate.count !== 1) throw new AppError(`${item.productTitle} does not have enough stock`, 409);
    }

    if (couponCode) {
      await tx.coupon.update({
        where: { storeId_code: { storeId: req.params.storeId, code: couponCode } },
        data: { usedCount: { increment: 1 } },
      });
    }

    return createdOrder;
  });
  const marketingSettings = await prisma.marketingSettings.findUnique({ where: { storeId: req.params.storeId } });
  sendPurchaseEvent(marketingSettings, data, metaEventId).catch((error) => {
    console.error("Meta CAPI Purchase event failed", error);
  });
  return successResponse(res, "Order created", serialize(data), 201);
}
export async function getOrder(req: Request, res: Response) {
  const data = await prisma.order.findFirstOrThrow({ where: { id: req.params.orderId, storeId: req.params.storeId }, include: { orderItems: true, customer: true } });
  return successResponse(res, "Order fetched", serialize(data));
}
export async function updateOrderStatus(req: Request, res: Response) {
  const data = await prisma.order.update({ where: { id: req.params.orderId, storeId: req.params.storeId }, data: { status: req.body.status } });
  return successResponse(res, "Order status updated", serialize(data));
}
export async function updatePaymentStatus(req: Request, res: Response) {
  const data = await prisma.order.update({ where: { id: req.params.orderId, storeId: req.params.storeId }, data: { paymentStatus: req.body.paymentStatus } });
  return successResponse(res, "Payment status updated", serialize(data));
}

export async function updateOrder(req: Request, res: Response) {
  const data = await prisma.order.update({ where: { id: req.params.orderId, storeId: req.params.storeId }, data: req.body });
  return successResponse(res, "Order updated", serialize(data));
}
