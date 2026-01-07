import asyncio
from app.core.database import engine, Base
from app.models.user import User
from app.models.authorization import AuthorizationApplication, FinancialStatement, SolvencyAssessment, ConductDeclaration, ImportThresholdTracking
# Import other models if needed

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed Data
    async with AsyncSessionLocal() as session:
        # Create default user
        user = User(
            email="test@vaya.trade",
            full_name="VAYA Demo User",
            # Hash for "password"
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", 
            is_active=True
        )
        session.add(user)
        await session.commit()
    
    print("Database tables created and seeded successfully.")

from app.core.database import AsyncSessionLocal

if __name__ == "__main__":
    asyncio.run(init_models())
