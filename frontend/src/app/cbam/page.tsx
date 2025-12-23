'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    FileText,
    Plus,
    Download,
    Trash2,
    ArrowLeft,
    Factory,
    Leaf,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    Upload,
    Sparkles,
    Eye,
    X,
    FileCheck,
    AlertCircle,
    ChevronRight,
    Loader2,
    Package,
    RefreshCw
} from 'lucide-react';

interface CBAMReport {
    id: string;
    report_number: string;
    hs_code: string;
    cn_code?: string;
    product_description: string;
    cbam_category: string;
    quantity: number;
    quantity_unit: string;
    net_weight_kg: number;
    direct_emissions: number;
    indirect_emissions: number;
    total_emissions: number;
    country_of_origin: string;
    reporting_period: string;
    status: string;
    estimated_cbam_cost?: number;
    created_at: string;
}

interface ExtractedData {
    invoice_number?: string;
    invoice_date?: string;
    supplier_name?: string;
    buyer_name?: string;
    hs_code?: string;
    product_description?: string;
    quantity?: number;
    quantity_unit?: string;
    net_weight_kg?: number;
    total_value?: number;
    currency?: string;
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

const CBAM_CATEGORIES = {
    iron_steel: { name: 'Iron & Steel', icon: Factory, color: 'from-slate-500 to-slate-700', emission_factor: 1.85 },
    aluminium: { name: 'Aluminium', icon: Factory, color: 'from-blue-500 to-blue-700', emission_factor: 8.7 },
    cement: { name: 'Cement', icon: Factory, color: 'from-amber-500 to-amber-700', emission_factor: 0.79 },
    fertilisers: { name: 'Fertilizers', icon: Leaf, color: 'from-green-500 to-green-700', emission_factor: 2.7 },
};

// EU CBAM Validation Rules
const validateCBAMData = (data: any): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields check
    if (!data.hs_code || data.hs_code.length < 6) {
        errors.push("HS code must be at least 6 digits");
    }
    if (!data.product_description || data.product_description.length < 5) {
        errors.push("Product description is required (min 5 characters)");
    }
    if (!data.net_weight_kg || data.net_weight_kg <= 0) {
        errors.push("Net weight must be greater than 0");
    }
    if (!data.cbam_category) {
        errors.push("CBAM category is required");
    }
    if (!data.reporting_period) {
        errors.push("Reporting period is required");
    }

    // EU-specific validations
    if (data.country_of_origin && !['IN', 'CN', 'TR', 'RU', 'UA', 'BY', 'EG', 'ZA'].includes(data.country_of_origin)) {
        warnings.push("Uncommon origin country - verify if CBAM applies");
    }

    // HS code category validation
    const hsPrefix = data.hs_code?.slice(0, 2);
    const categoryValidation: Record<string, string[]> = {
        iron_steel: ['72', '73'],
        aluminium: ['76'],
        cement: ['25'],
        fertilisers: ['28', '31'],
    };

    if (data.cbam_category && hsPrefix && categoryValidation[data.cbam_category]) {
        if (!categoryValidation[data.cbam_category].includes(hsPrefix)) {
            warnings.push(`HS code ${hsPrefix}xx may not match category ${CBAM_CATEGORIES[data.cbam_category as keyof typeof CBAM_CATEGORIES]?.name}`);
        }
    }

