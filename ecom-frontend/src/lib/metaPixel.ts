type PixelEventPayload = Record<string, string | number | boolean | string[] | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

type FbqStub = ((...args: unknown[]) => void) & { loaded?: boolean; version?: string; queue?: unknown[] };

let currentPixelId: string | null = null;

export function initMetaPixel(pixelId?: string | null) {
  if (typeof window === "undefined" || !pixelId) return;
  if (currentPixelId === pixelId && window.fbq) return;

  currentPixelId = pixelId;
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      const queue = fbq.queue ?? [];
      queue.push(args);
      fbq.queue = queue;
    } as FbqStub;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

export function trackViewContent(payload?: PixelEventPayload, eventId?: string) {
  track("ViewContent", payload, eventId);
}

export function trackAddToCart(payload?: PixelEventPayload, eventId?: string) {
  track("AddToCart", payload, eventId);
}

export function trackInitiateCheckout(payload?: PixelEventPayload, eventId?: string) {
  track("InitiateCheckout", payload, eventId);
}

export function trackPurchase(payload?: PixelEventPayload, eventId?: string) {
  track("Purchase", payload, eventId);
}

function track(eventName: string, payload: PixelEventPayload = {}, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  const options = eventId ? { eventID: eventId } : undefined;
  if (options) {
    window.fbq("track", eventName, payload, options);
    return;
  }
  window.fbq("track", eventName, payload);
}

export function createEventId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
