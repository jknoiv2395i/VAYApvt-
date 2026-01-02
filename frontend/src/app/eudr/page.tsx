'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    MapPin,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Upload,
    Trash2,
    Info,
    Leaf,
    Globe,
    FileCheck,
    Loader2,
    TreePine,
    Shield,
    AlertOctagon,
    TrendingDown
} from 'lucide-react';

// Dynamic import for Leaflet map (SSR disabled)
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] bg-slate-800 rounded-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
    )
});

interface ValidationError {
    code: string;
    message: string;
    severity: string;
    location: string;
    remediation: string;
}

interface ValidationResult {
    is_valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    fixes_applied: string[];
    corrected_geometry: any;
    area_hectares: number | null;
    plot_size_category: string | null;
}

interface ForestCover {
    tree_cover_2020: number;
    tree_cover_current: number;
    tree_cover_loss_ha: number;
    tree_cover_gain_ha: number;
    forest_type: string;
    biome: string;
}

interface DeforestationAlert {
    alert_type: string;
    date_detected: string;
    confidence: number;
    area_affected_ha: number;
    location: { lat: number; lon: number };
    source: string;
    description: string;
    remediation: string | null;
}

interface DeforestationResult {
    is_compliant: boolean;
    risk_level: string;
    risk_score: number;
    forest_cover: ForestCover | null;
    alerts: DeforestationAlert[];
    summary: string;
    recommendations: string[];
    analysis_date: string;
    data_sources: string[];
    cutoff_date: string;
}

const COMMODITIES = [
    { code: 'cattle', name: 'Cattle', icon: '🐄' },
    { code: 'cocoa', name: 'Cocoa', icon: '🍫' },
    { code: 'coffee', name: 'Coffee', icon: '☕' },
    { code: 'palm_oil', name: 'Palm Oil', icon: '🌴' },
    { code: 'rubber', name: 'Rubber', icon: '🛞' },
    { code: 'soya', name: 'Soya', icon: '🫘' },
    { code: 'wood', name: 'Wood', icon: '🪵' },
];

const RISK_COLORS = {
    low: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    medium: { bg: 'bg-amber-900/30', border: 'border-amber-500/30', text: 'text-amber-400' },
    high: { bg: 'bg-orange-900/30', border: 'border-orange-500/30', text: 'text-orange-400' },
    critical: { bg: 'bg-red-900/30', border: 'border-red-500/30', text: 'text-red-400' },
};

