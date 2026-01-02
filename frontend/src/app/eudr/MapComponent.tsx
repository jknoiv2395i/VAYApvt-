'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapComponentProps {
    geometry: any;
    onGeometryChange: (geometry: any) => void;
}

export default function MapComponent({ geometry, onGeometryChange }: MapComponentProps) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawnLayerRef = useRef<L.Polygon | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<L.LatLng[]>([]);
    const tempLayerRef = useRef<L.Polyline | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Initialize map centered on India
        const map = L.map(containerRef.current, {
            center: [20.5937, 78.9629], // India center
            zoom: 5,
            zoomControl: true,
        });

        // Add dark-themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        // Click handler for drawing
        map.on('click', (e: L.LeafletMouseEvent) => {
            if (!isDrawing) {
                // Start drawing
                setIsDrawing(true);
                setPoints([e.latlng]);
            } else {
                // Add point
                setPoints(prev => [...prev, e.latlng]);
            }
        });

        // Double-click to finish
        map.on('dblclick', (e: L.LeafletMouseEvent) => {
            if (isDrawing && points.length >= 3) {
                finishDrawing();
            }
            L.DomEvent.stopPropagation(e);
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Update temp polyline while drawing
    useEffect(() => {
        if (!mapRef.current) return;

        if (tempLayerRef.current) {
            mapRef.current.removeLayer(tempLayerRef.current);
        }

        if (isDrawing && points.length > 0) {
            tempLayerRef.current = L.polyline(points, {
                color: '#10b981',
                weight: 2,
                dashArray: '5, 5',
            }).addTo(mapRef.current);

            // Add markers for vertices
            points.forEach((point, i) => {
                L.circleMarker(point, {
                    radius: 6,
                    fillColor: i === 0 ? '#ef4444' : '#10b981',
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 1,
                }).addTo(mapRef.current!);
            });
        }
    }, [points, isDrawing]);

    // Show existing geometry
    useEffect(() => {
        if (!mapRef.current || !geometry) return;

        if (drawnLayerRef.current) {
            mapRef.current.removeLayer(drawnLayerRef.current);
        }

        try {
            const geoJson = L.geoJSON(geometry as any, {
                style: {
                    color: '#10b981',
                    weight: 3,
                    fillColor: '#10b981',
                    fillOpacity: 0.2,
                },
            });

            if (geoJson.getLayers().length > 0) {
                const layer = geoJson.getLayers()[0] as L.Polygon;
                layer.addTo(mapRef.current);
                drawnLayerRef.current = layer;

                // Fit bounds to geometry
                mapRef.current.fitBounds(layer.getBounds(), { padding: [50, 50] });
            }
        } catch {
            console.error('Failed to display geometry');
        }
    }, [geometry]);

    const finishDrawing = () => {
        if (points.length < 3) return;

        // Create closed polygon coordinates
        const coordinates = points.map(p => [p.lng, p.lat]);
        coordinates.push(coordinates[0]); // Close the polygon

        const geojsonGeometry = {
            type: 'Polygon',
            coordinates: [coordinates],
        };

        onGeometryChange(geojsonGeometry);
        setIsDrawing(false);
        setPoints([]);

        // Clear temp layer
        if (tempLayerRef.current && mapRef.current) {
            mapRef.current.removeLayer(tempLayerRef.current);
            tempLayerRef.current = null;
        }
    };

    const handleStartDrawing = () => {
        setIsDrawing(true);
        setPoints([]);

        // Clear existing geometry
        if (drawnLayerRef.current && mapRef.current) {
            mapRef.current.removeLayer(drawnLayerRef.current);
            drawnLayerRef.current = null;
        }
        onGeometryChange(null);
    };

    const handleFinishDrawing = () => {
        if (points.length >= 3) {
            finishDrawing();
        }
    };

    const handleCancelDrawing = () => {
        setIsDrawing(false);
        setPoints([]);

        if (tempLayerRef.current && mapRef.current) {
            mapRef.current.removeLayer(tempLayerRef.current);
            tempLayerRef.current = null;
        }
    };

    return (
        <div className="relative">
            <div ref={containerRef} className="h-[400px] w-full" />

            {/* Drawing Controls */}
            <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
                {!isDrawing ? (
                    <button
                        onClick={handleStartDrawing}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
                    >
                        ✏️ Start Drawing
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleFinishDrawing}
                            disabled={points.length < 3}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
                        >
                            ✓ Complete ({points.length} points)
                        </button>
                        <button
                            onClick={handleCancelDrawing}
                            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
                        >
                            ✕ Cancel
                        </button>
                    </>
                )}
            </div>

            {/* Drawing Instructions */}
            {isDrawing && (
                <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-black/70 backdrop-blur-sm text-white text-sm p-2 rounded-lg">
                    <p>
                        {points.length === 0
                            ? '👆 Click to place first point'
                            : points.length < 3
                                ? `Click to add more points (${3 - points.length} more needed)`
                                : `Click "Complete" or double-click to finish (${points.length} points)`}
                    </p>
                </div>
            )}
        </div>
    );
}
