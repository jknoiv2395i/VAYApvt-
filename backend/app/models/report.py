from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date
import uuid

class EmissionData(BaseModel):
    direct_emissions: float = 0.0  # Tonnes CO2e
    indirect_emissions: float = 0.0 # Tonnes CO2e
    precursor_emissions: float = 0.0 # Tonnes CO2e
    production_method: Optional[str] = "actual" # actual, default

class Installation(BaseModel):
    name: str = "Unknown Installation"
    country_code: str = "XX"
    address: Optional[str] = None
    operator_name: Optional[str] = None

class ReportItem(BaseModel):
    id: str
    hs_code: str
    cn_code: Optional[str] = None
    description: str
    quantity: float
    unit: str = "kg"
    country_of_origin: str
    installation: Optional[Installation] = None
    emissions: EmissionData = EmissionData()
    documents: List[str] = [] # List of filenames

class CBAMReport(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime
    status: str = "draft" # draft, validated, exported
    reporting_period: str # e.g., "2023-Q4"
    importer_name: Optional[str] = None
    items: List[ReportItem] = []

    @staticmethod
    def create_id() -> str:
        return str(uuid.uuid4())
