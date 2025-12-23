{
  "project_metadata": {
    "name": "VAYA",
    "version": "1.0.0",
    "description": "Regulatory Middleware for Global South Trade Compliance",
    "generated_date": "2025-12-22",
    "tech_lead_recommendation": "Optimized for rapid development, scalability, and regulatory precision"
  },
  "recommended_tech_stack": {
    "backend": {
      "primary_language": "Python 3.11+",
      "framework": "FastAPI 0.104+"
    },
    "frontend": {
      "framework": "Next.js 14+ (App Router)",
      "language": "TypeScript 5.0_",
      "styling": "Tailwind CSS 3.4+",
      "ui_library": "shadcn/ui",
      "state_management": "Zustand 4.4+"
    },
    "database": {
      "primary": "PostgreSQL 15+ (via Supabase)",
      "orm": "SQLAlchemy 2.0+ with Alembic",
      "cache_layer": "Redis 7.0+"
    }
  },
  "data_models": {
    "users": "Core user accounts (exporters, CHAs, admin)",
    "organizations": "Companies/entities",
    "whatsapp_sessions": "Track WhatsApp conversation state",
    "documents": "Uploaded invoices, certificates, etc.",
    "hs_codes": "Indian ITC-HS Codes",
    "cn_codes": "EU Combined Nomenclature codes",
    "hs_cn_mapping": "Mapping between HS and CN codes",
    "cbam_reports": "Generated CBAM quarterly reports",
    "eudr_reports": "Generated EUDR Due Diligence Statements",
    "geolocation_data": "Spatial queries (PostGIS)",
    "validation_rules": "Configurable business rules",
    "audit_logs": "Comprehensive audit trail",
    "payments": "Transaction records",
    "api_keys": "For ERP integrations",
    "notifications": "User alerts"
  },
  "api_endpoints": [
    "POST /api/v1/auth/register",
    "POST /api/v1/auth/login",
    "POST /api/v1/webhook/whatsapp",
    "POST /api/v1/documents/upload",
    "GET /api/v1/hs-codes/search",
    "POST /api/v1/cbam/generate-xml",
    "POST /api/v1/eudr/generate-geojson"
  ],
  "deployment_architecture": {
    "backend": "Railway or Render",
    "frontend": "Vercel",
    "database": "Supabase"
  },
   "phases": {
      "Phase 1": "HS Code Utility (WhatsApp Bot + Web Search)",
      "Phase 2": "CBAM Report Engine (Doc Upload -> XML)",
      "Phase 3": "API Ecosystem (ERP Integrations)"
   }
}
