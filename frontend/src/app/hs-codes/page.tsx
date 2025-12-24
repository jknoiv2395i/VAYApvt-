
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
    Search,
    Check,
    Zap,
    Globe,
    Shield,
    FileText,
    BarChart3,
    Users,
    ArrowRight,
    TrendingUp,
    Layout,
    MessageSquare,
    ChevronRight,
    ChevronDown,
    Sparkles,
    Loader2,
    Box,
    AlertTriangle,
    Factory,
    Languages,
    ArrowRightLeft,
    Ship,
    Building2,
    Flag,
    MapPin
} from "lucide-react";

// Sample Mapping Data for Demonstration
const SAMPLE_MAPPINGS: Record<string, { indian: string; indianDesc: string; eu: string; euDesc: string; cbam?: boolean }> = {
    "steel screws": { indian: "7318 15 00", indianDesc: "Screws, Threaded (Iron/Steel)", eu: "7318 15 90", euDesc: "Other screws, fully threaded", cbam: true },
    "aluminum sheets": { indian: "7606 12 00", indianDesc: "Aluminium Plates, Alloy", eu: "7606 12 91", euDesc: "Aluminium alloy plates, thickness > 0.2mm", cbam: true },
    "cotton shirts": { indian: "6205 20 00", indianDesc: "Men's Shirts, Cotton", eu: "6205 20 00", euDesc: "Men's shirts of cotton" },
    "cement": { indian: "2523 29 00", indianDesc: "Portland Cement, Other", eu: "2523 29 00", euDesc: "Other Portland cement", cbam: true },
    "nut bolt": { indian: "7318 16 00", indianDesc: "Nuts (Iron or Steel)", eu: "7318 16 91", euDesc: "Nuts, internally threaded" },
};

