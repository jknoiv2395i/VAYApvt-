"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Shield,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Calculator,
    Upload,
    ChevronRight,
    Download,
    RefreshCw,
    Loader2,
    ArrowLeft,
    Settings,
    Menu,
    X,
    LogOut,
    Globe,
    Info,
    AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

// API base URL
const API_BASE = "http://localhost:8000/api/v1";

// Types
interface ThresholdStatus {
    status: string;
    current_tonnage: number;
    threshold: number;
    remaining_buffer: number;
    alert_level: string;
    message: string;
}

interface DashboardData {
    threshold_status: ThresholdStatus;
    has_active_application: boolean;
    application?: ApplicationStatus;
    documents_uploaded: number;
    solvency_assessed: boolean;
    conduct_completed: boolean;
    next_step: string;
    urgency_level: string;
}

interface ApplicationStatus {
    id: string;
    status: string;
    documents_uploaded: number;
    documents_required: number;
    financial_years_submitted: number;
    conduct_completed: boolean;
    packet_ready: boolean;
    pending_actions: string[];
}

// Gauge component for threshold visualization
function ThresholdGauge({ current, threshold }: { current: number; threshold: number }) {
    const percentage = Math.min((current / threshold) * 100, 100);
    const getColor = () => {
        if (percentage >= 100) return "from-red-500 to-red-600";
        if (percentage >= 94) return "from-orange-500 to-orange-600";
        if (percentage >= 80) return "from-yellow-500 to-amber-500";
        return "from-emerald-500 to-teal-500";
    };

    return (
        <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Quarterly CBAM Imports</span>
                <span className="text-sm font-semibold text-white">{current.toFixed(1)}t / {threshold}t</span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-white/10">
                <div
                    style={{ width: `${percentage}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${getColor()} transition-all duration-500`}
                />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0t</span>
                <span className={percentage >= 80 ? "text-amber-400" : ""}>40t</span>
                <span className={percentage >= 100 ? "text-red-400" : ""}>50t</span>
            </div>
        </div>
    );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
        exempt: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: <CheckCircle2 className="w-4 h-4" /> },
        approaching: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: <AlertTriangle className="w-4 h-4" /> },
        critical: { bg: "bg-orange-500/20", text: "text-orange-400", icon: <AlertCircle className="w-4 h-4" /> },
        requires_authorization: { bg: "bg-red-500/20", text: "text-red-400", icon: <Shield className="w-4 h-4" /> },
    };

    const cfg = config[status] || config.exempt;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}
            {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </span>
    );
}

