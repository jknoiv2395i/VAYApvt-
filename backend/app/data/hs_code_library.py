"""
Complete HS Code Library - Hierarchical Database

Contains the full WCO HS code nomenclature with ~5800+ codes.
Provides search functionality by description or code.
"""

from typing import List, Dict, Optional
import json
import os

# The complete HS code database will be loaded from JSON file
HS_CODE_LIBRARY: List[Dict] = []

def _load_hs_library():
    """Load HS code library from JSON file."""
    global HS_CODE_LIBRARY
    json_path = os.path.join(os.path.dirname(__file__), "hs_code_library.json")
    if os.path.exists(json_path) and not HS_CODE_LIBRARY:
        with open(json_path, 'r', encoding='utf-8') as f:
            HS_CODE_LIBRARY = json.load(f)
    return HS_CODE_LIBRARY

def search_hs_library(query: str, limit: int = 20) -> List[Dict]:
    """
    Search HS codes by description or code prefix.
    
    Args:
        query: Search term (code prefix or description keywords)
        limit: Maximum results to return
        
    Returns:
        List of matching HS code entries
    """
    library = _load_hs_library()
    if not library:
        return []
    
    query_lower = query.lower()
    results = []
    
    for entry in library:
        code = entry.get("id", "")
        text = entry.get("text", "").lower()
        
        # Match by code prefix or description
        if code.startswith(query) or query_lower in text:
            results.append({
                "hs_code": code,
                "cn_code": code,
                "description": entry.get("text", "").split(" - ", 1)[-1] if " - " in entry.get("text", "") else entry.get("text", ""),
                "full_text": entry.get("text", ""),
                "parent": entry.get("parent"),
                "is_leaf": entry.get("isLeaf") == "1",
                "level": entry.get("aggrlevel", 0),
                "unit": entry.get("standardUnitAbbr", "n/a"),
                "cbam_category": None,
                "emission_factor": 0,
                "category": "hs_library"
            })
            
            if len(results) >= limit:
                break
    
    return results

def lookup_hs_library(hs_code: str) -> Optional[Dict]:
    """Look up a specific HS code."""
    library = _load_hs_library()
    for entry in library:
        if entry.get("id") == hs_code:
            return {
                "hs_code": hs_code,
                "cn_code": hs_code,
                "description": entry.get("text", "").split(" - ", 1)[-1] if " - " in entry.get("text", "") else entry.get("text", ""),
                "full_text": entry.get("text", ""),
                "parent": entry.get("parent"),
                "is_leaf": entry.get("isLeaf") == "1",
                "level": entry.get("aggrlevel", 0),
                "unit": entry.get("standardUnitAbbr", "n/a")
            }
    return None

def get_hs_library_count() -> int:
    """Get total count of HS codes in library."""
    return len(_load_hs_library())

def get_children(parent_code: str) -> List[Dict]:
    """Get all child codes of a parent."""
    library = _load_hs_library()
    return [
        {
            "hs_code": e.get("id"),
            "description": e.get("text", "").split(" - ", 1)[-1] if " - " in e.get("text", "") else e.get("text", ""),
            "is_leaf": e.get("isLeaf") == "1"
        }
        for e in library if e.get("parent") == parent_code
    ]
