# Ecom Local Setup

This project has two separate apps:

- `backend`: Express, TypeScript, Prisma, PostgreSQL
- `ecom-frontend`: Next.js storefront/admin frontend

Run the backend and frontend in separate terminal windows.

## Requirements

- Node.js
- npm
- Docker Desktop

## 1. Start The Backend

Open a terminal from the project root:

```bash
cd backend
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The backend API will run at:

```text
http://localhost:5001/api/v1
```

You can test it with:

```bash
curl http://localhost:5001/api/v1/health
```

pgAdmin is available at:

```text
http://localhost:5050
```

## 2. Start The Frontend

Open a second terminal from the project root:

```bash
cd ecom-frontend
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

The frontend calls the backend at:

```text
http://localhost:5001/api/v1
```

So the backend must be running for pages that load store, theme, product, customer, or order data.

## Demo Admin Login

Use these seeded credentials after running `npm run db:seed` in the backend:

```text
Admin dashboard: http://localhost:3000/admin/login
Super admin email: admin@example.com
Super admin password: password123
Store owner email: owner@example.com
Store owner password: password123
Demo store slug: demo-fashion-store
```

## Useful Backend Commands

Run these from the `backend` folder:

```bash
npm run dev          # start backend in watch mode
npm run build        # compile TypeScript
npm run start        # run compiled backend
npm run db:generate  # generate Prisma client
npm run db:migrate   # run database migrations
npm run db:push      # push schema without migration files
npm run db:seed      # seed demo data
npm run db:studio    # open Prisma Studio
```

## Useful Frontend Commands

Run these from the `ecom-frontend` folder:

```bash
npm run dev    # start Next.js dev server
npm run build  # build frontend
npm run start  # run production frontend build
npm run lint   # run linting
```

## Stopping Local Services

Stop the frontend and backend dev servers with `Ctrl+C`.

Stop the backend database containers with:

```bash
cd backend
docker compose down
```
