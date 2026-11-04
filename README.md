# MediAI Care 🏥🤖

> Multi-clinic appointment & operations platform integrated with a calibrated AI skin-lesion decision support system and RAG assistant.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql)](https://supabase.com)
[![Prisma 6](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Overview

**MediAI Care** is designed to modernize local clinic management—replacing legacy single-clinic systems with a scalable multi-tenant SaaS architecture. It serves as a clinical decision support framework featuring:

1. **Multi-Clinic Core:** Online slot scheduling, receptionist walk-in token counters, doctor workspaces, and patient medical record tracking.
2. **AI Decision Support:** Calibrated vision models (FastAPI + PyTorch) with quality gating, uncertainty abstention, and Grad-CAM attention heatmaps for skin-lesion screening.
3. **RAG Health Assistant:** Grounded symptom triage and specialty routing using PostgreSQL `pgvector`.

> **⚠️ Disclaimer:** MediAI Care is strictly a clinical decision-support and workflow system. It does **not** provide autonomous medical diagnoses, clinical prescriptions, or dosage determinations.

---

## 🏗️ Architecture & Structure

The repository is structured as a single unified monorepo[cite: 1]:

```text
mediai-care/
├── src/                        # Next.js 15 App Router (TypeScript)[cite: 1]
│   ├── app/                    # Route handlers & multi-role dashboards[cite: 1]
│   ├── components/             # Tailwind UI components[cite: 1]
│   ├── lib/                    # Core utilities (DB, Auth, Time, RBAC)[cite: 1]
│   └── server/                 # Business logic services & Zod validation[cite: 1]
├── ai-service/                 # FastAPI Python Microservice[cite: 1]
│   ├── app/                    # ML models, quality gate & RAG engine[cite: 1]
│   └── requirements.txt        # Python dependency list[cite: 1]
├── prisma/                     # Database schemas & migrations[cite: 1]
└── docs/                       # Architecture plans & specifications[cite: 1]