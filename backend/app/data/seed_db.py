"""
Database seeder script for HS codes, CN codes, and mappings.

Usage: python -m app.data.seed_db
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal, engine, Base
from app.models import HSCode, CNCode, HSCNMapping
from app.data.seed_data import HS_CODES, CN_CODES, HS_CN_MAPPINGS


async def create_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created successfully")


async def seed_hs_codes(db: AsyncSession):
    """Seed HS codes into database."""
    for data in HS_CODES:
        # Check if already exists
        result = await db.execute(
            select(HSCode).where(HSCode.hs_code == data["hs_code"])
        )
        existing = result.scalar_one_or_none()
        
        if not existing:
            hs_code = HSCode(**data)
            db.add(hs_code)
    
    await db.commit()
    print(f"✅ Seeded {len(HS_CODES)} HS codes")


async def seed_cn_codes(db: AsyncSession):
    """Seed CN codes into database."""
    for data in CN_CODES:
        result = await db.execute(
            select(CNCode).where(CNCode.cn_code == data["cn_code"])
        )
        existing = result.scalar_one_or_none()
        
        if not existing:
            cn_code = CNCode(**data)
            db.add(cn_code)
    
    await db.commit()
    print(f"✅ Seeded {len(CN_CODES)} CN codes")


async def seed_hs_cn_mappings(db: AsyncSession):
    """Seed HS-CN mappings into database."""
    for data in HS_CN_MAPPINGS:
        result = await db.execute(
            select(HSCNMapping).where(
                HSCNMapping.hs_code == data["hs_code"],
                HSCNMapping.cn_code == data["cn_code"]
            )
        )
        existing = result.scalar_one_or_none()
        
        if not existing:
            mapping = HSCNMapping(**data)
            db.add(mapping)
    
    await db.commit()
    print(f"✅ Seeded {len(HS_CN_MAPPINGS)} HS-CN mappings")


async def run_seeder():
    """Run all seeders."""
    print("🌱 Starting database seeder...")
    
    # Create tables
    await create_tables()
    
    # Seed data
    async with AsyncSessionLocal() as db:
        await seed_hs_codes(db)
        await seed_cn_codes(db)
        await seed_hs_cn_mappings(db)
    
    print("🎉 Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(run_seeder())
