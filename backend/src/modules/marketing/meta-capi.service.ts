import crypto from "crypto";
import { MarketingSettings, Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { orderItems: OrderItem[] };

function hash(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function sendPurchaseEvent(settings: MarketingSettings | null, order: OrderWithItems, eventId?: string) {
  const datasetId = settings?.metaDatasetId || settings?.metaPixelId;
  if (!settings?.isCapiEnabled || !settings.capiAccessToken || !datasetId) return;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId || order.id,
        action_source: "website",
        user_data: {
          em: hash(order.customerEmail),
          ph: hash(order.customerPhone),
          fn: hash(order.customerName.split(" ")[0]),
          ln: hash(order.customerName.split(" ").slice(1).join(" ")),
          ct: hash(order.city),
        },
        custom_data: {
          currency: "BDT",
          value: Number(order.total),
          order_id: order.orderNumber,
          content_type: "product",
          content_ids: order.orderItems.map((item) => item.productId).filter(Boolean),
          contents: order.orderItems.map((item) => ({
            id: item.productId ?? item.productTitle,
            quantity: item.quantity,
            item_price: Number(item.price),
          })),
        },
      },
    ],
  };

  const response = await fetch(`https://graph.facebook.com/v20.0/${datasetId}/events?access_token=${encodeURIComponent(settings.capiAccessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("Meta CAPI Purchase event failed", response.status, message);
  }
}
