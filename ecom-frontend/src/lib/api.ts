import { Category, Product, ThemePreset } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1";
const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG ?? "demo-fashion-store";
export const ADMIN_TOKEN_COOKIE = "admin_token";

type ApiResponse<T> = { success: boolean; message: string; data: T; meta?: unknown };

export type BackendStore = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  currency: string;
};

export type BackendTheme = {
  id?: string;
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  layoutStyle?: "CLASSIC_ECOMMERCE" | "MODERN_GRID" | "BOUTIQUE" | "SINGLE_PRODUCT";
  customCss?: string | null;
};

export type BackendStoreSettings = {
  id?: string;
  enableCOD: boolean;
  enableBkash: boolean;
  enableNagad: boolean;
  enableBankTransfer: boolean;
  minimumOrderAmount?: number | null;
  insideCityDeliveryCharge: number;
  outsideCityDeliveryCharge: number;
  freeDeliveryMinAmount?: number | null;
  refundPolicy?: string | null;
  privacyPolicy?: string | null;
  termsAndConditions?: string | null;
  homepageSeoTitle?: string | null;
  homepageSeoDescription?: string | null;
  ogImage?: string | null;
};

export type BackendMarketingSettings = {
  id?: string;
  metaPixelId?: string | null;
  isPixelEnabled?: boolean;
  isCapiEnabled?: boolean;
  capiAccessToken?: string | null;
  metaDatasetId?: string | null;
  facebookPageUrl?: string | null;
  instagramProfileUrl?: string | null;
  whatsappNumber?: string | null;
  messengerLink?: string | null;
  tiktokUrl?: string | null;
};

export type HomepageSettings = {
  id?: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  categoryEyebrow: string;
  categoryTitle: string;
  categoryDescription: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredDescription: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsDescription: string;
  promoEyebrow: string;
  promoTitle: string;
  promoDescription: string;
  promoImage?: string | null;
  promoButtonLabel: string;
  promoButtonHref: string;
  bestSellersEyebrow: string;
  bestSellersTitle: string;
  bestSellersDescription: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonials: HomepageTestimonial[];
  newsletterEyebrow: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonLabel: string;
};

export type HomepageTestimonial = {
  name: string;
  role?: string | null;
  quote: string;
  rating?: number;
  image?: string | null;
};

export type BackendCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: { products: number };
};

export type BackendProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  salePrice?: number | null;
  images: string[];
  category?: BackendCategory | null;
  stock: number;
  badge?: string | null;
  variants?: unknown;
  bestSeller: boolean;
  featured: boolean;
  status?: string;
  sku?: string | null;
  createdAt: string;
};

export type ProductPayload = {
  categoryId?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  images: string[];
  badge?: string;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  featured: boolean;
  bestSeller: boolean;
  variants?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

export type BackendOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  city?: string | null;
  notes?: string | null;
  subtotal: number;
  deliveryCharge: number;
  couponCode?: string | null;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  status: string;
  createdAt: string;
  orderItems?: Array<{ id: string; productTitle: string; productImage?: string | null; price: number; quantity: number; total: number }>;
};

export type PublicOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city?: string;
  notes?: string;
  subtotal: number;
  deliveryCharge: number;
  couponCode?: string;
  discountAmount: number;
  total: number;
  paymentMethod: "COD" | "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CARD";
  deliveryMethod: "INSIDE_CITY" | "OUTSIDE_CITY";
  metaEventId?: string;
  items: Array<{
    productId?: string;
    productTitle: string;
    productImage?: string;
    price: number;
    quantity: number;
    total: number;
    variant?: Record<string, string>;
  }>;
};

export type AppliedCoupon = {
  code: string;
  discountAmount: number;
  discountType: string;
};

export type BackendCustomer = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  notes?: string | null;
  createdAt: string;
  orders?: BackendOrder[];
};

export type BackendCustomerAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  emailVerifiedAt?: string | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
};

export type CustomerAuthResult = {
  customer: BackendCustomerAccount;
  token: string;
};

export type BackendCoupon = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  status: string;
};

export type CouponPayload = {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  minOrderAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  status: "ACTIVE" | "INACTIVE";
};

