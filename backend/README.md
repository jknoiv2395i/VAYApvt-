# VAYA Backend

## Description
FastAPI backend for VAYA - Regulatory Middleware for Global South Trade Compliance.

## Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

## API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
