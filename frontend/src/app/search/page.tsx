'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    Search,
    ArrowLeft,
    FileText,
    Factory,
    Leaf,
    AlertCircle,
    Loader2,
    ChevronRight,
    Check,
    X,
    Sparkles
} from 'lucide-react';

interface HSCodeResult {
    hs_code: string;
    description: string;
    is_cbam_relevant?: boolean;
    is_restricted?: boolean;
    basic_duty_rate?: number;
    igst_rate?: number;
    cbam_category?: string;
}

interface AIMatch {
    hs_code: string;
    description: string;
    confidence: string;
    cbam_category?: string;
    reasoning: string;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<HSCodeResult[]>([]);
    const [aiMatches, setAIMatches] = useState<AIMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAILoading] = useState(false);

    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setAILoading(true);

        // Regular search
        try {
            const res = await fetch(`http://localhost:8000/api/v1/hs-codes/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }

        // AI matching
        try {
            const res = await fetch('http://localhost:8000/api/v1/ai/match-hs-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_description: searchQuery }),
            });
            const data = await res.json();
            setAIMatches(data.suggestions || []);
        } catch (error) {
            console.error('AI match failed:', error);
        } finally {
            setAILoading(false);
        }
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'iron_steel': return 'from-slate-500 to-slate-700';
            case 'aluminium': return 'from-blue-500 to-blue-700';
            case 'cement': return 'from-amber-500 to-amber-700';
            case 'fertilisers': return 'from-green-500 to-green-700';
            default: return 'from-violet-500 to-violet-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                placeholder="Search HS codes or describe product..."
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleSearch(query)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                    >
                        Search
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* AI Suggestions */}
                {(aiLoading || aiMatches.length > 0) && (
                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                            <h2 className="text-lg font-semibold text-white">AI Suggestions</h2>
                            {aiLoading && <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />}
                        </div>

                        <div className="grid gap-4">
                            {aiMatches.map((match, i) => (
                                <div
                                    key={i}
                                    className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(match.cbam_category)} flex items-center justify-center`}>
                                                <Factory className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-2xl font-bold text-white">{match.hs_code}</span>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${match.confidence === 'high'
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-amber-500/20 text-amber-400'
                                                        }`}>
                                                        {match.confidence} confidence
                                                    </span>
                                                </div>
                                                <p className="text-gray-300">{match.description}</p>
                                                <p className="text-sm text-gray-500 mt-2">{match.reasoning}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/cbam"
                                            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                                        >
                                            Create Report →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Database Results */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-white">
                            {loading ? 'Searching...' : `${results.length} Results`}
                        </h2>
                        {loading && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : results.length === 0 && query ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                            <p className="text-gray-400">Try a different search term or use AI suggestions above</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {results.map((result, i) => (
                                <div
                                    key={i}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                                                <span className="text-emerald-400 font-bold text-sm">{result.hs_code.slice(0, 2)}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <code className="text-lg font-bold text-white">{result.hs_code}</code>
                                                    {result.is_cbam_relevant && (
                                                        <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                                                            CBAM
                                                        </span>
                                                    )}
                                                    {result.is_restricted && (
                                                        <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                                                            Restricted
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400">{result.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-right">
                                            <div>
                                                <p className="text-xs text-gray-500">Basic Duty</p>
                                                <p className="text-white font-medium">{result.basic_duty_rate || 0}%</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">IGST</p>
                                                <p className="text-white font-medium">{result.igst_rate || 18}%</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