    // Emission threshold warning
    const factor = CBAM_CATEGORIES[data.cbam_category as keyof typeof CBAM_CATEGORIES]?.emission_factor || 1;
    const estimatedEmissions = (data.net_weight_kg || 0) * factor;
    if (estimatedEmissions > 10000) {
        warnings.push(`High emissions estimated (${(estimatedEmissions / 1000).toFixed(1)} tCO₂e) - may require detailed verification`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
};

export default function CBAMDashboard() {
    const [reports, setReports] = useState<CBAMReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'reports' | 'upload'>('reports');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [previewReport, setPreviewReport] = useState<CBAMReport | null>(null);
    const [xmlPreview, setXmlPreview] = useState<string>('');

    // Multi-select for merge
    const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
    const [merging, setMerging] = useState(false);
    const [mergedResult, setMergedResult] = useState<any>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/cbam/');
            const data = await res.json();
            setReports(data.reports || []);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadXML = async (reportId: string, reportNumber: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/cbam/${reportId}/xml`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportNumber}.xml`;
            a.click();
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const downloadZIP = async (reportId: string, reportNumber: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/cbam/${reportId}/zip`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportNumber}_package.zip`;
            a.click();
        } catch (error) {
            console.error('ZIP download failed:', error);
        }
    };

    const previewXML = async (report: CBAMReport) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/cbam/${report.id}/xml`);
            const xml = await res.text();
            setXmlPreview(xml);
            setPreviewReport(report);
        } catch (error) {
            console.error('Preview failed:', error);
        }
    };

    const deleteReport = async (reportId: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return;
        try {
            await fetch(`http://localhost:8000/api/v1/cbam/${reportId}`, { method: 'DELETE' });
            setReports(reports.filter(r => r.id !== reportId));
            selectedReports.delete(reportId);
            setSelectedReports(new Set(selectedReports));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    // Toggle report selection for merge
    const toggleSelection = (reportId: string) => {
        const newSelected = new Set(selectedReports);
        if (newSelected.has(reportId)) {
            newSelected.delete(reportId);
        } else {
            newSelected.add(reportId);
        }
        setSelectedReports(newSelected);
    };

    // Select/deselect all reports
    const toggleSelectAll = () => {
        if (selectedReports.size === filteredReports.length) {
            setSelectedReports(new Set());
        } else {
            setSelectedReports(new Set(filteredReports.map(r => r.id)));
        }
    };

    // Merge selected reports
    const mergeSelectedReports = async () => {
        if (selectedReports.size < 2) {
            alert('Select at least 2 reports to merge');
            return;
        }

        setMerging(true);
        try {
            const res = await fetch('http://localhost:8000/api/v1/cbam/merge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ report_ids: Array.from(selectedReports) }),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(`Merge failed: ${error.detail}`);
                return;
            }

            const merged = await res.json();
            setMergedResult(merged);
            setSelectedReports(new Set());
        } catch (error) {
            console.error('Merge failed:', error);
            alert('Failed to merge reports');
        } finally {
            setMerging(false);
        }
    };

    // Download merged report
    const downloadMergedXML = async (mergedId: string, reportNumber: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/cbam/merged/${mergedId}/xml`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportNumber}.xml`;
            a.click();
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const downloadMergedPackage = async (mergedId: string, reportNumber: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/cbam/merged/${mergedId}/package`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportNumber}_package.zip`;
            a.click();
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.product_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.hs_code.includes(searchQuery) ||
            report.report_number.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || report.cbam_category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Calculate stats
    const totalEmissions = reports.reduce((sum, r) => sum + r.total_emissions, 0);
    const totalCost = reports.reduce((sum, r) => sum + (r.estimated_cbam_cost || 0), 0);
    const totalWeight = reports.reduce((sum, r) => sum + r.net_weight_kg, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">CBAM Reports</h1>
                            <p className="text-sm text-gray-400">Carbon Border Adjustment Mechanism</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Tab Switcher */}
                        <div className="flex bg-white/5 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'reports' ? 'bg-white text-slate-900' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FileText className="w-4 h-4 inline mr-2" />
                                Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white text-slate-900' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload Invoice
                            </button>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            New Report
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'upload' ? (
                    <InvoiceUploadSection onReportCreated={() => {
                        setActiveTab('reports');
                        fetchReports();
                    }} />
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-gray-400 text-sm">Total Reports</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{reports.length}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-gray-400 text-sm">Total Emissions</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{(totalEmissions / 1000).toFixed(1)}<span className="text-lg text-gray-400 ml-1">tCO₂e</span></p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <span className="text-gray-400 text-sm">Est. CBAM Cost</span>
                                </div>
                                <p className="text-3xl font-bold text-white">€{totalCost.toFixed(0)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                        <Factory className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <span className="text-gray-400 text-sm">Total Weight</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{(totalWeight / 1000).toFixed(1)}<span className="text-lg text-gray-400 ml-1">t</span></p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-gray-400 text-sm">Status</span>
                                </div>
                                <p className="text-xl font-bold text-emerald-400">EU Ready</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by product, HS code, or report number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${selectedCategory === 'all'
                                        ? 'bg-white text-slate-900'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                        }`}
                                >
                                    All
                                </button>
                                {Object.entries(CBAM_CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${selectedCategory === key
                                            ? 'bg-white text-slate-900'
                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Merge Action Bar */}
                        {reports.length > 1 && (
                            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedReports.size === filteredReports.length && filteredReports.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-5 h-5 rounded border-gray-600 bg-white/10 text-emerald-500 focus:ring-emerald-500/50"
                                        />
                                        <span className="text-gray-400 text-sm">Select All</span>
                                    </label>
                                    {selectedReports.size > 0 && (
                                        <span className="text-sm text-emerald-400">
                                            {selectedReports.size} selected
                                        </span>
                                    )}
                                </div>
                                {selectedReports.size >= 2 && (
                                    <button
                                        onClick={mergeSelectedReports}
                                        disabled={merging}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25"
                                    >
                                        {merging ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Merging...
                                            </>
                                        ) : (
                                            <>
                                                <Package className="w-4 h-4" />
                                                Merge {selectedReports.size} Reports
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Merged Result Banner */}
                        {mergedResult && (
                            <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl p-5 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            Merged: {mergedResult.report_number}
                                        </h3>
                                        <p className="text-sm text-gray-400">{mergedResult.goods_count} goods • {(mergedResult.total_emissions / 1000).toFixed(2)} tCO₂e • €{mergedResult.total_cbam_cost?.toFixed(2)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={async () => {
                                            try {
                                                const res = await fetch(`http://localhost:8000/api/v1/cbam/merged/${mergedResult.id}/xml`);
                                                const xml = await res.text();
                                                setXmlPreview(xml);
                                                setPreviewReport({ ...mergedResult, product_description: `Merged: ${mergedResult.goods_count} goods` } as any);
                                            } catch (e) { console.error(e); }
                                        }} className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30">
                                            <Eye className="w-4 h-4 inline mr-1" /> View
                                        </button>
                                        <button onClick={() => downloadMergedXML(mergedResult.id, mergedResult.report_number)} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30">
                                            <Download className="w-4 h-4 inline mr-1" /> XML
                                        </button>
                                        <button onClick={() => downloadMergedPackage(mergedResult.id, mergedResult.report_number)} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                                            <Package className="w-4 h-4 inline mr-1" /> ZIP
                                        </button>
                                        <button onClick={() => setMergedResult(null)} className="p-2 text-gray-400 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reports List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No CBAM Reports Yet</h3>
                                <p className="text-gray-400 mb-6">Upload an invoice or create a report manually</p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500/20 text-violet-400 rounded-lg font-medium hover:bg-violet-500/30 transition-all"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Invoice
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Manually
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredReports.map((report) => {
                                    const category = CBAM_CATEGORIES[report.cbam_category as keyof typeof CBAM_CATEGORIES] || CBAM_CATEGORIES.iron_steel;
                                    const CategoryIcon = category.icon;

                                    return (
                                        <div
                                            key={report.id}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Selection Checkbox */}
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.has(report.id)}
                                                        onChange={() => toggleSelection(report.id)}
                                                        className="w-5 h-5 mt-3 rounded border-gray-600 bg-white/10 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer"
                                                    />
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                                                        <CategoryIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-semibold text-white">{report.product_description}</h3>
                                                            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
                                                                {report.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                                                            <span>HS: {report.hs_code}</span>
                                                            <span>•</span>
                                                            <span>{report.report_number}</span>
                                                            <span>•</span>
                                                            <span>{report.reporting_period}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-white">{(report.total_emissions / 1000).toFixed(2)} <span className="text-sm text-gray-400">tCO₂e</span></p>
                                                        <p className="text-sm text-amber-400">€{report.estimated_cbam_cost?.toFixed(2) || '0'} est.</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => previewXML(report)}
                                                            className="p-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors"
                                                            title="Preview XML"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => downloadXML(report.id, report.report_number)}
                                                            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                                                            title="Download XML"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => downloadZIP(report.id, report.report_number)}
                                                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                            title="Download ZIP Package"
                                                        >
                                                            <Package className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteReport(report.id)}
                                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Emissions Breakdown */}
                                            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Net Weight</p>
                                                    <p className="text-sm font-medium text-white">{report.net_weight_kg.toLocaleString()} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Direct Emissions</p>
                                                    <p className="text-sm font-medium text-white">{report.direct_emissions.toFixed(1)} kgCO₂e</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Indirect Emissions</p>
                                                    <p className="text-sm font-medium text-white">{report.indirect_emissions.toFixed(1)} kgCO₂e</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Origin</p>
                                                    <p className="text-sm font-medium text-white">{report.country_of_origin}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Create Report Modal */}
            {showCreateModal && (
                <CreateReportModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchReports();
                    }}
                />
            )}

            {/* XML Preview Modal */}
            {previewReport && (
                <XMLPreviewModal
                    report={previewReport}
                    xml={xmlPreview}
                    onClose={() => {
                        setPreviewReport(null);
                        setXmlPreview('');
                    }}
                    onDownload={() => downloadXML(previewReport.id, previewReport.report_number)}
                />
            )}
        </div>
    );
}

