# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

VAYA is an AI-powered regulatory middleware platform for Indian exporters to navigate EU trade compliance (CBAM and EUDR regulations). It provides HS code lookup, CBAM report generation, document OCR, and AI-powered trade advisory.

## Tech Stack

- **Backend:** FastAPI (Python 3.11+), SQLAlchemy 2.0 (async), PostgreSQL, Redis, Alembic
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand
- **AI Services:** Google Gemini (gemini-1.5-flash) for HS code matching and document extraction
- **Infrastructure:** Docker Compose (PostgreSQL 15, Redis 7)

## Development Commands

### Backend (FastAPI)

```bash
# Setup and run
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

# Linting and type checking
ruff check .
mypy .

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Run tests
pytest
pytest tests/test_specific.py -v
```

### Frontend (Next.js)

```bash
cd frontend
npm install
cp env.example .env.local
npm run dev      # Development server on :3000
npm run build    # Production build
npm run lint     # ESLint
```

### Docker (full stack)

```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f backend # Tail backend logs
```

### API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

### Backend Structure

```
backend/app/
├── main.py              # FastAPI app entry, lifespan events, CORS
├── core/
│   ├── config.py        # Pydantic settings (env vars via BaseSettings)
│   ├── database.py      # Async SQLAlchemy engine, session factory
│   └── security.py      # JWT token creation/verification, password hashing
├── api/
│   ├── deps.py          # Common dependencies (get_current_user, etc.)
│   └── v1/              # API v1 routes, combined in __init__.py
│       ├── auth.py      # Registration, login, token refresh
│       ├── hs_codes.py  # HS/CN code lookup, search, CBAM category info
│       ├── cbam.py      # CBAM report CRUD, EU-compliant XML generation
│       ├── ai.py        # Gemini-powered HS matching, trade Q&A
│       ├── documents.py # Document upload and OCR extraction
│       └── whatsapp.py  # WhatsApp bot webhook
├── models/              # SQLAlchemy ORM models (User, Organization, Document)
├── schemas/             # Pydantic request/response schemas
├── services/
│   ├── gemini_service.py    # Google Gemini API wrapper
│   └── cbam_validation.py   # XSD-based validation, HTML certificate generation
└── data/
    ├── hs_cn_mapping.py     # In-memory HS→CN code mappings with emission factors
    └── seed_data.py         # Seed data utilities
```

### Frontend Structure

```
frontend/src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout with Geist fonts
│   ├── page.tsx         # Landing page (marketing)
│   ├── dashboard/       # Main dashboard with AI search
│   ├── cbam/            # CBAM report creation/management
│   ├── advisor/         # AI trade advisor chat
│   └── ...              # Other feature pages
└── lib/
    └── store.ts         # Zustand auth store (useAuthStore)
```

### Key Data Flows

1. **HS Code Search:** Frontend → `/api/v1/ai/match-hs-code` → GeminiService → JSON response with confidence scores
2. **CBAM Report:** Frontend → `/api/v1/cbam/` POST → Calculate emissions → Generate EU-compliant XML → Store in memory (production: database)
3. **Auth:** JWT access (15min) + refresh (7 days) tokens, stored client-side via Zustand

## Key Patterns

### Backend

- All database operations use async SQLAlchemy (`AsyncSession`)
- Settings loaded via `pydantic-settings` from environment variables
- API routes use `Annotated[AsyncSession, Depends(get_db)]` pattern
- CBAM XML follows EU QReport_ver23.00 schema structure

### Frontend

- Pages use `"use client"` directive for client components
- Auth state managed via Zustand with localStorage persistence
- API calls use fetch directly (no axios wrapper currently)
- Styling uses Tailwind with gradient backgrounds and glass-morphism effects

## Environment Variables

Backend requires (see `backend/.env.example`):
- `DATABASE_URL` - PostgreSQL connection string (async: postgresql+asyncpg://...)
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT signing key (CHANGE IN PRODUCTION)
- `GEMINI_API_KEY` - Required for AI features

Frontend requires:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Domain Concepts

- **HS Code:** 8-digit Harmonized System code for product classification (Indian ITC-HS)
- **CN Code:** EU Combined Nomenclature code (8-digit, maps from HS codes)
- **CBAM:** Carbon Border Adjustment Mechanism - EU regulation requiring carbon emission reporting for imports of steel, aluminium, cement, fertilizers, hydrogen, electricity
- **EUDR:** EU Deforestation Regulation (feature coming soon)
- **EORI:** Economic Operators Registration and Identification number (EU importer ID)
- **Default Emission Factors:** Pre-defined kg CO2e per kg product by category when actual data unavailable
