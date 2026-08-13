import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { modernBlueTheme } from "../src/modules/auth/auth.service.js";
import { defaultHomepageSettings } from "../src/modules/homepage/homepage.defaults.js";
import { slugify } from "../src/utils/slugify.js";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Fashion",
    description: "Apparel, bags, and everyday style essentials.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Beauty",
    description: "Skincare, cosmetics, and personal care picks.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Electronics",
    description: "Smart gadgets, accessories, and tech essentials.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Food",
    description: "Pantry goods, coffee, honey, and curated treats.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Home & Living",
    description: "Decor, textiles, and useful pieces for calmer spaces.",
    image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Digital Products",
    description: "Templates, brand kits, launch guides, and downloads.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
];
const products = [
  ["Everyday Linen Shirt", "Fashion", 3200, 2590, 18],
  ["Glow Repair Serum", "Beauty", 1850, 1490, 35],
  ["Wireless Noise Earbuds", "Electronics", 6200, 5290, 22],
  ["Organic Honey Jar", "Food", 950, null, 50],
  ["Minimal Ceramic Vase", "Home & Living", 2750, 2290, 14],
  ["Creator Launch Template", "Digital Products", 2200, 1590, 999],
  ["Structured Tote Bag", "Fashion", 4100, null, 16],
  ["Velvet Matte Lip Duo", "Beauty", 1450, null, 27],
  ["Smart Desk Lamp", "Electronics", 3650, 3190, 19],
  ["Artisan Coffee Beans", "Food", 1250, 1090, 44],
  ["Cotton Bed Throw", "Home & Living", 2980, null, 12],
  ["Storefront Brand Kit", "Digital Products", 3500, 2490, 999],
] as const;

