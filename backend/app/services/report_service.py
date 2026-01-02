
import json
import os
from typing import List, Optional, Dict
from datetime import datetime
from app.models.report importCBAMReport, ReportItem, EmissionData, Installation

DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/reports.json")

class ReportService:
    def __init__(self):
        self._ensure_data_file()

    def _ensure_data_file(self):
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, "w") as f:
                json.dump([], f)

    def _load_data(self) -> List[Dict]:
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _save_data(self, data: List[Dict]):
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def list_reports(self) -> List[CBAMReport]:
        data = self._load_data()
        return [CBAMReport(**item) for item in data]

    def get_report(self, report_id: str) -> Optional[CBAMReport]:
        data = self._load_data()
        for item in data:
            if item["id"] == report_id:
                return CBAMReport(**item)
        return None

    def create_report(self, reporting_period: str, importer_name: str) -> CBAMReport:
        reports = self._load_data()
        new_report = CBAMReport(
            id=CBAMReport.create_id(),
            created_at=datetime.now(),
            updated_at=datetime.now(),
            reporting_period=reporting_period,
            importer_name=importer_name,
            items=[],
            status="draft"
        )
        # Convert to dict for storage, ensuring datetimes are serialized
        report_dict = json.loads(new_report.json())
        reports.append(report_dict)
        self._save_data(reports)
        return new_report

    def add_item_to_report(self, report_id: str, item: ReportItem) -> Optional[CBAMReport]:
        reports = self._load_data()
        for i, r_data in enumerate(reports):
            if r_data["id"] == report_id:
                # Add item
                current_items = r_data.get("items", [])
                current_items.append(json.loads(item.json()))
                r_data["items"] = current_items
                r_data["updated_at"] = datetime.now().isoformat()
                
                reports[i] = r_data
                self._save_data(reports)
                return CBAMReport(**r_data)
        return None

    def update_item_emissions(self, report_id: str, item_id: str, emissions: EmissionData) -> Optional[CBAMReport]:
        reports = self._load_data()
        for i, r_data in enumerate(reports):
            if r_data["id"] == report_id:
                found_item = False
                for item in r_data.get("items", []):
                    if item["id"] == item_id:
                        item["emissions"] = json.loads(emissions.json())
                        found_item = True
                        break
                
                if found_item:
                    r_data["updated_at"] = datetime.now().isoformat()
                    reports[i] = r_data
                    self._save_data(reports)
                    return CBAMReport(**r_data)
        return None

    def delete_report(self, report_id: str) -> bool:
        reports = self._load_data()
        original_len = len(reports)
        reports = [r for r in reports if r["id"] != report_id]
        if len(reports) < original_len:
            self._save_data(reports)
            return True
        return False