export type BackendStaffMember = {
  id: string;
  storeId: string;
  userId: string;
  role: "OWNER" | "MANAGER" | "DIGITAL_MARKETER" | "MARKETING_OFFICER";
  permissions?: unknown;
  status: "ACTIVE" | "INACTIVE";
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type StaffPayload = {
  name: string;
  email: string;
  password: string;
  role: BackendStaffMember["role"];
  status: BackendStaffMember["status"];
};

export type BackendCurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  stores?: BackendStore[];
  staffMembers?: BackendStaffMember[];
};

export type AdminAccessRole = BackendStaffMember["role"] | "NO_ACCESS";
export type AdminLoginState = AdminAccessRole | "LOGIN_REQUIRED";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) {
    let message = `API request failed: ${res.status} ${path}`;
    try {
      const error = (await res.json()) as { message?: string; errors?: unknown };
      message = error.message ? `${message} - ${error.message}` : message;
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    throw new Error(message);
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

async function safe<T>(value: Promise<T>, fallback: T): Promise<T> {
  try {
    return await value;
  } catch {
    return fallback;
  }
}

export async function getStore() {
  return safe(apiFetch<BackendStore>(`/public/stores/${STORE_SLUG}`), null);
}

export async function getStoreId() {
  const store = await getStore();
  return store?.id ?? "";
}

export async function getProducts(): Promise<Product[]> {
  const data = await safe(apiFetch<BackendProduct[]>(`/public/stores/${STORE_SLUG}/products`), []);
  return data.map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await safe(apiFetch<BackendProduct>(`/public/stores/${STORE_SLUG}/products/${slug}`), null);
  return data ? mapProduct(data) : null;
}

export async function getCategories(): Promise<Category[]> {
  const data = await safe(apiFetch<BackendCategory[]>(`/public/stores/${STORE_SLUG}/categories`), []);
  return data.map(mapCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getTheme(): Promise<ThemePreset | null> {
  const theme = await safe(apiFetch<BackendTheme>(`/public/stores/${STORE_SLUG}/theme`), null);
  return theme
    ? {
        id: theme.id ?? theme.themeName,
        name: theme.themeName,
        primary: theme.primaryColor,
        secondary: theme.secondaryColor,
        accent: theme.accentColor,
        background: theme.backgroundColor,
        surface: theme.surfaceColor,
        text: theme.textColor,
        muted: theme.mutedColor,
        border: theme.borderColor,
      }
    : null;
}

export async function getHomepageSettings() {
  return safe(apiFetch<HomepageSettings>(`/public/stores/${STORE_SLUG}/homepage`), null);
}

export async function getPublicMarketingSettings() {
  return safe(apiFetch<BackendMarketingSettings>(`/public/stores/${STORE_SLUG}/marketing`), null);
}

export async function createPublicOrder(payload: PublicOrderPayload, customerToken?: string | null) {
  const order = await apiFetch<BackendOrder>(`/public/stores/${STORE_SLUG}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return normalizeOrder(order);
}

export async function registerCustomer(payload: { name: string; email: string; password: string; phone: string; address?: string; city?: string }) {
  return apiFetch<{ customer: BackendCustomerAccount; emailVerificationRequired: boolean }>(`/public/stores/${STORE_SLUG}/customer-auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loginCustomer(email: string, password: string) {
  return apiFetch<CustomerAuthResult>(`/public/stores/${STORE_SLUG}/customer-auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyCustomerEmail(token: string) {
  return apiFetch<CustomerAuthResult>(`/public/stores/${STORE_SLUG}/customer-auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export async function resendCustomerVerification(email: string) {
  return apiFetch<{ customer: BackendCustomerAccount; emailVerificationRequired: boolean }>(`/public/stores/${STORE_SLUG}/customer-auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function getCurrentCustomer(token: string) {
  return apiFetch<BackendCustomerAccount>(`/public/stores/${STORE_SLUG}/customer-auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getCustomerOrders(token: string) {
  const orders = await apiFetch<BackendOrder[]>(`/public/stores/${STORE_SLUG}/customer-auth/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return orders.map(normalizeOrder);
}

export async function validatePublicCoupon(code: string, subtotal: number, deliveryCharge = 0): Promise<AppliedCoupon> {
  const data = await apiFetch<{ coupon: BackendCoupon; discountAmount: number }>(`/public/stores/${STORE_SLUG}/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal, deliveryCharge }),
  });
  return {
    code: data.coupon.code,
    discountAmount: Number(data.discountAmount),
    discountType: data.coupon.discountType,
  };
}

export async function getPublicOrder(orderNumber: string, phone?: string) {
  const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
  const order = await safe(apiFetch<BackendOrder>(`/public/stores/${STORE_SLUG}/orders/${encodeURIComponent(orderNumber)}${query}`), null);
  return order ? normalizeOrder(order) : null;
}

export async function trackPublicOrder(identifier: string) {
  const order = await safe(apiFetch<BackendOrder>(`/public/stores/${STORE_SLUG}/orders/track/${encodeURIComponent(identifier)}`), null);
  return order ? normalizeOrder(order) : null;
}

async function getAdminToken() {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${ADMIN_TOKEN_COOKIE}=`))
      ?.split("=")[1];
    if (!token) throw new Error("Admin login required");
    return decodeURIComponent(token);
  }

  const { cookies } = await import("next/headers");
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) throw new Error("Admin login required");
  return token;
}

async function hasAdminToken() {
  if (typeof window !== "undefined") {
    return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${ADMIN_TOKEN_COOKIE}=`));
  }

  const { cookies } = await import("next/headers");
  return Boolean((await cookies()).get(ADMIN_TOKEN_COOKIE)?.value);
}

export async function loginAdmin(email: string, password: string) {
  return apiFetch<{ user: BackendCurrentUser; token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

async function adminFetch<T>(path: string): Promise<T> {
  const token = await getAdminToken();
  return apiFetch<T>(path, { headers: { Authorization: `Bearer ${token}` } });
}

async function adminWrite<T>(path: string, method: "PATCH" | "PUT" | "POST", payload: unknown): Promise<T> {
  const token = await getAdminToken();
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

async function adminDelete<T>(path: string): Promise<T> {
  const token = await getAdminToken();
  return apiFetch<T>(path, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

export async function getAdminStore() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendStore>(`/stores/${storeId}`), null);
}

export async function updateAdminStore(payload: Partial<BackendStore>) {
  const storeId = await getStoreId();
  const body = {
    ...(payload.name ? { name: payload.name } : {}),
    ...(payload.slug ? { slug: payload.slug } : {}),
    ...(payload.description !== undefined ? { description: payload.description || null } : {}),
    ...(payload.logo !== undefined ? { logo: payload.logo || null } : {}),
    ...(payload.email !== undefined ? { email: payload.email || null } : {}),
    ...(payload.phone !== undefined ? { phone: payload.phone || null } : {}),
    ...(payload.address !== undefined ? { address: payload.address || null } : {}),
    ...(payload.currency ? { currency: payload.currency } : {}),
  };
  return adminWrite<BackendStore>(`/stores/${storeId}`, "PATCH", body);
}

export async function getAdminTheme() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendTheme>(`/stores/${storeId}/theme`), null);
}

export async function updateAdminTheme(payload: BackendTheme) {
  const storeId = await getStoreId();
  const body = {
    themeName: payload.themeName,
    primaryColor: payload.primaryColor,
    secondaryColor: payload.secondaryColor,
    accentColor: payload.accentColor,
    backgroundColor: payload.backgroundColor,
    surfaceColor: payload.surfaceColor,
    textColor: payload.textColor,
    mutedColor: payload.mutedColor,
    borderColor: payload.borderColor,
    headingFont: payload.headingFont,
    bodyFont: payload.bodyFont,
    layoutStyle: payload.layoutStyle ?? "CLASSIC_ECOMMERCE",
    ...(payload.customCss !== undefined ? { customCss: payload.customCss || null } : {}),
  };
  return adminWrite<BackendTheme>(`/stores/${storeId}/theme`, "PUT", body);
}

export async function getAdminStoreSettings() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendStoreSettings>(`/stores/${storeId}/settings`), null);
}

export async function updateAdminStoreSettings(payload: Partial<BackendStoreSettings>) {
  const storeId = await getStoreId();
  return adminWrite<BackendStoreSettings>(`/stores/${storeId}/settings`, "PUT", payload);
}

export async function getAdminMarketingSettings() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendMarketingSettings>(`/stores/${storeId}/marketing`), null);
}

export async function updateAdminMarketingSettings(payload: Partial<BackendMarketingSettings>) {
  const storeId = await getStoreId();
  return adminWrite<BackendMarketingSettings>(`/stores/${storeId}/marketing`, "PUT", payload);
}

export async function getAdminHomepageSettings() {
  const storeId = await getStoreId();
  return safe(adminFetch<HomepageSettings>(`/stores/${storeId}/homepage`), null);
}

export async function updateAdminHomepageSettings(payload: HomepageSettings) {
  const storeId = await getStoreId();
  return adminWrite<HomepageSettings>(`/stores/${storeId}/homepage`, "PUT", payload);
}

export async function getAdminProducts() {
  const storeId = await getStoreId();
  const response = await safe(adminFetch<BackendProduct[] | { data?: BackendProduct[] }>(`/stores/${storeId}/products?limit=100`), []);
  const products = Array.isArray(response) ? response : response.data ?? [];
  return products;
}

export async function createAdminProduct(payload: ProductPayload) {
  const storeId = await getStoreId();
  return adminWrite<BackendProduct>(`/stores/${storeId}/products`, "POST", payload);
}

export async function updateAdminProduct(productId: string, payload: Partial<ProductPayload>) {
  const storeId = await getStoreId();
  return adminWrite<BackendProduct>(`/stores/${storeId}/products/${productId}`, "PATCH", payload);
}

export async function deleteAdminProduct(productId: string) {
  const storeId = await getStoreId();
  return adminDelete<null>(`/stores/${storeId}/products/${productId}`);
}

export async function getAdminCategories() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendCategory[]>(`/stores/${storeId}/categories`), []);
}