async function main() {
  const password = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "Super Admin", email: "admin@example.com", password, role: "SUPER_ADMIN" },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: { name: "Demo Store Owner", email: "owner@example.com", password, role: "STORE_OWNER" },
  });

  const store = await prisma.store.upsert({
    where: { slug: "demo-fashion-store" },
    update: {},
    create: {
      ownerId: owner.id,
      name: "Demo Fashion Store",
      slug: "demo-fashion-store",
      currency: "BDT",
      email: "support@demo.test",
      phone: "+8801000000000",
    },
  });

  await prisma.themeSettings.upsert({
    where: { storeId: store.id },
    update: modernBlueTheme,
    create: { ...modernBlueTheme, storeId: store.id },
  });
  await prisma.marketingSettings.upsert({ where: { storeId: store.id }, update: {}, create: { storeId: store.id } });
  await prisma.storeSettings.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
      enableCOD: true,
      insideCityDeliveryCharge: 80,
      outsideCityDeliveryCharge: 140,
      refundPolicy: "Eligible products may be returned within 7 days.",
      privacyPolicy: "Customer data is used only for order processing.",
      termsAndConditions: "Demo storefront terms.",
    },
  });
  await prisma.homepageSettings.upsert({
    where: { storeId: store.id },
    update: defaultHomepageSettings,
    create: { ...defaultHomepageSettings, storeId: store.id },
  });

  const categoryRecords = new Map<string, string>();
  for (const item of categories) {
    const category = await prisma.category.upsert({
      where: { storeId_slug: { storeId: store.id, slug: slugify(item.name) } },
      update: { description: item.description, image: item.image, status: "ACTIVE" },
      create: { storeId: store.id, name: item.name, slug: slugify(item.name), description: item.description, image: item.image, status: "ACTIVE" },
    });
    categoryRecords.set(item.name, category.id);
  }

  for (const [title, categoryName, price, salePrice, stock] of products) {
    await prisma.product.upsert({
      where: { storeId_slug: { storeId: store.id, slug: slugify(title) } },
      update: {},
      create: {
        storeId: store.id,
        categoryId: categoryRecords.get(categoryName),
        title,
        slug: slugify(title),
        description: `${title} demo product description.`,
        shortDescription: `${title} short description.`,
        price,
        salePrice: salePrice ?? undefined,
        stock,
        images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"],
        status: "PUBLISHED",
        featured: title.includes("Shirt") || title.includes("Kit"),
        bestSeller: title.includes("Serum") || title.includes("Coffee") || title.includes("Earbuds"),
        badge: salePrice ? "Sale" : "New",
      },
    });
  }

  const customers = [
    { name: "Nadia Rahman", phone: "+8801711000001", email: "nadia@example.com", city: "Dhaka", tags: ["VIP"] },
    { name: "Arif Hasan", phone: "+8801811000002", email: "arif@example.com", city: "Dhaka", tags: ["Repeat"] },
    { name: "Maliha Karim", phone: "+8801911000003", email: "maliha@example.com", city: "Chattogram", tags: ["New"] },
    { name: "Sabbir Ahmed", phone: "+8801611000004", email: "sabbir@example.com", city: "Sylhet", tags: ["Repeat"] },
    { name: "Tania Sultana", phone: "+8801511000005", email: "tania@example.com", city: "Dhaka", tags: ["Risky"] },
  ];

  const customerRecords = [];
  for (const item of customers) {
    const customer = await prisma.customer.upsert({
      where: { storeId_phone: { storeId: store.id, phone: item.phone } },
      update: {},
      create: { storeId: store.id, ...item },
    });
    customerRecords.push(customer);
  }

  await prisma.coupon.upsert({
    where: { storeId_code: { storeId: store.id, code: "WELCOME10" } },
    update: {},
    create: { storeId: store.id, code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 1500, usageLimit: 500, status: "ACTIVE" },
  });
  await prisma.coupon.upsert({
    where: { storeId_code: { storeId: store.id, code: "FREESHIP" } },
    update: {},
    create: { storeId: store.id, code: "FREESHIP", discountType: "FREE_SHIPPING", discountValue: 0, minOrderAmount: 2500, usageLimit: 300, status: "ACTIVE" },
  });

  const seededProducts = await prisma.product.findMany({ where: { storeId: store.id }, take: 5 });
  for (let index = 0; index < customerRecords.length; index += 1) {
    const customer = customerRecords[index];
    const product = seededProducts[index % seededProducts.length];
    const unitPrice = product.salePrice ?? product.price;
    const deliveryCharge = index % 2 === 0 ? 80 : 140;
    const subtotal = unitPrice;
    const total = unitPrice.plus(deliveryCharge);
    await prisma.order.upsert({
      where: { orderNumber: `ORD-2026-${String(index + 1).padStart(6, "0")}` },
      update: {},
      create: {
        storeId: store.id,
        customerId: customer.id,
        orderNumber: `ORD-2026-${String(index + 1).padStart(6, "0")}`,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        deliveryAddress: `${customer.city}, Bangladesh`,
        city: customer.city,
        subtotal,
        deliveryCharge,
        discountAmount: 0,
        total,
        paymentMethod: index % 2 === 0 ? "COD" : "BKASH",
        paymentStatus: index % 2 === 0 ? "UNPAID" : "PAID",
        deliveryMethod: index % 2 === 0 ? "INSIDE_CITY" : "OUTSIDE_CITY",
        status: ["PROCESSING", "DELIVERED", "PENDING", "CONFIRMED", "CANCELLED"][index] as never,
        orderItems: {
          create: [{ productId: product.id, productTitle: product.title, productImage: product.images[0], price: unitPrice, quantity: 1, total: unitPrice }],
        },
      },
    });
  }

  for (const plan of [
    { name: "Starter", price: 1500, interval: "MONTHLY" as const, productLimit: 100, features: ["Basic storefront", "COD checkout"] },
    { name: "Business", price: 4500, interval: "MONTHLY" as const, productLimit: 1000, features: ["Marketing center", "Reports"] },
    { name: "Pro", price: 9500, interval: "MONTHLY" as const, productLimit: null, features: ["Team roles", "Priority support"] },
  ]) {
    await prisma.subscriptionPlan.upsert({ where: { name: plan.name }, update: {}, create: plan });
  }

  console.log("Seed complete. Demo credentials: admin@example.com / password123, owner@example.com / password123");
}

main().finally(async () => prisma.$disconnect());
