# VAYA - Regulatory Middleware for Global South Trade Compliance

> AI-powered platform to simplify EU CBAM and EUDR compliance for Indian exporters.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Run with Docker
```bash
# Clone the repository
git clone https://github.com/your-org/vaya.git
cd vaya

# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```

### Run Locally (Development)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
cp env.example .env.local
npm run dev
```

## 📁 Project Structure
```
vaya/
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── api/       # API routes
│   │   ├── core/      # Config, DB, Security
│   │   ├── models/    # SQLAlchemy models
│   │   └── schemas/   # Pydantic schemas
│   └── Dockerfile
├── frontend/          # Next.js 14 frontend
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   └── lib/       # API, Store, Utils
│   └── Dockerfile.dev
└── docker-compose.yml
```

## 🔧 Tech Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Infrastructure:** Docker, Redis, Supabase (optional)

## 📝 API Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/hs-codes/search?q=<query>` - HS code search
- `GET /api/v1/hs-codes/{hs_code}` - Get HS code details
- `POST /api/v1/hs-codes/map-to-cn` - Map HS to CN code

## 🛠️ Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/vaya
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key
OPENAI_API_KEY=sk-...  # Optional for Phase 2
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📄 License
MIT
