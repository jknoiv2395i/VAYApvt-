"""Test HS code library search."""
import sys
import os
import json

# Direct import - bypass app.__init__
data_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(data_dir, "app", "data", "hs_code_library.json")

# Load JSON directly
with open(json_path, 'r', encoding='utf-8') as f:
    HS_CODE_LIBRARY = json.load(f)

def search_hs_library(query, limit=20):
    query_lower = query.lower()
    results = []
    for entry in HS_CODE_LIBRARY:
        code = entry.get("id", "")
        text = entry.get("text", "").lower()
        if code.startswith(query) or query_lower in text:
            results.append({
                "hs_code": code,
                "description": entry.get("text", "").split(" - ", 1)[-1] if " - " in entry.get("text", "") else entry.get("text", "")
            })
            if len(results) >= limit:
                break
    return results

print("Testing HS Code Library Search")
print("=" * 50)

# Count
count = len(HS_CODE_LIBRARY)
print(f"Total HS codes in library: {count}")
print()

# Test: animal
print("Search: animal")
results = search_hs_library("animal", 5)
for r in results:
    print(f"  {r['hs_code']} - {r['description'][:60]}")
print()

# Test: iron
print("Search: iron")
results = search_hs_library("iron", 5)
for r in results:
    print(f"  {r['hs_code']} - {r['description'][:60]}")
print()

# Test: coffee
print("Search: coffee")
results = search_hs_library("coffee", 5)
for r in results:
    print(f"  {r['hs_code']} - {r['description'][:60]}")
print()

# Test: live
print("Search: live")
results = search_hs_library("live", 5)
for r in results:
    print(f"  {r['hs_code']} - {r['description'][:60]}")
