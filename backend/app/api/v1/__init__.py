# API v1 router
from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.hs_codes import router as hs_codes_router
from app.api.v1.ai import router as ai_router
from app.api.v1.whatsapp import router as whatsapp_router
from app.api.v1.documents import router as documents_router
from app.api.v1.cbam import router as cbam_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(hs_codes_router)
api_router.include_router(ai_router, prefix="/ai", tags=["AI"])
api_router.include_router(whatsapp_router, prefix="/whatsapp", tags=["WhatsApp"])
api_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_router.include_router(cbam_router, prefix="/cbam", tags=["CBAM Reports"])