// Invoice Upload Section
function InvoiceUploadSection({ onReportCreated }: { onReportCreated: () => void }) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [step, setStep] = useState<'upload' | 'review' | 'create'>('upload');

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFile = async (file: File) => {
        setUploadedFile(file);
        setUploading(true);

        try {
            // Upload file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('document_type', 'invoice');

            const uploadRes = await fetch('http://localhost:8000/api/v1/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Upload failed');

            const uploadData = await uploadRes.json();
            setUploading(false);
            setExtracting(true);

            // Extract data
            const extractRes = await fetch(`http://localhost:8000/api/v1/documents/${uploadData.id}/extract`, {
                method: 'POST',
            });

            if (!extractRes.ok) throw new Error('Extraction failed');

            const data = await extractRes.json();
            setExtractedData(data);
            setStep('review');

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process document');
        } finally {
            setUploading(false);
            setExtracting(false);
        }
    };

    const handleValidate = () => {
        if (!extractedData) return;

        const formData = {
            hs_code: extractedData.hs_code || '',
            product_description: extractedData.product_description || '',
            net_weight_kg: extractedData.net_weight_kg || 0,
            cbam_category: detectCategory(extractedData.hs_code || ''),
            reporting_period: '2024-Q4',
            country_of_origin: 'IN',
        };

        const result = validateCBAMData(formData);
        setValidation(result);
        setStep('create');
    };

    const detectCategory = (hsCode: string): string => {
        const prefix = hsCode.slice(0, 2);
        if (['72', '73'].includes(prefix)) return 'iron_steel';
        if (prefix === '76') return 'aluminium';
        if (prefix === '25') return 'cement';
        if (['28', '31'].includes(prefix)) return 'fertilisers';
        return 'iron_steel';
    };

    const handleCreateReport = async () => {
        if (!extractedData) return;

        const category = detectCategory(extractedData.hs_code || '');

        try {
            const params = new URLSearchParams({
                hs_code: extractedData.hs_code || '73181500',
                product_description: extractedData.product_description || 'Imported goods',
                cbam_category: category,
                net_weight_kg: String(extractedData.net_weight_kg || 1000),
                quantity: String(extractedData.quantity || extractedData.net_weight_kg || 1000),
                quantity_unit: extractedData.quantity_unit || 'KGS',
                country_of_origin: 'IN',
                reporting_period: '2024-Q4',
            });

            const res = await fetch(`http://localhost:8000/api/v1/cbam/simple?${params.toString()}`, {
                method: 'POST',
            });

            if (res.ok) {
                onReportCreated();
            } else {
                throw new Error('Failed to create report');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create report');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-emerald-500' : 'bg-white/10'}`}>
                            <Upload className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Upload</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                    <div className={`flex items-center gap-2 ${step === 'review' ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-emerald-500' : 'bg-white/10'}`}>
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">AI Extract</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                    <div className={`flex items-center gap-2 ${step === 'create' ? 'text-emerald-400' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'create' ? 'bg-emerald-500' : 'bg-white/10'}`}>
                            <FileCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Validate & Create</span>
                    </div>
                </div>
            </div>

            {step === 'upload' && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all ${dragActive
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                >
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploading || extracting ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {uploading ? 'Uploading...' : 'AI Extracting Data...'}
                            </h3>
                            <p className="text-gray-400">This may take a few seconds</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                                <Upload className="w-10 h-10 text-violet-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Upload Invoice</h3>
                            <p className="text-gray-400 mb-4">Drag & drop or click to select</p>
                            <p className="text-sm text-gray-500">PDF, PNG, JPG • Max 10MB</p>
                        </div>
                    )}
                </div>
            )}

            {step === 'review' && extractedData && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">AI Extracted Data</h3>
                            <p className="text-sm text-gray-400">Review and confirm the extracted information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {extractedData.invoice_number && (
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Invoice Number</p>
                                <p className="text-white font-medium">{extractedData.invoice_number}</p>
                            </div>
                        )}
                        {extractedData.hs_code && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                                <p className="text-xs text-emerald-400 mb-1">HS Code ✓</p>
                                <p className="text-white font-medium">{extractedData.hs_code}</p>
                            </div>
                        )}
                        {extractedData.product_description && (
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Product</p>
                                <p className="text-white font-medium">{extractedData.product_description}</p>
                            </div>
                        )}
                        {extractedData.net_weight_kg && (
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Net Weight</p>
                                <p className="text-white font-medium">{extractedData.net_weight_kg.toLocaleString()} kg</p>
                            </div>
                        )}
                        {extractedData.total_value && (
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Total Value</p>
                                <p className="text-white font-medium">{extractedData.currency} {extractedData.total_value.toLocaleString()}</p>
                            </div>
                        )}
                        {extractedData.supplier_name && (
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs text-gray-500 mb-1">Supplier</p>
                                <p className="text-white font-medium">{extractedData.supplier_name}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleValidate}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                    >
                        Validate for CBAM →
                    </button>
                </div>
            )}

            {step === 'create' && validation && (
                <div className="space-y-6">
                    {/* Validation Results */}
                    <div className={`border rounded-2xl p-6 ${validation.valid
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="flex items-center gap-3 mb-4">
                            {validation.valid ? (
                                <>
                                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                                    <h3 className="text-lg font-semibold text-emerald-400">EU Validation Passed</h3>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                    <h3 className="text-lg font-semibold text-red-400">Validation Issues</h3>
                                </>
                            )}
                        </div>

                        {validation.errors.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-red-400 mb-2">Errors:</p>
                                <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                                    {validation.errors.map((error, i) => (
                                        <li key={i}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {validation.warnings.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-amber-400 mb-2">Warnings:</p>
                                <ul className="list-disc list-inside text-sm text-amber-300 space-y-1">
                                    {validation.warnings.map((warning, i) => (
                                        <li key={i}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleCreateReport}
                        disabled={!validation.valid}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        Generate CBAM Report & XML
                    </button>
                </div>
            )}
        </div>
    );
}

// Create Report Modal
function CreateReportModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [formData, setFormData] = useState({
        hs_code: '',
        product_description: '',
        cbam_category: 'iron_steel',
        quantity: '',
        quantity_unit: 'KGS',
        net_weight_kg: '',
        country_of_origin: 'IN',
        reporting_period: '2024-Q4',
    });

    const handleValidate = () => {
        const result = validateCBAMData({
            ...formData,
            quantity: parseFloat(formData.quantity) || 0,
            net_weight_kg: parseFloat(formData.net_weight_kg) || 0,
        });
        setValidation(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate first
        const result = validateCBAMData({
            ...formData,
            quantity: parseFloat(formData.quantity) || 0,
            net_weight_kg: parseFloat(formData.net_weight_kg) || 0,
        });

        if (!result.valid) {
            setValidation(result);
            return;
        }

        setLoading(true);

        try {
            // Use the simple endpoint with query parameters
            const params = new URLSearchParams({
                hs_code: formData.hs_code,
                product_description: formData.product_description,
                cbam_category: formData.cbam_category,
                net_weight_kg: formData.net_weight_kg,
                quantity: formData.quantity,
                quantity_unit: formData.quantity_unit,
                country_of_origin: formData.country_of_origin,
                reporting_period: formData.reporting_period,
            });

            const res = await fetch(`http://localhost:8000/api/v1/cbam/simple?${params.toString()}`, {
                method: 'POST',
            });

            if (res.ok) {
                onSuccess();
            } else {
                const error = await res.json();
                alert(error.detail || 'Failed to create report');
            }
        } catch (error) {
            console.error('Create failed:', error);
            alert('Failed to create report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Create CBAM Report</h2>
                        <p className="text-gray-400 mt-1">Generate an EU-compliant carbon emissions report</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* HS Code & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">HS Code *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., 73181500"
                                value={formData.hs_code}
                                onChange={(e) => setFormData({ ...formData, hs_code: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CBAM Category *</label>
                            <select
                                required
                                value={formData.cbam_category}
                                onChange={(e) => setFormData({ ...formData, cbam_category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                <option value="iron_steel">Iron & Steel</option>
                                <option value="aluminium">Aluminium</option>
                                <option value="cement">Cement</option>
                                <option value="fertilisers">Fertilizers</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Description *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Steel screws and bolts"
                            value={formData.product_description}
                            onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>

                    {/* Quantities */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="5000"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
                            <select
                                value={formData.quantity_unit}
                                onChange={(e) => setFormData({ ...formData, quantity_unit: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                <option value="KGS">Kilograms</option>
                                <option value="NOS">Numbers</option>
                                <option value="MTR">Meters</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Net Weight (kg) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="5000"
                                value={formData.net_weight_kg}
                                onChange={(e) => setFormData({ ...formData, net_weight_kg: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>

                    {/* Origin & Period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Country of Origin</label>
                            <select
                                value={formData.country_of_origin}
                                onChange={(e) => setFormData({ ...formData, country_of_origin: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                <option value="IN">India</option>
                                <option value="CN">China</option>
                                <option value="TR">Turkey</option>
                                <option value="RU">Russia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Reporting Period</label>
                            <select
                                value={formData.reporting_period}
                                onChange={(e) => setFormData({ ...formData, reporting_period: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                <option value="2024-Q4">2024 Q4</option>
                                <option value="2025-Q1">2025 Q1</option>
                                <option value="2025-Q2">2025 Q2</option>
                            </select>
                        </div>
                    </div>

                    {/* Validation Results */}
                    {validation && (
                        <div className={`border rounded-xl p-4 ${validation.valid
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                            }`}>
                            {validation.errors.length > 0 && (
                                <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
                                    {validation.errors.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            )}
                            {validation.warnings.length > 0 && (
                                <ul className="list-disc list-inside text-sm text-amber-400 space-y-1 mt-2">
                                    {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            )}
                            {validation.valid && validation.errors.length === 0 && (
                                <p className="text-emerald-400 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Ready for submission
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleValidate}
                            className="flex-1 px-6 py-3 bg-violet-500/20 text-violet-400 rounded-xl font-medium hover:bg-violet-500/30 transition-colors"
                        >
                            Validate
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            Create Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// XML Preview Modal
function XMLPreviewModal({
    report,
    xml,
    onClose,
    onDownload
}: {
    report: CBAMReport;
    xml: string;
    onClose: () => void;
    onDownload: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">XML Preview</h2>
                        <p className="text-sm text-gray-400">{report.report_number}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <pre className="text-sm text-gray-300 bg-black/30 rounded-xl p-4 overflow-x-auto font-mono whitespace-pre">
                        {xml}
                    </pre>
                </div>
            </div>
        </div>
    );
}
