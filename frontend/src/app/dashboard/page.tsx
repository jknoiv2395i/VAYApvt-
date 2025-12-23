"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FileText, Globe, LogOut, Menu, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { hsCodeApi, HSCodeResult } from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<HSCodeResult[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await hsCodeApi.search(searchQuery);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Redirect if not authenticated
    if (typeof window !== "undefined" && !isAuthenticated) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-2 p-4 border-b border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <span className="text-white font-bold text-xl">VAYA</span>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-lg">
                        <Search className="w-5 h-5" />
                        HS Code Search
                    </Link>
                    <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                        <FileText className="w-5 h-5" />
                        CBAM Reports
                    </Link>
                    <Link href="/dashboard/eudr" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                        <Globe className="w-5 h-5" />
                        EUDR Compliance
                    </Link>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white w-full rounded-lg transition">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="h-16 bg-slate-800 border-b border-white/10 flex items-center justify-between px-4 lg:px-8">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white">
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="text-gray-400">Welcome, <span className="text-white">{user?.full_name || "User"}</span></div>
                    <div className="text-sm text-purple-400 px-3 py-1 bg-purple-500/10 rounded-full capitalize">
                        {user?.subscription_tier || "free"} plan
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">HS Code Lookup</h1>
                        <p className="text-gray-400">Search for Indian HS codes and check CBAM applicability</p>
                    </div>

                    {/* Search Box */}
                    <div className="max-w-3xl mb-8">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="Search by code, product name, or description..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={searching}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {searching && <Loader2 className="w-4 h-4 animate-spin" />}
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    {searchResults.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Results ({searchResults.length})</h2>
                            <div className="grid gap-4">
                                {searchResults.map((result) => (
                                    <div key={result.hs_code} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xl font-mono font-bold text-white">{result.hs_code}</span>
                                                    {result.is_cbam_relevant && (
                                                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded">
                                                            CBAM
                                                        </span>
                                                    )}
                                                    {result.is_restricted && (
                                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                                                            Restricted
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-300">{result.description}</p>
                                            </div>
                                            <div className="text-right text-sm">
                                                {result.basic_duty_rate !== null && (
                                                    <div className="text-gray-400">Duty: <span className="text-white">{result.basic_duty_rate}%</span></div>
                                                )}
                                                {result.igst_rate !== null && (
                                                    <div className="text-gray-400">IGST: <span className="text-white">{result.igst_rate}%</span></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {searchResults.length === 0 && !searching && (
                        <div className="text-center py-16">
                            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-400">Search for HS Codes</h3>
                            <p className="text-gray-500 mt-2">Enter a product name or HS code number to get started</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
