"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    FileText,
    Code2,
    Zap,
    ArrowRight,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
    Upload,
    Download,
    RefreshCw,
    ChevronDown,
    ChevronRight,
    Cpu,
    Database,
    FileCode,
    Factory,
    Globe,
    Scale,
    Leaf,
    Play,
    Copy,
    Check,
} from "lucide-react";
import {
    classifyProduct,
    extractDocument,
    generateXML,
    downloadXML,
    processFullPipeline,
    checkHealth,
    downloadBlobAsFile,
    type ClassifyResponse,
    type ExtractResponse,
    type XMLGenerateResponse,
    type FullPipelineResponse,
    type HealthResponse,
} from "@/lib/cbam-api";

type TabType = "classifier" | "extractor" | "serializer" | "pipeline";

export default function CBAMEnginePage() {
    const [activeTab, setActiveTab] = useState<TabType>("pipeline");
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [healthLoading, setHealthLoading] = useState(true);

    // Classifier state
    const [classifyInput, setClassifyInput] = useState("");
    const [classifyResult, setClassifyResult] = useState<ClassifyResponse | null>(null);
    const [classifyLoading, setClassifyLoading] = useState(false);
    const [classifyError, setClassifyError] = useState("");

    // Extractor state
    const [extractFile, setExtractFile] = useState<File | null>(null);
    const [extractResult, setExtractResult] = useState<ExtractResponse | null>(null);
    const [extractLoading, setExtractLoading] = useState(false);
    const [extractError, setExtractError] = useState("");

    // Serializer state
    const [xmlForm, setXmlForm] = useState({
        year: new Date().getFullYear(),
        quarter: Math.ceil((new Date().getMonth() + 1) / 3),
        declarant_eori: "DE123456789012345",
        declarant_name: "",
        declarant_street: "",
        declarant_city: "",
        declarant_postal: "",
        declarant_country: "DE",
        cn_code: "",
        cn_description: "",
        cbam_category: "iron_steel",
        quantity_kg: 1000,
        country_of_origin: "IN",
        producer_id: "",
        producer_name: "",
        producer_country: "IN",
        direct_emissions: 0,
        indirect_emissions: 0,
    });
    const [xmlResult, setXmlResult] = useState<XMLGenerateResponse | null>(null);
    const [xmlLoading, setXmlLoading] = useState(false);
    const [xmlError, setXmlError] = useState("");

    // Pipeline state
    const [pipelineForm, setPipelineForm] = useState({
        product_description: "",
        declarant_eori: "DE123456789012345",
        declarant_name: "German Imports GmbH",
        declarant_country: "DE",
        quantity_kg: 10000,
        country_of_origin: "IN",
    });
    const [pipelineResult, setPipelineResult] = useState<FullPipelineResponse | null>(null);
    const [pipelineLoading, setPipelineLoading] = useState(false);
    const [pipelineError, setPipelineError] = useState("");

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadHealth();
    }, []);

    const loadHealth = async () => {
        setHealthLoading(true);
        try {
            const h = await checkHealth();
            setHealth(h);
        } catch (e) {
            console.error("Health check failed:", e);
        } finally {
            setHealthLoading(false);
        }
    };

    const handleClassify = async () => {
        if (!classifyInput.trim()) return;
        setClassifyLoading(true);
        setClassifyError("");
        setClassifyResult(null);
        try {
            const result = await classifyProduct({ product_description: classifyInput });
            setClassifyResult(result);
        } catch (e: any) {
            setClassifyError(e.message || "Classification failed");
        } finally {
            setClassifyLoading(false);
        }
    };

    const handleExtract = async () => {
        if (!extractFile) return;
        setExtractLoading(true);
        setExtractError("");
        setExtractResult(null);
        try {
            const result = await extractDocument(extractFile);
            setExtractResult(result);
        } catch (e: any) {
            setExtractError(e.message || "Extraction failed");
        } finally {
            setExtractLoading(false);
        }
    };

    const handleGenerateXML = async () => {
        setXmlLoading(true);
        setXmlError("");
        setXmlResult(null);
        try {
            const result = await generateXML(xmlForm as any);
            setXmlResult(result);
        } catch (e: any) {
            setXmlError(e.message || "XML generation failed");
        } finally {
            setXmlLoading(false);
        }
    };

    const handleDownloadXML = async () => {
        try {
            const blob = await downloadXML(xmlForm as any);
            downloadBlobAsFile(blob, `CBAM_Report_${xmlResult?.report_id || "report"}.xml`);
        } catch (e: any) {
            setXmlError(e.message || "Download failed");
        }
    };

    const handlePipeline = async () => {
        if (!pipelineForm.product_description.trim()) return;
        setPipelineLoading(true);
        setPipelineError("");
        setPipelineResult(null);
        try {
            const result = await processFullPipeline(pipelineForm);
            setPipelineResult(result);
            // Auto-populate XML form from pipeline result
            if (result.classification) {
                setXmlForm(prev => ({
                    ...prev,
                    cn_code: result.classification!.cn_code,
                    cn_description: result.classification!.cn_description,
                    cbam_category: result.classification!.cbam_category || "iron_steel",
                    direct_emissions: result.emissions?.direct_tco2 || 0,
                    indirect_emissions: result.emissions?.indirect_tco2 || 0,
                }));
            }
        } catch (e: any) {
            setPipelineError(e.message || "Pipeline failed");
        } finally {
            setPipelineLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: "pipeline", label: "Full Pipeline", icon: Zap },
        { id: "classifier", label: "Classifier", icon: Search },
        { id: "extractor", label: "Extractor", icon: FileText },
        { id: "serializer", label: "XML Generator", icon: Code2 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            ← Dashboard
                        </Link>
                        <div className="h-6 w-px bg-white/20" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <Cpu className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">CBAM ML Engine</h1>
                        </div>
                    </div>

                    {/* Health Status */}
                    <div className="flex items-center gap-4">
                        {healthLoading ? (
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : health ? (
                            <div className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${health.status === "healthy" ? "bg-emerald-500" : "bg-red-500"}`} />
                                <span className="text-gray-400">v{health.version}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <XCircle className="w-4 h-4" />
                                Backend offline
                            </div>
                        )}
                        <button onClick={loadHealth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Agent Status Cards */}
                {health && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <Database className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Classifier Agent</h3>
                                    <p className="text-xs text-gray-400">CN Code Classification</p>
                                </div>
                            </div>
                            <div className="text-sm text-emerald-400">
                                {health.agents.classifier.cache_enabled ? "Cache Enabled" : "No Cache"} • Ready
                            </div>
                        </div>

                        <div className="bg-slate-800/50 border border-violet-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Extractor Agent</h3>
                                    <p className="text-xs text-gray-400">Document Parsing</p>
                                </div>
                            </div>
                            <div className="text-sm text-violet-400">
                                Backend: {health.agents.extractor.backend} • Ready
                            </div>
                        </div>

                        <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <FileCode className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Serializer Agent</h3>
                                    <p className="text-xs text-gray-400">XML Generation</p>
                                </div>
                            </div>
                            <div className="text-sm text-blue-400">
                                Schema: {health.agents.serializer.schema_loaded ? "Loaded" : "Not loaded"} • Ready
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-emerald-500 text-black"
                                    : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden">

                    {/* Full Pipeline Tab */}
                    {activeTab === "pipeline" && (
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Full CBAM Pipeline</h2>
                                <p className="text-gray-400">
                                    Classify product → Calculate emissions → Generate XML in one step
                                </p>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Input Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Description *</label>
                                        <textarea
                                            value={pipelineForm.product_description}
                                            onChange={e => setPipelineForm(p => ({ ...p, product_description: e.target.value }))}
                                            placeholder="e.g., Hot-rolled steel coils, galvanized nuts and bolts, aluminum sheets..."
                                            className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Declarant EORI</label>
                                            <input
                                                type="text"
                                                value={pipelineForm.declarant_eori}
                                                onChange={e => setPipelineForm(p => ({ ...p, declarant_eori: e.target.value }))}
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Declarant Name</label>
                                            <input
                                                type="text"
                                                value={pipelineForm.declarant_name}
                                                onChange={e => setPipelineForm(p => ({ ...p, declarant_name: e.target.value }))}
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity (kg)</label>
                                            <input
                                                type="number"
                                                value={pipelineForm.quantity_kg}
                                                onChange={e => setPipelineForm(p => ({ ...p, quantity_kg: Number(e.target.value) }))}
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Origin Country</label>
                                            <input
                                                type="text"
                                                value={pipelineForm.country_of_origin}
                                                onChange={e => setPipelineForm(p => ({ ...p, country_of_origin: e.target.value }))}
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                                maxLength={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Declarant Country</label>
                                            <input
                                                type="text"
                                                value={pipelineForm.declarant_country}
                                                onChange={e => setPipelineForm(p => ({ ...p, declarant_country: e.target.value }))}
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                                maxLength={2}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePipeline}
                                        disabled={pipelineLoading || !pipelineForm.product_description.trim()}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold rounded-xl hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {pipelineLoading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                        ) : (
                                            <><Play className="w-5 h-5" /> Run Full Pipeline</>
                                        )}
                                    </button>

                                    {pipelineError && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                                            {pipelineError}
                                        </div>
                                    )}
                                </div>

                                {/* Results */}
                                <div className="space-y-4">
                                    {pipelineResult && (
                                        <>
                                            {/* Status */}
                                            <div className={`p-4 rounded-xl border ${pipelineResult.status === "success"
                                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                                    : "bg-amber-500/10 border-amber-500/30"
                                                }`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {pipelineResult.status === "success" ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                    )}
                                                    <span className={`font-semibold ${pipelineResult.status === "success" ? "text-emerald-400" : "text-amber-400"
                                                        }`}>
                                                        {pipelineResult.status === "success" ? "Pipeline Complete" : "Review Required"}
                                                    </span>
                                                </div>
                                                {pipelineResult.message && (
                                                    <p className="text-sm text-gray-400">{pipelineResult.message}</p>
                                                )}
                                            </div>

                                            {/* Classification */}
                                            {pipelineResult.classification && (
                                                <div className="p-4 bg-slate-900/50 rounded-xl">
                                                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                        <Search className="w-4 h-4 text-emerald-400" /> Classification
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">CN Code:</span>
                                                            <span className="font-mono text-emerald-400">{pipelineResult.classification.cn_code}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Confidence:</span>
                                                            <span className={`font-bold ${pipelineResult.classification.confidence >= 0.85 ? "text-emerald-400" : "text-amber-400"
                                                                }`}>
                                                                {(pipelineResult.classification.confidence * 100).toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">CBAM Category:</span>
                                                            <span className="text-white">{pipelineResult.classification.cbam_category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Emissions */}
                                            {pipelineResult.emissions && (
                                                <div className="p-4 bg-slate-900/50 rounded-xl">
                                                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                        <Leaf className="w-4 h-4 text-green-400" /> Emissions
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div>
                                                            <div className="text-2xl font-bold text-orange-400">
                                                                {pipelineResult.emissions.direct_tco2.toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-400">Direct tCO₂</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-blue-400">
                                                                {pipelineResult.emissions.indirect_tco2.toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-400">Indirect tCO₂</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-emerald-400">
                                                                {pipelineResult.emissions.total_tco2.toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-400">Total tCO₂</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* XML Preview */}
                                            {pipelineResult.xml && (
                                                <div className="p-4 bg-slate-900/50 rounded-xl">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-white flex items-center gap-2">
                                                            <Code2 className="w-4 h-4 text-blue-400" /> XML Preview
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            {pipelineResult.xml.is_valid ? (
                                                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Valid</span>
                                                            ) : (
                                                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Invalid</span>
                                                            )}
                                                            <button
                                                                onClick={() => copyToClipboard(pipelineResult.xml?.preview || "")}
                                                                className="p-1 hover:bg-white/10 rounded"
                                                            >
                                                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <pre className="text-xs text-gray-400 overflow-x-auto bg-black/30 p-3 rounded-lg max-h-[200px] overflow-y-auto">
                                                        {pipelineResult.xml.preview}
                                                    </pre>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Classifier Tab */}
                    {activeTab === "classifier" && (
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">CN Code Classifier</h2>
                                <p className="text-gray-400">
                                    Enter a product description to get the EU Combined Nomenclature code
                                </p>
                            </div>

                            <div className="flex gap-4 mb-6">
                                <input
                                    type="text"
                                    value={classifyInput}
                                    onChange={e => setClassifyInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleClassify()}
                                    placeholder="e.g., steel screws, aluminum sheets, cement, urea fertilizer..."
                                    className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                                <button
                                    onClick={handleClassify}
                                    disabled={classifyLoading || !classifyInput.trim()}
                                    className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {classifyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                </button>
                            </div>

                            {classifyError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
                                    {classifyError}
                                </div>
                            )}

                            {classifyResult && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="bg-slate-900/50 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white">Classification Result</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classifyResult.review_status === "approved"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-amber-500/20 text-amber-400"
                                                }`}>
                                                {classifyResult.review_status === "approved" ? "Approved" : "Needs Review"}
                                            </span>
                                        </div>

                                        <div className="text-4xl font-mono font-bold text-emerald-400 mb-2">
                                            {classifyResult.cn_code_formatted}
                                        </div>
                                        <p className="text-gray-400 mb-4">{classifyResult.cn_description}</p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Confidence:</span>
                                                <span className="font-bold text-white">{(classifyResult.confidence * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Chapter:</span>
                                                <span className="text-white">{classifyResult.chapter} - {classifyResult.chapter_description}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">CBAM Relevant:</span>
                                                <span className={classifyResult.is_cbam_relevant ? "text-emerald-400" : "text-gray-400"}>
                                                    {classifyResult.is_cbam_relevant ? "Yes" : "No"}
                                                </span>
                                            </div>
                                            {classifyResult.cbam_category && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Category:</span>
                                                    <span className="text-white capitalize">{classifyResult.cbam_category.replace("_", " ")}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {classifyResult.emission_factor && (
                                        <div className="bg-slate-900/50 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Default Emission Factors</h3>
                                            <div className="space-y-4">
                                                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-orange-400">
                                                        {classifyResult.emission_factor.direct_tco2_per_tonne} tCO₂/t
                                                    </div>
                                                    <div className="text-sm text-gray-400">Direct Emissions</div>
                                                </div>
                                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-400">
                                                        {classifyResult.emission_factor.indirect_tco2_per_tonne} tCO₂/t
                                                    </div>
                                                    <div className="text-sm text-gray-400">Indirect Emissions</div>
                                                </div>
                                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-yellow-400">
                                                        {classifyResult.emission_factor.electricity_mwh_per_tonne} MWh/t
                                                    </div>
                                                    <div className="text-sm text-gray-400">Electricity Consumption</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Extractor Tab */}
                    {activeTab === "extractor" && (
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Document Extractor</h2>
                                <p className="text-gray-400">
                                    Upload electricity bills or mill certificates to extract CBAM data
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl mb-6 hover:border-violet-500/50 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={e => setExtractFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer text-center">
                                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-white font-medium mb-1">
                                        {extractFile ? extractFile.name : "Click to upload PDF"}
                                    </p>
                                    <p className="text-sm text-gray-500">Electricity bills, Mill Test Certificates</p>
                                </label>
                            </div>

                            <button
                                onClick={handleExtract}
                                disabled={extractLoading || !extractFile}
                                className="w-full px-6 py-3 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                            >
                                {extractLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Extracting...</>
                                ) : (
                                    <><FileText className="w-5 h-5 inline mr-2" /> Extract Data</>
                                )}
                            </button>

                            {extractError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
                                    {extractError}
                                </div>
                            )}

                            {extractResult && (
                                <div className="bg-slate-900/50 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">Extracted Data</h3>
                                        <span className="text-sm text-gray-400">Method: {extractResult.extraction_method}</span>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        {extractResult.document_type && (
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <div className="text-sm text-gray-500">Document Type</div>
                                                <div className="text-white capitalize">{extractResult.document_type.replace("_", " ")}</div>
                                            </div>
                                        )}
                                        {extractResult.electricity_consumption_mwh && (
                                            <div className="p-3 bg-yellow-500/10 rounded-lg">
                                                <div className="text-sm text-gray-500">Electricity</div>
                                                <div className="text-yellow-400 font-bold">{extractResult.electricity_consumption_mwh} MWh</div>
                                            </div>
                                        )}
                                        {extractResult.gross_weight_kg && (
                                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                                <div className="text-sm text-gray-500">Weight</div>
                                                <div className="text-blue-400 font-bold">{(extractResult.gross_weight_kg / 1000).toFixed(2)} tonnes</div>
                                            </div>
                                        )}
                                        {extractResult.country_of_origin && (
                                            <div className="p-3 bg-emerald-500/10 rounded-lg">
                                                <div className="text-sm text-gray-500">Origin</div>
                                                <div className="text-emerald-400 font-bold">{extractResult.country_of_origin}</div>
                                            </div>
                                        )}
                                        {extractResult.producer_name && (
                                            <div className="p-3 bg-white/5 rounded-lg md:col-span-2">
                                                <div className="text-sm text-gray-500">Producer</div>
                                                <div className="text-white">{extractResult.producer_name}</div>
                                            </div>
                                        )}
                                    </div>

                                    {extractResult.warnings.length > 0 && (
                                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                            <div className="text-sm font-medium text-amber-400 mb-1">Warnings</div>
                                            <ul className="text-sm text-gray-400 list-disc list-inside">
                                                {extractResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Serializer Tab */}
                    {activeTab === "serializer" && (
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">CBAM XML Generator</h2>
                                <p className="text-gray-400">
                                    Generate EU-compliant CBAM quarterly reports
                                </p>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Form */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Year</label>
                                            <input
                                                type="number"
                                                value={xmlForm.year}
                                                onChange={e => setXmlForm(f => ({ ...f, year: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Quarter</label>
                                            <select
                                                value={xmlForm.quarter}
                                                onChange={e => setXmlForm(f => ({ ...f, quarter: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            >
                                                <option value={1}>Q1</option>
                                                <option value={2}>Q2</option>
                                                <option value={3}>Q3</option>
                                                <option value={4}>Q4</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">CN Code</label>
                                        <input
                                            type="text"
                                            value={xmlForm.cn_code}
                                            onChange={e => setXmlForm(f => ({ ...f, cn_code: e.target.value }))}
                                            placeholder="e.g., 72085191"
                                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={xmlForm.cn_description}
                                            onChange={e => setXmlForm(f => ({ ...f, cn_description: e.target.value }))}
                                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Direct Emissions (tCO₂)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={xmlForm.direct_emissions}
                                                onChange={e => setXmlForm(f => ({ ...f, direct_emissions: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Indirect Emissions (tCO₂)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={xmlForm.indirect_emissions}
                                                onChange={e => setXmlForm(f => ({ ...f, indirect_emissions: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleGenerateXML}
                                            disabled={xmlLoading}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 disabled:opacity-50"
                                        >
                                            {xmlLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Generate XML"}
                                        </button>
                                        {xmlResult && (
                                            <button
                                                onClick={handleDownloadXML}
                                                className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div>
                                    {xmlError && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-4">
                                            {xmlError}
                                        </div>
                                    )}

                                    {xmlResult && (
                                        <div className="bg-slate-900/50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-semibold text-white">XML Preview</span>
                                                <span className={`text-sm px-2 py-1 rounded ${xmlResult.is_valid ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                                    }`}>
                                                    {xmlResult.is_valid ? "Valid" : "Invalid"}
                                                </span>
                                            </div>
                                            <pre className="text-xs text-gray-400 overflow-auto bg-black/30 p-3 rounded-lg max-h-[400px]">
                                                {xmlResult.xml_preview}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
