# ConstructHR

A full-stack HR and attendance management system built for construction workforce management. Handles daily check-in/check-out, work report submissions, payroll calculation, and team management across multiple construction sites.

---

## Features

### Employee

- **Attendance** — GPS-verified check-in/check-out with distance validation (≤2km from site), real-time clock, OT tracking
- **Work Reports** — Submit multiple photo reports (up to 10 images) with site and date reference, lightbox viewer
- **Calendar** — Monthly work schedule view with daily attendance breakdown
- **Payroll** — View monthly earnings with normal pay, OT, and allowance breakdown
- **Profile** — Edit personal info and avatar upload

### Admin

- **Dashboard** — Executive-level overview: payroll total, approval rate, pending items, OT alert (flags if OT ≥ 20%)
- **Attendance Review** — Approve/reject by team and month, manual hour override with audit log, export Excel (split by team sheets)
- **Payroll** — Auto-calculated on attendance approval, rate-change detection with recalculate prompt
- **Employees** — Full CRUD with pay rate management, soft delete/restore
- **Reports** — Review and approve work photo reports grouped by site and date, image grid with lightbox
- **Sites** — Manage construction sites with GPS coordinates, per-site shift configuration, attendance history by month
- **Teams** — Manage teams and add/remove members

---

## Tech Stack

### Frontend (`client`)

|               |                                   |
| ------------- | --------------------------------- |
| Framework     | Next.js 16 (App Router)           |
| Language      | TypeScript                        |
| Auth          | NextAuth.js v5                    |
| Styling       | Tailwind CSS 4                    |
| UI Components | shadcn/ui + Radix UI              |
| Animation     | Framer Motion                     |
| File Upload   | Cloudinary (batch, max 10 images) |

### Backend (`server`)

|             |                                        |
| ----------- | -------------------------------------- |
| Framework   | NestJS                                 |
| Language    | TypeScript                             |
| Database    | PostgreSQL + Prisma ORM                |
| Auth        | JWT                                    |
| File Upload | Cloudinary (batch upload, 3 per batch) |
| Validation  | class-validator                        |

---

## Architecture

```
client/                         # Next.js frontend
├── app/
│   ├── (employee)/             # Employee routes
│   └── admin/                  # Admin routes
├── components/
│   ├── feature/                # Domain components
│   └── shared/                 # Reusable UI
└── lib/
    ├── actions/                 # Server Actions (employee/, admin/)
    ├── api/                     # API service layer
    └── utils/                   # date, export-attendance

server/                         # NestJS backend
└── src/
    ├── attendance/              # Check-in/out, approve/reject, admin override
    ├── employee/                # Employee CRUD
    ├── payroll/                 # Auto-calculation, summary
    ├── report/                  # Multi-image work reports
    ├── site/                    # Sites + shift config
    ├── team/                    # Team management
    └── auth/                    # JWT authentication
```

---

## Key Design Decisions

- **Server Components first** — Data fetching in Server Components, Client Components handle interactivity only
- **Server Actions** — All mutations go through typed Server Actions, never directly from client to API
- **Auto Payroll** — Recalculates automatically on attendance approval, detects pay rate changes and prompts recalculation
- **Time Rounding** — Hours rounded to nearest 30 minutes to match paper-based records
- **OT Rules** — Per-site shift config, early arrival and late departure both count as OT, weekends rate ×2/×3
- **Admin Audit Log** — Every manual hour override is logged with before/after values and admin identity
- **Batch Image Upload** — Cloudinary uploads in batches of 3 to prevent rate limiting
- **Role-based routing** — `proxy.ts` enforces route access by role

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm
- Cloudinary account

### Backend Setup

```bash
cd server
pnpm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
pnpm run start:dev
```

### Frontend Setup

```bash
cd client
pnpm install
cp .env.example .env.local
pnpm run dev
```

### Default Accounts (after seed)

| Email                | Password    | Role        |
| -------------------- | ----------- | ----------- |
| superadmin@anc.co.th | password123 | Super Admin |
| admin@anc.co.th      | password123 | Admin       |
| worker@anc.co.th     | password123 | Worker      |

---

## Environment Variables

### `client/.env.local`

```env
BACKEND_URL=http://localhost:xxxx/
AUTH_SECRET=your-secret-min-32-chars
```

### `server/.env`

```env
PORT=
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SALT_ROUNDS=
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:xxxx
```

---

## Author

**Puntawach** — Full-Stack Developer

Built ConstructHR to demonstrate end-to-end system design — from database schema, REST API with NestJS, to production-ready UI with Next.js App Router.

- GitHub: [github.com/Puntawach](https://github.com/Puntawach)
