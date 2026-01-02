"""
HS Code Service

Provides HS code lookup and search functionality.
Supports both static file (legacy) and database (new) backends.
"""

from typing import Optional, List, Dict
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.hs_code import HSCode, CNCode, HSCNMapping, CBAMCategory
from app.data.hs_cn_mapping import (
    ALL_MAPPINGS,
    get_cn_code as static_get_cn_code,
    get_cbam_category as static_get_cbam_category,
    get_emission_factor as static_get_emission_factor,
    get_description as static_get_description,
    search_hs_codes as static_search,
    get_all_hs_codes as static_get_all
)


class HSCodeService:
    """
    Service for HS code operations.
    
    This service abstracts the underlying data source (static file or database)
    and provides a consistent API for HS code lookups and searches.
    """
    
    def __init__(self, session: Optional[AsyncSession] = None):
        """Initialize with optional database session."""
        self.session = session
        self.use_database = session is not None
    
    # =========================================================================
    # Public API
    # =========================================================================
    
    async def lookup(self, hs_code: str) -> Optional[Dict]:
        """
        Look up a single HS code.
        
        Returns:
            Dict with cn_code, description, cbam_category, emission_factor
        """
        if self.use_database:
            return await self._db_lookup(hs_code)
        return self._static_lookup(hs_code)
    
    async def search(self, query: str, limit: int = 20) -> List[Dict]:
        """
        Search HS codes by code or description.
        
        Args:
            query: Search term (code prefix or description keyword)
            limit: Maximum results to return
            
        Returns:
            List of matching HS code records
        """
        if self.use_database:
            return await self._db_search(query, limit)
        return self._static_search(query, limit)
    
    async def get_all(
        self, 
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict]:
        """Get all HS codes, optionally filtered by category."""
        if self.use_database:
            return await self._db_get_all(category, skip, limit)
        return self._static_get_all(category, skip, limit)
    
    async def get_category_stats(self) -> List[Dict]:
        """Get statistics for each CBAM category."""
        if self.use_database:
            return await self._db_category_stats()
        return self._static_category_stats()
    
    async def get_count(self) -> int:
        """Get total number of HS codes."""
        if self.use_database:
            result = await self.session.execute(select(func.count(HSCode.id)))
            return result.scalar() or 0
        return len(ALL_MAPPINGS)
    
    # =========================================================================
    # Static File Backend (Legacy)
    # =========================================================================
    
    def _static_lookup(self, hs_code: str) -> Optional[Dict]:
        """Lookup from static file."""
        mapping = ALL_MAPPINGS.get(hs_code)
        if not mapping:
            return None
        return {
            "hs_code": hs_code,
            "cn_code": mapping.get("cn"),
            "description": mapping.get("desc"),
            "cbam_category": mapping.get("category"),
            "emission_factor": mapping.get("factor", 0),
            "is_cbam_covered": mapping.get("category") is not None
        }
    
    def _static_search(self, query: str, limit: int) -> List[Dict]:
        """Search static file."""
        results = static_search(query, limit)
        return [
            {
                "hs_code": r["hs_code"],
                "cn_code": r["cn_code"],
                "description": r["description"],
                "cbam_category": r["cbam_category"],
                "emission_factor": r["emission_factor"]
            }
            for r in results
        ]
    
    def _static_get_all(
        self, 
        category: Optional[str],
        skip: int,
        limit: int
    ) -> List[Dict]:
        """Get all from static file."""
        all_codes = static_get_all()
        if category:
            all_codes = [c for c in all_codes if c["cbam_category"] == category]
        return all_codes[skip:skip + limit]
    
    def _static_category_stats(self) -> Dict[str, int]:
        """Get category stats from static file."""
        stats = {}
        for code, data in ALL_MAPPINGS.items():
            cat = data.get("category")
            if cat:
                if cat not in stats:
                    stats[cat] = 0
                stats[cat] += 1
        return stats
    
    # =========================================================================
    # Database Backend (New)
    # =========================================================================
    
    async def _db_lookup(self, hs_code: str) -> Optional[Dict]:
        """Lookup from database."""
        # Join HS -> Mapping -> CN
        stmt = (
            select(HSCode, CNCode, HSCNMapping)
            .join(HSCNMapping, HSCode.hs_code == HSCNMapping.hs_code)
            .join(CNCode, HSCNMapping.cn_code == CNCode.cn_code)
            .where(HSCode.hs_code == hs_code)
        )
        result = await self.session.execute(stmt)
        row = result.first()
        
        if not row:
            # Fallback: check HS only
            hs_stmt = select(HSCode).where(HSCode.hs_code == hs_code)
            hs_result = await self.session.execute(hs_stmt)
            hs = hs_result.scalar()
            if hs:
                return {
                    "hs_code": hs.hs_code,
                    "cn_code": None,
                    "description": hs.description,
                    "cbam_category": None,
                    "emission_factor": 0,
                    "is_cbam_covered": False
                }
            return None
        
        hs, cn, mapping = row
        return {
            "hs_code": hs.hs_code,
            "cn_code": cn.cn_code,
            "description": hs.description,
            "cbam_category": cn.cbam_category.value if cn.cbam_category else None,
            "emission_factor": float(cn.default_direct_emission or 0),
            "is_cbam_covered": cn.is_cbam_covered
        }
    
    async def _db_search(self, query: str, limit: int) -> List[Dict]:
        """Search database with ILIKE."""
        search_pattern = f"%{query}%"
        
        stmt = (
            select(HSCode, CNCode)
            .outerjoin(HSCNMapping, HSCode.hs_code == HSCNMapping.hs_code)
            .outerjoin(CNCode, HSCNMapping.cn_code == CNCode.cn_code)
            .where(
                or_(
                    HSCode.hs_code.ilike(search_pattern),
                    HSCode.description.ilike(search_pattern)
                )
            )
            .limit(limit)
        )
        
        result = await self.session.execute(stmt)
        rows = result.all()
        
        return [
            {
                "hs_code": hs.hs_code,
                "cn_code": cn.cn_code if cn else None,
                "description": hs.description,
                "cbam_category": cn.cbam_category.value if cn and cn.cbam_category else None,
                "emission_factor": float(cn.default_direct_emission or 0) if cn else 0
            }
            for hs, cn in rows
        ]
    
    async def _db_get_all(
        self,
        category: Optional[str],
        skip: int,
        limit: int
    ) -> List[Dict]:
        """Get all from database with pagination."""
        stmt = (
            select(HSCode, CNCode)
            .outerjoin(HSCNMapping, HSCode.hs_code == HSCNMapping.hs_code)
            .outerjoin(CNCode, HSCNMapping.cn_code == CNCode.cn_code)
        )
        
        if category:
            try:
                cat_enum = CBAMCategory(category)
                stmt = stmt.where(CNCode.cbam_category == cat_enum)
            except ValueError:
                pass
        
        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        rows = result.all()
        
        return [
            {
                "hs_code": hs.hs_code,
                "cn_code": cn.cn_code if cn else None,
                "description": hs.description,
                "cbam_category": cn.cbam_category.value if cn and cn.cbam_category else None,
                "emission_factor": float(cn.default_direct_emission or 0) if cn else 0
            }
            for hs, cn in rows
        ]
    
    async def _db_category_stats(self) -> List[Dict]:
        """Get category statistics from database."""
        stmt = (
            select(
                CNCode.cbam_category,
                func.count(CNCode.id).label("count"),
                func.min(CNCode.default_direct_emission).label("min_factor"),
                func.max(CNCode.default_direct_emission).label("max_factor")
            )
            .where(CNCode.cbam_category.isnot(None))
            .group_by(CNCode.cbam_category)
        )
        
        result = await self.session.execute(stmt)
        rows = result.all()
        
        return [
            {
                "category": row.cbam_category.value,
                "display_name": row.cbam_category.value.replace("_", " ").title(),
                "hs_code_count": row.count,
                "emission_factor_range": f"{float(row.min_factor or 0):.1f} - {float(row.max_factor or 0):.1f} kg CO₂e/kg"
            }
            for row in rows
        ]


# Singleton for static file mode (no database required)
_static_service = None

def get_static_service() -> HSCodeService:
    """Get the singleton static HS code service."""
    global _static_service
    if _static_service is None:
        _static_service = HSCodeService(session=None)
    return _static_service
