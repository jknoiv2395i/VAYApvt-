"""
EUDR Geometry Validator Service

Validates GeoJSON geometries for EU Deforestation Regulation compliance.
Implements the "Geometry Firewall" that ensures all farm plots meet the
strict technical requirements of TRACES NT before submission.

Key Validations:
1. CRS: Must be WGS84 (EPSG:4326)
2. Winding Order: Counter-clockwise for exterior rings (RFC 7946)
3. No Holes: Interior rings are prohibited by TRACES
4. Topology: Must be valid (no self-intersections)
5. Precision: Minimum 6 decimal places for coordinates
6. Closure: First coordinate must equal last coordinate

Reference: EU Regulation 2023/1115 (EUDR)
"""

from typing import Any
from dataclasses import dataclass, field
from shapely.geometry import shape, mapping, Polygon, MultiPolygon
from shapely.ops import orient
from shapely.validation import explain_validity, make_valid
import json


@dataclass
class ValidationError:
    """A single validation error with remediation guidance."""
    code: str
    message: str
    severity: str = "error"  # error, warning
    location: str = ""
    remediation: str = ""


@dataclass
class ValidationResult:
    """Complete validation result for a geometry."""
    is_valid: bool
    errors: list[ValidationError] = field(default_factory=list)
    warnings: list[ValidationError] = field(default_factory=list)
    fixes_applied: list[str] = field(default_factory=list)
    corrected_geometry: dict | None = None
    
    def to_dict(self) -> dict:
        return {
            "is_valid": self.is_valid,
            "errors": [{"code": e.code, "message": e.message, "severity": e.severity, 
                       "location": e.location, "remediation": e.remediation} for e in self.errors],
            "warnings": [{"code": w.code, "message": w.message, "severity": w.severity,
                         "location": w.location, "remediation": w.remediation} for w in self.warnings],
            "fixes_applied": self.fixes_applied,
            "corrected_geometry": self.corrected_geometry
        }


