
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    Factory
} from "lucide-react";

export default function HSCodeLandingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setAiResult(null);

        try {
            const response = await fetch('http://localhost:8000/api/v1/ai/match-hs-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_description: searchQuery }),
            });
            const data = await response.json();
            if (data.suggestions && data.suggestions.length > 0) {
                setAiResult(data.suggestions[0]); // Show top result in demo
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const features = [
        {
            icon: Sparkles,
            title: "Natural Language Search",
            desc: "Stop browsing 99 chapters. Just describe your product like 'Steel screws for wood' and get the exact 8-digit code instantly.",
            color: "emerald"
        },
        {
            icon: Box,
            title: "AI Classification Engine",
            desc: "Powered by Gemini 2.0, our AI understands context, material composition, and usage to prevent misclassification.",
            color: "violet"
        },
        {
            icon: Factory,
            title: "CBAM Auto-Detection",
            desc: "We monitor all CBAM-relevant codes (Iron, Steel, Aluminum, Cement). If your code is on the list, we alert you immediately.",
            color: "amber"
        },
        {
            icon: TrendingUp,
            title: "Duty Rate Calculator",
            desc: "Get real-time Basic Customs Duty (BCD), IGST, and SWS rates for imports into India and exports to the EU.",
            color: "cyan"
        },
        {
            icon: Shield,
            title: "Export Control Checks",
            desc: "Automatically checks for DGFT restrictions, prohibited items, and SCOMET licensing requirements.",
            color: "red"
        },
        {
            icon: Globe,
            title: "FTA Analysis",
            desc: "Find out if your product qualifies for zero duty under India's FTAs with UAE, Australia, and ASEAN.",
            color: "teal"
        }
    ];

    const faqs = [
        {
            q: "What is an HS code?",
            a: "The Harmonized System (HS) is a standardized numerical method of classifying traded products. It is used by customs authorities around the world to identify products when assessing duties and taxes."
        },
        {
            q: "How accurate is AI classification?",
            a: "Our AI model is trained on millions of customs declarations and rulings. It achieves 99% accuracy for common goods and provides confidence scores to help you make informed decisions."
        },
        {
            q: "Does it work for all countries?",
            a: "VAYA focuses primarily on Indian ITC-HS codes (8 digits) and EU CN codes (8 digits) to ensure maximum compliance for Indian exporters targeting the European market."
        },
        {
            q: "How does CBAM detection work?",
            a: "We maintain a real-time database of all HS codes covered under EU Regulation 2023/956. When you search, we cross-reference your code against this list."
        },
        {
            q: "Can I integrate this with my ERP?",
            a: "Yes! Our Enterprise plan offers a robust API that can plug directly into SAP, Oracle, or custom ERPs to automate classification."
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all">
                                <span className="font-bold text-white">V</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">VAYA <span className="font-normal text-emerald-500">Codes</span></span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                            <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
                            <Link href="#demo" className="hover:text-emerald-400 transition-colors">Live Demo</Link>
                            <Link href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all text-sm">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#020617] to-[#020617] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">AI-Powered Compliance for Indian Exporters</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        AI-Powered <br />
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">HS Code Lookup</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Eliminate manual classification errors, avoid customs delays, and ensure 100% CBAM compliance.
                        Trusted by 500+ Indian exporters.
                    </p>

                    {/* Live Search Box Hero Component */}
                    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 mb-12">
                        <div className="flex items-center">
                            <Search className="w-6 h-6 text-gray-500 ml-4" />
                            <input
                                type="text"
                                placeholder="Try 'Aluminum plates backed with plastic'..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-lg py-4 px-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                <span className="hidden sm:inline">Check Code</span>
                            </button>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
                        <div className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4" /> 15,000+ Codes</div>
                        <div className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4" /> 99% Accuracy</div>
                        <div className="flex items-center gap-2"><Check className="text-emerald-500 w-4 h-4" /> 180+ Countries</div>
                    </div>
                </div>
            </section>

            {/* Problem Statement Grid */}
            <section className="py-20 px-4 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Costly Delays</h3>
                        <p className="text-gray-400">Manual classification errors lead to shipment holds, port demurrage charges, and lost business.</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Compliance Risks</h3>
                        <p className="text-gray-400">Incorrect codes can result in penalties, fines, and blacklisting by EU customs authorities.</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">CBAM Complexity</h3>
                        <p className="text-gray-400">Missed carbon reporting requirements can lead to Euro-denominated fines under new regulations.</p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Complete Trade Intelligence</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">More than just a lookup tool. It's an entire compliance department in one search bar.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className={`p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-${f.color}-500/30 transition-all group`}>
                                <div className={`w-12 h-12 rounded-xl bg-${f.color}-500/20 flex items-center justify-center mb-6 text-${f.color}-400 group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

                        {[
                            { title: "Describe", desc: "Type your product details in plain English", icon: MessageSquare },
                            { title: "Analyze", desc: "AI maps distinct features to HS chapters", icon: Box },
                            { title: "Match", desc: "Get the exact 8-digit ITC-HS Code", icon: Check },
                            { title: "Report", desc: "Generate CBAM & Duty reports instantly", icon: FileText }
                        ].map((step, i) => (
                            <div key={i} className="relative text-center z-10">
                                <div className="w-20 h-20 bg-[#0F172A] border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                                    <step.icon className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Demo Section */}
            <section id="demo" className="py-24 px-4">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Try it Live</h2>
                            <p className="text-gray-400 text-sm">See how AI handles complex product descriptions</p>
                        </div>
                        <div className="flex gap-2">
                            {["Steel Pipes", "Cotton Shirts", "Aluminum Sheets"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => { setSearchQuery(tag); handleSearch(); }}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-emerald-400 border border-emerald-500/20 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 min-h-[300px] flex items-center justify-center bg-black/50">
                        {!aiResult && !isSearching && (
                            <div className="text-center text-gray-600">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Search results will appear here</p>
                            </div>
                        )}

                        {isSearching && (
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                                <p className="text-emerald-400 animate-pulse">AI is analyzing 99 HS Chapters...</p>
                            </div>
                        )}

                        {aiResult && (
                            <div className="w-full max-w-2xl bg-[#0F172A] border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <span className="bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded">
                                        {aiResult.confidence} Confidence
                                    </span>
                                </div>
                                <div className="text-4xl font-mono font-bold text-white mb-2">{aiResult.hs_code}</div>
                                <h3 className="text-lg text-emerald-400 mb-4">{aiResult.description}</h3>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Reasoning</span>
                                        <span className="text-white text-right max-w-[60%]">{aiResult.reasoning}</span>
                                    </div>
                                    {aiResult.cbam_category && (
                                        <div className="flex justify-between text-sm bg-orange-500/10 p-2 rounded">
                                            <span className="text-orange-400 font-bold flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> CBAM Relevant</span>
                                            <span className="text-orange-300 capitalize">{aiResult.cbam_category.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                                    <Link href="/dashboard" className="text-emerald-400 text-sm font-medium hover:underline flex items-center gap-1">
                                        View Full Report <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why VAYA?</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-4 text-gray-400 font-medium">Feature</th>
                                    <th className="p-4 text-white font-bold bg-white/5 rounded-t-xl">VAYA AI</th>
                                    <th className="p-4 text-gray-500 font-medium">Manual Lookup</th>
                                    <th className="p-4 text-gray-500 font-medium">Basic Tools</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: "Accuracy", vaya: "99% (AI Context)", manual: "Prone to Error", basic: "Keyword only" },
                                    { name: "Speed", vaya: "< 1 Second", manual: "15-30 Mins", basic: "2-5 Mins" },
                                    { name: "CBAM Detection", vaya: "Automated", manual: "Manual Check", basic: "None" },
                                    { name: "Duty Calculation", vaya: "Real-time API", manual: "Static PDF Lists", basic: "Often Outdated" },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-white/5">
                                        <td className="p-4 text-gray-300">{row.name}</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-white/5">
                                            <div className="flex items-center gap-2"><Check className="w-4 h-4" /> {row.vaya}</div>
                                        </td>
                                        <td className="p-4 text-gray-500">{row.manual}</td>
                                        <td className="p-4 text-gray-500">{row.basic}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 px-4 bg-white/[0.02]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-xl bg-[#0F172A] overflow-hidden">
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

            {/* Pricing CTA */}
            <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-[#020617] to-emerald-950/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Start Classifying in Seconds</h2>
                    <p className="text-xl text-gray-400 mb-12">No credit card required for free tier.</p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <div className="p-8 rounded-3xl border border-white/10 bg-white/5">
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <div className="text-4xl font-bold mb-6">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <ul className="text-left space-y-3 mb-8 text-gray-300">
                                <li className="flex gap-2"><Check className="text-emerald-500 w-5 h-5" /> 10 AI Lookups/mo</li>
                                <li className="flex gap-2"><Check className="text-emerald-500 w-5 h-5" /> Basic Duty Rates</li>
                                <li className="flex gap-2"><Check className="text-emerald-500 w-5 h-5" /> WhatsApp Bot</li>
                            </ul>
                            <Link href="/dashboard" className="block w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-semibold">
                                Sign Up Free
                            </Link>
                        </div>

                        <div className="p-8 rounded-3xl border border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</span>
                            <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                            <div className="text-4xl font-bold mb-6 text-white">₹2,499<span className="text-lg text-gray-400 font-normal">/mo</span></div>
                            <ul className="text-left space-y-3 mb-8 text-gray-300">
                                <li className="flex gap-2"><Check className="text-emerald-400 w-5 h-5" /> Unlimited Lookups</li>
                                <li className="flex gap-2"><Check className="text-emerald-400 w-5 h-5" /> CBAM Reporting</li>
                                <li className="flex gap-2"><Check className="text-emerald-400 w-5 h-5" /> API Access</li>
                            </ul>
                            <Link href="/dashboard" className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-all font-bold shadow-lg shadow-emerald-500/25">
                                Start 14-Day Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#010409] text-gray-500 text-sm text-center">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-500 font-bold">V</div>
                        <span>© 2025 VAYA Logistics</span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-emerald-400">Privacy Policy</Link>
                        <Link href="#" className="hover:text-emerald-400">Terms of Service</Link>
                        <Link href="#" className="hover:text-emerald-400">Contact Support</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
}