export async function createAdminCategory(payload: { name: string; slug?: string; description?: string; image?: string; status?: "ACTIVE" | "INACTIVE" }) {
  const storeId = await getStoreId();
  return adminWrite<BackendCategory>(`/stores/${storeId}/categories`, "POST", payload);
}

export async function updateAdminCategory(
  categoryId: string,
  payload: { name: string; slug?: string; description?: string; image?: string; status?: "ACTIVE" | "INACTIVE" },
) {
  const storeId = await getStoreId();
  return adminWrite<BackendCategory>(`/stores/${storeId}/categories/${categoryId}`, "PATCH", payload);
}

export async function deleteAdminCategory(categoryId: string) {
  const storeId = await getStoreId();
  return adminDelete<null>(`/stores/${storeId}/categories/${categoryId}`);
}

export async function getAdminOrders() {
  const storeId = await getStoreId();
  const response = await safe(adminFetch<BackendOrder[] | { data?: BackendOrder[] }>(`/stores/${storeId}/orders?limit=100`), []);
  const orders = Array.isArray(response) ? response : response.data ?? [];
  return orders.map(normalizeOrder);
}

export async function getAdminOrder(id: string) {
  const storeId = await getStoreId();
  const order = await safe(adminFetch<BackendOrder>(`/stores/${storeId}/orders/${id}`), null);
  return order ? normalizeOrder(order) : null;
}