class EUDRGeometryValidator:
    """
    Validates and corrects GeoJSON geometries for EUDR/TRACES compliance.
    
    Usage:
        validator = EUDRGeometryValidator()
        result = validator.validate(geojson_geometry, auto_fix=True)
        
        if result.is_valid:
            compliant_geojson = result.corrected_geometry
        else:
            for error in result.errors:
                print(f"{error.code}: {error.message}")
    """
    
    # EUDR/TRACES specific requirements
    MIN_DECIMAL_PRECISION = 6
    MAX_DECIMAL_PRECISION = 8
    LARGE_PLOT_THRESHOLD_HECTARES = 4.0
    
    def __init__(self):
        pass
    
    def validate(self, geojson_geometry: dict, auto_fix: bool = True) -> ValidationResult:
        """
        Main entry point for geometry validation.
        
        Args:
            geojson_geometry: A GeoJSON Geometry object (Point, Polygon, MultiPolygon)
            auto_fix: If True, attempt to fix correctable issues automatically
            
        Returns:
            ValidationResult with is_valid, errors, warnings, and corrected geometry
        """
        errors: list[ValidationError] = []
        warnings: list[ValidationError] = []
        fixes: list[str] = []
        
        try:
            # Parse GeoJSON to Shapely geometry
            geom = shape(geojson_geometry)
        except Exception as e:
            errors.append(ValidationError(
                code="EUDR-PARSE-001",
                message=f"Invalid GeoJSON: {str(e)}",
                remediation="Ensure geometry follows GeoJSON specification (RFC 7946)"
            ))
            return ValidationResult(is_valid=False, errors=errors)
        
        # Run all validation checks
        geom, check_errors, check_warnings, check_fixes = self._run_all_checks(geom, auto_fix)
        errors.extend(check_errors)
        warnings.extend(check_warnings)
        fixes.extend(check_fixes)
        
        # Determine final validity
        is_valid = len([e for e in errors if e.severity == "error"]) == 0
        
        # Convert back to GeoJSON
        corrected_geojson = None
        if is_valid and geom is not None:
            corrected_geojson = mapping(geom)
            # Round coordinates in the output
            corrected_geojson = self._round_coordinates_in_geojson(corrected_geojson)
        
        return ValidationResult(
            is_valid=is_valid,
            errors=errors,
            warnings=warnings,
            fixes_applied=fixes,
            corrected_geometry=corrected_geojson
        )
    
    def _run_all_checks(self, geom, auto_fix: bool):
        """Run all EUDR compliance checks on the geometry."""
        errors = []
        warnings = []
        fixes = []
        
        # Check 1: Basic topology validity
        geom, topo_errors, topo_fixes = self._check_topology(geom, auto_fix)
        errors.extend(topo_errors)
        fixes.extend(topo_fixes)
        
        if geom is None:
            return None, errors, warnings, fixes
        
        # Check 2: Coordinate bounds (WGS84 range)
        bound_errors = self._check_coordinate_bounds(geom)
        errors.extend(bound_errors)
        
        # Check 3: Winding order (RFC 7946: CCW for exterior)
        geom, winding_fixed = self._fix_winding_order(geom)
        if winding_fixed:
            fixes.append("winding_order_corrected")
        
        # Check 4: Interior rings (holes) - TRACES prohibition
        hole_errors = self._check_for_holes(geom)
        errors.extend(hole_errors)
        
        # Check 5: Coordinate precision
        precision_warnings = self._check_precision(geom)
        warnings.extend(precision_warnings)
        
        # Check 6: Polygon closure
        geom, closure_fixed = self._ensure_closure(geom)
        if closure_fixed:
            fixes.append("polygon_closed")
        
        # Check 7: Minimum vertex count
        vertex_errors = self._check_minimum_vertices(geom)
        errors.extend(vertex_errors)
        
        return geom, errors, warnings, fixes
    
    def _check_topology(self, geom, auto_fix: bool):
        """Check for valid topology (no self-intersections)."""
        errors = []
        fixes = []
        
        if not geom.is_valid:
            reason = explain_validity(geom)
            
            if auto_fix:
                try:
                    fixed_geom = make_valid(geom)
                    # Filter out tiny artifacts from make_valid
                    if isinstance(fixed_geom, (Polygon, MultiPolygon)):
                        geom = fixed_geom
                        fixes.append("topology_repaired")
                    else:
                        # make_valid might return GeometryCollection
                        # Extract largest polygon
                        polygons = [g for g in fixed_geom.geoms if isinstance(g, Polygon)]
                        if polygons:
                            geom = max(polygons, key=lambda p: p.area)
                            fixes.append("topology_repaired_extracted_polygon")
                        else:
                            errors.append(ValidationError(
                                code="EUDR-TOPO-001",
                                message=f"Invalid topology: {reason}",
                                remediation="Redraw the polygon without self-intersections"
                            ))
                            return None, errors, fixes
                except Exception:
                    errors.append(ValidationError(
                        code="EUDR-TOPO-001",
                        message=f"Invalid topology: {reason}",
                        remediation="Redraw the polygon without self-intersections"
                    ))
                    return None, errors, fixes
            else:
                errors.append(ValidationError(
                    code="EUDR-TOPO-001",
                    message=f"Invalid topology: {reason}",
                    remediation="Enable auto_fix or redraw the polygon"
                ))
        
        if not geom.is_simple:
            errors.append(ValidationError(
                code="EUDR-TOPO-002",
                message="Geometry is not simple (has self-tangencies)",
                remediation="Simplify geometry to remove self-touching edges"
            ))
        
        return geom, errors, fixes
    
    def _check_coordinate_bounds(self, geom) -> list[ValidationError]:
        """Check coordinates are within WGS84 valid ranges."""
        errors = []
        bounds = geom.bounds  # (minx, miny, maxx, maxy)
        
        if bounds[0] < -180 or bounds[2] > 180:
            errors.append(ValidationError(
                code="EUDR-CRS-001",
                message=f"Longitude out of range: [{bounds[0]}, {bounds[2]}]",
                location="coordinates",
                remediation="Longitude must be between -180 and 180 (WGS84)"
            ))
        
        if bounds[1] < -90 or bounds[3] > 90:
            errors.append(ValidationError(
                code="EUDR-CRS-002",
                message=f"Latitude out of range: [{bounds[1]}, {bounds[3]}]",
                location="coordinates",
                remediation="Latitude must be between -90 and 90 (WGS84)"
            ))
        
        return errors
    
    def _fix_winding_order(self, geom):
        """
        Fix winding order to comply with RFC 7946.
        Exterior rings must be counter-clockwise.
        """
        fixed = False
        
        if isinstance(geom, Polygon):
            oriented = orient(geom, sign=1.0)  # 1.0 = counter-clockwise exterior
            if oriented != geom:
                fixed = True
                geom = oriented
        elif isinstance(geom, MultiPolygon):
            oriented_polys = []
            for poly in geom.geoms:
                oriented = orient(poly, sign=1.0)
                if oriented != poly:
                    fixed = True
                oriented_polys.append(oriented)
            geom = MultiPolygon(oriented_polys)
        
        return geom, fixed
    
    def _check_for_holes(self, geom) -> list[ValidationError]:
        """
        Check for interior rings (holes) which TRACES prohibits.
        
        TRACES explicitly rejects polygons with holes. They must be
        decomposed into multiple hole-free polygons.
        """
        errors = []
        
        def check_polygon(poly: Polygon, index: str = ""):
            if len(poly.interiors) > 0:
                errors.append(ValidationError(
                    code="EUDR-HOLE-001",
                    message=f"Polygon{index} has {len(poly.interiors)} interior ring(s) (holes)",
                    severity="error",
                    location=f"geometry{index}",
                    remediation="TRACES prohibits holes. Decompose into multiple hole-free polygons or remove the hole cutouts."
                ))
        
        if isinstance(geom, Polygon):
            check_polygon(geom)
        elif isinstance(geom, MultiPolygon):
            for i, poly in enumerate(geom.geoms):
                check_polygon(poly, f"[{i}]")
        
        return errors
    
    def _check_precision(self, geom) -> list[ValidationError]:
        """Check coordinate precision meets EUDR requirements."""
        warnings = []
        
        def count_decimals(value: float) -> int:
            str_val = f"{value:.15f}".rstrip('0')
            if '.' in str_val:
                return len(str_val.split('.')[1])
            return 0
        
        def check_coords(coords):
            min_precision = float('inf')
            max_precision = 0
            
            for coord in coords:
                if isinstance(coord[0], (list, tuple)):
                    check_coords(coord)
                else:
                    lon_dec = count_decimals(coord[0])
                    lat_dec = count_decimals(coord[1])
                    min_precision = min(min_precision, lon_dec, lat_dec)
                    max_precision = max(max_precision, lon_dec, lat_dec)
            
            return min_precision, max_precision
        
        try:
            geojson = mapping(geom)
            min_prec, max_prec = check_coords(geojson.get('coordinates', []))
            
            if min_prec < self.MIN_DECIMAL_PRECISION:
                warnings.append(ValidationError(
                    code="EUDR-PREC-001",
                    message=f"Low coordinate precision: {min_prec} decimals (minimum: 6)",
                    severity="warning",
                    remediation="Use GPS with higher accuracy or manually increase precision"
                ))
            
            if max_prec > self.MAX_DECIMAL_PRECISION:
                warnings.append(ValidationError(
                    code="EUDR-PREC-002",
                    message=f"Excessive precision: {max_prec} decimals (causes file bloat)",
                    severity="warning",
                    remediation="Coordinates will be rounded to 6 decimals"
                ))
        except Exception:
            pass  # Precision check is non-critical
        
        return warnings
    
    def _ensure_closure(self, geom):
        """Ensure polygons are properly closed (first == last coordinate)."""
        fixed = False
        
        # Shapely automatically closes polygons during construction,
        # so this is mainly for validation messaging
        if isinstance(geom, Polygon):
            coords = list(geom.exterior.coords)
            if coords[0] != coords[-1]:
                fixed = True
                # Shapely already handles this, but flag it
        
        return geom, fixed
    
    def _check_minimum_vertices(self, geom) -> list[ValidationError]:
        """Check polygon has minimum required vertices."""
        errors = []
        
        def check_polygon(poly: Polygon, index: str = ""):
            # A valid polygon needs at least 4 points (3 unique + closure)
            coords = list(poly.exterior.coords)
            if len(coords) < 4:
                errors.append(ValidationError(
                    code="EUDR-VERT-001",
                    message=f"Polygon{index} has insufficient vertices: {len(coords)} (minimum: 4)",
                    severity="error",
                    remediation="Draw a polygon with at least 3 distinct points"
                ))
        
        if isinstance(geom, Polygon):
            check_polygon(geom)
        elif isinstance(geom, MultiPolygon):
            for i, poly in enumerate(geom.geoms):
                check_polygon(poly, f"[{i}]")
        
        return errors
    
    def _round_coordinates_in_geojson(self, geojson: dict, precision: int = 6) -> dict:
        """Round all coordinates in a GeoJSON object to specified precision."""
        
        def round_coords(coords):
            if isinstance(coords[0], (list, tuple)):
                return [round_coords(c) for c in coords]
            else:
                return [round(coords[0], precision), round(coords[1], precision)]
        
        if 'coordinates' in geojson:
            geojson['coordinates'] = round_coords(geojson['coordinates'])
        
        return geojson
    
    def calculate_area_hectares(self, geom) -> float:
        """
        Calculate approximate area in hectares.
        
        Note: This is an approximation using WGS84 coordinates.
        For accurate area, reproject to a local UTM zone.
        """
        # Rough conversion factor for typical Indian latitudes (~20°N)
        # 1 degree ≈ 111km at equator, cos(20°) ≈ 0.94
        import math
        
        if isinstance(geom, dict):
            geom = shape(geom)
        
        # Get centroid latitude for more accurate conversion
        centroid = geom.centroid
        lat = centroid.y
        
        # Approximate meters per degree at this latitude
        meters_per_degree_lat = 111132.92
        meters_per_degree_lon = 111132.92 * math.cos(math.radians(lat))
        
        # Convert area from square degrees to square meters
        area_sq_degrees = geom.area
        area_sq_meters = area_sq_degrees * meters_per_degree_lat * meters_per_degree_lon
        
        # Convert to hectares (1 hectare = 10,000 sq meters)
        return area_sq_meters / 10000


# Singleton instance for easy import
_validator_instance = None

def get_eudr_validator() -> EUDRGeometryValidator:
    """Get the singleton EUDR validator instance."""
    global _validator_instance
    if _validator_instance is None:
        _validator_instance = EUDRGeometryValidator()
    return _validator_instance