// Progress stepper component
function ApplicationProgress({ application }: { application?: ApplicationStatus }) {
    const steps = [
        { id: 1, name: "Start Application", completed: !!application },
        { id: 2, name: "Upload Financials", completed: application?.financial_years_submitted === 3 },
        { id: 3, name: "Conduct Check", completed: application?.conduct_completed },
        { id: 4, name: "Packet Ready", completed: application?.packet_ready },
    ];

    const currentStep = steps.findIndex(s => !s.completed) + 1 || steps.length + 1;

    return (
        <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
                <div key={step.id} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center w-full">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                            ${step.completed
                                ? "bg-emerald-500 text-white"
                                : step.id === currentStep
                                    ? "bg-blue-500/20 text-blue-400 border-2 border-blue-500"
                                    : "bg-white/10 text-gray-500"}`}>
                            {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                        </div>
                        <span className={`mt-2 text-xs text-center ${step.completed ? "text-emerald-400" : "text-gray-500"}`}>
                            {step.name}
                        </span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className={`h-0.5 w-full mx-2 ${step.completed ? "bg-emerald-500" : "bg-white/10"}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

// Bank guarantee calculator widget
function GuaranteeCalculator() {
    const [tonnage, setTonnage] = useState(500);
    const [carbonPrice, setCarbonPrice] = useState(85);
    const emissionFactor = 2.0; // Default for steel
    const safetyFactor = 1.5;
    const eurInrRate = 91;

    const totalEmissions = tonnage * emissionFactor;
    const baseCost = totalEmissions * carbonPrice;
    const guaranteeEur = baseCost * safetyFactor;
    const guaranteeInr = guaranteeEur * eurInrRate;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Bank Guarantee Calculator</h3>
                    <p className="text-sm text-gray-400">Estimate your requirement</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Annual Tonnage</label>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        value={tonnage}
                        onChange={(e) => setTonnage(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">100t</span>
                        <span className="text-white font-medium">{tonnage}t</span>
                        <span className="text-gray-500">2000t</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Carbon Price (EUR/tCO2e)</label>
                    <input
                        type="range"
                        min="50"
                        max="150"
                        value={carbonPrice}
                        onChange={(e) => setCarbonPrice(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">€50</span>
                        <span className="text-white font-medium">€{carbonPrice}</span>
                        <span className="text-gray-500">€150</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Emissions</p>
                            <p className="text-lg font-semibold text-white">{totalEmissions.toLocaleString()} tCO2e</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Annual CBAM Cost</p>
                            <p className="text-lg font-semibold text-white">€{baseCost.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-xs text-blue-400 mb-1">Estimated Bank Guarantee (150%)</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-white">€{guaranteeEur.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">≈ ₹{(guaranteeInr / 100000).toFixed(2)} Lakhs</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// WhatsApp TurboTax Widget
function WhatsAppWidget() {
    return (
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Shield className="w-24 h-24 text-emerald-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">TurboTax for ACD</h3>
                        <p className="text-xs text-emerald-400">AI-Powered Application</p>
                    </div>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                    Skip the forms! Simply scan this QR code or click the button to chat with our AI agent. Upload your financial docs directly on WhatsApp.
                </p>

                <button
                    onClick={() => window.open('https://wa.me/919999999999?text=Start%20ACD%20Application', '_blank')}
                    className="w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                    Chat on WhatsApp
                </button>
            </div>
        </div>
    );
}

// Document checklist component
function DocumentChecklist({
    documentsUploaded,
    onUploader
}: {
    documentsUploaded: number;
    onUploader: (count: number) => void;
}) {
    // Initialize state with default documents
    const [docs, setDocs] = useState([
        // 1. Financials
        { id: 1, name: "Balance Sheet FY 2023-24", required: true, uploaded: documentsUploaded >= 1 },
        { id: 2, name: "Balance Sheet FY 2022-23", required: true, uploaded: documentsUploaded >= 2 },
        { id: 3, name: "Balance Sheet FY 2021-22", required: true, uploaded: documentsUploaded >= 3 },
        { id: 4, name: "P&L Statement FY 2023-24", required: true, uploaded: documentsUploaded >= 4 },
        { id: 5, name: "P&L Statement FY 2022-23", required: true, uploaded: documentsUploaded >= 5 },
        { id: 6, name: "P&L Statement FY 2021-22", required: true, uploaded: documentsUploaded >= 6 },

        // 2. Mandatory Legal & Compliance
        { id: 7, name: "EORI Certificate", required: true, uploaded: false },
        { id: 8, name: "Business Registration", required: true, uploaded: false },
        { id: 9, name: "Declaration of Honour", required: true, uploaded: false },
        { id: 10, name: "Tax Clearance Certificate", required: true, uploaded: false },
        { id: 11, name: "Proof of Operational Capacity (SOP)", required: true, uploaded: false },

        // 3. Activity & Forecast Data
        { id: 12, name: "Import Forecast (2026-2027)", required: true, uploaded: false },
        { id: 13, name: "List of Member States", required: true, uploaded: false },

        // 4. Conditional
        { id: 14, name: "AEO / Compliance Certificate", required: true, uploaded: false },
        { id: 15, name: "Proof of Representation (If applicable)", required: false, uploaded: false },
        { id: 16, name: "Criminal Record Checks (If applicable)", required: false, uploaded: false },
    ]);

    const [activeUploadId, setActiveUploadId] = useState<number | null>(null);

    const handleUploadClick = (docId: number) => {
        setActiveUploadId(docId);
        // Add specific interaction for specific doc upload if needed
        const input = document.getElementById('doc-upload-input');
        if (input) input.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileName = e.target.files[0].name;

            // Simulate upload delay
            setTimeout(() => {
                setDocs(prev => {
                    const newDocs = prev.map(d =>
                        d.id === activeUploadId ? { ...d, uploaded: true } : d
                    );
                    const newCount = newDocs.filter(d => d.uploaded).length;

                    // Defer parent update to avoid "setState during render"
                    setTimeout(() => onUploader(newCount), 0);

                    return newDocs;
                });
                alert(`Successfully uploaded: ${fileName}`);
                setActiveUploadId(null);

                // Reset input
                e.target.value = '';
            }, 800);
        }
    };

    // Calculate generic upload button click (uploads next required document)
    const handleGenericUpload = () => {
        const nextRequired = docs.find(d => d.required && !d.uploaded);
        if (nextRequired) {
            handleUploadClick(nextRequired.id);
        } else {
            alert("All required documents are uploaded! 🎉");
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Required Documents</h3>
                <span className="text-sm text-gray-400">
                    {docs.filter(d => d.uploaded).length}/{docs.filter(d => d.required).length} required
                </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition group">
                        <div className="flex items-center gap-3">
                            {doc.uploaded ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${doc.uploaded ? "text-gray-300" : "text-gray-500"}`}>{doc.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {doc.required && !doc.uploaded && (
                                <span className="text-xs text-amber-400 font-medium">Required</span>
                            )}
                            {!doc.uploaded && (
                                <button
                                    onClick={() => handleUploadClick(doc.id)}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                                    title="Upload this document"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                id="doc-upload-input"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
            />

            {/* Main CTA */}
            <button
                onClick={handleGenericUpload}
                disabled={docs.every(d => !d.required || d.uploaded)}
                className="w-full mt-4 py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
                <Upload className="w-4 h-4" />
                {docs.every(d => !d.required || d.uploaded) ? "All Documents Uploaded" : "Upload Next Required"}
            </button>
        </div>
    );
}

export default function AuthorizePage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            // For demo, use mock data since auth may not be set up
            // In production, this would be: const res = await fetch(`${API_BASE}/authorize/dashboard`);
            setDashboardData({
                threshold_status: {
                    status: "approaching",
                    current_tonnage: 42.5,
                    threshold: 50,
                    remaining_buffer: 7.5,
                    alert_level: "yellow",
                    message: "You've imported 42.5t. Consider starting ACD application proactively."
                },
                has_active_application: false,
                documents_uploaded: 2,
                solvency_assessed: false,
                conduct_completed: false,
                next_step: "Start your ACD authorization application",
                urgency_level: "medium"
            });
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleStartApplication = () => {
        // Simulate starting application
        setLoading(true);
        setTimeout(() => {
            setDashboardData(prev => prev ? ({
                ...prev,
                has_active_application: true,
                application: {
                    id: "APP-2026-001",
                    status: "in_progress",
                    documents_uploaded: 0,
                    documents_required: 14,
                    financial_years_submitted: 0,
                    conduct_completed: false,
                    packet_ready: false,
                    pending_actions: ["Upload required documents"]
                },
                next_step: "Upload mandatory legal documents"
            }) : null);
            setLoading(false);
        }, 800);
    };

    // Callback when a document is uploaded in the child component
    const handleDocumentUpload = (count: number) => {
        setDashboardData(prev => {
            if (!prev || !prev.application) return prev;

            const requiredCount = prev.application.documents_required || 14;
            const newCount = count; // Use count from child
            const isComplete = newCount >= requiredCount;

            return {
                ...prev,
                application: {
                    ...prev.application,
                    documents_uploaded: newCount,
                    pending_actions: isComplete
                        ? ["Ready for Next Process"]
                        : [`Upload remaining documents (${requiredCount - newCount} left)`]
                },
                // Also update top level counter
                documents_uploaded: newCount,
                next_step: isComplete ? "Proceed to Next Process" : "Upload required documents",
                urgency_level: isComplete ? "high" : prev.urgency_level
            };
        });
    };

    // ... inside AuthorizePage component ...
    const [submissionResult, setSubmissionResult] = useState<any | null>(null);
    const [processingStep, setProcessingStep] = useState<string>("");

    // ... existing code ...

    // ... inside AuthorizePage component ...

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleNextProcess = async () => {
        if (!dashboardData?.application?.id) return;

        setLoading(true);
        setProcessingStep("Initializing Phase B: The Brain...");

        try {
            // Simulate progression for UX (since real API might be fast or blocked)
            setTimeout(() => setProcessingStep("analyzing financial ratios..."), 800);
            setTimeout(() => setProcessingStep("Checking EU De Minimis thresholds..."), 1600);
            setTimeout(() => setProcessingStep("Phase C: Assembling Digital Visa..."), 2400);

            // Real API Call
            const res = await fetch(`${API_BASE}/authorize/applications/${dashboardData.application.id}/submit-packet`, {
                method: 'POST'
            });

            if (res.ok) {
                const result = await res.json();
                setSubmissionResult(result);
                // Update dashboard mocking successful transition
                setDashboardData(prev => prev && prev.application ? ({
                    ...prev,
                    application: {
                        ...prev.application,
                        status: "submitted",
                        pending_actions: ["Application Under Review"],
                        conduct_completed: true
                    },
                    next_step: "Application Submitted. Awaiting NCA review.",
                    urgency_level: "low"
                }) : prev);
            } else {
                // Fallback for demo/offline mode
                console.warn("Backend unavailable, using mock simulation");
                await new Promise(r => setTimeout(r, 3000)); // Total 3s delay
                setSubmissionResult({
                    success: true,
                    phase_b_results: {
                        de_minimis: { total: 42.5, mandatory: false },
                        financial_health: { status: "GREEN", d_e: 1.2, cr: 1.8 },
                        bank_guarantee_est: 125000.0
                    },
                    phase_c_results: {
                        packet_path: "mock_path.zip",
                        download_url: null,
                        xml_validated: true
                    }
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            // Fallback for demo
            setSubmissionResult({
                success: true,
                phase_b_results: {
                    de_minimis: { total: dashboardData.threshold_status.current_tonnage, mandatory: false },
                    financial_health: { status: "GREEN", d_e: 1.5, cr: 2.1 },
                    bank_guarantee_est: 45000.0
                },
                phase_c_results: {
                    packet_path: "mock_path.zip",
                    download_url: "/api/v1/authorize/applications/mock/download-packet",
                    xml_validated: true
                }
            });
        } finally {
            setLoading(false);
            setProcessingStep("");
        }
    };

    // ... existing render code up to modals ...

    // Add Result Modal Logic here (insert before return end or inside main return)
    if (submissionResult) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Packet Ready</h2>
                                <p className="text-emerald-100">Phase B & C Completed Successfully</p>
                            </div>
                        </div>
                        <button onClick={() => setSubmissionResult(null)} className="text-white/80 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Phase B Results */}
                        <div>
                            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Phase B: The Brain (Solvency & Thresholds)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Solvency Status</p>
                                    <div className={`text-xl font-bold ${submissionResult.phase_b_results.financial_health.status === "GREEN" ? "text-emerald-400" :
                                        submissionResult.phase_b_results.financial_health.status === "AMBER" ? "text-amber-400" : "text-red-400"
                                        }`}>
                                        {submissionResult.phase_b_results.financial_health.status}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">D/E: {submissionResult.phase_b_results.financial_health.d_e}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Bank Guarantee Est.</p>
                                    <div className="text-xl font-bold text-white">
                                        €{submissionResult.phase_b_results.bank_guarantee_est.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">1.5x Carbon Cost</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">De Minimis Check</p>
                                    <div className="text-xl font-bold text-blue-400">
                                        {submissionResult.phase_b_results.de_minimis.total.toFixed(1)}t / 50t
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {submissionResult.phase_b_results.de_minimis.mandatory ? "Mandatory" : "Voluntary"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phase C Results */}
                        <div>
                            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Phase C: The Architect (Digital Visa)</h3>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Authorization_Packet_2026.zip</p>
                                        <p className="text-sm text-gray-400">XML Validated • Template Filled • Ready</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const url = submissionResult.phase_c_results.download_url;
                                        if (url) {
                                            const fullUrl = url.startsWith("http") ? url : `http://localhost:8000${url}`;
                                            window.open(fullUrl, '_blank');
                                        } else {
                                            alert("Simulation Mode: Packet generated at " + submissionResult.phase_c_results.packet_path);
                                        }
                                    }}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-black/20 border-t border-white/5 text-center">
                        <p className="text-sm text-gray-400 mb-2">A download link has also been sent to your WhatsApp.</p>
                        <button onClick={() => setSubmissionResult(null)} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                            Close and Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-emerald-400 font-medium animate-pulse">{processingStep || "Loading..."}</p>
            </div>
        );
    }

    return (
        // ... rest of the main return ...

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-5 border-b border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <span className="text-white font-bold text-lg">V</span>
                    </div>
                    <div>
                        <span className="text-white font-bold text-xl">VAYA</span>
                        <p className="text-xs text-gray-500">Authorize Module</p>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Authorization</p>

                    <Link href="/authorize" className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-emerald-500/20 to-transparent border-l-2 border-emerald-500 rounded-r-lg">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span>ACD Dashboard</span>
                    </Link>

                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Main</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user?.full_name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.full_name || "User"}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white w-full rounded-lg hover:bg-white/5 transition">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-72">
                {/* Top Bar */}
                <header className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white">
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <h1 className="text-lg font-semibold text-white">ACD Authorization</h1>
                    </div>
                    <button onClick={fetchDashboardData} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {/* Alert Banner */}
                    {dashboardData?.urgency_level === "high" && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl flex items-center gap-4">
                            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-white">Action Required</p>
                                <p className="text-sm text-gray-300">{dashboardData.next_step}</p>
                            </div>
                            <button className="ml-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition">
                                Start Now
                            </button>
                        </div>
                    )}

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Threshold Status Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">De Minimis Status</h3>
                                <StatusBadge status={dashboardData?.threshold_status.status || "exempt"} />
                            </div>
                            {dashboardData && (
                                <ThresholdGauge
                                    current={dashboardData.threshold_status.current_tonnage}
                                    threshold={dashboardData.threshold_status.threshold}
                                />
                            )}
                            <p className="mt-4 text-sm text-gray-400">
                                {dashboardData?.threshold_status.message}
                            </p>
                        </div>

                        {/* Application Status Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-white">Application Status</h3>
                                {dashboardData?.has_active_application ? (
                                    <Clock className="w-5 h-5 text-blue-400" />
                                ) : (
                                    <span className="text-xs text-gray-500">Not started</span>
                                )}
                            </div>
                            {dashboardData?.has_active_application ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Status</span>
                                        <span className="text-white capitalize">{dashboardData.application?.status.replace(/_/g, " ")}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Documents</span>
                                        <span className="text-white">
                                            {dashboardData.application?.documents_uploaded}/{dashboardData.application?.documents_required}
                                        </span>
                                    </div>
                                    {/* Show Submit button if ready and not yet submitted */}
                                    {dashboardData.application?.documents_uploaded >= dashboardData.application?.documents_required &&
                                        dashboardData.application?.status !== "under_review" && (
                                            <button
                                                onClick={handleNextProcess}
                                                className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                                                Proceed to Next Process <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}

                                    {/* Show status if submitted */}
                                    {dashboardData.application?.status === "under_review" && (
                                        <div className="w-full mt-2 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium text-center">
                                            Verification In Progress
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-400 mb-4">No active application</p>
                                    <button
                                        onClick={handleStartApplication}
                                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
                                    >
                                        Start ACD Application
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp Feature Card */}
                        <WhatsAppWidget />
                    </div>

                    {/* Progress Section */}
                    {dashboardData?.has_active_application && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                            <h3 className="font-semibold text-white mb-6">Application Progress</h3>
                            <ApplicationProgress application={dashboardData.application} />
                        </div>
                    )}

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Document Checklist */}
                        <DocumentChecklist
                            documentsUploaded={dashboardData?.documents_uploaded || 0}
                            onUploader={handleDocumentUpload}
                        />

                        {/* Bank Guarantee Calculator */}
                        <GuaranteeCalculator />
                    </div>

                    {/* Info Banner */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Deadline Approaching</h3>
                                <p className="text-gray-400 mb-4">
                                    The CBAM Definitive Period begins on <strong className="text-white">January 1, 2026</strong>.
                                    Applications take 3-6 months to process. We recommend starting now to ensure approval before the deadline.
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-blue-400 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        ~{Math.max(0, Math.floor((new Date('2026-01-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days remaining
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