export async function getAdminCustomers() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendCustomer[]>(`/stores/${storeId}/customers`), []);
}

export async function getAdminCustomer(id: string) {
  const storeId = await getStoreId();
  const customer = await safe(adminFetch<BackendCustomer>(`/stores/${storeId}/customers/${id}`), null);
  return customer ? { ...customer, orders: customer.orders?.map(normalizeOrder) } : null;
}

export async function updateAdminCustomer(customerId: string, payload: Partial<{ name: string; phone: string; email: string; address: string; city: string; tags: string[]; notes: string }>) {
  const storeId = await getStoreId();
  return adminWrite<BackendCustomer>(`/stores/${storeId}/customers/${customerId}`, "PATCH", payload);
}

export async function getAdminCoupons() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendCoupon[]>(`/stores/${storeId}/coupons`), []);
}

export async function getAdminStaff() {
  const storeId = await getStoreId();
  return safe(adminFetch<BackendStaffMember[]>(`/stores/${storeId}/staff`), []);
}

export async function createAdminStaff(payload: StaffPayload) {
  const storeId = await getStoreId();
  return adminWrite<BackendStaffMember>(`/stores/${storeId}/staff`, "POST", payload);
}

export async function updateAdminStaff(staffId: string, payload: Partial<{ role: BackendStaffMember["role"]; status: BackendStaffMember["status"]; permissions: unknown }>) {
  const storeId = await getStoreId();
  return adminWrite<BackendStaffMember>(`/stores/${storeId}/staff/${staffId}`, "PATCH", payload);
}

