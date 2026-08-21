# Ecommerce SaaS Backend

Express.js + Prisma backend for a multi-tenant ecommerce SaaS platform. One platform can host many stores, and each store owns its products, categories, customers, orders, coupons, theme, settings, staff, marketing, and subscription data.

## Tech Stack

- Node.js, Express.js, TypeScript
- PostgreSQL 16 through Docker Compose
- Prisma ORM
- Zod validation
- JWT-ready auth with bcrypt password hashing
- Helmet, CORS, Morgan, express-rate-limit

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

API base URL: `http://localhost:5001/api/v1`

pgAdmin: `http://localhost:5050`

## Prisma Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:studio
```

## Main Routes

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET|POST /api/v1/stores`
- `GET|PATCH|DELETE /api/v1/stores/:storeId`
- `GET|POST /api/v1/stores/:storeId/products`
- `GET|PATCH|DELETE /api/v1/stores/:storeId/products/:productId`
- `GET|POST /api/v1/stores/:storeId/categories`
- `GET|POST /api/v1/stores/:storeId/orders`
- `PATCH /api/v1/stores/:storeId/orders/:orderId/status`
- `PATCH /api/v1/stores/:storeId/orders/:orderId/payment-status`
- `GET|POST /api/v1/stores/:storeId/customers`
- `GET|POST /api/v1/stores/:storeId/coupons`
- `POST /api/v1/stores/:storeId/coupons/validate`
- `GET|PUT /api/v1/stores/:storeId/theme`
- `GET|PUT /api/v1/stores/:storeId/marketing`
- `GET|PUT /api/v1/stores/:storeId/settings`
- `GET /api/v1/stores/:storeId/analytics/overview`
- `GET|POST /api/v1/stores/:storeId/staff`
- `GET /api/v1/plans`
- `GET|POST /api/v1/stores/:storeId/subscription`

## Public Storefront Routes

- `GET /api/v1/public/stores/:slug`
- `GET /api/v1/public/stores/:slug/products`
- `GET /api/v1/public/stores/:slug/products/:productSlug`
- `GET /api/v1/public/stores/:slug/categories`
- `GET /api/v1/public/stores/:slug/theme`
- `GET /api/v1/public/stores/:slug/settings`
- `POST /api/v1/public/stores/:slug/orders`
- `POST /api/v1/public/stores/:slug/coupons/validate`
- `GET /api/v1/public/stores/:slug/meta-product-feed.xml`
- `GET /api/v1/public/stores/:slug/meta-product-feed.csv`

## Demo Admin Credentials

- Admin dashboard: `http://localhost:3000/admin/login`
- Super admin email: `admin@example.com`
- Super admin password: `password123`
- Store owner email: `owner@example.com`
- Store owner password: `password123`
- Demo store slug: `demo-fashion-store`

## Next Integration Steps

- Add frontend API client integration.
- Add real payment gateways.
- Add courier integration.
- Add Meta Conversions API and Meta Marketing API.
- Add AI-powered ad generation.
- Add email/SMS order confirmation.
- Add production auth flows, refresh tokens, password reset, and permission checks per route.
