
import xml.etree.ElementTree as ET
from xml.dom import minidom
from app.models.report import CBAMReport

class CBAMXMLGenerator:
    @staticmethod
    def generate_xml(report: CBAMReport) -> str:
        # Root Element
        root = ET.Element("QReport")
        root.set("xmlns", "http://ec.europa.eu/taxation_customs/cbam/v1")
        
        # Header
        header = ET.SubElement(root, "StructureHeader")
        ET.SubElement(header, "ReportID").text = report.id
        ET.SubElement(header, "ReportingPeriod").text = report.reporting_period
        ET.SubElement(header, "CreatedDate").text = report.created_at.isoformat()

        # Declarant (Importer)
        declarant = ET.SubElement(root, "Declarant")
        ET.SubElement(declarant, "Name").text = report.importer_name or "Unknown Importer"
        ET.SubElement(declarant, "Role").text = "Importer"

        # Goods Imported
        goods_section = ET.SubElement(root, "GoodsImported")
        
        for item in report.items:
            goods_item = ET.SubElement(goods_section, "GoodsImportedItem")
            goods_item.set("id", item.id)

            # HS/CN Code
            commod = ET.SubElement(goods_item, "CommodityCode")
            ET.SubElement(commod, "HSCode").text = item.hs_code
            if item.cn_code:
                ET.SubElement(commod, "CNCode").text = item.cn_code
            ET.SubElement(commod, "Description").text = item.description

            # Quantity
            qty = ET.SubElement(goods_item, "Quantity")
            ET.SubElement(qty, "NetMass").text = str(item.quantity)
            ET.SubElement(qty, "Unit").text = item.unit

            # Country of Origin
            ET.SubElement(goods_item, "CountryOfOrigin").text = item.country_of_origin

            # Installation
            if item.installation:
                inst = ET.SubElement(goods_item, "Installation")
                ET.SubElement(inst, "Name").text = item.installation.name
                ET.SubElement(inst, "Country").text = item.installation.country_code

            # Emissions
            emissions = ET.SubElement(goods_item, "EmissionsData")
            ET.SubElement(emissions, "DirectEmissions").text = str(item.emissions.direct_emissions)
            ET.SubElement(emissions, "IndirectEmissions").text = str(item.emissions.indirect_emissions)
            ET.SubElement(emissions, "Methodology").text = item.emissions.production_method

        # Generate String
        xml_str = ET.tostring(root, encoding='utf-8')
        parsed = minidom.parseString(xml_str)
        return parsed.toprettyxml(indent="  ")