export async function deleteAdminStaff(staffId: string) {
  const storeId = await getStoreId();
  return adminDelete<null>(`/stores/${storeId}/staff/${staffId}`);
}

export async function getAdminMe() {
  return safe(adminFetch<BackendCurrentUser>("/auth/me"), null);
}

export async function getAdminAccessRole() {
  const [user, storeId] = await Promise.all([getAdminMe(), getStoreId()]);
  if (!user) return (await hasAdminToken()) ? "NO_ACCESS" : "LOGIN_REQUIRED";
  if (user.role === "SUPER_ADMIN" || user.stores?.some((store) => store.id === storeId)) return "OWNER";
  const staffMember = user.staffMembers?.find((member) => member.storeId === storeId);
  if (!staffMember) return "NO_ACCESS";
  return staffMember.status === "ACTIVE" ? staffMember.role : "NO_ACCESS";
}

export async function createAdminCoupon(payload: CouponPayload) {
  const storeId = await getStoreId();
  return adminWrite<BackendCoupon>(`/stores/${storeId}/coupons`, "POST", payload);
}

export async function updateAdminCoupon(couponId: string, payload: Partial<CouponPayload>) {
  const storeId = await getStoreId();
  return adminWrite<BackendCoupon>(`/stores/${storeId}/coupons/${couponId}`, "PATCH", payload);
}

export async function deleteAdminCoupon(couponId: string) {
  const storeId = await getStoreId();
  return adminDelete<null>(`/stores/${storeId}/coupons/${couponId}`);
}

export async function getAdminAnalytics() {
  const storeId = await getStoreId();
  return safe(adminFetch<{ revenue: number; orders: number; products: number; customers: number; conversionRate: number }>(`/stores/${storeId}/analytics/overview`), {
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    conversionRate: 0,
  });
}

export async function updateAdminOrderStatus(orderId: string, status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED") {
  const storeId = await getStoreId();
  return adminWrite<BackendOrder>(`/stores/${storeId}/orders/${orderId}/status`, "PATCH", { status });
}

export async function updateAdminPaymentStatus(orderId: string, paymentStatus: "UNPAID" | "PAID" | "REFUNDED") {
  const storeId = await getStoreId();
  return adminWrite<BackendOrder>(`/stores/${storeId}/orders/${orderId}/payment-status`, "PATCH", { paymentStatus });
}

export async function updateAdminOrder(orderId: string, payload: Partial<{ notes: string }>) {
  const storeId = await getStoreId();
  return adminWrite<BackendOrder>(`/stores/${storeId}/orders/${orderId}`, "PATCH", payload);
}

function mapCategory(category: BackendCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image ?? "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    description: category.description ?? `${category.name} products`,
  };
}

function mapProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    images: product.images.length ? product.images : ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"],
    category: product.category?.name ?? "Uncategorized",
    rating: 4.8,
    reviewCount: 0,
    stock: product.stock,
    badge: product.badge ?? undefined,
    bestSeller: product.bestSeller,
    featured: product.featured,
    createdAt: product.createdAt,
  };
}

function normalizeOrder(order: BackendOrder): BackendOrder {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    deliveryCharge: Number(order.deliveryCharge),
    couponCode: order.couponCode ?? null,
    discountAmount: Number(order.discountAmount),
    total: Number(order.total),
    orderItems: order.orderItems?.map((item) => ({
      ...item,
      price: Number(item.price),
      total: Number(item.total),
    })),
  };
}
