{{
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
      "justification": [
        "Native support for data science libraries (pandas, numpy)",
        "Mature geospatial ecosystem (shapely, geopandas, PostGIS integration)",
        "Superior XML/JSON processing (lxml, pydantic)",
        "Best-in-class AI/ML integration (OpenAI, transformers)",
        "Strong type safety with type hints",
        "Excellent for regulatory rule engines"
      ],
      "framework": "FastAPI 0.104+",
      "framework_benefits": [
        "Automatic OpenAPI/Swagger documentation (critical for Phase 3 API)",
        "Native async/await support for high concurrency",
        "Pydantic integration for strict data validation",
        "Performance comparable to Node.js/Go",
        "Built-in dependency injection",
        "WebSocket support for real-time updates"
      ],
      "alternative_consideration": {
        "language": "Go",
        "use_case": "If team prioritizes raw performance and has Go expertise",
        "tradeoff": "Would lose Python's data/AI ecosystem advantage"
      }
    },

    "frontend": {
      "framework": "Next.js 14+ (App Router)",
      "language": "TypeScript 5.0+",
      "justification": [
        "Server-side rendering for SEO (marketing pages)",
        "API routes for backend proxy/webhooks",
        "File-based routing reduces boilerplate",
        "Built-in image optimization",
        "Edge runtime for global performance",
        "React Server Components for performance"
      ],
      "styling": "Tailwind CSS 3.4+",
      "ui_library": "shadcn/ui",
      "ui_library_benefits": [
        "Accessible components (WCAG 2.1 compliant)",
        "Copy-paste components (no npm bloat)",
        "Built on Radix UI primitives",
        "Full design system customization"
      ],
      "state_management": "Zustand 4.4+",
      "state_justification": [
        "Simpler than Redux, more powerful than Context API",
        "TypeScript-first design",
        "No boilerplate, no providers",
        "Built-in persistence support"
      ]
    },

    "database": {
      "primary": "PostgreSQL 15+ (via Supabase)",
      "justification": [
        "PostGIS extension for geospatial data (EUDR critical)",
        "JSONB for flexible document storage",
        "Full ACID compliance (financial data)",
        "Robust indexing for HS code lookups",
        "Row-level security for multi-tenancy"
      ],
      "orm": "SQLAlchemy 2.0+ with Alembic",
      "orm_benefits": [
        "Type-safe queries with modern syntax",
        "Complex joins for HS code mapping",
        "Migration management with Alembic",
        "Connection pooling built-in"
      ],
      "cache_layer": "Redis 7.0+",
      "cache_use_cases": [
        "Session management (WhatsApp conversations)",
        "HS code lookup cache (reduce DB load)",
        "Rate limiting counters",
        "Celery task queue backend"
      ]
    },

    "storage": {
      "service": "Supabase Storage (S3-compatible)",
      "file_types": {
        "raw_documents": {
          "retention": "24 hours (GDPR compliance)",
          "encryption": "AES-256 at rest",
          "access": "Signed URLs with 1-hour expiry"
        },
        "generated_reports": {
          "retention": "90 days",
          "versioning": "Enabled",
          "access": "User-scoped signed URLs"
        }
      }
    },

    "messaging": {
      "whatsapp": "Twilio WhatsApp Business API",
      "alternative": "Meta Cloud API (future consideration)",
      "email": "Resend or SendGrid",
      "sms_fallback": "Twilio SMS"
    },

    "ai_services": {
      "primary_model": "GPT-4o-mini (OpenAI)",
      "cost_per_1m_tokens": "$0.15 input / $0.60 output",
      "use_cases": [
        "Document OCR and data extraction",
        "HS code description matching",
        "User query understanding"
      ],
      "fallback_ocr": "Azure Document Intelligence",
      "fallback_use_case": "Handwritten documents, complex tables"
    },

    "background_jobs": {
      "queue": "Celery 5.3+",
      "broker": "Redis",
      "use_cases": [
        "Async document processing",
        "XML generation (long documents)",
        "Email delivery",
        "Report generation",
        "Database cleanup (TTL enforcement)"
      ]
    },

    "monitoring": {
      "error_tracking": "Sentry",
      "logging": "Structured logging with Python's logging module",
      "log_aggregation": "Better Stack (formerly Logtail)",
      "metrics": "Prometheus + Grafana (Phase 3)",
      "uptime": "UptimeRobot or Better Uptime"
    },

    "hosting": {
      "backend": {
        "service": "Railway or Render",
        "justification": "Better Python support than Vercel, auto-scaling",
        "alternative": "Google Cloud Run (Phase 3 scale)"
      },
      "frontend": {
        "service": "Vercel",
        "justification": "Native Next.js support, global CDN, zero config"
      },
      "database": {
        "service": "Supabase (hosted PostgreSQL)",
        "alternative": "Neon (serverless Postgres) for Phase 3"
      }
    },

    "development_tools": {
      "version_control": "Git + GitHub",
      "ci_cd": "GitHub Actions",
      "code_quality": {
        "python": {
          "linter": "ruff (replaces flake8, black, isort)",
          "type_checker": "mypy",
          "formatter": "ruff format"
        },
        "typescript": {
          "linter": "ESLint",
          "formatter": "Prettier"
        }
      },
      "testing": {
        "backend": "pytest + pytest-asyncio",
        "frontend": "Vitest + React Testing Library",
        "e2e": "Playwright"
      },
      "api_testing": "Bruno or Postman",
      "local_dev": "Docker Compose"
    }
  },

  "data_models": {
    "users": {
      "table_name": "users",
      "description": "Core user accounts (exporters, CHAs, admin)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true,
          "default": "gen_random_uuid()"
        },
        "email": {
          "type": "VARCHAR(255)",
          "unique": true,
          "nullable": false,
          "indexed": true
        },
        "phone": {
          "type": "VARCHAR(20)",
          "unique": true,
          "nullable": false,
          "indexed": true,
          "format": "E.164 (e.g., +919876543210)"
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "unique": true,
          "nullable": true,
          "note": "May differ from phone"
        },
        "full_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "role": {
          "type": "ENUM",
          "values": ["exporter", "cha", "admin", "verifier"],
          "default": "exporter"
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "language_preference": {
          "type": "VARCHAR(10)",
          "default": "en",
          "values": ["en", "hi", "pa", "ta", "te"]
        },
        "onboarding_completed": {
          "type": "BOOLEAN",
          "default": false
        },
        "kyc_status": {
          "type": "ENUM",
          "values": ["pending", "submitted", "verified", "rejected"],
          "default": "pending"
        },
        "subscription_tier": {
          "type": "ENUM",
          "values": ["free", "pro", "enterprise"],
          "default": "free"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "last_active_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        }
      },
      "indexes": [
        "CREATE INDEX idx_eudr_user ON eudr_reports(user_id)",
        "CREATE INDEX idx_eudr_org ON eudr_reports(organization_id)",
        "CREATE INDEX idx_eudr_commodity ON eudr_reports(commodity_type)",
        "CREATE INDEX idx_eudr_status ON eudr_reports(validation_status)",
        "CREATE INDEX idx_eudr_reference ON eudr_reports(reference_number)"
      ]
    },

    "geolocation_data": {
      "table_name": "geolocation_data",
      "description": "Dedicated table for spatial queries (PostGIS)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "eudr_report_id": {
          "type": "UUID",
          "foreign_key": "eudr_reports.id",
          "nullable": false
        },
        "producer_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "producer_country": {
          "type": "CHAR(2)",
          "nullable": false
        },
        "production_place": {
          "type": "VARCHAR(255)",
          "nullable": true
        },
        "area_hectares": {
          "type": "DECIMAL(10,4)",
          "nullable": false
        },
        "geolocation_type": {
          "type": "ENUM",
          "values": ["point", "polygon"],
          "nullable": false
        },
        "geometry": {
          "type": "GEOMETRY(Geometry, 4326)",
          "nullable": false,
          "note": "PostGIS geometry column - stores both POINT and POLYGON"
        },
        "coordinate_precision": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Decimal places (minimum 6 required)"
        },
        "validation_passed": {
          "type": "BOOLEAN",
          "default": false
        },
        "validation_errors": {
          "type": "TEXT[]",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_geo_report ON geolocation_data(eudr_report_id)",
        "CREATE SPATIAL INDEX idx_geo_geometry ON geolocation_data USING GIST(geometry)",
        "CREATE INDEX idx_geo_country ON geolocation_data(producer_country)"
      ],
      "spatial_queries": [
        "-- Find plots within protected areas",
        "SELECT * FROM geolocation_data WHERE ST_Within(geometry, protected_area_polygon)",
        "-- Calculate total area by country",
        "SELECT producer_country, SUM(area_hectares) FROM geolocation_data GROUP BY producer_country"
      ]
    },

    "validation_rules": {
      "table_name": "validation_rules",
      "description": "Configurable business rules for validation engine",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "rule_name": {
          "type": "VARCHAR(100)",
          "unique": true,
          "nullable": false
        },
        "rule_type": {
          "type": "ENUM",
          "values": ["cbam", "eudr", "hs_code", "document", "general"],
          "nullable": false
        },
        "rule_category": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["emissions_bounds", "geolocation_precision", "mandatory_fields"]
        },
        "rule_logic": {
          "type": "JSONB",
          "structure": {
            "condition": "string (Python expression or SQL)",
            "error_message": "string",
            "severity": "error|warning|info",
            "auto_fix": "boolean",
            "fix_logic": "string (optional)"
          }
        },
        "is_active": {
          "type": "BOOLEAN",
          "default": true
        },
        "priority": {
          "type": "INTEGER",
          "default": 100,
          "note": "Lower number = higher priority"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "example_rules": [
        {
          "rule_name": "cbam_direct_emissions_non_negative",
          "rule_type": "cbam",
          "rule_logic": {
            "condition": "direct_emissions >= 0",
            "error_message": "Direct emissions cannot be negative",
            "severity": "error",
            "auto_fix": false
          }
        },
        {
          "rule_name": "eudr_coordinate_precision_check",
          "rule_type": "eudr",
          "rule_logic": {
            "condition": "coordinate_precision >= 6",
            "error_message": "GPS coordinates must have at least 6 decimal places",
            "severity": "error",
            "auto_fix": false
          }
        }
      ]
    },

    "audit_logs": {
      "table_name": "audit_logs",
      "description": "Comprehensive audit trail for compliance",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": true
        },
        "action_type": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["document_upload", "report_generated", "validation_run", "xml_downloaded"]
        },
        "entity_type": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["document", "cbam_report", "eudr_report", "user"]
        },
        "entity_id": {
          "type": "UUID",
          "nullable": true
        },
        "action_details": {
          "type": "JSONB",
          "nullable": false,
          "note": "Full context of the action"
        },
        "ip_address": {
          "type": "INET",
          "nullable": true
        },
        "user_agent": {
          "type": "TEXT",
          "nullable": true
        },
        "request_id": {
          "type": "UUID",
          "nullable": true,
          "note": "Trace ID for debugging"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()",
          "indexed": true
        }
      },
      "indexes": [
        "CREATE INDEX idx_audit_user ON audit_logs(user_id)",
        "CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id)",
        "CREATE INDEX idx_audit_created ON audit_logs(created_at DESC)"
      ],
      "retention_policy": "Retain for 7 years (regulatory compliance)"
    },

    "payments": {
      "table_name": "payments",
      "description": "Payment transactions for reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "report_id": {
          "type": "UUID",
          "nullable": false,
          "note": "Polymorphic - can be cbam_report_id or eudr_report_id"
        },
        "report_type": {
          "type": "ENUM",
          "values": ["cbam", "eudr"],
          "nullable": false
        },
        "amount": {
          "type": "INTEGER",
          "nullable": false,
          "note": "In paise (₹499 = 49900)"
        },
        "currency": {
          "type": "CHAR(3)",
          "default": "INR"
        },
        "payment_method": {
          "type": "ENUM",
          "values": ["upi", "card", "netbanking", "wallet"],
          "nullable": false
        },
        "payment_gateway": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["razorpay", "stripe"]
        },
        "gateway_payment_id": {
          "type": "VARCHAR(100)",
          "unique": true,
          "nullable": false
        },
        "gateway_order_id": {
          "type": "VARCHAR(100)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed", "refunded"],
          "default": "pending"
        },
        "failure_reason": {
          "type": "TEXT",
          "nullable": true
        },
        "refund_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise"
        },
        "refund_reason": {
          "type": "TEXT",
          "nullable": true
        },
        "refunded_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "metadata": {
          "type": "JSONB",
          "nullable": true,
          "note": "Additional gateway response data"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_payments_user ON payments(user_id)",
        "CREATE INDEX idx_payments_report ON payments(report_type, report_id)",
        "CREATE INDEX idx_payments_status ON payments(payment_status)",
        "CREATE INDEX idx_payments_gateway_id ON payments(gateway_payment_id)"
      ]
    },

    "api_keys": {
      "table_name": "api_keys",
      "description": "API keys for Phase 3 ERP integrations",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "key_name": {
          "type": "VARCHAR(100)",
          "nullable": false,
          "note": "User-defined name (e.g., 'Tally Integration')"
        },
        "key_prefix": {
          "type": "VARCHAR(10)",
          "nullable": false,
          "note": "First 8 chars for display (e.g., 'vaya_liv')"
        },
        "key_hash": {
          "type": "VARCHAR(255)",
          "nullable": false,
          "note": "bcrypt hash of actual key"
        },
        "permissions": {
          "type": "JSONB",
          "default": "{}",
          "structure": {
            "read": "boolean",
            "write": "boolean",
            "validate": "boolean",
            "export": "boolean"
          }
        },
        "rate_limit": {
          "type": "INTEGER",
          "default": 1000,
          "note": "Requests per hour"
        },
        "is_active": {
          "type": "BOOLEAN",
          "default": true
        },
        "last_used_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_api_keys_user ON api_keys(user_id)",
        "CREATE INDEX idx_api_keys_org ON api_keys(organization_id)",
        "CREATE INDEX idx_api_keys_hash ON api_keys(key_hash)"
      ],
      "security_notes": [
        "Never store plaintext keys",
        "Show full key only once at creation",
        "Implement rate limiting in Redis",
        "Rotate keys every 6 months"
      ]
    },

    "notifications": {
      "table_name": "notifications",
      "description": "User notifications (in-app, email, WhatsApp)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "notification_type": {
          "type": "ENUM",
          "values": ["report_ready", "validation_error", "payment_success", "payment_failed", "system_alert"],
          "nullable": false
        },
        "title": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "message": {
          "type": "TEXT",
          "nullable": false
        },
        "channel": {
          "type": "ENUM",
          "values": ["in_app", "email", "whatsapp", "sms"],
          "nullable": false
        },
        "channel_status": {
          "type": "ENUM",
          "values": ["pending", "sent", "delivered", "failed"],
          "default": "pending"
        },
        "priority": {
          "type": "ENUM",
          "values": ["low", "medium", "high", "urgent"],
          "default": "medium"
        },
        "related_entity_type": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "related_entity_id": {
          "type": "UUID",
          "nullable": true
        },
        "action_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Deep link to relevant page"
        },
        "read_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_notif_user ON notifications(user_id)",
        "CREATE INDEX idx_notif_read ON notifications(read_at)",
        "CREATE INDEX idx_notif_created ON notifications(created_at DESC)"
      ]
    }
  },

  "api_endpoints": {
    "authentication": {
      "POST /api/v1/auth/register": {
        "description": "Register new user",
        "request_body": {
          "email": "string",
          "phone": "string (E.164)",
          "password": "string (min 8 chars)",
          "full_name": "string",
          "role": "enum"
        },
        "response": {
          "user": "User object",
          "access_token": "JWT",
          "refresh_token": "JWT"
        }
      },
      "POST /api/v1/auth/login": {
        "description": "Login with email/phone + password",
        "request_body": {
          "identifier": "string (email or phone)",
          "password": "string"
        },
        "response": {
          "user": "User object",
          "access_token": "JWT",
          "refresh_token": "JWT"
        }
      },
      "POST /api/v1/auth/refresh": {
        "description": "Refresh access token",
        "headers": {
          "Authorization": "Bearer {refresh_token}"
        },
        "response": {
          "access_token": "JWT"
        }
      }
    },

    "whatsapp_webhook": {
      "POST /api/v1/webhook/whatsapp": {
        "description": "Twilio WhatsApp webhook receiver",
        "security": "Twilio signature validation",
        "request_body": {
          "From": "string (whatsapp:+919876543210)",
          "Body": "string (message text)",
          "MediaUrl0": "string (optional)",
          "MediaContentType0": "string (optional)"
        },
        "response": {
          "twiml": "XML response for WhatsApp"
        },
        "processing": "Async via Celery task queue"
      }
    },

    "document_management": {
      "POST /api/v1/documents/upload": {
        "description": "Upload document via web dashboard",
        "authentication": "Required",
        "request_body": {
          "file": "multipart/form-data",
          "document_type": "enum",
          "related_report_id": "UUID (optional)"
        },
        "response": {
          "document": "Document object",
          "extraction_started": "boolean"
        }
      },
      "GET /api/v1/documents/{id}": {
        "description": "Get document details",
        "authentication": "Required",
        "response": {
          "document": "Document object with extracted_data"
        }
      },
      "DELETE /api/v1/documents/{id}": {
        "description": "Delete document (before TTL expires)",
        "authentication": "Required",
        "response": {
          "success": "boolean"
        }
      }
    },

    "hs_code_services": {
      "GET /api/v1/hs-codes/search": {
        "description": "Fuzzy search HS codes (Phase 1 feature)",
        "authentication": "Optional (for analytics)",
        "query_params": {
          "q": "string (search query)",
          "limit": "integer (default 10)"
        },
        "response": {
          "results": [
            {
              "hs_code": "string",
              "description": "string",
              "relevance_score": "float",
              "is_cbam_relevant": "boolean"
            }
          ]
        }
      },
      "GET /api/v1/hs-codes/{code}": {
        "description": "Get HS code details",
        "response": {
          "hs_code": "HS Code object with CN mappings"
        }
      },
      "POST /api/v1/hs-codes/map-to-cn": {
        "description": "Map Indian HS to EU CN code",
        "authentication": "Required",
        "request_body": {
          "hs_code": "string",
          "additional_context": "object (optional, for disambiguation)"
        },
        "response": {
          "cn_codes": [
            {
              "cn_code": "string",
              "confidence": "enum",
              "disambiguation_questions": "array (if ambiguous)"
            }
          ]
        }
      }
    },

    "cbam_services": {
      "POST /api/v1/cbam/validate": {
        "description": "Validate CBAM data before XML generation",
        "authentication": "Required",
        "request_body": {
          "reporting_period": "object",
          "declarant": "object",
          "goods": "array"
        },
        "response": {
          "validation_result": {
            "is_valid": "boolean",
            "errors": "array",
            "warnings": "array",
            "auto_fixes_applied": "array"
          }
        }
      },
      "POST /api/v1/cbam/generate-xml": {
        "description": "Generate CBAM XML report (Phase 2)",
        "authentication": "Required",
        "request_body": {
          "report_id": "UUID (existing draft)",
          "force_default_values": "boolean (optional)"
        },
        "response": {
          "report": "CBAM Report object",
          "xml_url": "string (signed download URL)",
          "payment_required": "boolean"
        }
      },
      "GET /api/v1/cbam/reports": {
        "description": "List user's CBAM reports",
        "authentication": "Required",
        "query_params": {
          "status": "enum (optional filter)",
          "period": "string (optional filter)",
          "limit": "integer",
          "offset": "integer"
        },
        "response": {
          "reports": "array of CBAM Report objects",
          "total": "integer",
          "pagination": "object"
        }
      },
      "GET /api/v1/cbam/reports/{id}": {
        "description": "Get CBAM report details",
        "authentication": "Required",
        "response": {
          "report": "CBAM Report object with full goods list"
        }
      }
    },

    "eudr_services": {
      "POST /api/v1/eudr/validate": {
        "description": "Validate EUDR geolocation data",
        "authentication": "Required",
        "request_body": {
          "commodity_type": "enum",
          "plots": "array of plot objects"
        },
        "response": {
          "validation_result": {
            "is_valid": "boolean",
            "errors": "array (with plot-specific issues)",
            "warnings": "array"
          }
        }
      },
      "POST /api/v1/eudr/generate-geojson": {
        "description": "Generate EUDR GeoJSON file(s)",
        "authentication": "Required",
        "request_body": {
          "report_id": "UUID"
        },
        "response": {
          "report": "EUDR Report object",
          "geojson_urls": "array of signed URLs (if split)",
          "file_count": "integer",
          "payment_required": "boolean"
        }
      },
      "GET /api/v1/eudr/reports": {
        "description": "List user's EUDR reports",
        "authentication": "Required",
        "response": {
          "reports": "array",
          "total": "integer",
          "pagination": "object"
        }
      }
    },

    "admin_endpoints": {
      "GET /api/v1/admin/stats": {
        "description": "System-wide statistics",
        "authentication": "Admin role required",
        "response": {
          "total_users": "integer",
          "reports_generated_today": "integer",
          "payment_volume_today": "integer",
          "active_sessions": "integer"
        }
      },
      "GET /api/v1/admin/users": {
        "description": "User management",
        "authentication": "Admin role required",
        "response": {
          "users": "array with sensitive data"
        }
      }
    }
  },

  "pydantic_schemas": {
    "description": "FastAPI request/response validation schemas",
    "examples": {
      "CBAMGoodsSchema": {
        "file": "app/schemas/cbam_schema.py",
        "code": "from pydantic import BaseModel, Field, validator\nfrom typing import Optional\nfrom decimal import Decimal\n\nclass EmissionsData(BaseModel):\n    direct: Decimal = Field(..., ge=0, description='Direct emissions (tonnes CO2e)')\n    indirect: Decimal = Field(..., ge=0, description='Indirect emissions')\n    production_method: str\n    qualifying_parameters: Optional[dict] = None\n    used_default_values: bool = False\n\n    @validator('direct')\n    def validate_direct_emissions(cls, v):\n        if v > 100:  # Sanity check\n            raise ValueError('Direct emissions seem unrealistically high')\n        return v\n\nclass CBAMGoodsSchema(BaseModel):\n    commodity_code: str = Field(..., regex=r'^\\d{8} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE)\n    procedure: str\n    net_mass: Decimal = Field(..., gt=0)\n    country_of_origin: str = Field(..., regex=r'^[A-Z]{2} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE)\n    emissions: EmissionsData\n\n    class Config:\n        json_schema_extra = {\n            'example': {\n                'commodity_code': '73181500',\n                'procedure': 'ReleaseForFreeCirculation',\n                'net_mass': 25.5,\n                'country_of_origin': 'IN',\n                'emissions': {\n                    'direct': 1.85,\n                    'indirect': 0.42,\n                    'production_method': 'EAF',\n                    'used_default_values': False\n                }\n            }\n        }"
      },
      "GeoLocationSchema": {
        "file": "app/schemas/eudr_schema.py",
        "code": "from pydantic import BaseModel, Field, validator\nfrom typing import List, Literal\nfrom decimal import Decimal\n\nclass PointCoordinates(BaseModel):\n    longitude: Decimal = Field(..., ge=-180, le=180)\n    latitude: Decimal = Field(..., ge=-90, le=90)\n\n    @validator('longitude', 'latitude')\n    def check_precision(cls, v):\n        if abs(v).as_tuple().exponent > -6:\n            raise ValueError('Coordinates must have at least 6 decimal places')\n        return v\n\nclass PolygonCoordinates(BaseModel):\n    coordinates: List[List[PointCoordinates]]\n\n    @validator('coordinates')\n    def validate_polygon(cls, v):\n        if len(v) < 1 or len(v[0]) < 4:\n            raise ValueError('Polygon must have at least 4 points')\n        if v[0][0] != v[0][-1]:\n            raise ValueError('Polygon must be closed (first and last point must match)')\n        return v\n\nclass PlotData(BaseModel):\n    producer_name: str = Field(..., max_length=255)\n    producer_country: str = Field(..., regex=r'^[A-Z]{2} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE)\n    production_place: Optional[str] = None\n    area_hectares: Decimal = Field(..., gt=0)\n    geolocation_type: Literal['point', 'polygon']\n    coordinates: Union[PointCoordinates, PolygonCoordinates]"
      }
    }
  },

  "celery_tasks": {
    "description": "Background job definitions",
    "tasks": {
      "process_document_extraction": {
        "file": "app/modules/snap/tasks.py",
        "function": "process_document_extraction(document_id: UUID)",
        "description": "Extract data from uploaded document using GPT-4o-mini",
        "priority": "high",
        "timeout": "5 minutes",
        "retry": "3 attempts with exponential backoff"
      },
      "generate_cbam_xml": {
        "file": "app/modules/export/tasks.py",
        "function": "generate_cbam_xml(report_id: UUID)",
        "description": "Generate and validate CBAM XML file",
        "priority": "high",
        "timeout": "3 minutes"
      },
      "generate_eudr_geojson": {
        "file": "app/modules/export/tasks.py",
        "function": "generate_eudr_geojson(report_id: UUID)",
        "description": "Generate EUDR GeoJSON file(s)",
        "priority": "high",
        "timeout": "5 minutes"
      },
      "cleanup_expired_documents": {
        "file": "app/tasks/cleanup.py",
        "function": "cleanup_expired_documents()",
        "description": "Delete documents past TTL (GDPR compliance)",
        "schedule": "cron: 0 2 * * * (daily at 2 AM)",
        "priority": "low"
      },
      "sync_eu_registry_data": {
        "file": "app/tasks/sync.py",
        "function": "sync_eu_registry_data()",
        "description": "Fetch latest default values and XSD schemas",
        "schedule": "cron: 0 3 * * 0 (weekly on Sunday)",
        "priority": "medium"
      },
      "send_notification": {
        "file": "app/tasks/notifications.py",
        "function": "send_notification(notification_id: UUID)",
        "description": "Send notification via email/WhatsApp/SMS",
        "priority": "medium",
        "retry": "2 attempts"
      }
    }
  },

  "deployment_architecture": {
    "development": {
      "backend": "Local FastAPI with hot reload (uvicorn --reload)",
      "frontend": "Local Next.js dev server (npm run dev)",
      "database": "Docker Postgres with PostGIS",
      "redis": "Docker Redis",
      "storage": "Supabase free tier or local MinIO"
    },
    "staging": {
      "backend": "Railway (auto-deploy from GitHub main branch)",
      "frontend": "Vercel (preview deployments for PRs)",
      "database": "Supabase staging project",
      "redis": "Upstash Redis (free tier)",
      "monitoring": "Sentry (error tracking)"
    },
    "production": {
      "backend": {
        "service": "Railway or Google Cloud Run",
        "instances": "Auto-scaling (min 2, max 10)",
        "health_check": "/api/v1/health",
        "deployment": "Blue-green deployment"
      },
      "frontend": {
        "service": "Vercel (production)",
        "cdn": "Global edge network",
        "domain": "dashboard.vaya.in"
      },
      "database": {
        "service": "Supabase Pro",
        "backup": "Daily automated backups",
        "replication": "Point-in-time recovery enabled"
      },
      "redis": {
        "service": "Upstash Redis (paid tier)",
        "persistence": "AOF enabled"
      },
      "storage": {
        "service": "Supabase Storage",
        "cdn": "CloudFront or Supabase CDN",
        "encryption": "AES-256"
      },
      "monitoring": {
        "errors": "Sentry",
        "logs": "Better Stack",
        "metrics": "Prometheus + Grafana (Phase 3)",
        "uptime": "Better Uptime",
        "alerts": "PagerDuty (for admin)"
      }
    }
  },

  "security_measures": {
    "authentication": {
      "method": "JWT (Access + Refresh tokens)",
      "access_token_expiry": "15 minutes",
      "refresh_token_expiry": "7 days",
      "password_hashing": "bcrypt with salt rounds = 12",
      "mfa": "SMS/WhatsApp OTP (Phase 2)"
    },
    "authorization": {
      "method": "Role-Based Access Control (RBAC)",
      "roles": ["exporter", "cha", "admin", "verifier"],
      "permissions": "Granular per endpoint"
    },
    "data_encryption": {
      "at_rest": "AES-256 (Supabase default)",
      "in_transit": "TLS 1.3",
      "sensitive_fields": "PII encrypted with Fernet (symmetric encryption)"
    },
    "api_security": {
      "rate_limiting": {
        "authenticated": "1000 requests/hour per user",
        "unauthenticated": "100 requests/hour per IP",
        "implementation": "Redis-based sliding window"
      },
      "input_validation": "Pydantic schemas on all endpoints",
      "sql_injection": "Prevented by SQLAlchemy ORM",
      "xss_protection": "Content-Security-Policy headers",
      "csrf_protection": "SameSite cookies + CSRF tokens"
    },
    "whatsapp_security": {
      "signature_validation": "Verify Twilio X-Twilio-Signature header",
      "media_validation": "Virus scan with ClamAV before processing",
      "rate_limiting": "Max 10 messages per user per minute"
    },
    "gdpr_compliance": {
      "data_retention": "24 hours for raw documents, 90 days for reports",
      "right_to_erasure": "Soft delete with anonymization",
      "data_portability": "Export API for user data",
      "consent_management": "Explicit opt-in for data processing"
    }
  },

  "testing_strategy": {
    "unit_tests": {
      "framework": "pytest",
      "coverage_target": ">80%",
      "focus_areas": [
        "Validation logic (Module B)",
        "XML/GeoJSON generation",
        "HS code mapping",
        "Emissions calculations"
      ],
      "example": "tests/test_validate/test_cbam_validation.py"
    },
    "integration_tests": {
      "framework": "pytest with pytest-asyncio",
      "database": "Test database with fixtures",
      "focus_areas": [
        "End-to-end report generation",
        "WhatsApp webhook flow",
        "Payment processing"
      ]
    },
    "api_tests": {
      "framework": "pytest with httpx",
      "focus": "All REST endpoints",
      "assertions": "Status codes, response schemas, error handling"
    },
    "load_tests": {
      "framework": "Locust",
      "scenarios": [
        "100 concurrent WhatsApp messages",
        "50 simultaneous XML generations",
        "1000 HS code searches per minute"
      ],
      "phase": "Before production launch"
    },
    "e2e_tests": {
      "framework": "Playwright",
      "coverage": "Critical user flows in web dashboard",
      "frequency": "Pre-deployment"
    }
  },

  "key_algorithms": {
    "hs_code_fuzzy_search": {
      "algorithm": "PostgreSQL full-text search + trigram similarity",
      "implementation": {
        "step_1": "Convert query to tsvector",
        "step_2": "Search against indexed description column",
        "step_3": "Rank by ts_rank_cd",
        "step_4": "Apply trigram similarity for typos",
        "step_5": "Return top 10 matches with scores"
      },
      "optimization": "GIN index on tsvector column"
    },
    "hs_to_cn_mapping": {
      "algorithm": "Rule-based decision tree",
      "logic": {
        "exact_match": "If first 6 digits match, return all CN variants",
        "disambiguation": "Present questions from hs_cn_mapping.disambiguation_questions",
        "user_input": "Filter CN codes based on answers",
        "confidence": "Mark as 'exact' if only 1 result, 'probable' if 2-3, 'ambiguous' if >3"
      }
    },
    "emissions_calculation": {
      "formula": "Total = (Quantity * Direct_Factor) + (Quantity * Indirect_Factor)",
      "validation": [
        "Assert Direct_Factor >= 0",
        "Warn if Direct_Factor > (EU_Default * 3)",
        "Require ProductionMethod for CBAM Annex II goods"
      ],
      "default_value_fallback": {
        "query": "SELECT default_emission_factor FROM cn_codes WHERE cn_code = ? AND country = ?",
        "flag": "Set used_default_values = true in output"
      }
    },
    "geospatial_validation": {
      "library": "Shapely 2.0",
      "checks": [
        {
          "name": "Format validation",
          "method": "isinstance(obj, Point|Polygon)"
        },
        {
          "name": "Topology validation",
          "method": "shapely.validation.explain_validity()",
          "handles": ["Self-intersection", "Unclosed polygon", "Invalid ring"]
        },
        {
          "name": "Country boundary check",
          "method": "shapely.contains(world_borders[country], plot_geometry)",
          "data_source": "Natural Earth 10m countries shapefile"
        },
        {
          "name": "Precision check",
          "method": "Custom regex on coordinate string",
          "requirement": "Minimum 6 decimal places"
        }
      ]
    },
    "xml_xsd_validation": {
      "library": "lxml.etree + xmlschema",
      "process": [
        "Load QReport_ver23.xsd from disk",
        "Parse generated XML with lxml",
        "Run xmlschema.validate(xml, xsd)",
        "Catch validation errors",
        "Parse error messages",
        "Attempt auto-fix for common issues",
        "Re-validate",
        "Return validated XML or detailed errors"
      ],
      "common_auto_fixes": [
        "Strip whitespace from text nodes",
        "Format decimals to 2 places",
        "Ensure correct namespace prefixes"
      ]
    },
    "geojson_chunking": {
      "algorithm": "Split by feature count if size > 25MB",
      "implementation": {
        "step_1": "Serialize full FeatureCollection to JSON",
        "step_2": "Check size in bytes",
        "step_3": "If > 25MB, calculate features_per_chunk",
        "step_4": "Create multiple FeatureCollections",
        "step_5": "Name files: batch_1_of_3.geojson, batch_2_of_3.geojson",
        "step_6": "Validate each chunk independently"
      }
    }
  },

  "ai_integration_details": {
    "gpt4o_mini_configuration": {
      "model": "gpt-4o-mini",
      "temperature": 0.1,
      "reasoning": "Low temperature for deterministic extraction",
      "max_tokens": 2000,
      "response_format": {
        "type": "json_schema",
        "json_schema": {
          "name": "invoice_extraction",
          "strict": true,
          "schema": {
            "type": "object",
            "properties": {
              "invoice_number": {"type": "string"},
              "invoice_date": {"type": "string", "format": "date"},
              "supplier_name": {"type": "string"},
              "buyer_name": {"type": "string"},
              "hs_code": {"type": "string", "pattern": "^\\d{8}$"},
              "gross_weight": {"type": "number"},
              "gross_weight_unit": {"type": "string"},
              "net_weight": {"type": "number"},
              "net_weight_unit": {"type": "string"},
              "total_value": {"type": "number"},
              "currency": {"type": "string"}
            },
            "required": ["invoice_number", "invoice_date", "hs_code"],
            "additionalProperties": false
          }
        }
      }
    },
    "prompt_engineering": {
      "system_prompt": "You are a data extraction engine specialized in Indian export documents. Extract ONLY the requested fields. Return valid JSON matching the schema. If a field is not found, return null. Never hallucinate data.",
      "user_prompt_template": "Extract the following fields from this invoice:\n\n{field_descriptions}\n\nDocument text:\n{ocr_text}\n\nReturn JSON only, no markdown.",
      "few_shot_examples": "Included in prompt for complex documents (e.g., Bill of Lading)"
    },
    "error_handling": {
      "invalid_json": "Retry with explicit instruction to return only JSON",
      "missing_fields": "Prompt user via WhatsApp for missing data",
      "low_confidence": "Flag for manual review if extraction_confidence < 0.7"
    },
    "cost_optimization": {
      "image_preprocessing": "Compress images to max 2048px width before sending to API",
      "token_management": "Truncate OCR text to 4000 tokens (keeps cost per doc < ₹1)",
      "caching": "Cache extracted data by file hash to avoid re-processing duplicates"
    }
  },

  "phase_specific_implementation": {
    "phase_1_hs_code_utility": {
      "timeline": "Months 1-2",
      "features": {
        "whatsapp_bot": {
          "commands": [
            "User: 'Steel screw' → Bot: 'HS Code: 7318 15 00. Duty: 0%. CBAM: YES'",
            "User: '73181500' → Bot: 'Description: Screws of iron/steel. Duty: 0%...'",
            "User: 'help' → Bot: Shows command list"
          ],
          "tech_stack": ["FastAPI webhook", "PostgreSQL FTS", "Twilio API"],
          "no_auth_required": "Free utility to build user base"
        },
        "web_version": {
          "url": "vaya.in/hs-search",
          "ui": "Simple search box with autocomplete",
          "results": "Card display with HS code, description, duty rate, CBAM flag"
        }
      },
      "success_metrics": {
        "target": "50 DAU by end of Month 2",
        "tracking": "Google Analytics + custom events in PostgreSQL"
      }
    },
    "phase_2_cbam_report_engine": {
      "timeline": "Months 3-4",
      "features": {
        "document_upload": {
          "channels": ["WhatsApp", "Web dashboard"],
          "supported_types": ["Commercial Invoice", "Electricity Bill", "Production Log"],
          "flow": "Upload → Extract → Validate → Generate XML → Payment → Download"
        },
        "validation_engine": {
          "rules": "All CBAM validation rules from validation_rules table",
          "default_values": "Integrated EU default emission factors",
          "user_prompts": "Interactive WhatsApp questions for missing data"
        },
        "payment_integration": {
          "gateway": "Razorpay",
          "amount": "₹499 per report",
          "methods": ["UPI", "Cards", "Net Banking"],
          "success_flow": "Payment → Generate XML → Send via WhatsApp + Email"
        },
        "xml_delivery": {
          "format": "QReport_ver23.xml",
          "validation": "XSD validated before delivery",
          "delivery": "Supabase Storage signed URL (7-day expiry)"
        }
      },
      "success_metrics": {
        "target": "10 paid reports with EU Registry acceptance",
        "tracking": "Payment conversions, EU submission confirmations"
      }
    },
    "phase_3_api_ecosystem": {
      "timeline": "Months 6+",
      "features": {
        "rest_api": {
          "authentication": "API key (SHA-256 hashed)",
          "rate_limiting": "1000 req/hour for paid plans",
          "endpoints": "All /api/v1/cbam/* and /api/v1/eudr/* endpoints",
          "documentation": "Auto-generated Swagger UI"
        },
        "erp_integrations": {
          "partners": ["Tally", "Zoho Books", "Busy"],
          "integration_type": "Plugin/Add-on",
          "flow": "ERP exports invoice → Calls VAYA API → Gets XML → Attaches to shipment"
        },
        "webhook_support": {
          "events": ["report.generated", "validation.failed", "payment.completed"],
          "format": "JSON POST to user-configured URL",
          "security": "HMAC signature verification"
        }
      },
      "success_metrics": {
        "target": "1000 monthly reports via API",
        "partnerships": "3+ ERP vendor integrations"
      }
    }
  },

  "database_optimization": {
    "indexing_strategy": {
      "hot_tables": ["hs_codes", "cn_codes", "users", "cbam_reports"],
      "composite_indexes": [
        "CREATE INDEX idx_reports_user_status ON cbam_reports(user_id, validation_status)",
        "CREATE INDEX idx_docs_user_type ON documents(user_id, document_type)"
      ],
      "partial_indexes": [
        "CREATE INDEX idx_active_sessions ON whatsapp_sessions(user_id) WHERE expires_at > NOW()"
      ]
    },
    "query_optimization": {
      "n_plus_1_prevention": "Use SQLAlchemy joinedload() for relationships",
      "pagination": "Cursor-based for large datasets",
      "aggregations": "Materialized views for dashboard stats (Phase 3)"
    },
    "partitioning": {
      "audit_logs": "Partition by month (audit_logs_2025_01, audit_logs_2025_02...)",
      "reasoning": "Improve query performance on time-range queries"
    },
    "connection_pooling": {
      "min_connections": 5,
      "max_connections": 20,
      "overflow": 10,
      "pool_recycle": 3600
    }
  },

  "monitoring_and_alerts": {
    "critical_alerts": [
      {
        "name": "API Error Rate > 5%",
        "channel": "PagerDuty",
        "action": "Wake on-call engineer"
      },
      {
        "name": "Database CPU > 80%",
        "channel": "Slack + Email",
        "action": "Scale up database"
      },
      {
        "name": "Payment Gateway Down",
        "channel": "PagerDuty",
        "action": "Switch to backup gateway"
      },
      {
        "name": "Celery Queue Length > 100",
        "channel": "Slack",
        "action": "Scale up workers"
      }
    ],
    "business_metrics": [
      {
        "metric": "Daily Active Users",
        "target": "> 50",
        "dashboard": "Grafana"
      },
      {
        "metric": "Report Generation Success Rate",
        "target": "> 95%",
        "dashboard": "Grafana"
      },
      {
        "metric": "Payment Conversion Rate",
        "target": "> 70%",
        "dashboard": "Google Analytics + Custom DB"
      },
      {
        "metric": "Average Response Time",
        "target": "< 2 seconds",
        "dashboard": "Better Stack"
      }
    ],
    "logging_standards": {
      "format": "JSON structured logs",
      "fields": ["timestamp", "level", "message", "user_id", "request_id", "context"],
      "levels": {
        "DEBUG": "Development only",
        "INFO": "Business events (report generated, payment received)",
        "WARNING": "Validation warnings, rate limit hits",
        "ERROR": "API failures, background job failures",
        "CRITICAL": "System down, data corruption"
      }
    }
  },

  "scalability_considerations": {
    "horizontal_scaling": {
      "stateless_backend": "All state in PostgreSQL/Redis, not in-memory",
      "load_balancer": "Railway/Cloud Run built-in",
      "session_management": "Redis for WhatsApp sessions"
    },
    "caching_strategy": {
      "redis_cache": {
        "hs_code_lookups": "TTL: 24 hours",
        "eu_default_values": "TTL: 7 days",
        "api_responses": "TTL: 5 minutes for read-heavy endpoints"
      },
      "cdn_cache": {
        "static_assets": "CloudFront/Vercel Edge",
        "generated_reports": "Supabase CDN (public URLs only)"
      }
    },
    "database_scaling": {
      "read_replicas": "Phase 3 if query load > 1000 QPS",
      "connection_pooling": "PgBouncer in transaction mode",
      "sharding": "Not needed unless > 10M users (Phase 4+)"
    },
    "async_processing": {
      "celery_workers": "Auto-scaling based on queue length",
      "worker_pools": {
        "high_priority": "Report generation (3 workers)",
        "low_priority": "Cleanup tasks (1 worker)"
      }
    }
  },

  "disaster_recovery": {
    "backup_strategy": {
      "database": {
        "frequency": "Daily automated backups (Supabase)",
        "retention": "30 days",
        "restore_time": "< 1 hour"
      },
      "storage": {
        "frequency": "S3 versioning enabled",
        "retention": "90 days for reports"
      }
    },
    "failover_plan": {
      "database": "Automatic failover to standby (Supabase Pro)",
      "backend": "Multi-region deployment (Phase 3)",
      "monitoring": "Health checks every 30 seconds"
    },
    "incident_response": {
      "severity_1": "API down → Page on-call → Restore from backup",
      "severity_2": "Payment gateway issues → Switch provider → Notify users",
      "severity_3": "Slow queries → Optimize indexes → Add caching"
    }
  },

  "development_workflow": {
    "git_workflow": {
      "branching": "GitFlow (main, develop, feature/*, hotfix/*)",
      "pr_requirements": [
        "All tests passing",
        "Code review from 1+ developer",
        "No merge conflicts",
        "Linear history (rebase before merge)"
      ],
      "commit_convention": "Conventional Commits (feat:, fix:, docs:, etc.)"
    },
    "ci_cd_pipeline": {
      "on_push_to_develop": [
        "Run linters (ruff, ESLint)",
        "Run unit tests",
        "Run integration tests",
        "Deploy to staging"
      ],
      "on_push_to_main": [
        "All above +",
        "Run E2E tests",
        "Deploy to production (manual approval)",
        "Send Slack notification"
      ]
    },
    "code_review_checklist": [
      "Logic correctness",
      "Test coverage",
      "Error handling",
      "Security considerations",
      "Performance implications",
      "Documentation updated"
    ]
  },

  "documentation_requirements": {
    "code_documentation": {
      "python": "Google-style docstrings for all public functions",
      "typescript": "JSDoc comments for exported functions",
      "example": "/**\n * Validates CBAM emissions data against EU rules.\n * \n * Args:\n *     goods_data: List of CBAM goods with emissions\n *     use_defaults: Whether to apply default values\n * \n * Returns:\n *     ValidationResult with errors and warnings\n * \n * Raises:\n *     ValueError: If goods_data is empty\n */"
    },
    "api_documentation": {
      "format": "OpenAPI 3.0 (auto-generated by FastAPI)",
      "enhancements": [
        "Add detailed descriptions for each endpoint",
        "Provide request/response examples",
        "Document error codes",
        "Include authentication requirements"
      ],
      "hosting": "Swagger UI at /docs, ReDoc at /redoc"
    },
    "user_documentation": {
      "formats": ["Web docs", "PDF guides", "Video tutorials"],
      "sections": [
        "Getting Started with VAYA",
        "How to Upload Documents",
        "Understanding CBAM Reports",
        "API Integration Guide",
        "Troubleshooting Common Issues"
      ]
    }
  },

  "compliance_and_legal": {
    "data_privacy": {
      "gdpr": {
        "right_to_access": "GET /api/v1/users/me/data endpoint",
        "right_to_erasure": "DELETE /api/v1/users/me endpoint (soft delete)",
        "right_to_portability": "Export all user data in JSON format",
        "data_processing_agreement": "Required for enterprise customers"
      },
      "indian_data_laws": {
        "dpdpa_2023_compliance": "Store PII in Indian data center (Supabase Asia region)",
        "consent_management": "Explicit opt-in for marketing communications"
      }
    },
    "financial_compliance": {
      "payment_regulations": "RBI compliant through Razorpay",
      "invoicing": "GST invoices for all transactions",
      "record_retention": "7 years for financial records"
    },
    "regulatory_compliance": {
      "eu_cbam": "Ensure XML output matches official XSD schema",
      "eu_eudr": "GeoJSON validation against official specifications",
      "customs_compliance": "HS code data synced quarterly from DGFT"
    }
  },

  "team_structure_recommendations": {
    "phase_1_mvp": {
      "team_size": "2-3 developers",
      "roles": [
        {
          "role": "Full-stack Developer (Lead)",
          "skills": ["Python", "FastAPI", "PostgreSQL", "Next.js", "DevOps"],
          "responsibilities": "Architecture, backend core, deployment"
        },
        {
          "role": "Frontend Developer",
          "skills": ["Next.js", "TypeScript", "Tailwind", "UX/UI"],
          "responsibilities": "Web dashboard, user flows"
        },
        {
          "role": "Optional: ML Engineer",
          "skills": ["Python", "OpenAI API", "Document processing"],
          "responsibilities": "OCR optimization, prompt engineering"
        }
      ]
    },
    "phase_2_growth": {
      "team_size": "5-7 people",
      "additional_roles": [
        {
          "role": "Backend Developer",
          "focus": "Payment integration, API development"
        },
        {
          "role": "QA Engineer",
          "focus": "Automated testing, load testing"
        },
        {
          "role": "DevOps Engineer",
          "focus": "Infrastructure, monitoring, on-call"
        }
      ]
    },
    "phase_3_scale": {
      "team_size": "10-15 people",
      "additional_roles": [
        "Product Manager",
        "UX Designer",
        "Customer Success Manager",
        "Technical Writer",
        "Security Engineer"
      ]
    }
  },

  "cost_estimation": {
    "monthly_operating_costs": {
      "phase_1_mvp": {
        "backend_hosting": "$20 (Railway Starter)",
        "frontend_hosting": "$0 (Vercel Free)",
        "database": "$25 (Supabase Pro)",
        "redis": "$10 (Upstash)",
        "twilio": "$50 (estimated)",
        "openai": "$100 (estimated)",
        "monitoring": "$0 (free tiers)",
        "total": "~$205/month"
      },
      "phase_2_production": {
        "backend_hosting": "$100 (Railway Pro or Cloud Run)",
        "frontend_hosting": "$20 (Vercel Pro)",
        "database": "$50 (Supabase Pro)",
        "redis": "$30 (Upstash)",
        "twilio": "$200 (500 users)",
        "openai": "$500 (5000 documents)",
        "monitoring": "$50 (Sentry + Better Stack)",
        "payment_gateway": "$0 (% of transactions)",
        "total": "~$950/month"
      },
      "phase_3_scale": {
        "infrastructure": "$500-1000",
        "ai_services": "$2000 (50K documents)",
        "monitoring": "$200",
        "total": "~$3000-4000/month"
      }
    },
    "revenue_projections": {
      "phase_2": {
        "assumption": "100 reports/month at ₹499",
        "revenue": "₹49,900 (~$600)",
        "gross_margin": "99%",
        "net_profit": "~$400/month"
      },
      "phase_3": {
        "assumption": "1000 reports/month",
        "revenue": "₹4,99,000 (~$6000)",
        "costs": "$4000",
        "net_profit": "~$2000/month"
      }
    }
  },

  "technical_debt_management": {
    "acceptable_shortcuts_phase_1": [
      "No comprehensive test coverage initially (focus on core logic)",
      "Simplified error handling (can be verbose later)",
      "Basic logging (structured logging in Phase 2)",
      "Manual deployment (CI/CD in Phase 2)"
    ],
    "must_avoid": [
      "Hardcoded secrets in code",
      "SQL injection vulnerabilities",
      "Unvalidated user inputs",
      "Missing data retention policies"
    ],
    "refactoring_priorities_phase_2": [
      "Add comprehensive test suite",
      "Implement proper error handling",
      "Set up automated CI/CD",
      "Optimize database queries",
      "Add structured logging"
    ]
  },

  "launch_checklist": {
    "pre_launch": [
      "✓ All Phase 1 features implemented",
      "✓ Database seeded with HS/CN codes",
      "✓ WhatsApp number verified with Twilio",
      "✓ OpenAI API key configured",
      "✓ Domain registered and SSL configured",
      "✓ Privacy policy and terms of service published",
      "✓ Sentry error tracking configured",
      "✓ Google Analytics set up",
      "✓ Beta testing with 10 users completed",
      "✓ Load testing passed (100 concurrent users)",
      "✓ Backup and restore tested",
      "✓ On-call rotation established"
    ],
    "post_launch": [
      "Monitor error rates hourly for first week",
      "Collect user feedback via WhatsApp",
      "Iterate on UX based on analytics",
      "Fix critical bugs within 24 hours",
      "Plan Phase 2 based on usage patterns"
    ]
  },

  "final_recommendations": {
    "backend": {
      "verdict": "Python 3.11+ with FastAPI",
      "confidence": "95%",
      "reasoning": "Unmatched ecosystem for data, AI, and geospatial processing. Team productivity will be highest with Python."
    },
    "frontend": {
      "verdict": "Next.js 14+ with TypeScript",
      "confidence": "90%",
      "reasoning": "Industry standard for production SaaS. Great DX, performance, and deployment story with Vercel."
    },
    "database": {
      "verdict": "PostgreSQL 15+ (via Supabase)",
      "confidence": "100%",
      "reasoning": "PostGIS is non-negotiable for EUDR. Supabase provides managed instance with excellent free tier."
    },
    "critical_success_factors": [
      "Nail the WhatsApp UX - it must feel like chatting with a smart assistant",
      "Ensure XML validation is bulletproof - one rejected report kills trust",
      "Keep Phase 1 absolutely simple - resist feature creep",
      "Build trust through transparency (open-source validator, clear pricing)",
      "Obsess over data privacy - this is sensitive supplier information"
    ]
  }
} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE

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
      "justification": [
        "Native support for data science libraries (pandas, numpy)",
        "Mature geospatial ecosystem (shapely, geopandas, PostGIS integration)",
        "Superior XML/JSON processing (lxml, pydantic)",
        "Best-in-class AI/ML integration (OpenAI, transformers)",
        "Strong type safety with type hints",
        "Excellent for regulatory rule engines"
      ],
      "framework": "FastAPI 0.104+",
      "framework_benefits": [
        "Automatic OpenAPI/Swagger documentation (critical for Phase 3 API)",
        "Native async/await support for high concurrency",
        "Pydantic integration for strict data validation",
        "Performance comparable to Node.js/Go",
        "Built-in dependency injection",
        "WebSocket support for real-time updates"
      ],
      "alternative_consideration": {
        "language": "Go",
        "use_case": "If team prioritizes raw performance and has Go expertise",
        "tradeoff": "Would lose Python's data/AI ecosystem advantage"
      }
    },

    "frontend": {
      "framework": "Next.js 14+ (App Router)",
      "language": "TypeScript 5.0+",
      "justification": [
        "Server-side rendering for SEO (marketing pages)",
        "API routes for backend proxy/webhooks",
        "File-based routing reduces boilerplate",
        "Built-in image optimization",
        "Edge runtime for global performance",
        "React Server Components for performance"
      ],
      "styling": "Tailwind CSS 3.4+",
      "ui_library": "shadcn/ui",
      "ui_library_benefits": [
        "Accessible components (WCAG 2.1 compliant)",
        "Copy-paste components (no npm bloat)",
        "Built on Radix UI primitives",
        "Full design system customization"
      ],
      "state_management": "Zustand 4.4+",
      "state_justification": [
        "Simpler than Redux, more powerful than Context API",
        "TypeScript-first design",
        "No boilerplate, no providers",
        "Built-in persistence support"
      ]
    },

    "database": {
      "primary": "PostgreSQL 15+ (via Supabase)",
      "justification": [
        "PostGIS extension for geospatial data (EUDR critical)",
        "JSONB for flexible document storage",
        "Full ACID compliance (financial data)",
        "Robust indexing for HS code lookups",
        "Row-level security for multi-tenancy"
      ],
      "orm": "SQLAlchemy 2.0+ with Alembic",
      "orm_benefits": [
        "Type-safe queries with modern syntax",
        "Complex joins for HS code mapping",
        "Migration management with Alembic",
        "Connection pooling built-in"
      ],
      "cache_layer": "Redis 7.0+",
      "cache_use_cases": [
        "Session management (WhatsApp conversations)",
        "HS code lookup cache (reduce DB load)",
        "Rate limiting counters",
        "Celery task queue backend"
      ]
    },

    "storage": {
      "service": "Supabase Storage (S3-compatible)",
      "file_types": {
        "raw_documents": {
          "retention": "24 hours (GDPR compliance)",
          "encryption": "AES-256 at rest",
          "access": "Signed URLs with 1-hour expiry"
        },
        "generated_reports": {
          "retention": "90 days",
          "versioning": "Enabled",
          "access": "User-scoped signed URLs"
        }
      }
    },

    "messaging": {
      "whatsapp": "Twilio WhatsApp Business API",
      "alternative": "Meta Cloud API (future consideration)",
      "email": "Resend or SendGrid",
      "sms_fallback": "Twilio SMS"
    },

    "ai_services": {
      "primary_model": "GPT-4o-mini (OpenAI)",
      "cost_per_1m_tokens": "$0.15 input / $0.60 output",
      "use_cases": [
        "Document OCR and data extraction",
        "HS code description matching",
        "User query understanding"
      ],
      "fallback_ocr": "Azure Document Intelligence",
      "fallback_use_case": "Handwritten documents, complex tables"
    },

    "background_jobs": {
      "queue": "Celery 5.3+",
      "broker": "Redis",
      "use_cases": [
        "Async document processing",
        "XML generation (long documents)",
        "Email delivery",
        "Report generation",
        "Database cleanup (TTL enforcement)"
      ]
    },

    "monitoring": {
      "error_tracking": "Sentry",
      "logging": "Structured logging with Python's logging module",
      "log_aggregation": "Better Stack (formerly Logtail)",
      "metrics": "Prometheus + Grafana (Phase 3)",
      "uptime": "UptimeRobot or Better Uptime"
    },

    "hosting": {
      "backend": {
        "service": "Railway or Render",
        "justification": "Better Python support than Vercel, auto-scaling",
        "alternative": "Google Cloud Run (Phase 3 scale)"
      },
      "frontend": {
        "service": "Vercel",
        "justification": "Native Next.js support, global CDN, zero config"
      },
      "database": {
        "service": "Supabase (hosted PostgreSQL)",
        "alternative": "Neon (serverless Postgres) for Phase 3"
      }
    },

    "development_tools": {
      "version_control": "Git + GitHub",
      "ci_cd": "GitHub Actions",
      "code_quality": {
        "python": {
          "linter": "ruff (replaces flake8, black, isort)",
          "type_checker": "mypy",
          "formatter": "ruff format"
        },
        "typescript": {
          "linter": "ESLint",
          "formatter": "Prettier"
        }
      },
      "testing": {
        "backend": "pytest + pytest-asyncio",
        "frontend": "Vitest + React Testing Library",
        "e2e": "Playwright"
      },
      "api_testing": "Bruno or Postman",
      "local_dev": "Docker Compose"
    }
  },

  "data_models": {
    "users": {
      "table_name": "users",
      "description": "Core user accounts (exporters, CHAs, admin)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true,
          "default": "gen_random_uuid()"
        },
        "email": {
          "type": "VARCHAR(255)",
          "unique": true,
          "nullable": false,
          "indexed": true
        },
        "phone": {
          "type": "VARCHAR(20)",
          "unique": true,
          "nullable": false,
          "indexed": true,
          "format": "E.164 (e.g., +919876543210)"
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "unique": true,
          "nullable": true,
          "note": "May differ from phone"
        },
        "full_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "role": {
          "type": "ENUM",
          "values": ["exporter", "cha", "admin", "verifier"],
          "default": "exporter"
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "language_preference": {
          "type": "VARCHAR(10)",
          "default": "en",
          "values": ["en", "hi", "pa", "ta", "te"]
        },
        "onboarding_completed": {
          "type": "BOOLEAN",
          "default": false
        },
        "kyc_status": {
          "type": "ENUM",
          "values": ["pending", "submitted", "verified", "rejected"],
          "default": "pending"
        },
        "subscription_tier": {
          "type": "ENUM",
          "values": ["free", "pro", "enterprise"],
          "default": "free"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "last_active_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        }
      },
      "indexes": [
        "CREATE INDEX idx_eudr_user ON eudr_reports(user_id)",
        "CREATE INDEX idx_eudr_org ON eudr_reports(organization_id)",
        "CREATE INDEX idx_eudr_commodity ON eudr_reports(commodity_type)",
        "CREATE INDEX idx_eudr_status ON eudr_reports(validation_status)",
        "CREATE INDEX idx_eudr_reference ON eudr_reports(reference_number)"
      ]
    },

    "geolocation_data": {
      "table_name": "geolocation_data",
      "description": "Dedicated table for spatial queries (PostGIS)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "eudr_report_id": {
          "type": "UUID",
          "foreign_key": "eudr_reports.id",
          "nullable": false
        },
        "producer_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "producer_country": {
          "type": "CHAR(2)",
          "nullable": false
        },
        "production_place": {
          "type": "VARCHAR(255)",
          "nullable": true
        },
        "area_hectares": {
          "type": "DECIMAL(10,4)",
          "nullable": false
        },
        "geolocation_type": {
          "type": "ENUM",
          "values": ["point", "polygon"],
          "nullable": false
        },
        "geometry": {
          "type": "GEOMETRY(Geometry, 4326)",
          "nullable": false,
          "note": "PostGIS geometry column - stores both POINT and POLYGON"
        },
        "coordinate_precision": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Decimal places (minimum 6 required)"
        },
        "validation_passed": {
          "type": "BOOLEAN",
          "default": false
        },
        "validation_errors": {
          "type": "TEXT[]",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_geo_report ON geolocation_data(eudr_report_id)",
        "CREATE SPATIAL INDEX idx_geo_geometry ON geolocation_data USING GIST(geometry)",
        "CREATE INDEX idx_geo_country ON geolocation_data(producer_country)"
      ],
      "spatial_queries": [
        "-- Find plots within protected areas",
        "SELECT * FROM geolocation_data WHERE ST_Within(geometry, protected_area_polygon)",
        "-- Calculate total area by country",
        "SELECT producer_country, SUM(area_hectares) FROM geolocation_data GROUP BY producer_country"
      ]
    },

    "validation_rules": {
      "table_name": "validation_rules",
      "description": "Configurable business rules for validation engine",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "rule_name": {
          "type": "VARCHAR(100)",
          "unique": true,
          "nullable": false
        },
        "rule_type": {
          "type": "ENUM",
          "values": ["cbam", "eudr", "hs_code", "document", "general"],
          "nullable": false
        },
        "rule_category": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["emissions_bounds", "geolocation_precision", "mandatory_fields"]
        },
        "rule_logic": {
          "type": "JSONB",
          "structure": {
            "condition": "string (Python expression or SQL)",
            "error_message": "string",
            "severity": "error|warning|info",
            "auto_fix": "boolean",
            "fix_logic": "string (optional)"
          }
        },
        "is_active": {
          "type": "BOOLEAN",
          "default": true
        },
        "priority": {
          "type": "INTEGER",
          "default": 100,
          "note": "Lower number = higher priority"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "example_rules": [
        {
          "rule_name": "cbam_direct_emissions_non_negative",
          "rule_type": "cbam",
          "rule_logic": {
            "condition": "direct_emissions >= 0",
            "error_message": "Direct emissions cannot be negative",
            "severity": "error",
            "auto_fix": false
          }
        },
        {
          "rule_name": "eudr_coordinate_precision_check",
          "rule_type": "eudr",
          "rule_logic": {
            "condition": "coordinate_precision >= 6",
            "error_message": "GPS coordinates must have at least 6 decimal places",
            "severity": "error",
            "auto_fix": false
          }
        }
      ]
    },

    "audit_logs": {
      "table_name": "audit_logs",
      "description": "Comprehensive audit trail for compliance",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": true
        },
        "action_type": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["document_upload", "report_generated", "validation_run", "xml_downloaded"]
        },
        "entity_type": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["document", "cbam_report", "eudr_report", "user"]
        },
        "entity_id": {
          "type": "UUID",
          "nullable": true
        },
        "action_details": {
          "type": "JSONB",
          "nullable": false,
          "note": "Full context of the action"
        },
        "ip_address": {
          "type": "INET",
          "nullable": true
        },
        "user_agent": {
          "type": "TEXT",
          "nullable": true
        },
        "request_id": {
          "type": "UUID",
          "nullable": true,
          "note": "Trace ID for debugging"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()",
          "indexed": true
        }
      },
      "indexes": [
        "CREATE INDEX idx_audit_user ON audit_logs(user_id)",
        "CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id)",
        "CREATE INDEX idx_audit_created ON audit_logs(created_at DESC)"
      ],
      "retention_policy": "Retain for 7 years (regulatory compliance)"
    },

    "payments": {
      "table_name": "payments",
      "description": "Payment transactions for reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "report_id": {
          "type": "UUID",
          "nullable": false,
          "note": "Polymorphic - can be cbam_report_id or eudr_report_id"
        },
        "report_type": {
          "type": "ENUM",
          "values": ["cbam", "eudr"],
          "nullable": false
        },
        "amount": {
          "type": "INTEGER",
          "nullable": false,
          "note": "In paise (₹499 = 49900)"
        },
        "currency": {
          "type": "CHAR(3)",
          "default": "INR"
        },
        "payment_method": {
          "type": "ENUM",
          "values": ["upi", "card", "netbanking", "wallet"],
          "nullable": false
        },
        "payment_gateway": {
          "type": "VARCHAR(50)",
          "nullable": false,
          "examples": ["razorpay", "stripe"]
        },
        "gateway_payment_id": {
          "type": "VARCHAR(100)",
          "unique": true,
          "nullable": false
        },
        "gateway_order_id": {
          "type": "VARCHAR(100)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed", "refunded"],
          "default": "pending"
        },
        "failure_reason": {
          "type": "TEXT",
          "nullable": true
        },
        "refund_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise"
        },
        "refund_reason": {
          "type": "TEXT",
          "nullable": true
        },
        "refunded_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "metadata": {
          "type": "JSONB",
          "nullable": true,
          "note": "Additional gateway response data"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_payments_user ON payments(user_id)",
        "CREATE INDEX idx_payments_report ON payments(report_type, report_id)",
        "CREATE INDEX idx_payments_status ON payments(payment_status)",
        "CREATE INDEX idx_payments_gateway_id ON payments(gateway_payment_id)"
      ]
    },

    "api_keys": {
      "table_name": "api_keys",
      "description": "API keys for Phase 3 ERP integrations",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "key_name": {
          "type": "VARCHAR(100)",
          "nullable": false,
          "note": "User-defined name (e.g., 'Tally Integration')"
        },
        "key_prefix": {
          "type": "VARCHAR(10)",
          "nullable": false,
          "note": "First 8 chars for display (e.g., 'vaya_liv')"
        },
        "key_hash": {
          "type": "VARCHAR(255)",
          "nullable": false,
          "note": "bcrypt hash of actual key"
        },
        "permissions": {
          "type": "JSONB",
          "default": "{}",
          "structure": {
            "read": "boolean",
            "write": "boolean",
            "validate": "boolean",
            "export": "boolean"
          }
        },
        "rate_limit": {
          "type": "INTEGER",
          "default": 1000,
          "note": "Requests per hour"
        },
        "is_active": {
          "type": "BOOLEAN",
          "default": true
        },
        "last_used_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_api_keys_user ON api_keys(user_id)",
        "CREATE INDEX idx_api_keys_org ON api_keys(organization_id)",
        "CREATE INDEX idx_api_keys_hash ON api_keys(key_hash)"
      ],
      "security_notes": [
        "Never store plaintext keys",
        "Show full key only once at creation",
        "Implement rate limiting in Redis",
        "Rotate keys every 6 months"
      ]
    },

    "notifications": {
      "table_name": "notifications",
      "description": "User notifications (in-app, email, WhatsApp)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "notification_type": {
          "type": "ENUM",
          "values": ["report_ready", "validation_error", "payment_success", "payment_failed", "system_alert"],
          "nullable": false
        },
        "title": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "message": {
          "type": "TEXT",
          "nullable": false
        },
        "channel": {
          "type": "ENUM",
          "values": ["in_app", "email", "whatsapp", "sms"],
          "nullable": false
        },
        "channel_status": {
          "type": "ENUM",
          "values": ["pending", "sent", "delivered", "failed"],
          "default": "pending"
        },
        "priority": {
          "type": "ENUM",
          "values": ["low", "medium", "high", "urgent"],
          "default": "medium"
        },
        "related_entity_type": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "related_entity_id": {
          "type": "UUID",
          "nullable": true
        },
        "action_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Deep link to relevant page"
        },
        "read_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_notif_user ON notifications(user_id)",
        "CREATE INDEX idx_notif_read ON notifications(read_at)",
        "CREATE INDEX idx_notif_created ON notifications(created_at DESC)"
      ]
    }
  },

  "api_endpoints": {
    "authentication": {
      "POST /api/v1/auth/register": {
        "description": "Register new user",
        "request_body": {
          "email": "string",
          "phone": "string (E.164)",
          "password": "string (min 8 chars)",
          "full_name": "string",
          "role": "enum"
        },
        "response": {
          "user": "User object",
          "access_token": "JWT",
          "refresh_token": "JWT"
        }
      },
      "POST /api/v1/auth/login": {
        "description": "Login with email/phone + password",
        "request_body": {
          "identifier": "string (email or phone)",
          "password": "string"
        },
        "response": {
          "user": "User object",
          "access_token": "JWT",
          "refresh_token": "JWT"
        }
      },
      "POST /api/v1/auth/refresh": {
        "description": "Refresh access token",
        "headers": {
          "Authorization": "Bearer {refresh_token}"
        },
        "response": {
          "access_token": "JWT"
        }
      }
    },

    "whatsapp_webhook": {
      "POST /api/v1/webhook/whatsapp": {
        "description": "Twilio WhatsApp webhook receiver",
        "security": "Twilio signature validation",
        "request_body": {
          "From": "string (whatsapp:+919876543210)",
          "Body": "string (message text)",
          "MediaUrl0": "string (optional)",
          "MediaContentType0": "string (optional)"
        },
        "response": {
          "twiml": "XML response for WhatsApp"
        },
        "processing": "Async via Celery task queue"
      }
    },

    "document_management": {
      "POST /api/v1/documents/upload": {
        "description": "Upload document via web dashboard",
        "authentication": "Required",
        "request_body": {
          "file": "multipart/form-data",
          "document_type": "enum",
          "related_report_id": "UUID (optional)"
        },
        "response": {
          "document": "Document object",
          "extraction_started": "boolean"
        }
      },
      "GET /api/v1/documents/{id}": {
        "description": "Get document details",
        "authentication": "Required",
        "response": {
          "document": "Document object with extracted_data"
        }
      },
      "DELETE /api/v1/documents/{id}": {
        "description": "Delete document (before TTL expires)",
        "authentication": "Required",
        "response": {
          "success": "boolean"
        }
      }
    },

    "hs_code_services": {
      "GET /api/v1/hs-codes/search": {
        "description": "Fuzzy search HS codes (Phase 1 feature)",
        "authentication": "Optional (for analytics)",
        "query_params": {
          "q": "string (search query)",
          "limit": "integer (default 10)"
        },
        "response": {
          "results": [
            {
              "hs_code": "string",
              "description": "string",
              "relevance_score": "float",
              "is_cbam_relevant": "boolean"
            }
          ]
        }
      },
      "GET /api/v1/hs-codes/{code}": {
        "description": "Get HS code details",
        "response": {
          "hs_code": "HS Code object with CN mappings"
        }
      },
      "POST /api/v1/hs-codes/map-to-cn": {
        "description": "Map Indian HS to EU CN code",
        "authentication": "Required",
        "request_body": {
          "hs_code": "string",
          "additional_context": "object (optional, for disambiguation)"
        },
        "response": {
          "cn_codes": [
            {
              "cn_code": "string",
              "confidence": "enum",
              "disambiguation_questions": "array (if ambiguous)"
            }
          ]
        }
      }
    },

    "cbam_services": {
      "POST /api/v1/cbam/validate": {
        "description": "Validate CBAM data before XML generation",
        "authentication": "Required",
        "request_body": {
          "reporting_period": "object",
          "declarant": "object",
          "goods": "array"
        },
        "response": {
          "validation_result": {
            "is_valid": "boolean",
            "errors": "array",
            "warnings": "array",
            "auto_fixes_applied": "array"
          }
        }
      },
      "POST /api/v1/cbam/generate-xml": {
        "description": "Generate CBAM XML report (Phase 2)",
        "authentication": "Required",
        "request_body": {
          "report_id": "UUID (existing draft)",
          "force_default_values": "boolean (optional)"
        },
        "response": {
          "report": "CBAM Report object",
          "xml_url": "string (signed download URL)",
          "payment_required": "boolean"
        }
      },
      "GET /api/v1/cbam/reports": {
        "description": "List user's CBAM reports",
        "authentication": "Required",
        "query_params": {
          "status": "enum (optional filter)",
          "period": "string (optional filter)",
          "limit": "integer",
          "offset": "integer"
        },
        "response": {
          "reports": "array of CBAM Report objects",
          "total": "integer",
          "pagination": "object"
        }
      },
      "GET /api/v1/cbam/reports/{id}": {
        "description": "Get CBAM report details",
        "authentication": "Required",
        "response": {
          "report": "CBAM Report object with full goods list"
        }
      }
    },

    "eudr_services": {
      "POST /api/v1/eudr/validate": {
        "description": "Validate EUDR geolocation data",
        "authentication": "Required",
        "request_body": {
          "commodity_type": "enum",
          "plots": "array of plot objects"
        },
        "response": {
          "validation_result": {
            "is_valid": "boolean",
            "errors": "array (with plot-specific issues)",
            "warnings": "array"
          }
        }
      },
      "POST /api/v1/eudr/generate-geojson": {
        "description": "Generate EUDR GeoJSON file(s)",
        "authentication": "Required",
        "request_body": {
          "report_id": "UUID"
        },
        "response": {
          "report": "EUDR Report object",
          "geojson_urls": "array of signed URLs (if split)",
          "file_count": "integer",
          "payment_required": "boolean"
        }
      },
      "GET /api/v1/eudr/reports": {
        "description": "List user's EUDR reports",
        "authentication": "Required",
        "response": {
          "reports": "array",
          "total": "integer",
          "pagination": "object"
        }
      }
    },

    "admin_endpoints": {
      "GET /api/v1/admin/stats": {
        "description": "System-wide statistics",
        "authentication": "Admin role required",
        "response": {
          "total_users": "integer",
          "reports_generated_today": "integer",
          "payment_volume_today": "integer",
          "active_sessions": "integer"
        }
      },
      "GET /api/v1/admin/users": {
        "description": "User management",
        "authentication": "Admin role required",
        "response": {
          "users": "array with sensitive data"
        }
      }
    }
  },

  "pydantic_schemas": {
    "description": "FastAPI request/response validation schemas",
    "examples": {
      "CBAMGoodsSchema": {
        "file": "app/schemas/cbam_schema.py",
        "code": "from pydantic import BaseModel, Field, validator\nfrom typing import Optional\nfrom decimal import Decimal\n\nclass EmissionsData(BaseModel):\n    direct: Decimal = Field(..., ge=0, description='Direct emissions (tonnes CO2e)')\n    indirect: Decimal = Field(..., ge=0, description='Indirect emissions')\n    production_method: str\n    qualifying_parameters: Optional[dict] = None\n    used_default_values: bool = False\n\n    @validator('direct')\n    def validate_direct_emissions(cls, v):\n        if v > 100:  # Sanity check\n            raise ValueError('Direct emissions seem unrealistically high')\n        return v\n\nclass CBAMGoodsSchema(BaseModel):\n    commodity_code: str = Field(..., regex=r'^\\d{8} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE)\n    procedure: str\n    net_mass: Decimal = Field(..., gt=0)\n    country_of_origin: str = Field(..., regex=r'^[A-Z]{2} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE)\n    emissions: EmissionsData\n\n    class Config:\n        json_schema_extra = {\n            'example': {\n                'commodity_code': '73181500',\n                'procedure': 'ReleaseForFreeCirculation',\n                'net_mass': 25.5,\n                'country_of_origin': 'IN',\n                'emissions': {\n                    'direct': 1.85,\n                    'indirect': 0.42,\n                    'production_method': 'EAF',\n                    'used_default_values': False\n                }\n            }\n        }"
      },
      "GeoLocationSchema": {
        "file": "app/schemas/eudr_schema.py",
        "code": "from pydantic import BaseModel, Field, validator\nfrom typing import List, Literal\nfrom decimal import Decimal\n\nclass PointCoordinates(BaseModel):\n    longitude: Decimal = Field(..., ge=-180, le=180)\n    latitude: Decimal = Field(..., ge=-90, le=90)\n\n    @validator('longitude', 'latitude')\n    def check_precision(cls, v):\n        if abs(v).as_tuple().exponent > -6:\n            raise ValueError('Coordinates must have at least 6 decimal places')\n        return v\n\nclass PolygonCoordinates(BaseModel):\n    coordinates: List[List[PointCoordinates]]\n\n    @validator('coordinates')\n    def validate_polygon(cls, v):\n        if len(v) < 1 or len(v[0]) < 4:\n            raise ValueError('Polygon must have at least 4 points')\n        if v[0][0] != v[0][-1]:\n            raise ValueError('Polygon must be closed (first and last point must match)')\n        return v\n\nclass PlotData(BaseModel):\n    producer_name: str = Field(..., max_length=255)\n    producer_country: str = Field(..., regex=r'^[A-Z]{2} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE)\n    production_place: Optional[str] = None\n    area_hectares: Decimal = Field(..., gt=0)\n    geolocation_type: Literal['point', 'polygon']\n    coordinates: Union[PointCoordinates, PolygonCoordinates]"
      }
    }
  },

  "celery_tasks": {
    "description": "Background job definitions",
    "tasks": {
      "process_document_extraction": {
        "file": "app/modules/snap/tasks.py",
        "function": "process_document_extraction(document_id: UUID)",
        "description": "Extract data from uploaded document using GPT-4o-mini",
        "priority": "high",
        "timeout": "5 minutes",
        "retry": "3 attempts with exponential backoff"
      },
      "generate_cbam_xml": {
        "file": "app/modules/export/tasks.py",
        "function": "generate_cbam_xml(report_id: UUID)",
        "description": "Generate and validate CBAM XML file",
        "priority": "high",
        "timeout": "3 minutes"
      },
      "generate_eudr_geojson": {
        "file": "app/modules/export/tasks.py",
        "function": "generate_eudr_geojson(report_id: UUID)",
        "description": "Generate EUDR GeoJSON file(s)",
        "priority": "high",
        "timeout": "5 minutes"
      },
      "cleanup_expired_documents": {
        "file": "app/tasks/cleanup.py",
        "function": "cleanup_expired_documents()",
        "description": "Delete documents past TTL (GDPR compliance)",
        "schedule": "cron: 0 2 * * * (daily at 2 AM)",
        "priority": "low"
      },
      "sync_eu_registry_data": {
        "file": "app/tasks/sync.py",
        "function": "sync_eu_registry_data()",
        "description": "Fetch latest default values and XSD schemas",
        "schedule": "cron: 0 3 * * 0 (weekly on Sunday)",
        "priority": "medium"
      },
      "send_notification": {
        "file": "app/tasks/notifications.py",
        "function": "send_notification(notification_id: UUID)",
        "description": "Send notification via email/WhatsApp/SMS",
        "priority": "medium",
        "retry": "2 attempts"
      }
    }
  },

  "deployment_architecture": {
    "development": {
      "backend": "Local FastAPI with hot reload (uvicorn --reload)",
      "frontend": "Local Next.js dev server (npm run dev)",
      "database": "Docker Postgres with PostGIS",
      "redis": "Docker Redis",
      "storage": "Supabase free tier or local MinIO"
    },
    "staging": {
      "backend": "Railway (auto-deploy from GitHub main branch)",
      "frontend": "Vercel (preview deployments for PRs)",
      "database": "Supabase staging project",
      "redis": "Upstash Redis (free tier)",
      "monitoring": "Sentry (error tracking)"
    },
    "production": {
      "backend": {
        "service": "Railway or Google Cloud Run",
        "instances": "Auto-scaling (min 2, max 10)",
        "health_check": "/api/v1/health",
        "deployment": "Blue-green deployment"
      },
      "frontend": {
        "service": "Vercel (production)",
        "cdn": "Global edge network",
        "domain": "dashboard.vaya.in"
      },
      "database": {
        "service": "Supabase Pro",
        "backup": "Daily automated backups",
        "replication": "Point-in-time recovery enabled"
      },
      "redis": {
        "service": "Upstash Redis (paid tier)",
        "persistence": "AOF enabled"
      },
      "storage": {
        "service": "Supabase Storage",
        "cdn": "CloudFront or Supabase CDN",
        "encryption": "AES-256"
      },
      "monitoring": {
        "errors": "Sentry",
        "logs": "Better Stack",
        "metrics": "Prometheus + Grafana (Phase 3)",
        "uptime": "Better Uptime",
        "alerts": "PagerDuty (for admin)"
      }
    }
  },

  "security_measures": {
    "authentication": {
      "method": "JWT (Access + Refresh tokens)",
      "access_token_expiry": "15 minutes",
      "refresh_token_expiry": "7 days",
      "password_hashing": "bcrypt with salt rounds = 12",
      "mfa": "SMS/WhatsApp OTP (Phase 2)"
    },
    "authorization": {
      "method": "Role-Based Access Control (RBAC)",
      "roles": ["exporter", "cha", "admin", "verifier"],
      "permissions": "Granular per endpoint"
    },
    "data_encryption": {
      "at_rest": "AES-256 (Supabase default)",
      "in_transit": "TLS 1.3",
      "sensitive_fields": "PII encrypted with Fernet (symmetric encryption)"
    },
    "api_security": {
      "rate_limiting": {
        "authenticated": "1000 requests/hour per user",
        "unauthenticated": "100 requests/hour per IP",
        "implementation": "Redis-based sliding window"
      },
      "input_validation": "Pydantic schemas on all endpoints",
      "sql_injection": "Prevented by SQLAlchemy ORM",
      "xss_protection": "Content-Security-Policy headers",
      "csrf_protection": "SameSite cookies + CSRF tokens"
    },
    "whatsapp_security": {
      "signature_validation": "Verify Twilio X-Twilio-Signature header",
      "media_validation": "Virus scan with ClamAV before processing",
      "rate_limiting": "Max 10 messages per user per minute"
    },
    "gdpr_compliance": {
      "data_retention": "24 hours for raw documents, 90 days for reports",
      "right_to_erasure": "Soft delete with anonymization",
      "data_portability": "Export API for user data",
      "consent_management": "Explicit opt-in for data processing"
    }
  },

  "testing_strategy": {
    "unit_tests": {
      "framework": "pytest",
      "coverage_target": ">80%",
      "focus_areas": [
        "Validation logic (Module B)",
        "XML/GeoJSON generation",
        "HS code mapping",
        "Emissions calculations"
      ],
      "example": "tests/test_validate/test_cbam_validation.py"
    },
    "integration_tests": {
      "framework": "pytest with pytest-asyncio",
      "database": "Test database with fixtures",
      "focus_areas": [
        "End-to-end report generation",
        "WhatsApp webhook flow",
        "Payment processing"
      ]
    },
    "api_tests": {
      "framework": "pytest with httpx",
      "focus": "All REST endpoints",
      "assertions": "Status codes, response schemas, error handling"
    },
    "load_tests": {
      "framework": "Locust",
      "scenarios": [
        "100 concurrent WhatsApp messages",
        "50 simultaneous XML generations",
        "1000 HS code searches per minute"
      ],
      "phase": "Before production launch"
    },
    "e2e_tests": {
      "framework": "Playwright",
      "coverage": "Critical user flows in web dashboard",
      "frequency": "Pre-deployment"
    }
  },

  "key_algorithms": {
    "hs_code_fuzzy_search": {
      "algorithm": "PostgreSQL full-text search + trigram similarity",
      "implementation": {
        "step_1": "Convert query to tsvector",
        "step_2": "Search against indexed description column",
        "step_3": "Rank by ts_rank_cd",
        "step_4": "Apply trigram similarity for typos",
        "step_5": "Return top 10 matches with scores"
      },
      "optimization": "GIN index on tsvector column"
    },
    "hs_to_cn_mapping": {
      "algorithm": "Rule-based decision tree",
      "logic": {
        "exact_match": "If first 6 digits match, return all CN variants",
        "disambiguation": "Present questions from hs_cn_mapping.disambiguation_questions",
        "user_input": "Filter CN codes based on answers",
        "confidence": "Mark as 'exact' if only 1 result, 'probable' if 2-3, 'ambiguous' if >3"
      }
    },
    "emissions_calculation": {
      "formula": "Total = (Quantity * Direct_Factor) + (Quantity * Indirect_Factor)",
      "validation": [
        "Assert Direct_Factor >= 0",
        "Warn if Direct_Factor > (EU_Default * 3)",
        "Require ProductionMethod for CBAM Annex II goods"
      ],
      "default_value_fallback": {
        "query": "SELECT default_emission_factor FROM cn_codes WHERE cn_code = ? AND country = ?",
        "flag": "Set used_default_values = true in output"
      }
    },
    "geospatial_validation": {
      "library": "Shapely 2.0",
      "checks": [
        {
          "name": "Format validation",
          "method": "isinstance(obj, Point|Polygon)"
        },
        {
          "name": "Topology validation",
          "method": "shapely.validation.explain_validity()",
          "handles": ["Self-intersection", "Unclosed polygon", "Invalid ring"]
        },
        {
          "name": "Country boundary check",
          "method": "shapely.contains(world_borders[country], plot_geometry)",
          "data_source": "Natural Earth 10m countries shapefile"
        },
        {
          "name": "Precision check",
          "method": "Custom regex on coordinate string",
          "requirement": "Minimum 6 decimal places"
        }
      ]
    },
    "xml_xsd_validation": {
      "library": "lxml.etree + xmlschema",
      "process": [
        "Load QReport_ver23.xsd from disk",
        "Parse generated XML with lxml",
        "Run xmlschema.validate(xml, xsd)",
        "Catch validation errors",
        "Parse error messages",
        "Attempt auto-fix for common issues",
        "Re-validate",
        "Return validated XML or detailed errors"
      ],
      "common_auto_fixes": [
        "Strip whitespace from text nodes",
        "Format decimals to 2 places",
        "Ensure correct namespace prefixes"
      ]
    },
    "geojson_chunking": {
      "algorithm": "Split by feature count if size > 25MB",
      "implementation": {
        "step_1": "Serialize full FeatureCollection to JSON",
        "step_2": "Check size in bytes",
        "step_3": "If > 25MB, calculate features_per_chunk",
        "step_4": "Create multiple FeatureCollections",
        "step_5": "Name files: batch_1_of_3.geojson, batch_2_of_3.geojson",
        "step_6": "Validate each chunk independently"
      }
    }
  },

  "ai_integration_details": {
    "gpt4o_mini_configuration": {
      "model": "gpt-4o-mini",
      "temperature": 0.1,
      "reasoning": "Low temperature for deterministic extraction",
      "max_tokens": 2000,
      "response_format": {
        "type": "json_schema",
        "json_schema": {
          "name": "invoice_extraction",
          "strict": true,
          "schema": {
            "type": "object",
            "properties": {
              "invoice_number": {"type": "string"},
              "invoice_date": {"type": "string", "format": "date"},
              "supplier_name": {"type": "string"},
              "buyer_name": {"type": "string"},
              "hs_code": {"type": "string", "pattern": "^\\d{8}$"},
              "gross_weight": {"type": "number"},
              "gross_weight_unit": {"type": "string"},
              "net_weight": {"type": "number"},
              "net_weight_unit": {"type": "string"},
              "total_value": {"type": "number"},
              "currency": {"type": "string"}
            },
            "required": ["invoice_number", "invoice_date", "hs_code"],
            "additionalProperties": false
          }
        }
      }
    },
    "prompt_engineering": {
      "system_prompt": "You are a data extraction engine specialized in Indian export documents. Extract ONLY the requested fields. Return valid JSON matching the schema. If a field is not found, return null. Never hallucinate data.",
      "user_prompt_template": "Extract the following fields from this invoice:\n\n{field_descriptions}\n\nDocument text:\n{ocr_text}\n\nReturn JSON only, no markdown.",
      "few_shot_examples": "Included in prompt for complex documents (e.g., Bill of Lading)"
    },
    "error_handling": {
      "invalid_json": "Retry with explicit instruction to return only JSON",
      "missing_fields": "Prompt user via WhatsApp for missing data",
      "low_confidence": "Flag for manual review if extraction_confidence < 0.7"
    },
    "cost_optimization": {
      "image_preprocessing": "Compress images to max 2048px width before sending to API",
      "token_management": "Truncate OCR text to 4000 tokens (keeps cost per doc < ₹1)",
      "caching": "Cache extracted data by file hash to avoid re-processing duplicates"
    }
  },

  "phase_specific_implementation": {
    "phase_1_hs_code_utility": {
      "timeline": "Months 1-2",
      "features": {
        "whatsapp_bot": {
          "commands": [
            "User: 'Steel screw' → Bot: 'HS Code: 7318 15 00. Duty: 0%. CBAM: YES'",
            "User: '73181500' → Bot: 'Description: Screws of iron/steel. Duty: 0%...'",
            "User: 'help' → Bot: Shows command list"
          ],
          "tech_stack": ["FastAPI webhook", "PostgreSQL FTS", "Twilio API"],
          "no_auth_required": "Free utility to build user base"
        },
        "web_version": {
          "url": "vaya.in/hs-search",
          "ui": "Simple search box with autocomplete",
          "results": "Card display with HS code, description, duty rate, CBAM flag"
        }
      },
      "success_metrics": {
        "target": "50 DAU by end of Month 2",
        "tracking": "Google Analytics + custom events in PostgreSQL"
      }
    },
    "phase_2_cbam_report_engine": {
      "timeline": "Months 3-4",
      "features": {
        "document_upload": {
          "channels": ["WhatsApp", "Web dashboard"],
          "supported_types": ["Commercial Invoice", "Electricity Bill", "Production Log"],
          "flow": "Upload → Extract → Validate → Generate XML → Payment → Download"
        },
        "validation_engine": {
          "rules": "All CBAM validation rules from validation_rules table",
          "default_values": "Integrated EU default emission factors",
          "user_prompts": "Interactive WhatsApp questions for missing data"
        },
        "payment_integration": {
          "gateway": "Razorpay",
          "amount": "₹499 per report",
          "methods": ["UPI", "Cards", "Net Banking"],
          "success_flow": "Payment → Generate XML → Send via WhatsApp + Email"
        },
        "xml_delivery": {
          "format": "QReport_ver23.xml",
          "validation": "XSD validated before delivery",
          "delivery": "Supabase Storage signed URL (7-day expiry)"
        }
      },
      "success_metrics": {
        "target": "10 paid reports with EU Registry acceptance",
        "tracking": "Payment conversions, EU submission confirmations"
      }
    },
    "phase_3_api_ecosystem": {
      "timeline": "Months 6+",
      "features": {
        "rest_api": {
          "authentication": "API key (SHA-256 hashed)",
          "rate_limiting": "1000 req/hour for paid plans",
          "endpoints": "All /api/v1/cbam/* and /api/v1/eudr/* endpoints",
          "documentation": "Auto-generated Swagger UI"
        },
        "erp_integrations": {
          "partners": ["Tally", "Zoho Books", "Busy"],
          "integration_type": "Plugin/Add-on",
          "flow": "ERP exports invoice → Calls VAYA API → Gets XML → Attaches to shipment"
        },
        "webhook_support": {
          "events": ["report.generated", "validation.failed", "payment.completed"],
          "format": "JSON POST to user-configured URL",
          "security": "HMAC signature verification"
        }
      },
      "success_metrics": {
        "target": "1000 monthly reports via API",
        "partnerships": "3+ ERP vendor integrations"
      }
    }
  },

  "database_optimization": {
    "indexing_strategy": {
      "hot_tables": ["hs_codes", "cn_codes", "users", "cbam_reports"],
      "composite_indexes": [
        "CREATE INDEX idx_reports_user_status ON cbam_reports(user_id, validation_status)",
        "CREATE INDEX idx_docs_user_type ON documents(user_id, document_type)"
      ],
      "partial_indexes": [
        "CREATE INDEX idx_active_sessions ON whatsapp_sessions(user_id) WHERE expires_at > NOW()"
      ]
    },
    "query_optimization": {
      "n_plus_1_prevention": "Use SQLAlchemy joinedload() for relationships",
      "pagination": "Cursor-based for large datasets",
      "aggregations": "Materialized views for dashboard stats (Phase 3)"
    },
    "partitioning": {
      "audit_logs": "Partition by month (audit_logs_2025_01, audit_logs_2025_02...)",
      "reasoning": "Improve query performance on time-range queries"
    },
    "connection_pooling": {
      "min_connections": 5,
      "max_connections": 20,
      "overflow": 10,
      "pool_recycle": 3600
    }
  },

  "monitoring_and_alerts": {
    "critical_alerts": [
      {
        "name": "API Error Rate > 5%",
        "channel": "PagerDuty",
        "action": "Wake on-call engineer"
      },
      {
        "name": "Database CPU > 80%",
        "channel": "Slack + Email",
        "action": "Scale up database"
      },
      {
        "name": "Payment Gateway Down",
        "channel": "PagerDuty",
        "action": "Switch to backup gateway"
      },
      {
        "name": "Celery Queue Length > 100",
        "channel": "Slack",
        "action": "Scale up workers"
      }
    ],
    "business_metrics": [
      {
        "metric": "Daily Active Users",
        "target": "> 50",
        "dashboard": "Grafana"
      },
      {
        "metric": "Report Generation Success Rate",
        "target": "> 95%",
        "dashboard": "Grafana"
      },
      {
        "metric": "Payment Conversion Rate",
        "target": "> 70%",
        "dashboard": "Google Analytics + Custom DB"
      },
      {
        "metric": "Average Response Time",
        "target": "< 2 seconds",
        "dashboard": "Better Stack"
      }
    ],
    "logging_standards": {
      "format": "JSON structured logs",
      "fields": ["timestamp", "level", "message", "user_id", "request_id", "context"],
      "levels": {
        "DEBUG": "Development only",
        "INFO": "Business events (report generated, payment received)",
        "WARNING": "Validation warnings, rate limit hits",
        "ERROR": "API failures, background job failures",
        "CRITICAL": "System down, data corruption"
      }
    }
  },

  "scalability_considerations": {
    "horizontal_scaling": {
      "stateless_backend": "All state in PostgreSQL/Redis, not in-memory",
      "load_balancer": "Railway/Cloud Run built-in",
      "session_management": "Redis for WhatsApp sessions"
    },
    "caching_strategy": {
      "redis_cache": {
        "hs_code_lookups": "TTL: 24 hours",
        "eu_default_values": "TTL: 7 days",
        "api_responses": "TTL: 5 minutes for read-heavy endpoints"
      },
      "cdn_cache": {
        "static_assets": "CloudFront/Vercel Edge",
        "generated_reports": "Supabase CDN (public URLs only)"
      }
    },
    "database_scaling": {
      "read_replicas": "Phase 3 if query load > 1000 QPS",
      "connection_pooling": "PgBouncer in transaction mode",
      "sharding": "Not needed unless > 10M users (Phase 4+)"
    },
    "async_processing": {
      "celery_workers": "Auto-scaling based on queue length",
      "worker_pools": {
        "high_priority": "Report generation (3 workers)",
        "low_priority": "Cleanup tasks (1 worker)"
      }
    }
  },

  "disaster_recovery": {
    "backup_strategy": {
      "database": {
        "frequency": "Daily automated backups (Supabase)",
        "retention": "30 days",
        "restore_time": "< 1 hour"
      },
      "storage": {
        "frequency": "S3 versioning enabled",
        "retention": "90 days for reports"
      }
    },
    "failover_plan": {
      "database": "Automatic failover to standby (Supabase Pro)",
      "backend": "Multi-region deployment (Phase 3)",
      "monitoring": "Health checks every 30 seconds"
    },
    "incident_response": {
      "severity_1": "API down → Page on-call → Restore from backup",
      "severity_2": "Payment gateway issues → Switch provider → Notify users",
      "severity_3": "Slow queries → Optimize indexes → Add caching"
    }
  },

  "development_workflow": {
    "git_workflow": {
      "branching": "GitFlow (main, develop, feature/*, hotfix/*)",
      "pr_requirements": [
        "All tests passing",
        "Code review from 1+ developer",
        "No merge conflicts",
        "Linear history (rebase before merge)"
      ],
      "commit_convention": "Conventional Commits (feat:, fix:, docs:, etc.)"
    },
    "ci_cd_pipeline": {
      "on_push_to_develop": [
        "Run linters (ruff, ESLint)",
        "Run unit tests",
        "Run integration tests",
        "Deploy to staging"
      ],
      "on_push_to_main": [
        "All above +",
        "Run E2E tests",
        "Deploy to production (manual approval)",
        "Send Slack notification"
      ]
    },
    "code_review_checklist": [
      "Logic correctness",
      "Test coverage",
      "Error handling",
      "Security considerations",
      "Performance implications",
      "Documentation updated"
    ]
  },

  "documentation_requirements": {
    "code_documentation": {
      "python": "Google-style docstrings for all public functions",
      "typescript": "JSDoc comments for exported functions",
      "example": "/**\n * Validates CBAM emissions data against EU rules.\n * \n * Args:\n *     goods_data: List of CBAM goods with emissions\n *     use_defaults: Whether to apply default values\n * \n * Returns:\n *     ValidationResult with errors and warnings\n * \n * Raises:\n *     ValueError: If goods_data is empty\n */"
    },
    "api_documentation": {
      "format": "OpenAPI 3.0 (auto-generated by FastAPI)",
      "enhancements": [
        "Add detailed descriptions for each endpoint",
        "Provide request/response examples",
        "Document error codes",
        "Include authentication requirements"
      ],
      "hosting": "Swagger UI at /docs, ReDoc at /redoc"
    },
    "user_documentation": {
      "formats": ["Web docs", "PDF guides", "Video tutorials"],
      "sections": [
        "Getting Started with VAYA",
        "How to Upload Documents",
        "Understanding CBAM Reports",
        "API Integration Guide",
        "Troubleshooting Common Issues"
      ]
    }
  },

  "compliance_and_legal": {
    "data_privacy": {
      "gdpr": {
        "right_to_access": "GET /api/v1/users/me/data endpoint",
        "right_to_erasure": "DELETE /api/v1/users/me endpoint (soft delete)",
        "right_to_portability": "Export all user data in JSON format",
        "data_processing_agreement": "Required for enterprise customers"
      },
      "indian_data_laws": {
        "dpdpa_2023_compliance": "Store PII in Indian data center (Supabase Asia region)",
        "consent_management": "Explicit opt-in for marketing communications"
      }
    },
    "financial_compliance": {
      "payment_regulations": "RBI compliant through Razorpay",
      "invoicing": "GST invoices for all transactions",
      "record_retention": "7 years for financial records"
    },
    "regulatory_compliance": {
      "eu_cbam": "Ensure XML output matches official XSD schema",
      "eu_eudr": "GeoJSON validation against official specifications",
      "customs_compliance": "HS code data synced quarterly from DGFT"
    }
  },

  "team_structure_recommendations": {
    "phase_1_mvp": {
      "team_size": "2-3 developers",
      "roles": [
        {
          "role": "Full-stack Developer (Lead)",
          "skills": ["Python", "FastAPI", "PostgreSQL", "Next.js", "DevOps"],
          "responsibilities": "Architecture, backend core, deployment"
        },
        {
          "role": "Frontend Developer",
          "skills": ["Next.js", "TypeScript", "Tailwind", "UX/UI"],
          "responsibilities": "Web dashboard, user flows"
        },
        {
          "role": "Optional: ML Engineer",
          "skills": ["Python", "OpenAI API", "Document processing"],
          "responsibilities": "OCR optimization, prompt engineering"
        }
      ]
    },
    "phase_2_growth": {
      "team_size": "5-7 people",
      "additional_roles": [
        {
          "role": "Backend Developer",
          "focus": "Payment integration, API development"
        },
        {
          "role": "QA Engineer",
          "focus": "Automated testing, load testing"
        },
        {
          "role": "DevOps Engineer",
          "focus": "Infrastructure, monitoring, on-call"
        }
      ]
    },
    "phase_3_scale": {
      "team_size": "10-15 people",
      "additional_roles": [
        "Product Manager",
        "UX Designer",
        "Customer Success Manager",
        "Technical Writer",
        "Security Engineer"
      ]
    }
  },

  "cost_estimation": {
    "monthly_operating_costs": {
      "phase_1_mvp": {
        "backend_hosting": "$20 (Railway Starter)",
        "frontend_hosting": "$0 (Vercel Free)",
        "database": "$25 (Supabase Pro)",
        "redis": "$10 (Upstash)",
        "twilio": "$50 (estimated)",
        "openai": "$100 (estimated)",
        "monitoring": "$0 (free tiers)",
        "total": "~$205/month"
      },
      "phase_2_production": {
        "backend_hosting": "$100 (Railway Pro or Cloud Run)",
        "frontend_hosting": "$20 (Vercel Pro)",
        "database": "$50 (Supabase Pro)",
        "redis": "$30 (Upstash)",
        "twilio": "$200 (500 users)",
        "openai": "$500 (5000 documents)",
        "monitoring": "$50 (Sentry + Better Stack)",
        "payment_gateway": "$0 (% of transactions)",
        "total": "~$950/month"
      },
      "phase_3_scale": {
        "infrastructure": "$500-1000",
        "ai_services": "$2000 (50K documents)",
        "monitoring": "$200",
        "total": "~$3000-4000/month"
      }
    },
    "revenue_projections": {
      "phase_2": {
        "assumption": "100 reports/month at ₹499",
        "revenue": "₹49,900 (~$600)",
        "gross_margin": "99%",
        "net_profit": "~$400/month"
      },
      "phase_3": {
        "assumption": "1000 reports/month",
        "revenue": "₹4,99,000 (~$6000)",
        "costs": "$4000",
        "net_profit": "~$2000/month"
      }
    }
  },

  "technical_debt_management": {
    "acceptable_shortcuts_phase_1": [
      "No comprehensive test coverage initially (focus on core logic)",
      "Simplified error handling (can be verbose later)",
      "Basic logging (structured logging in Phase 2)",
      "Manual deployment (CI/CD in Phase 2)"
    ],
    "must_avoid": [
      "Hardcoded secrets in code",
      "SQL injection vulnerabilities",
      "Unvalidated user inputs",
      "Missing data retention policies"
    ],
    "refactoring_priorities_phase_2": [
      "Add comprehensive test suite",
      "Implement proper error handling",
      "Set up automated CI/CD",
      "Optimize database queries",
      "Add structured logging"
    ]
  },

  "launch_checklist": {
    "pre_launch": [
      "✓ All Phase 1 features implemented",
      "✓ Database seeded with HS/CN codes",
      "✓ WhatsApp number verified with Twilio",
      "✓ OpenAI API key configured",
      "✓ Domain registered and SSL configured",
      "✓ Privacy policy and terms of service published",
      "✓ Sentry error tracking configured",
      "✓ Google Analytics set up",
      "✓ Beta testing with 10 users completed",
      "✓ Load testing passed (100 concurrent users)",
      "✓ Backup and restore tested",
      "✓ On-call rotation established"
    ],
    "post_launch": [
      "Monitor error rates hourly for first week",
      "Collect user feedback via WhatsApp",
      "Iterate on UX based on analytics",
      "Fix critical bugs within 24 hours",
      "Plan Phase 2 based on usage patterns"
    ]
  },

  "final_recommendations": {
    "backend": {
      "verdict": "Python 3.11+ with FastAPI",
      "confidence": "95%",
      "reasoning": "Unmatched ecosystem for data, AI, and geospatial processing. Team productivity will be highest with Python."
    },
    "frontend": {
      "verdict": "Next.js 14+ with TypeScript",
      "confidence": "90%",
      "reasoning": "Industry standard for production SaaS. Great DX, performance, and deployment story with Vercel."
    },
    "database": {
      "verdict": "PostgreSQL 15+ (via Supabase)",
      "confidence": "100%",
      "reasoning": "PostGIS is non-negotiable for EUDR. Supabase provides managed instance with excellent free tier."
    },
    "critical_success_factors": [
      "Nail the WhatsApp UX - it must feel like chatting with a smart assistant",
      "Ensure XML validation is bulletproof - one rejected report kills trust",
      "Keep Phase 1 absolutely simple - resist feature creep",
      "Build trust through transparency (open-source validator, clear pricing)",
      "Obsess over data privacy - this is sensitive supplier information"
    ]
  }
} INDEX idx_users_phone ON users(phone)",
        "CREATE INDEX idx_users_email ON users(email)",
        "CREATE INDEX idx_users_org ON users(organization_id)",
        "CREATE INDEX idx_users_role ON users(role)"
      ]
    },

    "organizations": {
      "table_name": "organizations",
      "description": "Companies/entities (factories, CHA firms)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "legal_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "gstin": {
          "type": "VARCHAR(15)",
          "unique": true,
          "nullable": true,
          "note": "Indian GST Identification Number"
        },
        "iec_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": true,
          "note": "Importer Exporter Code"
        },
        "eori_number": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "note": "EU EORI number if exporting to EU"
        },
        "business_type": {
          "type": "ENUM",
          "values": ["manufacturer", "trader", "cha", "freight_forwarder"]
        },
        "address_line1": {
          "type": "TEXT",
          "nullable": false
        },
        "address_line2": {
          "type": "TEXT",
          "nullable": true
        },
        "city": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "state": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "postal_code": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "country": {
          "type": "CHAR(2)",
          "default": "IN",
          "note": "ISO 3166-1 alpha-2"
        },
        "primary_industry": {
          "type": "VARCHAR(100)",
          "nullable": true,
          "examples": ["Steel Manufacturing", "Textile Export"]
        },
        "annual_export_volume": {
          "type": "BIGINT",
          "nullable": true,
          "note": "In USD"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_orgs_gstin ON organizations(gstin)",
        "CREATE INDEX idx_orgs_iec ON organizations(iec_code)"
      ]
    },

    "whatsapp_sessions": {
      "table_name": "whatsapp_sessions",
      "description": "Track WhatsApp conversation state (24h window)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "whatsapp_number": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "session_state": {
          "type": "JSONB",
          "default": "{}",
          "note": "Stores conversation context, pending questions, extracted data"
        },
        "current_flow": {
          "type": "ENUM",
          "values": ["hs_code_lookup", "cbam_report", "eudr_report", "support", "idle"],
          "default": "idle"
        },
        "documents_pending": {
          "type": "INTEGER",
          "default": 0,
          "note": "Count of documents waiting for processing"
        },
        "last_message_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "Used to enforce 24h service window"
        },
        "expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "note": "last_message_at + 24 hours"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_wa_sessions_user ON whatsapp_sessions(user_id)",
        "CREATE INDEX idx_wa_sessions_expires ON whatsapp_sessions(expires_at)",
        "CREATE INDEX idx_wa_sessions_number ON whatsapp_sessions(whatsapp_number)"
      ],
      "ttl_policy": "Auto-delete rows where expires_at < NOW() (daily cron job)"
    },

    "documents": {
      "table_name": "documents",
      "description": "All uploaded documents (invoices, certificates, etc.)",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": true
        },
        "document_type": {
          "type": "ENUM",
          "values": [
            "commercial_invoice",
            "packing_list",
            "bill_of_lading",
            "mill_test_certificate",
            "shipping_bill",
            "bill_of_entry",
            "electricity_bill",
            "production_log",
            "gps_data",
            "other"
          ],
          "nullable": false
        },
        "file_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "file_size": {
          "type": "BIGINT",
          "note": "In bytes"
        },
        "mime_type": {
          "type": "VARCHAR(100)",
          "nullable": false
        },
        "storage_path": {
          "type": "TEXT",
          "nullable": false,
          "note": "Supabase Storage path"
        },
        "storage_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed URL, regenerated on access"
        },
        "ocr_status": {
          "type": "ENUM",
          "values": ["pending", "processing", "completed", "failed"],
          "default": "pending"
        },
        "extracted_data": {
          "type": "JSONB",
          "nullable": true,
          "note": "Raw JSON from GPT-4o-mini extraction"
        },
        "extraction_confidence": {
          "type": "DECIMAL(3,2)",
          "nullable": true,
          "note": "0.00 to 1.00 confidence score"
        },
        "uploaded_via": {
          "type": "ENUM",
          "values": ["whatsapp", "web_dashboard", "api"],
          "default": "whatsapp"
        },
        "related_report_id": {
          "type": "UUID",
          "foreign_key": "cbam_reports.id OR eudr_reports.id",
          "nullable": true,
          "note": "Polymorphic relationship"
        },
        "ttl_expires_at": {
          "type": "TIMESTAMPTZ",
          "nullable": false,
          "default": "NOW() + INTERVAL '24 hours'",
          "note": "GDPR compliance - auto-delete"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_docs_user ON documents(user_id)",
        "CREATE INDEX idx_docs_ttl ON documents(ttl_expires_at)",
        "CREATE INDEX idx_docs_type ON documents(document_type)",
        "CREATE INDEX idx_docs_status ON documents(ocr_status)"
      ],
      "storage_policy": "Celery task runs daily to delete files where ttl_expires_at < NOW()"
    },

    "hs_codes": {
      "table_name": "hs_codes",
      "description": "Indian ITC-HS Codes (master reference)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit code (e.g., 73181500)"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "unit_of_measurement": {
          "type": "VARCHAR(20)",
          "nullable": true,
          "examples": ["KGS", "NOS", "MTR"]
        },
        "basic_duty_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "note": "Percentage"
        },
        "igst_rate": {
          "type": "DECIMAL(5,2)",
          "nullable": true
        },
        "is_restricted": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Requires import/export license"
        },
        "synonyms": {
          "type": "TEXT[]",
          "nullable": true,
          "note": "Array for fuzzy search (e.g., ['screw', 'fastener', 'bolt'])"
        },
        "chapter": {
          "type": "CHAR(2)",
          "nullable": false,
          "indexed": true,
          "note": "First 2 digits for grouping"
        },
        "updated_at": {
          "type": "DATE",
          "note": "Last sync from DGFT"
        }
      },
      "indexes": [
        "CREATE INDEX idx_hs_code ON hs_codes(hs_code)",
        "CREATE INDEX idx_hs_chapter ON hs_codes(chapter)",
        "CREATE INDEX idx_hs_description ON hs_codes USING gin(to_tsvector('english', description))",
        "CREATE INDEX idx_hs_synonyms ON hs_codes USING gin(synonyms)"
      ],
      "search_strategy": "Use PostgreSQL full-text search with ts_rank for relevance scoring"
    },

    "cn_codes": {
      "table_name": "cn_codes",
      "description": "EU Combined Nomenclature codes (for CBAM mapping)",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "unique": true,
          "nullable": false,
          "note": "8-digit EU code"
        },
        "description": {
          "type": "TEXT",
          "nullable": false
        },
        "is_cbam_covered": {
          "type": "BOOLEAN",
          "default": false,
          "indexed": true
        },
        "cbam_category": {
          "type": "ENUM",
          "values": ["cement", "electricity", "fertilisers", "iron_steel", "aluminium", "hydrogen"],
          "nullable": true
        },
        "default_emission_factor": {
          "type": "JSONB",
          "nullable": true,
          "structure": {
            "direct": "float (tonnes CO2e per tonne product)",
            "indirect": "float",
            "source": "string (e.g., 'EU Default Values 2024')",
            "country_specific": {
              "IN": {"direct": "float", "indirect": "float"},
              "VN": {"direct": "float", "indirect": "float"}
            }
          }
        },
        "production_methods": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of valid production method codes for this CN code"
        },
        "qualifying_parameters": {
          "type": "JSONB",
          "nullable": true,
          "note": "Required parameters (e.g., scrap percentage for steel)"
        },
        "updated_at": {
          "type": "DATE"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cn_code ON cn_codes(cn_code)",
        "CREATE INDEX idx_cn_cbam ON cn_codes(is_cbam_covered)",
        "CREATE INDEX idx_cn_category ON cn_codes(cbam_category)"
      ]
    },

    "hs_cn_mapping": {
      "table_name": "hs_cn_mapping",
      "description": "Mapping between Indian HS codes and EU CN codes",
      "fields": {
        "id": {
          "type": "SERIAL",
          "primary_key": true
        },
        "hs_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "hs_codes.hs_code",
          "nullable": false
        },
        "cn_code": {
          "type": "VARCHAR(10)",
          "foreign_key": "cn_codes.cn_code",
          "nullable": false
        },
        "mapping_confidence": {
          "type": "ENUM",
          "values": ["exact", "probable", "ambiguous"],
          "default": "probable"
        },
        "disambiguation_questions": {
          "type": "JSONB",
          "nullable": true,
          "structure": [
            {
              "question": "Is the tensile strength > 800 MPa?",
              "if_yes": "73181510",
              "if_no": "73181590"
            }
          ]
        },
        "notes": {
          "type": "TEXT",
          "nullable": true
        },
        "verified": {
          "type": "BOOLEAN",
          "default": false,
          "note": "Human-verified mapping"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_mapping_hs ON hs_cn_mapping(hs_code)",
        "CREATE INDEX idx_mapping_cn ON hs_cn_mapping(cn_code)",
        "CREATE UNIQUE INDEX idx_mapping_pair ON hs_cn_mapping(hs_code, cn_code)"
      ]
    },

    "cbam_reports": {
      "table_name": "cbam_reports",
      "description": "Generated CBAM quarterly reports",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "report_type": {
          "type": "ENUM",
          "values": ["transitional", "definitive"],
          "default": "transitional"
        },
        "reporting_period": {
          "type": "JSONB",
          "structure": {
            "year": "integer",
            "quarter": "string (Q1, Q2, Q3, Q4)"
          },
          "nullable": false
        },
        "declarant_eori": {
          "type": "VARCHAR(20)",
          "nullable": false
        },
        "declarant_name": {
          "type": "VARCHAR(255)",
          "nullable": false
        },
        "declarant_address": {
          "type": "TEXT",
          "nullable": false
        },
        "member_state": {
          "type": "CHAR(2)",
          "nullable": false,
          "note": "EU member state code"
        },
        "goods_list": {
          "type": "JSONB",
          "structure": [
            {
              "commodity_code": "string (CN code)",
              "procedure": "string",
              "net_mass": "float (tonnes)",
              "country_of_origin": "string (ISO)",
              "emissions": {
                "direct": "float",
                "indirect": "float",
                "production_method": "string",
                "qualifying_parameters": {},
                "used_default_values": "boolean"
              }
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "xsd_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true,
          "note": "Array of error objects from XSD validation"
        },
        "xml_file_path": {
          "type": "TEXT",
          "nullable": true,
          "note": "Storage path for generated XML"
        },
        "xml_file_url": {
          "type": "TEXT",
          "nullable": true,
          "note": "Signed download URL"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true,
          "note": "Reference number from EU Transitional Registry"
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true,
          "note": "In paise (₹499 = 49900)"
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE INDEX idx_cbam_user ON cbam_reports(user_id)",
        "CREATE INDEX idx_cbam_org ON cbam_reports(organization_id)",
        "CREATE INDEX idx_cbam_period ON cbam_reports USING gin(reporting_period)",
        "CREATE INDEX idx_cbam_status ON cbam_reports(validation_status)",
        "CREATE INDEX idx_cbam_payment ON cbam_reports(payment_status)"
      ]
    },

    "eudr_reports": {
      "table_name": "eudr_reports",
      "description": "Generated EUDR Due Diligence Statements",
      "fields": {
        "id": {
          "type": "UUID",
          "primary_key": true
        },
        "user_id": {
          "type": "UUID",
          "foreign_key": "users.id",
          "nullable": false
        },
        "organization_id": {
          "type": "UUID",
          "foreign_key": "organizations.id",
          "nullable": false
        },
        "commodity_type": {
          "type": "ENUM",
          "values": ["cattle", "cocoa", "coffee", "palm_oil", "rubber", "soya", "wood"],
          "nullable": false
        },
        "reference_number": {
          "type": "VARCHAR(50)",
          "unique": true,
          "nullable": false,
          "note": "Internal tracking number"
        },
        "shipment_date": {
          "type": "DATE",
          "nullable": false
        },
        "quantity": {
          "type": "DECIMAL(12,3)",
          "nullable": false
        },
        "quantity_unit": {
          "type": "VARCHAR(10)",
          "nullable": false
        },
        "producer_count": {
          "type": "INTEGER",
          "nullable": false,
          "note": "Number of farms/plots in this shipment"
        },
        "plots_data": {
          "type": "JSONB",
          "structure": [
            {
              "producer_name": "string",
              "producer_country": "string (ISO)",
              "production_place": "string",
              "area_hectares": "float",
              "geolocation_type": "point|polygon",
              "coordinates": "array (GeoJSON format)"
            }
          ]
        },
        "validation_status": {
          "type": "ENUM",
          "values": ["draft", "validated", "geojson_valid", "submitted", "rejected"],
          "default": "draft"
        },
        "validation_errors": {
          "type": "JSONB",
          "nullable": true
        },
        "geojson_file_path": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_url": {
          "type": "TEXT",
          "nullable": true
        },
        "geojson_file_count": {
          "type": "INTEGER",
          "default": 1,
          "note": "Number of split files if > 25MB"
        },
        "submitted_to_eu_at": {
          "type": "TIMESTAMPTZ",
          "nullable": true
        },
        "eu_submission_id": {
          "type": "VARCHAR(50)",
          "nullable": true
        },
        "payment_status": {
          "type": "ENUM",
          "values": ["pending", "paid", "refunded", "free_tier"],
          "default": "pending"
        },
        "payment_amount": {
          "type": "INTEGER",
          "nullable": true
        },
        "created_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        },
        "updated_at": {
          "type": "TIMESTAMPTZ",
          "default": "NOW()"
        }
      },
      "indexes": [
        "CREATE


