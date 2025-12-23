"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    FileText,
    Globe,
    LogOut,
    Menu,
    X,
    Loader2,
    Upload,
    TrendingUp,
    Sparkles,
    ArrowRight,
    MessageCircle,
    Factory,
    Leaf,
    ChevronRight,
    Lock,
    Eye,
    EyeOff,
    BarChart3
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

// Passkey for quick access (bypasses login)
const PASSKEY = "vaya2024";

interface HSCodeResult {
    hs_code: string;
    description: string;
    is_cbam_relevant?: boolean;
    is_restricted?: boolean;
    basic_duty_rate?: number;
    igst_rate?: number;
}

interface AIMatch {
    hs_code: string;
    description: string;
    confidence: string;
    cbam_category?: string;
    reasoning: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isAuthenticated, setUser } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [aiResults, setAiResults] = useState<AIMatch[]>([]);
    const [searching, setSearching] = useState(false);
    const [recentReports, setRecentReports] = useState<number>(0);

    // Passkey overlay state
    const [showPasskeyOverlay, setShowPasskeyOverlay] = useState(false);
    const [passkey, setPasskey] = useState("");
    const [passkeyError, setPasskeyError] = useState("");
    const [showPasskey, setShowPasskey] = useState(false);
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        // Check if already unlocked via passkey or authenticated
        const isUnlocked = localStorage.getItem("vaya_unlocked") === "true";
        if (isUnlocked) {
            setUnlocked(true);
        } else if (!isAuthenticated) {
            setShowPasskeyOverlay(true);
        }

        // Fetch stats
        fetch('http://localhost:8000/api/v1/cbam/')
            .then(res => res.json())
            .then(data => setRecentReports(data.total || 0))
            .catch(() => { });
    }, [isAuthenticated]);

    const handlePasskeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passkey === PASSKEY) {
            localStorage.setItem("vaya_unlocked", "true");
            setUnlocked(true);
            setShowPasskeyOverlay(false);
            setPasskeyError("");
            // Set a demo user
            setUser({
                id: "demo",
                email: "demo@vaya.trade",
                full_name: "Demo User",
                subscription_tier: "pro"
            });
        } else {
            setPasskeyError("Invalid passkey. Try 'vaya2024'");
        }
    };

    const handleAISearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/ai/match-hs-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_description: searchQuery }),
            });
            const data = await response.json();
            setAiResults(data.suggestions || []);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("vaya_unlocked");
        setUnlocked(false);
        logout();
        router.push("/");
    };

    // Show passkey overlay if not authenticated and not unlocked
    if (showPasskeyOverlay && !unlocked && !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Quick Access</h1>
                        <p className="text-gray-400">Enter passkey to access VAYA dashboard</p>
                    </div>

                    <form onSubmit={handlePasskeySubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Passkey</label>
                            <div className="relative">
                                <input
                                    type={showPasskey ? "text" : "password"}
                                    value={passkey}
                                    onChange={(e) => {
                                        setPasskey(e.target.value);
                                        setPasskeyError("");
                                    }}
                                    placeholder="Enter passkey..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 pr-12"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasskey(!showPasskey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPasskey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passkeyError && (
                                <p className="mt-2 text-sm text-red-400">{passkeyError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
                        >
                            Unlock Dashboard
                        </button>

                        <div className="mt-4 text-center">
                            <Link href="/login" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                                Or sign in with email →
                            </Link>
                        </div>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        Hint: The passkey is <code className="text-emerald-400">vaya2024</code>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-5 border-b border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <span className="text-white font-bold text-lg">V</span>
                    </div>
                    <div>
                        <span className="text-white font-bold text-xl">VAYA</span>
                        <p className="text-xs text-gray-500">Trade Compliance</p>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Main</p>

                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-emerald-500/20 to-transparent border-l-2 border-emerald-500 rounded-r-lg">
                        <Search className="w-5 h-5 text-emerald-400" />
                        <span>HS Code Search</span>
                    </Link>

                    <Link href="/cbam" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition group">
                        <Factory className="w-5 h-5" />
                        <span>CBAM Reports</span>
                        {recentReports > 0 && (
                            <span className="ml-auto px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">{recentReports}</span>
                        )}
                    </Link>

                    <Link href="/documents" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                        <Upload className="w-5 h-5" />
                        <span>Documents</span>
                    </Link>

                    <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                        <BarChart3 className="w-5 h-5" />
                        <span>Analytics</span>
                    </Link>

                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                        <Leaf className="w-5 h-5" />
                        <span>EUDR Compliance</span>
                        <span className="ml-auto text-xs text-gray-600">Soon</span>
                    </Link>

                    <Link href="/advisor" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition group">
                        <Sparkles className="w-5 h-5" />
                        <span>AI Advisor</span>
                        <span className="ml-auto px-2 py-0.5 text-xs bg-violet-500/20 text-violet-400 rounded-full">New</span>
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
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white w-full rounded-lg hover:bg-white/5 transition mb-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                    </Link>
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
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-4">
                        <div className="text-sm px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 capitalize">
                            {user?.subscription_tier || "free"} plan
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}! 👋
                        </h1>
                        <p className="text-gray-400">AI-powered HS code lookup and CBAM compliance</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Link href="/cbam" className="group p-5 bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-2xl hover:border-amber-500/40 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Create CBAM Report</h3>
                            <p className="text-sm text-gray-400">Generate EU carbon compliance reports</p>
                        </Link>

                        <Link href="/documents" className="group p-5 bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20 rounded-2xl hover:border-violet-500/40 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Upload Invoice</h3>
                            <p className="text-sm text-gray-400">AI extracts data from documents</p>
                        </Link>

                        <div className="group p-5 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs text-gray-500">24/7</span>
                            </div>
                            <h3 className="font-semibold text-white mb-1">WhatsApp Support</h3>
                            <p className="text-sm text-gray-400">Chat for instant HS code lookup</p>
                        </div>
                    </div>

                    {/* AI Search Box */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">AI-Powered HS Code Search</h2>
                                <p className="text-sm text-gray-400">Describe your product and let AI find the right code</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                                    placeholder="e.g., steel screws for construction, aluminum sheets..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleAISearch}
                                disabled={searching}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                            >
                                {searching ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Search with AI
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* AI Results */}
                    {aiResults.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">AI Suggestions</h2>
                                <span className="text-sm text-gray-400">{aiResults.length} matches found</span>
                            </div>
                            <div className="grid gap-4">
                                {aiResults.map((result, idx) => (
                                    <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl font-mono font-bold text-white">{result.hs_code}</span>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${result.confidence === 'high'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : result.confidence === 'medium'
                                                            ? 'bg-amber-500/20 text-amber-400'
                                                            : 'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {result.confidence} confidence
                                                    </span>
                                                    {result.cbam_category && (
                                                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">
                                                            CBAM: {result.cbam_category.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-300 mb-2">{result.description}</p>
                                                <p className="text-sm text-gray-500">{result.reasoning}</p>
                                            </div>
                                            <Link
                                                href={`/cbam?hs_code=${result.hs_code}&description=${encodeURIComponent(result.description)}&category=${result.cbam_category || ''}`}
                                                className="flex-shrink-0 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium flex items-center gap-2"
                                            >
                                                Create Report
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {aiResults.length === 0 && !searching && (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Search for HS Codes</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Enter a product description like "steel pipes for construction" and our AI will find the matching HS codes
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
