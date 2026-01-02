"""
HS Code Database Seeder

Migrates HS codes from static hs_cn_mapping.py file to the PostgreSQL database.
This is Phase 1 of the 15,000 HS Code Expansion Plan.

Usage:
    python -m app.scripts.seed_hs_codes
"""

import asyncio
from datetime import date
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.hs_code import HSCode, CNCode, HSCNMapping, CBAMCategory
from app.data.hs_cn_mapping import ALL_MAPPINGS


# Map string categories to enum
CATEGORY_MAP = {
    "iron_steel": CBAMCategory.IRON_STEEL,
    "aluminium": CBAMCategory.ALUMINIUM,
    "cement": CBAMCategory.CEMENT,
    "fertilisers": CBAMCategory.FERTILISERS,
    "hydrogen": CBAMCategory.HYDROGEN,
    "electricity": CBAMCategory.ELECTRICITY,
}


async def seed_hs_codes():
    """Seed HS codes from static file to database."""
    
    # Create async engine
    database_url = settings.DATABASE_URL
    if database_url and database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    engine = create_async_engine(database_url, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    print(f"\n{'='*60}")
    print("HS CODE DATABASE SEEDER")
    print(f"{'='*60}")
    print(f"Source: hs_cn_mapping.py ({len(ALL_MAPPINGS)} entries)")
    print(f"Target: PostgreSQL database")
    print(f"{'='*60}\n")
    
    async with async_session() as session:
        # Count existing records
        hs_count = await session.execute(select(HSCode).limit(1))
        if hs_count.scalar():
            print("⚠️  Database already contains HS codes. Skipping to avoid duplicates.")
            print("   To re-seed, truncate hs_codes, cn_codes, and hs_cn_mapping tables first.\n")
            return
        
        hs_codes_added = 0
        cn_codes_added = 0
        mappings_added = 0
        
        for hs_code, data in ALL_MAPPINGS.items():
            cn_code = data["cn"]
            desc = data["desc"]
            category_str = data.get("category")
            factor = data.get("factor", 0)
            
            # 1. Insert HS Code
            existing_hs = await session.execute(
                select(HSCode).where(HSCode.hs_code == hs_code)
            )
            if not existing_hs.scalar():
                hs_entry = HSCode(
                    hs_code=hs_code,
                    description=desc,
                    chapter=hs_code[:2],
                    is_restricted=False,
                    updated_at=date.today()
                )
                session.add(hs_entry)
                hs_codes_added += 1
            
            # 2. Insert CN Code
            existing_cn = await session.execute(
                select(CNCode).where(CNCode.cn_code == cn_code)
            )
            if not existing_cn.scalar():
                cbam_cat = CATEGORY_MAP.get(category_str)
                cn_entry = CNCode(
                    cn_code=cn_code,
                    description=desc,
                    is_cbam_covered=cbam_cat is not None,
                    cbam_category=cbam_cat,
                    default_direct_emission=factor,
                    updated_at=date.today()
                )
                session.add(cn_entry)
                cn_codes_added += 1
            
            # 3. Insert Mapping
            existing_map = await session.execute(
                select(HSCNMapping).where(
                    HSCNMapping.hs_code == hs_code,
                    HSCNMapping.cn_code == cn_code
                )
            )
            if not existing_map.scalar():
                mapping_entry = HSCNMapping(
                    hs_code=hs_code,
                    cn_code=cn_code,
                    mapping_confidence="exact",
                    verified=True
                )
                session.add(mapping_entry)
                mappings_added += 1
        
        await session.commit()
        
        print(f"✅ Seeding complete!")
        print(f"   - HS Codes added: {hs_codes_added}")
        print(f"   - CN Codes added: {cn_codes_added}")
        print(f"   - Mappings added: {mappings_added}")
        print()


async def show_stats():
    """Show current database statistics."""
    database_url = settings.DATABASE_URL
    if database_url and database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    engine = create_async_engine(database_url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        hs_count = await session.execute(text("SELECT COUNT(*) FROM hs_codes"))
        cn_count = await session.execute(text("SELECT COUNT(*) FROM cn_codes"))
        map_count = await session.execute(text("SELECT COUNT(*) FROM hs_cn_mapping"))
        
        print(f"\n📊 DATABASE STATISTICS")
        print(f"   - HS Codes: {hs_count.scalar()}")
        print(f"   - CN Codes: {cn_count.scalar()}")
        print(f"   - Mappings: {map_count.scalar()}\n")


if __name__ == "__main__":
    asyncio.run(seed_hs_codes())
    asyncio.run(show_stats())
