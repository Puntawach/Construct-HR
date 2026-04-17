# ConstructHR

A full-stack HR and attendance management system built for construction workforce management. Handles daily check-in/check-out, work report submissions, payroll calculation, and team management across multiple construction sites.

---

## Features

### Employee

- **Attendance** — Check-in/check-out with site selection, real-time clock, OT tracking
- **Work Reports** — Submit photo reports with site and date reference
- **Calendar** — Monthly work schedule view with daily breakdown
- **Payroll** — View monthly earnings with normal pay, OT, and allowance breakdown
- **Profile** — Edit personal info and avatar

### Admin

- **Dashboard** — Overview of attendance status, pending approvals, and monthly payroll summary
- **Attendance Review** — Approve or reject employee attendance by team and month
- **Payroll** — Auto-calculated on approval, manual sync available, monthly navigation
- **Employees** — Full CRUD with pay rate management and soft delete/restore
- **Reports** — Review and approve work photo reports grouped by date
- **Sites** — Manage construction site locations with coordinates
- **Teams** — Manage teams and member assignments

---

## Tech Stack

### Frontend (`anc-client`)

|               |                         |
| ------------- | ----------------------- |
| Framework     | Next.js 16 (App Router) |
| Language      | TypeScript              |
| Auth          | NextAuth.js v5          |
| Styling       | Tailwind CSS 4          |
| UI Components | shadcn/ui + Radix UI    |
| State         | Zustand                 |
| Forms         | React Hook Form + Zod   |

### Backend (`anc-server`)

|             |                         |
| ----------- | ----------------------- |
| Framework   | NestJS                  |
| Language    | TypeScript              |
| Database    | PostgreSQL + Prisma ORM |
| Auth        | JWT (RS256)             |
| File Upload | Cloudinary              |
| Validation  | class-validator         |

---

## Architecture

anc-client/ # Next.js frontend
├── app/
│ ├── (employee)/ # Employee routes (home, attendance, reports, calendar, profile)
│ └── admin/ # Admin routes (dashboard, employees, payroll, reports, sites, teams)
├── components/
│ ├── feature/ # Domain-specific components
│ └── shared/ # Reusable UI components
└── lib/
├── actions/ # Server Actions (employee/, admin/)
├── api/ # API service layer
└── types/ # Shared TypeScript types
anc-server/ # NestJS backend
├── src/
│ ├── attendance/ # Check-in/out, approve/reject
│ ├── employee/ # Employee CRUD
│ ├── payroll/ # Auto-calculation, summary
│ ├── report/ # Work photo reports
│ ├── site/ # Construction sites
│ ├── team/ # Team management
│ └── auth/ # JWT authentication

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm
- Cloudinary account

### Backend Setup

```bash
cd anc-server
pnpm install
cp .env.example .env   # fill in your values
npx prisma migrate dev
npx prisma db seed
pnpm run start:dev
```

### Frontend Setup

```bash
cd anc-client
pnpm install
cp .env.example .env.local   # fill in your values
pnpm run dev
```

### Default Accounts (after seed)

| Email                | Password    | Role        |
| -------------------- | ----------- | ----------- |
| superadmin@anc.co.th | password123 | Super Admin |
| admin@anc.co.th      | password123 | Admin       |
| worker@anc.co.th     | password123 | Worker      |

---

## Key Design Decisions

- **Server Components first** — All data fetching happens in Server Components, Client Components handle interactivity only
- **Server Actions** — All mutations go through typed Server Actions, never directly from client to API
- **Auto Payroll** — Payroll recalculates automatically when admin approves attendance, no manual trigger needed
- **Role-based routing** — Middleware enforces route access by role at the edge

---

## Environment Variables

### `anc-client/.env.local`

```env
BACKEND_URL=http://localhost:xxxx
AUTH_SECRET=your-secret-min-32-chars
```

### `anc-server/.env`

```env
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/xxx
SALT_ROUNDS=xxx
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=xx
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:xxxx
```

---

## Author

**Puntawach** — Full-Stack Developer (4.5 months into coding)

Built ConstructHR as a personal project to demonstrate end-to-end system design — from database schema design, REST API development with NestJS, to production-ready UI with Next.js App Router.

- GitHub: [github.com/Puntawach](https://github.com/Puntawach)
