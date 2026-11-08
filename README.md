# 🩺 MediAI Care — Enterprise Multi-Clinic & Telemedicine Platform

> **Status:** Phase 0 Complete — Infrastructure, Database Security Guards, Auth.js RBAC, & Seeding Hardened

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql)](https://supabase.com)
[![Prisma 6](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

MediAI Care is a multi-clinic appointment and decision-support healthcare platform designed for local medical centers. It transitions traditional clinic workflows (phone bookings, walk-in queues, doctor scheduling) into a scalable SaaS model, with seamless integration points for explainable skin-lesion AI screening and RAG health assistance.



## 🌟 Overview & System Vision

* **Multi-Tenancy from Day One:** Every clinic operates in complete data isolation via strict database-level tenant triggers and scoping rules (`clinicId`).
* **Global Patient Portals:** Patients maintain one global identity account across clinics, while individual clinic records and visits remain strictly isolated.
* **Fail-Safe Integrity:** Double-booking prevention, phone standardizations, append-only audit logging, and row-level security (RLS) are enforced directly inside PostgreSQL.
* **Explainable AI Ready:** Prepared for low-latency FastAPI sidecars running PyTorch lesion screening and vector-based RAG assistants.

---

## 🏗️ Architecture & Technology Stack

```
                       ┌──────────────────────────┐
  Browser Clients ───► │  Next.js 15 (App Router) │
  (Patients/Staff)     │  TypeScript + Tailwind   │
                       └───┬──────────┬───────────┘
                           │          │
             ┌─────────────▼┐      ┌──▼────────────────┐
             │ PostgreSQL   │      │ Auth.js (v5 Beta) │
             │ (Supabase)   │      │ JWT + Bcryptjs    │
             └──────────────┘      └───────────────────┘
```

| Component | Choice | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Full-stack React server components & server actions |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety and compile-time verification |
| **Database** | PostgreSQL on Supabase | Relational engine with `pgvector` and trigram search support |
| **ORM** | Prisma 6 | Type-safe query building and baseline migration management |
| **Authentication** | Auth.js (NextAuth v5) | Stateless JWT sessions with Role-Based Access Control (RBAC) |
| **Data Validation** | Zod | Unified schema validation across frontend and backend boundaries |

---

## 🛡️ Phase 0 Milestones & System Reflections

Phase 0 established a production-grade database baseline, authentication framework, and automated safety guards.

### 1. Database-Level Security Guards (`1_db_guards`)
* **Double-Booking Shield:** Partial unique index (`uniq_active_slot`) blocks overlapping appointments for active bookings at the database engine level.
* **Tenant Isolation Wall:** A PostgreSQL trigger (`appt_tenant_guard`) automatically rejects any appointment linking a doctor or patient outside their designated clinic.
* **Immutable Audit Trail:** Trigger-enforced append-only `AuditLog` table prevents `UPDATE` or `DELETE` operations on security records.
* **Strict Format Enforcement:** Built-in `CHECK` constraints validate E.164 phone formats (`+923001234567`), lowercase emails, non-negative fees, and valid operating hours.
* **Row-Level Security (RLS):** Enabled across all public database tables to block unauthorized REST API access via public Supabase keys.

### 2. Robust Authentication & Session Architecture
* **Dual Identifiers:** Auto-detects input format to allow seamless login via email or local/international phone numbers.
* **Timing-Attack Protection:** Executes dummy `bcrypt` hashing on non-existent accounts to normalize execution duration.
* **Brute-Force Shield:** Automatically locks user accounts for 15 minutes after 5 consecutive failed login attempts.
* **Edge Routing Protection:** `middleware.ts` verifies incoming JWT tokens against defined role routes (`/admin`, `/doctor`, `/reception`, `/patient`), auto-redirecting unauthorized attempts to `/forbidden`.

### 3. Verification & Seeding Suite
* **Deterministic Seeding:** `prisma/seed.ts` populates multi-clinic test environments, doctor schedules, walk-in token counters, and sample appointments.
* **Automated Guard Test Suite:** `scripts/verify-db.ts` executes automated attacks (e.g., intentional double-bookings, tenant leaks, audit tampering) to confirm PostgreSQL constraints reject invalid operations.

---

## 📁 Repository Directory Structure

```text
mediai-care/
├── prisma/
│   ├── migrations/
│   │   ├── 0_init/              # Baseline PostgreSQL table definitions
│   │   └── 1_db_guards/         # SQL triggers, indexes, and CHECK constraints
│   ├── schema.prisma            # Master database datamodel (25 entities)
│   └── seed.ts                  # Deterministic demo dataset generator
├── scripts/
│   └── verify-db.ts             # Database guard automated verification runner
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # Auth.js API catch-all endpoint
│   │   │   └── health/              # System ping & DB connectivity monitor
│   │   ├── dashboard/           # Authenticated user session view
│   │   ├── forbidden/           # 403 Security exception view
│   │   └── login/               # Interactive authentication interface
│   ├── lib/
│   │   ├── db.ts                # PrismaClient singleton instance
│   │   ├── phone.ts             # E.164 International phone normalizer
│   │   ├── rbac.ts              # Route permission mapping
│   │   └── session.ts           # Server action permission validator
│   ├── types/
│   │   └── next-auth.d.ts       # Auth.js type augmentations (Role, ClinicId)
│   ├── auth.config.ts           # Edge-compatible authentication rules
│   ├── auth.ts                  # Node.js server authentication engine
│   └── middleware.ts            # Route protection guardian
├── docker-compose.yml           # Optional local PostgreSQL container config
└── README.md                    # System architecture documentation
```

---

## 🚦 Getting Started & Local Setup

### Prerequisites
* **Node.js:** v20 or higher
* **Package Manager:** `npm` v10+
* **Database:** Managed Supabase PostgreSQL project or local Docker instance

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/asad-ali-sajjad/mediai-care.git
cd mediai-care
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
BETTER_AUTH_SECRET="your-32-byte-base64-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ALLOW_SEED="yes"
```

### 3. Deploy Migrations & Seed Data
Apply custom SQL guards and generate test data:
```bash
# Deploy migrations
npx prisma migrate deploy

# Seed multi-clinic test environment
npx tsx prisma/seed.ts

# Run security verification suite
npx tsx scripts/verify-db.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000/api/health` to verify system health.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Action / Route | `SUPER_ADMIN` | `CLINIC_ADMIN` | `RECEPTIONIST` | `DOCTOR` | `PATIENT` |
|---|:---:|:---:|:---:|:---:|:---:|
| **Platform Management (`/super`)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Clinic Staff & Settings (`/admin`)** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Reception & Queue (`/reception`)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Clinical Workspace (`/doctor`)** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Patient Portal (`/patient`)** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Shared Dashboard (`/dashboard`)** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🗺️ Roadmap: Next Steps

* [x] **Phase 0: Foundation & Security Baseline** — Schema, DB guards, Auth.js, Seed pipeline.
* [ ] **Phase 1: Booking Core & Slot Engine** — Dynamic slot calculation (`getSlots`), appointment state transitions, doctor schedule/leave editor, printable tickets.
* [ ] **Phase 2: Walk-in Queue & Reception Tools** — Atomic token generator (`QueueCounter`), walk-in check-in, real-time public queue screen.
* [ ] **Phase 3: Notifications Outbox** — Idempotent reminder pipeline, email delivery worker, WhatsApp Cloud API gateway.
* [ ] **Phase 4: Clinical Workspace & File Vault** — Doctor visit notes, prescription storage via private buckets, signed expiring URLs.
* [ ] **Phase 5: Skin-Lesion AI Module** — FastAPI service, ONNX model integration, Grad-CAM overlays, abstention gates, doctor review queues.