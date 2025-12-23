# VAYA - Product Requirements Document (PRD)

## 1. Executive Summary
**Product Name:** VAYA
**Description:** Regulatory Middleware for Global South Trade Compliance.
**Goal:** To simplify and automate compliance with EU regulations (CBAM, EUDR) for Indian exporters through a user-friendly platform and WhatsApp interface.

## 2. Target Audience
- **Exporters:** Indian manufacturers and traders exporting to the EU.
- **CHAs (Customs House Agents):** Intermediaries managing compliance for exporters.
- **Admin/Verifiers:** Internal team managing the platform and verifying data.

## 3. Key Features
### Phase 1: HS Code Utility (Months 1-2)
- **HS Code Search:** Fuzzy search for Indian ITC-HS codes and mapping to EU CN codes.
- **WhatsApp Bot:** Simple query interface for HS codes, duty rates, and CBAM applicability.
- **Duty Calculator:** Basic duty rate and IGST calculation.

### Phase 2: CBAM Report Engine (Months 3-4)
- **Document Management:** Upload Commercial Invoices, Bills, Production Logs via WhatsApp or Web.
- **OCR & Extraction:** AI-powered extraction of relevant data (using GPT-4o-mini).
- **Validation Engine:** Validate data against CBAM rules and EU default values.
- **XML Generation:** Generate approved XML reports for EU submission.
- **Payments:** Pay-per-report model (Razorpay/UPI).

### Phase 3: API Ecosystem (Months 6+)
- **REST API:** For ERP integrations (Tally, Zoho).
- **EUDR Support:** Geolocation validation and GeoJSON generation.

## 4. Technical Specifications
### Stack
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic.
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI.
- **Database:** PostgreSQL 15+ (Supabase) with PostGIS.
- **AI/ML:** OpenAI GPT-4o-mini for OCR, Shapely for Geospatial.
- **Infrastructure:** Vercel (Frontend), Railway/Render (Backend).

## 5. Data Models
- **Users & Organizations:** Multi-tenancy support.
- **HS/CN Codes:** Master data for compliance.
- **Reports:** CBAM and EUDR report entities.
- **Documents:** Storage and metadata for uploaded proofs.
- **Audit Logs:** Compliance trail.

## 6. User Roles
- **Exporter:** Upload docs, generate reports, pay.
- **CHA:** Manage multiple exporters.
- **Admin:** System stats, user management.

## 7. Success Metrics
- Phase 1: 50 DAU.
- Phase 2: 10 paid reports, EU registry acceptance.
- Phase 3: 1000 monthly reports via API.
