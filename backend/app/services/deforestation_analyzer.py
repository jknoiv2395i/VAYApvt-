"""
EUDR Deforestation Analyzer

Analyzes geolocation data to detect potential deforestation risks.
Based on EU Regulation 2023/1115 requirements and December 2020 cutoff date.

Key data sources:
- JRC Global Forest Cover (GFC) 2020 baseline
- Hansen Global Forest Change (tree cover loss)
- RADD Forest Disturbance Alerts (near real-time)
"""

from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum
from typing import List, Dict, Optional, Any, Tuple
import math

from shapely.geometry import shape, Polygon, MultiPolygon
from shapely.ops import transform


class RiskLevel(str, Enum):
    """Deforestation risk classification."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    UNKNOWN = "unknown"


class AlertType(str, Enum):
    """Types of deforestation alerts."""
    TREE_COVER_LOSS = "tree_cover_loss"
    FOREST_DISTURBANCE = "forest_disturbance"
    LAND_USE_CHANGE = "land_use_change"
    FIRE_DAMAGE = "fire_damage"
    BASELINE_VIOLATION = "baseline_violation"


@dataclass
class DeforestationAlert:
    """Individual deforestation alert."""
    alert_type: AlertType
    date_detected: date
    confidence: float  # 0.0 to 1.0
    area_affected_ha: float
    location: Dict[str, float]  # lat, lon
    source: str
    description: str
    remediation: Optional[str] = None


@dataclass
class ForestCoverData:
    """Forest cover statistics for a plot."""
    tree_cover_2020: float  # Percentage (0-100)
    tree_cover_current: float
    tree_cover_loss_ha: float
    tree_cover_gain_ha: float
    forest_type: str  # primary, secondary, plantation, etc.
    biome: str  # tropical, temperate, boreal


@dataclass
class DeforestationAnalysisResult:
    """Complete deforestation analysis result for a plot."""
    is_compliant: bool
    risk_level: RiskLevel
    risk_score: float  # 0-100
    
    # Forest cover data
    forest_cover: Optional[ForestCoverData] = None
    
    # Alerts detected
    alerts: List[DeforestationAlert] = field(default_factory=list)
    
    # Summary
    summary: str = ""
    recommendations: List[str] = field(default_factory=list)
    
    # Metadata
    analysis_date: date = field(default_factory=date.today)
    data_sources: List[str] = field(default_factory=list)
    cutoff_date: date = field(default_factory=lambda: date(2020, 12, 31))


class DeforestationAnalyzer:
    """
    Analyzes plots for EUDR deforestation compliance.
    
    The EU Deforestation Regulation (EUDR) requires that commodities:
    1. Were not produced on land deforested after December 31, 2020
    2. Were produced in compliance with local laws
    
    This service simulates satellite-based analysis using:
    - Tree cover baselines from JRC/Hansen datasets
    - Change detection algorithms
    - Risk scoring based on location and commodity type
    """
    
    # EUDR cutoff date
    CUTOFF_DATE = date(2020, 12, 31)
    
    # EUDR regulated commodities (with deforestation risk factors)
    COMMODITY_RISK_FACTORS = {
        "cattle": 1.5,
        "cocoa": 1.3,
        "coffee": 1.2,
        "palm_oil": 1.8,
        "rubber": 1.4,
        "soya": 1.3,
        "wood": 1.1,
    }
    
    # High-risk regions (sample data)
    HIGH_RISK_REGIONS = {
        # Brazil Amazon
        ("BR", "AM"): 0.9,
        ("BR", "PA"): 0.85,
        ("BR", "MT"): 0.8,
        # Indonesia
        ("ID", "RI"): 0.85,
        ("ID", "KS"): 0.8,
        # West Africa
        ("CI", "*"): 0.7,
        ("GH", "*"): 0.65,
    }
    
    def __init__(self):
        """Initialize the analyzer."""
        self.data_sources = [
            "JRC Global Forest Cover 2020",
            "Hansen Global Forest Change v1.10",
            "RADD Forest Disturbance Alerts",
        ]
    
    async def analyze(
        self,
        geometry: Dict[str, Any],
        commodity: Optional[str] = None,
        country_code: Optional[str] = None,
    ) -> DeforestationAnalysisResult:
        """
        Analyze a plot for deforestation risk.
        
        Args:
            geometry: GeoJSON geometry (Polygon or MultiPolygon)
            commodity: EUDR commodity type (optional)
            country_code: ISO country code (optional)
            
        Returns:
            DeforestationAnalysisResult with risk assessment
        """
        # Parse geometry
        try:
            geom = shape(geometry)
        except Exception as e:
            return DeforestationAnalysisResult(
                is_compliant=False,
                risk_level=RiskLevel.UNKNOWN,
                risk_score=0,
                summary=f"Could not parse geometry: {e}",
            )
        
        # Calculate area
        area_ha = self._calculate_area_hectares(geom)
        
        # Get centroid for location-based analysis
        centroid = geom.centroid
        lat, lon = centroid.y, centroid.x
        
        # Simulate forest cover data retrieval
        forest_cover = await self._get_forest_cover_data(geom, lat, lon)
        
        # Detect alerts
        alerts = await self._detect_alerts(geom, forest_cover, area_ha)
        
        # Calculate risk score
        risk_score, risk_level = self._calculate_risk_score(
            forest_cover, alerts, commodity, country_code
        )
        
        # Determine compliance
        is_compliant = risk_level in [RiskLevel.LOW, RiskLevel.MEDIUM]
        
        # Generate summary and recommendations
        summary = self._generate_summary(forest_cover, alerts, risk_level)
        recommendations = self._generate_recommendations(
            forest_cover, alerts, risk_level, commodity
        )
        
        return DeforestationAnalysisResult(
            is_compliant=is_compliant,
            risk_level=risk_level,
            risk_score=risk_score,
            forest_cover=forest_cover,
            alerts=alerts,
            summary=summary,
            recommendations=recommendations,
            data_sources=self.data_sources,
        )
    
    async def _get_forest_cover_data(
        self, geom: Polygon, lat: float, lon: float
    ) -> ForestCoverData:
        """
        Simulate retrieval of forest cover data.
        
        In production, this would query:
        - Google Earth Engine API
        - JRC TMF dataset
        - Hansen GFC tiles
        """
        # Simulate forest cover based on latitude (tropical vs temperate)
        if -23.5 <= lat <= 23.5:
            # Tropical zone - higher baseline forest cover
            biome = "tropical"
            base_cover = 75.0 + (abs(lon) % 20)  # 75-95%
        elif abs(lat) <= 45:
            # Temperate zone
            biome = "temperate"
            base_cover = 40.0 + (abs(lon) % 30)  # 40-70%
        else:
            # Boreal zone
            biome = "boreal"
            base_cover = 50.0 + (abs(lon) % 25)  # 50-75%
        
        # Simulate some loss since 2020 (0-5% random)
        simulated_loss_pct = (hash(f"{lat:.4f},{lon:.4f}") % 500) / 100
        current_cover = max(0, base_cover - simulated_loss_pct)
        
        # Calculate area affected
        area_ha = self._calculate_area_hectares(geom)
        loss_ha = area_ha * (simulated_loss_pct / 100)
        
        # Determine forest type based on biome
        if biome == "tropical":
            if current_cover > 80:
                forest_type = "primary"
            elif current_cover > 50:
                forest_type = "secondary"
            else:
                forest_type = "degraded"
        else:
            forest_type = "secondary"
        
        return ForestCoverData(
            tree_cover_2020=round(base_cover, 1),
            tree_cover_current=round(current_cover, 1),
            tree_cover_loss_ha=round(loss_ha, 3),
            tree_cover_gain_ha=0,  # Simplified
            forest_type=forest_type,
            biome=biome,
        )
    
    async def _detect_alerts(
        self, geom: Polygon, forest_cover: ForestCoverData, area_ha: float
    ) -> List[DeforestationAlert]:
        """
        Detect deforestation alerts within the plot.
        
        In production, this would query:
        - RADD deforestation alert system
        - FORMA clearance alerts
        - VIIRS fire data
        """
        alerts = []
        centroid = geom.centroid
        lat, lon = centroid.y, centroid.x
        
        # Check for tree cover loss
        if forest_cover.tree_cover_loss_ha > 0.1:
            loss_pct = (forest_cover.tree_cover_loss_ha / area_ha) * 100 if area_ha > 0 else 0
            
            # Determine severity based on loss percentage
            if loss_pct > 10:
                confidence = 0.9
                description = f"Significant tree cover loss detected: {loss_pct:.1f}% of plot area"
            elif loss_pct > 5:
                confidence = 0.7
                description = f"Moderate tree cover loss detected: {loss_pct:.1f}% of plot area"
            else:
                confidence = 0.5
                description = f"Minor tree cover loss detected: {loss_pct:.1f}% of plot area"
            
            alerts.append(DeforestationAlert(
                alert_type=AlertType.TREE_COVER_LOSS,
                date_detected=date(2023, 6, 15),  # Simulated detection date
                confidence=confidence,
                area_affected_ha=forest_cover.tree_cover_loss_ha,
                location={"lat": lat, "lon": lon},
                source="Hansen GFC v1.10",
                description=description,
                remediation="Verify with high-resolution imagery and ground truth data"
            ))
        
        # Check for baseline violation (post-2020 land use change)
        if forest_cover.tree_cover_2020 > 50 and forest_cover.tree_cover_current < 30:
            alerts.append(DeforestationAlert(
                alert_type=AlertType.BASELINE_VIOLATION,
                date_detected=date.today(),
                confidence=0.85,
                area_affected_ha=area_ha * 0.3,
                location={"lat": lat, "lon": lon},
                source="JRC GFC 2020 Baseline",
                description=f"Land shows {forest_cover.tree_cover_2020:.0f}% forest cover in 2020 "
                           f"but only {forest_cover.tree_cover_current:.0f}% currently",
                remediation="This plot may not be compliant for EUDR commodities"
            ))
        
        return alerts
    
    def _calculate_risk_score(
        self,
        forest_cover: ForestCoverData,
        alerts: List[DeforestationAlert],
        commodity: Optional[str],
        country_code: Optional[str],
    ) -> Tuple[float, RiskLevel]:
        """
        Calculate overall deforestation risk score (0-100).
        
        Factors:
        - Tree cover loss since 2020
        - Number and severity of alerts
        - Commodity type
        - Geographic risk
        """
        base_score = 0.0
        
        # Factor 1: Tree cover loss (0-40 points)
        loss_pct = (
            (forest_cover.tree_cover_2020 - forest_cover.tree_cover_current) 
            / forest_cover.tree_cover_2020 * 100
        ) if forest_cover.tree_cover_2020 > 0 else 0
        base_score += min(40, loss_pct * 4)
        
        # Factor 2: Alerts (0-30 points)
        for alert in alerts:
            if alert.alert_type == AlertType.BASELINE_VIOLATION:
                base_score += 20 * alert.confidence
            elif alert.alert_type == AlertType.TREE_COVER_LOSS:
                base_score += 10 * alert.confidence
            else:
                base_score += 5 * alert.confidence
        base_score = min(base_score, 70)  # Cap at 70 for loss + alerts
        
        # Factor 3: Commodity risk (multiplier)
        commodity_factor = 1.0
        if commodity and commodity.lower() in self.COMMODITY_RISK_FACTORS:
            commodity_factor = self.COMMODITY_RISK_FACTORS[commodity.lower()]
        
        # Factor 4: Geographic risk (0-20 points)
        geo_risk = 0
        if country_code:
            for (country, region), risk in self.HIGH_RISK_REGIONS.items():
                if country_code.upper() == country:
                    geo_risk = max(geo_risk, risk * 20)
        base_score += geo_risk
        
        # Apply commodity factor
        final_score = min(100, base_score * commodity_factor)
        
        # Determine risk level
        if final_score < 20:
            risk_level = RiskLevel.LOW
        elif final_score < 40:
            risk_level = RiskLevel.MEDIUM
        elif final_score < 70:
            risk_level = RiskLevel.HIGH
        else:
            risk_level = RiskLevel.CRITICAL
        
        return round(final_score, 1), risk_level
    
    def _generate_summary(
        self,
        forest_cover: ForestCoverData,
        alerts: List[DeforestationAlert],
        risk_level: RiskLevel,
    ) -> str:
        """Generate human-readable summary."""
        if risk_level == RiskLevel.LOW:
            status = "This plot shows no significant deforestation concerns."
        elif risk_level == RiskLevel.MEDIUM:
            status = "This plot has minor deforestation indicators that may require review."
        elif risk_level == RiskLevel.HIGH:
            status = "This plot has concerning deforestation indicators. Additional verification is recommended."
        else:
            status = "This plot has critical deforestation indicators and may not be EUDR compliant."
        
        cover_info = (
            f"Forest cover: {forest_cover.tree_cover_current:.0f}% "
            f"(was {forest_cover.tree_cover_2020:.0f}% in 2020). "
            f"Biome: {forest_cover.biome}."
        )
        
        alert_info = f"Alerts detected: {len(alerts)}." if alerts else "No alerts detected."
        
        return f"{status} {cover_info} {alert_info}"
    
    def _generate_recommendations(
        self,
        forest_cover: ForestCoverData,
        alerts: List[DeforestationAlert],
        risk_level: RiskLevel,
        commodity: Optional[str],
    ) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = []
        
        if risk_level == RiskLevel.LOW:
            recommendations.append("Document this analysis for your due diligence records.")
            recommendations.append("Re-analyze annually or when sourcing changes.")
        
        elif risk_level == RiskLevel.MEDIUM:
            recommendations.append("Obtain high-resolution satellite imagery (5m or better) for verification.")
            recommendations.append("Cross-reference with local land registry data.")
            if commodity:
                recommendations.append(f"Verify {commodity} production practices with supplier.")
        
        elif risk_level == RiskLevel.HIGH:
            recommendations.append("⚠️ Conduct on-ground verification before proceeding.")
            recommendations.append("Request supplier documentation and certifications.")
            recommendations.append("Consider third-party verification audit.")
            if forest_cover.tree_cover_loss_ha > 0:
                recommendations.append(
                    f"Investigate {forest_cover.tree_cover_loss_ha:.2f} ha of tree cover loss."
                )
        
        else:  # CRITICAL
            recommendations.append("🚨 DO NOT source from this plot without full investigation.")
            recommendations.append("Engage legal/compliance team immediately.")
            recommendations.append("Request complete chain of custody documentation.")
            recommendations.append("Consider alternative sourcing options.")
        
        return recommendations
    
    def _calculate_area_hectares(self, geom: Polygon) -> float:
        """Calculate approximate area in hectares."""
        if not geom.is_valid:
            return 0
        
        centroid = geom.centroid
        lat = centroid.y
        
        # Approximate conversion at this latitude
        lat_rad = math.radians(lat)
        meters_per_degree_lat = 111320
        meters_per_degree_lon = 111320 * math.cos(lat_rad)
        
        # Simple approximation using bounding box
        minx, miny, maxx, maxy = geom.bounds
        width_m = (maxx - minx) * meters_per_degree_lon
        height_m = (maxy - miny) * meters_per_degree_lat
        
        # Approximate area (will be refined by actual geometry)
        area_m2 = geom.area * meters_per_degree_lat * meters_per_degree_lon
        area_ha = area_m2 / 10000
        
        return round(area_ha, 4)


# Singleton instance
_analyzer: Optional[DeforestationAnalyzer] = None

def get_deforestation_analyzer() -> DeforestationAnalyzer:
    """Get the singleton deforestation analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = DeforestationAnalyzer()
    return _analyzer