export default function EUDRValidatePage() {
    const [geometry, setGeometry] = useState<any>(null);
    const [geojsonInput, setGeojsonInput] = useState('');
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [deforestationResult, setDeforestationResult] = useState<DeforestationResult | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputMode, setInputMode] = useState<'draw' | 'paste'>('draw');
    const [activeTab, setActiveTab] = useState<'geometry' | 'deforestation'>('geometry');
    const [selectedCommodity, setSelectedCommodity] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');
    const [error, setError] = useState('');

    const validateGeometry = async (geom: any) => {
        setIsValidating(true);
        setError('');
        setValidationResult(null);

        try {
            const response = await fetch('http://localhost:8000/api/v1/eudr/validate-geometry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ geometry: geom, auto_fix: true })
            });

            if (!response.ok) throw new Error(`Validation failed: ${response.statusText}`);

            const result = await response.json();
            setValidationResult(result);
            if (result.corrected_geometry) setGeometry(result.corrected_geometry);
        } catch (err: any) {
            setError(err.message || 'Failed to validate geometry');
        } finally {
            setIsValidating(false);
        }
    };

    const analyzeDeforestation = async (geom: any) => {
        setIsAnalyzing(true);
        setError('');
        setDeforestationResult(null);

        try {
            const response = await fetch('http://localhost:8000/api/v1/eudr/analyze-deforestation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    geometry: geom,
                    commodity: selectedCommodity || null,
                    country_code: countryCode || null
                })
            });

            if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);

            const result = await response.json();
            setDeforestationResult(result);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze deforestation');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGeometryChange = useCallback((geom: any) => {
        setGeometry(geom);
        setValidationResult(null);
        setDeforestationResult(null);
    }, []);

    const handleValidate = () => {
        const geom = inputMode === 'paste' ? parseGeoJSON() : geometry;
        if (!geom) {
            setError('Please draw or paste a polygon first');
            return;
        }
        validateGeometry(geom);
    };

    const handleAnalyze = () => {
        const geom = inputMode === 'paste' ? parseGeoJSON() : geometry;
        if (!geom) {
            setError('Please draw or paste a polygon first');
            return;
        }

        // First validate, then analyze
        if (!validationResult?.is_valid) {
            validateGeometry(geom).then(() => analyzeDeforestation(geom));
        } else {
            analyzeDeforestation(geom);
        }
    };

    const parseGeoJSON = () => {
        try {
            const parsed = JSON.parse(geojsonInput);
            const geom = parsed.geometry || parsed;
            setGeometry(geom);
            return geom;
        } catch {
            setError('Invalid GeoJSON format');
            return null;
        }
    };

    const handleClear = () => {
        setGeometry(null);
        setGeojsonInput('');
        setValidationResult(null);
        setDeforestationResult(null);
        setError('');
    };

    const getRiskColors = (level: string) => RISK_COLORS[level as keyof typeof RISK_COLORS] || RISK_COLORS.low;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">EUDR Compliance Center</h1>
                            <p className="text-sm text-gray-400">Validate Geometry & Analyze Deforestation Risk</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('geometry')}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'geometry'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        <Globe className="w-5 h-5" />
                        Geometry Validation
                    </button>
                    <button
                        onClick={() => setActiveTab('deforestation')}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'deforestation'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        <TreePine className="w-5 h-5" />
                        Deforestation Analysis
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-emerald-100">
                        {activeTab === 'geometry' ? (
                            <>
                                <strong>Geometry Validation</strong> checks your farm plot against TRACES NT requirements:
                                WGS84 coordinates, counter-clockwise winding, no holes, and minimum precision.
                            </>
                        ) : (
                            <>
                                <strong>Deforestation Analysis</strong> checks for tree cover loss since December 31, 2020
                                using satellite data. Select your commodity type for weighted risk scoring.
                            </>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Map / Input */}
                    <div className="space-y-4">
                        {/* Input Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setInputMode('draw')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${inputMode === 'draw'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                <MapPin className="w-4 h-4" />
                                Draw on Map
                            </button>
                            <button
                                onClick={() => setInputMode('paste')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${inputMode === 'paste'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                Paste GeoJSON
                            </button>
                        </div>

                        {/* Map or Text Input */}
                        {inputMode === 'draw' ? (
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden">
                                <MapComponent geometry={geometry} onGeometryChange={handleGeometryChange} />
                                <div className="p-3 border-t border-white/10 text-sm text-gray-400">
                                    Click to draw polygon vertices. Double-click to complete.
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                                <textarea
                                    value={geojsonInput}
                                    onChange={(e) => setGeojsonInput(e.target.value)}
                                    placeholder={`Paste GeoJSON geometry here...`}
                                    className="w-full h-[350px] bg-slate-900 text-gray-200 font-mono text-sm p-4 rounded-lg border border-white/10 focus:border-emerald-500 focus:outline-none resize-none"
                                />
                            </div>
                        )}

                        {/* Commodity Selection (for deforestation tab) */}
                        {activeTab === 'deforestation' && (
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
                                <label className="text-sm text-gray-400">Select Commodity (optional)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {COMMODITIES.map((c) => (
                                        <button
                                            key={c.code}
                                            onClick={() => setSelectedCommodity(selectedCommodity === c.code ? '' : c.code)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${selectedCommodity === c.code
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                }`}
                                        >
                                            <span className="text-lg">{c.icon}</span>
                                            <span>{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                                        placeholder="Country (e.g., BR, ID)"
                                        maxLength={2}
                                        className="flex-1 py-2 px-3 bg-slate-900 text-gray-200 rounded-lg border border-white/10 focus:border-emerald-500 focus:outline-none text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {activeTab === 'geometry' ? (
                                <button
                                    onClick={handleValidate}
                                    disabled={isValidating || (!geometry && !geojsonInput)}
                                    className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    {isValidating ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Validating...</>
                                    ) : (
                                        <><FileCheck className="w-5 h-5" /> Validate Geometry</>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || (!geometry && !geojsonInput)}
                                    className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <><TreePine className="w-5 h-5" /> Analyze Deforestation</>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={handleClear}
                                className="py-3 px-4 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 flex items-center gap-2">
                                <XCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Results */}
                    <div className="space-y-4">
                        {activeTab === 'geometry' ? (
                            <GeometryResults result={validationResult} />
                        ) : (
                            <DeforestationResults result={deforestationResult} getRiskColors={getRiskColors} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Geometry Results Component
function GeometryResults({ result }: { result: ValidationResult | null }) {
    if (!result) {
        return (
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Globe className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400">Draw or paste geometry to validate</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status */}
            <div className={`p-4 rounded-xl border ${result.is_valid ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
                <div className="flex items-center gap-3">
                    {result.is_valid ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : <XCircle className="w-8 h-8 text-red-400" />}
                    <div>
                        <p className={`font-semibold ${result.is_valid ? 'text-emerald-300' : 'text-red-300'}`}>
                            {result.is_valid ? 'EUDR Compliant ✓' : 'Validation Failed'}
                        </p>
                        <p className="text-sm text-gray-400">
                            {result.is_valid ? 'Geometry meets TRACES NT requirements' : `${result.errors.length} error(s) found`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Area Info */}
            {result.area_hectares && (
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-400">Plot Area</p>
                        <p className="text-xl font-semibold text-white">{result.area_hectares} ha</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className={`text-xl font-semibold ${result.plot_size_category === 'small' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {result.plot_size_category === 'small' ? '≤4 ha' : '>4 ha'}
                        </p>
                    </div>
                </div>
            )}

            {/* Errors */}
            {result.errors.map((err, i) => (
                <div key={i} className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <code className="text-red-300 text-sm">{err.code}</code>
                            <p className="text-gray-300 text-sm">{err.message}</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Fixes */}
            {result.fixes_applied.length > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
                    <h3 className="text-blue-400 font-medium mb-2">Auto-Fixes Applied</h3>
                    {result.fixes_applied.map((fix, i) => (
                        <div key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                            {fix.replace(/_/g, ' ')}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Deforestation Results Component
function DeforestationResults({ result, getRiskColors }: { result: DeforestationResult | null; getRiskColors: (level: string) => any }) {
    if (!result) {
        return (
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <TreePine className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400">Select a plot to analyze deforestation risk</p>
            </div>
        );
    }

    const colors = getRiskColors(result.risk_level);

    return (
        <div className="space-y-4">
            {/* Risk Score Header */}
            <div className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {result.is_compliant ? (
                            <Shield className="w-8 h-8 text-emerald-400" />
                        ) : (
                            <AlertOctagon className="w-8 h-8 text-red-400" />
                        )}
                        <div>
                            <p className={`font-semibold ${colors.text}`}>
                                Risk: {result.risk_level.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-400">
                                {result.is_compliant ? 'EUDR Compliant' : 'Requires Investigation'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-3xl font-bold ${colors.text}`}>{result.risk_score}</p>
                        <p className="text-xs text-gray-400">/ 100</p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <p className="text-gray-300 text-sm">{result.summary}</p>
            </div>

            {/* Forest Cover */}
            {result.forest_cover && (
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-emerald-400" />
                        Forest Cover
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold text-white">{result.forest_cover.tree_cover_2020}%</p>
                            <p className="text-xs text-gray-400">2020 Baseline</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold text-white">{result.forest_cover.tree_cover_current}%</p>
                            <p className="text-xs text-gray-400">Current</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                                <TrendingDown className="w-4 h-4" />
                                {result.forest_cover.tree_cover_loss_ha} ha
                            </p>
                            <p className="text-xs text-gray-400">Loss</p>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 bg-emerald-900/50 text-emerald-300 text-xs rounded">{result.forest_cover.biome}</span>
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">{result.forest_cover.forest_type}</span>
                    </div>
                </div>
            )}

            {/* Alerts */}
            {result.alerts.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-amber-400 font-medium">🚨 Alerts Detected</h3>
                    {result.alerts.map((alert, i) => (
                        <div key={i} className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-amber-300 text-sm font-medium">
                                        {alert.alert_type.replace(/_/g, ' ')}
                                        <span className="ml-2 text-gray-400">({Math.round(alert.confidence * 100)}% confidence)</span>
                                    </p>
                                    <p className="text-gray-300 text-sm">{alert.description}</p>
                                    <p className="text-gray-500 text-xs mt-1">Source: {alert.source}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-2">📋 Recommendations</h3>
                    <ul className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-emerald-400">•</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Data Sources */}
            <div className="text-xs text-gray-500 text-center">
                Data: {result.data_sources.join(' • ')} | Cutoff: {result.cutoff_date}
            </div>
        </div>
    );
}
