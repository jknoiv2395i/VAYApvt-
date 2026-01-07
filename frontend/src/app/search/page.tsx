'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import {
    Search,
    Factory,
    Sparkles,
    Loader2,
    ChevronRight,
    AlertCircle,
    Copy,
    Share2,
    TrendingUp,
    AlertTriangle
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

    return (
        <DashboardWrapper>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Area */}
                <div className="flex justify-between items-center py-2">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">HS Classification</h1>
                        <p className="text-gray-400 text-sm">Calculate duties and finding correct HS codes</p>
                    </div>
                </div>

                {/* Main Search Input: Transaction Style */}
                <div className="bg-[#121212] rounded-3xl p-8 md:p-12 text-center border border-white/5 relative overflow-hidden group shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF5100]/5 blur-[80px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <label className="block text-gray-500 mb-6 font-medium uppercase tracking-widest text-xs">
                            Product Description
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                className="w-full bg-transparent text-center text-4xl md:text-5xl font-bold text-white focus:outline-none placeholder:text-gray-800 caret-[#FF5100] transition-all"
                                placeholder="Cotton Shirt..."
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    {/* Clear icon if needed */}
                                </button>
                            )}
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button
                                onClick={() => handleSearch(query)}
                                disabled={loading && aiLoading}
                                className="bg-[#FF5100] hover:bg-[#ff6a26] text-white px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_4px_20px_rgba(255,81,0,0.25)] hover:shadow-[0_4px_30px_rgba(255,81,0,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {(loading || aiLoading) ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Search className="w-5 h-5" />
                                )}
                                <span>Calculate Duties</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: High Confidence AI Match (Featured Card) */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#FF5100]" />
                            AISuggestion
                        </h3>

                        {aiLoading ? (
                            <div className="h-64 rounded-2xl bg-[#121212] animate-pulse border border-white/5" />
                        ) : aiMatches.length > 0 ? (
                            <div className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <Factory className="w-24 h-24 text-white/5 -rotate-12" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#FF5100]/20 flex items-center justify-center">
                                            <span className="text-[#FF5100] font-bold text-xs">AI</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${aiMatches[0].confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {aiMatches[0].confidence}
                                        </span>
                                    </div>

                                    <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Recommended Code</h4>
                                    <p className="text-3xl font-mono text-white tracking-widest mb-4">
                                        {aiMatches[0].hs_code}
                                    </p>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l-2 border-[#FF5100] pl-3">
                                        {aiMatches[0].reasoning}
                                    </p>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">
                                            Details
                                        </button>
                                        <button className="flex-1 bg-[#FF5100]/10 hover:bg-[#FF5100]/20 text-[#FF5100] py-2 rounded-lg text-sm font-medium transition-colors border border-[#FF5100]/20">
                                            Use Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center flex-col gap-4 text-center p-6">
                                <Search className="w-8 h-8 text-gray-700" />
                                <p className="text-gray-500 text-sm">Enter a product to generate an <br />AI recommendation.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Database Results (Transaction List) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-lg font-medium text-gray-300">Database Matches</h3>
                            {results.length > 0 && <span className="text-xs text-gray-500">{results.length} found</span>}
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[#121212] rounded-xl animate-pulse" />)}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="bg-[#121212] rounded-2xl overflow-hidden border border-white/5">
                                {results.map((result, i) => (
                                    <div
                                        key={i}
                                        className="group p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#222] transition-colors">
                                                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-mono font-medium">{result.hs_code}</span>
                                                    {result.is_cbam_relevant && (
                                                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold rounded">CBAM</span>
                                                    )}
                                                    {result.is_restricted && (
                                                        <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[10px] uppercase font-bold rounded">Restricted</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-sm line-clamp-1 max-w-md">{result.description}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-white font-medium">{result.basic_duty_rate || 0}%</p>
                                            <p className="text-xs text-gray-500">Duty Rate</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-[#1A1A1A] rounded-2xl">
                                <p className="text-gray-600">No database results found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardWrapper>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <DashboardWrapper>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-[#FF5100] animate-spin" />
                </div>
            </DashboardWrapper>
        }>
            <SearchContent />
        </Suspense>
    );
}