export default function HSCodeLandingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [mappingResult, setMappingResult] = useState<typeof SAMPLE_MAPPINGS["steel screws"] | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [animateBridge, setAnimateBridge] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setMappingResult(null);
        setAnimateBridge(false);

        // Simulate API call delay
        await new Promise(r => setTimeout(r, 1500));

        // Find closest match from sample data
        const lowerQuery = searchQuery.toLowerCase();
        let bestMatch = SAMPLE_MAPPINGS["steel screws"]; // default
        for (const key of Object.keys(SAMPLE_MAPPINGS)) {
            if (lowerQuery.includes(key) || key.includes(lowerQuery.split(" ")[0])) {
                bestMatch = SAMPLE_MAPPINGS[key];
                break;
            }
        }

        setMappingResult(bestMatch);
        setIsSearching(false);
        setAnimateBridge(true);
    };

    const faqs = [
        { q: "What is an HS code?", a: "The Harmonized System (HS) is a standardized numerical method of classifying traded products. It is used by customs authorities around the world to identify products when assessing duties and taxes." },
        { q: "Why are Indian and EU codes different?", a: "The first 6 digits are globally standardized (WCO). However, the last 2 digits are country-specific. India uses ITC-HS codes, while the EU uses CN codes. Incorrectly mapping these causes customs rejections." },
        { q: "How does the 'Bridge' work?", a: "VAYA maintains a curated Correlation Database that maps every Indian ITC-HS code to its corresponding EU CN code(s). This is updated quarterly with official customs data." },
        { q: "Is the AI search accurate for vague terms?", a: "Yes! Our Semantic Search uses AI embeddings to understand product 'intent'. Typing 'Nut Bolt' will correctly find 'Threaded Fasteners' - no exact keywords needed." },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans selection:bg-emerald-500/30">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-emerald-500/20">
                                <span className="font-bold text-white">V</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">VAYA <span className="font-normal text-emerald-500">Codes</span></span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                            <Link href="#bridge" className="hover:text-emerald-400 transition-colors">The Bridge</Link>
                            <Link href="#demo" className="hover:text-emerald-400 transition-colors">Live Demo</Link>
                            <Link href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all text-sm shadow-lg shadow-emerald-500/20">
                            Open Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[700px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-[#020617] to-[#020617] pointer-events-none" />
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-1/3 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                        <Flag className="w-4 h-4 text-orange-400" />
                        <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                        <Flag className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-white ml-2">Cross-Border Translation Engine</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Speak <span className="text-orange-400">India's</span> Code. <br />
                        Get <span className="text-blue-400">Europe's</span> Code.
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        In global trade, India speaks <strong className="text-orange-300">ITC-HS</strong> and Europe speaks <strong className="text-blue-300">CN Codes</strong>.
                        If these don't match, your container gets stuck. VAYA is the <span className="text-emerald-400 font-semibold">bridge</span>.
                    </p>
                </div>
            </section>

            {/* The Bridge - Visual Section */}
            <section id="bridge" className="py-24 px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">The Language Barrier of Trade</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">The first 6 digits are universal (WCO standard). The last 2 digits are country-specific. This is where errors happen.</p>
                    </div>

                    {/* Animated Bridge Diagram */}
                    <div className="relative bg-[#0a0f1a] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                        <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                            {/* India Side */}
                            <div className="text-center md:text-left p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-orange-400">INDIA (Exporter)</span>
                                </div>
                                <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">
                                    <span className="text-gray-500">7318</span> <span className="text-orange-400">15 00</span>
                                </div>
                                <p className="text-sm text-gray-400">ITC-HS Code (8-digit)</p>
                                <p className="text-xs text-orange-300 mt-2">Used on: Tax Invoices, Shipping Bills</p>
                            </div>

                            {/* Bridge / Arrow */}
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className={`relative w-full max-w-[200px] h-2 bg-gradient-to-r from-orange-500 via-emerald-400 to-blue-500 rounded-full overflow-hidden`}>
                                    <div className={`absolute top-0 left-0 h-full w-8 bg-white/50 rounded-full blur-sm ${animateBridge ? 'animate-bridge-flash' : 'opacity-0'}`}></div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30">
                                    <Languages className="w-4 h-4" />
                                    VAYA BRIDGE
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">AI + Correlation Database</p>
                            </div>

                            {/* EU Side */}
                            <div className="text-center md:text-right p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                                <div className="flex items-center justify-center md:justify-end gap-3 mb-4">
                                    <span className="font-bold text-blue-400">EUROPE (Importer)</span>
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Ship className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">
                                    <span className="text-gray-500">7318</span> <span className="text-blue-400">15 90</span>
                                </div>
                                <p className="text-sm text-gray-400">CN Code (8-digit)</p>
                                <p className="text-xs text-blue-300 mt-2">Used on: EU Customs, CBAM Declarations</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-gray-500 text-sm">
                                <AlertTriangle className="inline w-4 h-4 text-amber-500 mr-1" />
                                Without this mapping, EU customs systems will <strong className="text-red-400">reject</strong> the Indian code, causing delays and fines.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Smart Search Explanation */}
            <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-sm">Layer 1: Smart Search</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">You Don't Need to Know Technical Names</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Most factory owners know their products as "Screws" or "Nut Bolt" - not "Threaded Fasteners of Iron or Steel."
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            VAYA uses <strong className="text-white">Semantic Search (AI Embeddings)</strong> to understand <em>intent</em>.
                            If you type "Nut Bolt," the system intelligently maps it to the official description "Threaded Articles."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20">
                                <Sparkles className="w-4 h-4" /> Semantic Search
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
                                <Zap className="w-4 h-4" /> Vector Embeddings
                            </div>
                        </div>
                    </div>
                    <div className="relative p-1 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30">
                        <div className="bg-[#0a0f1a] rounded-xl p-8">
                            <p className="text-gray-500 text-sm mb-4">User types:</p>
                            <div className="text-3xl font-mono text-white mb-6 border-b border-dashed border-white/20 pb-4">"Nut Bolt"</div>
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                                <span className="text-gray-400 text-sm">AI Analysis...</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-2">VAYA understands:</p>
                            <div className="text-xl text-emerald-400 font-semibold">"Threaded Fasteners (Nuts, Bolts)"</div>
                            <div className="mt-4 text-4xl font-mono font-bold text-white">→ 7318.16.00</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Demo Section */}
            <section id="demo" className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Try the Translation Engine</h2>
                        <p className="text-gray-400">Type a product name and watch the bridge in action.</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#0a0f1a] to-[#05080f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
                        {/* Search Input */}
                        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Try: Steel Screws, Aluminum Sheets, Nut Bolt, Cement..."
                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Languages className="w-5 h-5" />}
                                Translate Code
                            </button>
                        </div>

                        {/* Results Area */}
                        <div className="p-8 min-h-[350px]">
                            {!mappingResult && !isSearching && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 py-12">
                                    <ArrowRightLeft className="w-16 h-16 mb-4 opacity-30" />
                                    <p className="text-lg">Enter a product to see the India ↔ EU code translation</p>
                                </div>
                            )}

                            {isSearching && (
                                <div className="h-full flex flex-col items-center justify-center text-emerald-400 py-12">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
                                        <Languages className="absolute inset-0 m-auto w-10 h-10" />
                                    </div>
                                    <p className="text-lg animate-pulse">Translating across borders...</p>
                                </div>
                            )}

                            {mappingResult && !isSearching && (
                                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                                    {/* India Code Card */}
                                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-900/20 border border-orange-500/30 rounded-2xl p-6 flex flex-col">
                                        <div className="flex items-center gap-2 text-orange-400 font-semibold mb-4">
                                            <Flag className="w-4 h-4" /> INDIA (ITC-HS)
                                        </div>
                                        <div className="text-4xl font-mono font-bold text-white mb-2">{mappingResult.indian}</div>
                                        <p className="text-sm text-gray-400 flex-1">{mappingResult.indianDesc}</p>
                                        <div className="mt-4 pt-4 border-t border-orange-500/20">
                                            <span className="text-xs text-orange-300/70">For: Indian Tax Invoice, DGFT</span>
                                        </div>
                                    </div>

                                    {/* Bridge Indicator */}
                                    <div className="flex md:flex-col items-center justify-center gap-4 py-4">
                                        <div className={`w-full md:w-auto md:h-full flex items-center justify-center transition-all duration-500 ${animateBridge ? 'scale-110' : 'scale-100'}`}>
                                            <div className="p-4 bg-emerald-500/20 rounded-full border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20">
                                                <ArrowRightLeft className={`w-8 h-8 text-emerald-400 ${animateBridge ? 'animate-pulse' : ''}`} />
                                            </div>
                                        </div>
                                        <span className="text-emerald-400 font-bold text-sm">MAPPED!</span>
                                    </div>

                                    {/* EU Code Card */}
                                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6 flex flex-col">
                                        <div className="flex items-center gap-2 text-blue-400 font-semibold mb-4">
                                            <Flag className="w-4 h-4" /> EUROPE (CN Code)
                                        </div>
                                        <div className="text-4xl font-mono font-bold text-white mb-2">{mappingResult.eu}</div>
                                        <p className="text-sm text-gray-400 flex-1">{mappingResult.euDesc}</p>
                                        <div className="mt-4 pt-4 border-t border-blue-500/20 flex justify-between items-center">
                                            <span className="text-xs text-blue-300/70">For: EU Customs, CBAM</span>
                                            {mappingResult.cbam && (
                                                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full font-bold">CBAM</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section id="faq" className="py-20 px-4 bg-white/[0.02]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Understanding the Bridge</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-xl bg-[#0a0f1a] overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold text-lg">{faq.q}</span>
                                    {openFaq === i ? <ChevronDown className="w-5 h-5 text-emerald-400" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                                </button>
                                {openFaq === i && (
                                    <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <h2 className="text-4xl font-bold mb-6 relative z-10">Stop Guessing. Start Translating.</h2>
                    <p className="text-gray-400 text-lg mb-8 relative z-10">Get the correct EU code for every Indian export. Instantly.</p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 relative z-10">
                        Open the Dashboard <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#010409] text-gray-500 text-sm text-center">
                <p>© 2025 VAYA Logistics. The Bridge for Indian Exporters.</p>
            </footer>

            {/* Custom Animation Style */}
            <style jsx>{`
        @keyframes bridge-flash {
          0% { left: 0; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-bridge-flash {
          animation: bridge-flash 1s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
