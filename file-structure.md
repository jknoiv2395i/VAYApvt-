# File Structure for VAYA

This project is organized as a monorepo containing both the Backend (FastAPI) and Frontend (Next.js).

## Root Directory
- \`backend/\`: Python FastAPI application
- \`frontend/\`: Next.js TypeScript application
- \`docker-compose.yml\` (for local dev)
- \`README.md\`

## Backend Structure (\`backend/\`)
\`\`\`
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py         # Registration, Login
│   │   │   ├── documents.py    # Upload, Management
│   │   │   ├── hs_codes.py     # Search, Mapping
│   │   │   ├── cbam.py         # Validation, XML Generation
│   │   │   ├── eudr.py         # Geolocation, GeoJSON
│   │   │   └── webhooks.py     # WhatsApp integration
│   │   └── deps.py             # Dependencies (DB session, Auth)
│   ├── core/
│   │   ├── config.py           # Env vars, Settings
│   │   ├── security.py         # JWT, Hashing
│   │   └── database.py         # DB setup
│   ├── models/                 # SQLAlchemy Models
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── report.py
│   │   └── document.py
│   ├── schemas/                # Pydantic Schemas
│   │   ├── user_schema.py
│   │   ├── cbam_schema.py
│   │   └── eudr_schema.py
│   ├── services/
│   │   ├── ocr_service.py      # OpenAI integration
│   │   └── validation_service.py
│   ├── modules/
│   │   ├── export/             # XML/GeoJSON generation logic
│   │   └── snap/               # Document processing tasks
│   └── main.py                 # App entry point
├── tests/
├── alembic/                    # Migrations
├── requirements.txt
└── Dockerfile
\`\`\`

## Frontend Structure (\`frontend/\`)
\`\`\`
frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login/Register pages
│   ├── dashboard/              # Protected routes
│   │   ├── reports/
│   │   ├── documents/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── forms/                  # React Hook Forms
│   └── layout/                 # Header, Sidebar
├── lib/
│   ├── api.ts                  # Axios/Fetch wrapper
│   ├── store.ts                # Zustand store
│   └── utils.ts
├── public/
├── types/
└── package.json
\`\`\`