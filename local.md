# Running The Project Locally

This repository contains two apps:

- `backend`: Express, TypeScript, Prisma, PostgreSQL
- `ecom-frontend`: Next.js storefront/admin frontend

Run the backend and frontend in separate terminal windows.

## Prerequisites

Install these before starting:

- Node.js and npm
- Docker Desktop

## Full Local Run

Use these steps when starting from the project root.

### 1. Start Docker Desktop

Docker Desktop must be running before the backend database containers can start.

Open Docker Desktop from Applications, or run:

```bash
open -a Docker
```

Wait until Docker Desktop says it is running. You should see the Docker icon in the macOS menu bar.

Confirm Docker is ready:

```bash
docker --version
docker compose version
docker info
```

If `docker info` fails, Docker Desktop is still starting. Wait a minute and run it again.

### 2. Start Backend Database Containers

```bash
cd backend
docker compose up -d
```

Check that the containers are running:

```bash
docker compose ps
```

You should see `postgres` and `pgadmin` running.

### 3. Configure And Run Backend

Still inside the `backend` folder:

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

For customer email verification through Resend, add these to `backend/.env` before starting the backend:

```text
RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="Your Store <verify@yourdomain.com>"
```

If those values are empty in local development, the backend logs the verification link in the terminal instead of sending email.

Leave this terminal open. The backend should run at:

```text
http://localhost:5001/api/v1
```

Test it from another terminal:

```bash
curl http://localhost:5001/api/v1/health
```

### 4. Run Frontend

Open a new terminal from the project root:

```bash
cd ecom-frontend
npm install
npm run dev
```

Leave this terminal open. The frontend should run at:

```text
http://localhost:3000
```

Open that URL in your browser.

## Backend Details

pgAdmin runs at:

```text
http://localhost:5050
```

pgAdmin login:

```text
Email: admin@example.com
Password: admin
```

PostgreSQL connection details:

```text
Host: localhost
Port: 5432
Database: ecommerce_saas
User: postgres
Password: postgres
```

## Frontend Details

The frontend defaults to:

```text
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_STORE_SLUG=demo-fashion-store
```

You only need an `ecom-frontend/.env.local` file if you want to override those defaults:

```bash
cd ecom-frontend
printf 'NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1\nNEXT_PUBLIC_STORE_SLUG=demo-fashion-store\n' > .env.local
```

## Demo Login

These accounts are created by `npm run db:seed` in the backend:

```text
Super admin: admin@example.com / password123
Store owner: owner@example.com / password123
Demo store slug: demo-fashion-store
```

## Common Commands

Run backend commands from `backend`:

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

Run frontend commands from `ecom-frontend`:

```bash
npm run dev    # start Next.js dev server
npm run build  # build frontend
npm run start  # run production frontend build
npm run lint   # run linting
```

## Stop Local Services

Stop the frontend and backend dev servers with `Ctrl+C`.

Stop the backend database containers:

```bash
cd backend
docker compose down
```

To also remove the local PostgreSQL data volume and start with a clean database:

```bash
cd backend
docker compose down -v
```
