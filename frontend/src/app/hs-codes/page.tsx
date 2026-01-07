"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
    Search,
    Check,
    Zap,
    Globe,
    Shield,
    FileText,
    BarChart3,
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
    MapPin,
    Menu,
    X,
    Users
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Process Section Animation State
    const [activeProcessStep, setActiveProcessStep] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const processSectionRef = useState<HTMLElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const processSection = document.getElementById('process-section');
            if (!processSection) return;

            const rect = processSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const totalHeight = rect.height;

            // Calculate progress 0 to 1 as section scrolls through view
            // Start counting when top enters viewport (0)
            // End counting when bottom leaves viewport (1)
            let progress = (viewportHeight - rect.top) / (viewportHeight + totalHeight);
            progress = Math.max(0, Math.min(1, progress));
            setScrollProgress(progress);

            // Calculate active step based on scroll position within the section
            // We want step 0 to activate when section is centered
            // Divide the viewport passage into 4 segments roughly
            if (progress < 0.35) setActiveProcessStep(0);
            else if (progress < 0.55) setActiveProcessStep(1);
            else if (progress < 0.75) setActiveProcessStep(2);
            else setActiveProcessStep(3);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <div className="min-h-screen bg-[#080808] text-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#FF5100] selection:text-white">
            {/* Background Image Reuse/Overlay */}
            <div className="absolute inset-0 z-0 w-full h-[120vh] pointer-events-none">
                <div className="absolute inset-0 bg-[#080808]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5100]/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5100]/5 rounded-full blur-[120px] pointer-events-none" />
            </div>

            {/* Navigation - Floating Pill Style */}
            <nav className="fixed top-0 left-0 right-0 z-50 pt-6 transition-all duration-300">
                <div className="max-w-[1350px] mx-auto px-6">
                    <div className="flex items-center justify-between h-[57px] rounded-full bg-[#080808]/40 border border-white/5 backdrop-blur-xl px-2 pl-6 shadow-lg shadow-black/20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 pr-8 group">
                            <div className="w-5 h-5 bg-[#FF5100] rounded-sm transform group-hover:rotate-45 transition-transform duration-300 flex items-center justify-center">
                                <span className="text-black font-bold text-[10px]">V</span>
                            </div>
                            <span className="font-semibold text-[19px] tracking-tight text-[#FAFAFA]">VAYA <span className="font-normal text-[#FF5100]">Codes</span></span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center justify-center flex-1 gap-1">
                            {["The Bridge", "Live Demo", "Process", "FAQs"].map((item) => (
                                <Link
                                    key={item}
                                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                                    className="px-4 py-2 text-[14px] font-bold text-[#FAFAFA] hover:text-[#FF5100] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:block pl-8">
                            <Link
                                href="/dashboard"
                                className="group relative flex items-center justify-center w-[169px] h-[46px] rounded-full bg-[#0F0F0F] border border-white/5 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(50%_42.6%_at_50%_100%,_#FF5100_0%,_rgba(255,81,0,0.00)_100%)] opacity-80" />
                                <span className="relative z-10 text-[16px] font-semibold bg-gradient-to-r from-[#FF5100] to-[#FAFAFA] bg-clip-text text-transparent group-hover:to-white transition-all">
                                    Open Dashboard
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white/80"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
                {/* Status Badge */}
                <div className="mt-0 mb-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-white/5 mx-auto hover:border-[#FF5100]/30 transition-colors cursor-default backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5100] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5100]"></span>
                    </span>
                    <span className="text-[12px] font-semibold tracking-wide text-[#999999] group-hover:text-white transition-colors">
                        Cross-Border Translation Engine
                    </span>
                </div>

                <h1
                    className="text-6xl font-bold tracking-[-0.02em] leading-[1.1] mb-[13px] mt-0 mr-[52px] mx-auto max-w-6xl text-transparent bg-clip-text pb-0 hero-title"
                    style={{
                        backgroundImage: 'linear-gradient(180deg, rgba(255, 81, 0, 1) 18%, rgba(245, 230, 230, 1) 51%, rgba(255, 144, 0, 1) 69%, rgba(255, 255, 255, 1) 94%)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    Speak India's Code. <br />
                    Get Europe's Code.
                </h1>

                <p className="text-base md:text-lg text-[#999999] max-w-2xl mx-auto mb-[9px] font-medium">
                    In global trade, India speaks <strong>ITC-HS</strong> and Europe speaks <strong>CN Codes</strong>.
                    If these don't match, your container gets stuck. VAYA is the bridge.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-[10px] mb-[10px]">
                    <Link
                        href="#demo"
                        className="group relative px-8 py-4 rounded-full bg-[#0F0F0F] border border-white/5 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(50%_42.6%_at_50%_100%,_#FF5100_0%,_rgba(255,81,0,0.00)_100%)] opacity-80" />
                        <span className="relative z-10 font-semibold bg-gradient-to-r from-[#FF5100] to-[#FAFAFA] bg-clip-text text-transparent group-hover:to-white transition-all">
                            Try Live Demo
                        </span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-8 py-4 rounded-full bg-[#0F0F0F] border border-white/5 text-[#999] font-medium hover:text-white hover:border-white/10 transition-all font-semibold"
                    >
                        Learn More
                    </Link>
                </div>

                {/* SAS Preview Mockup */}
                <div className="relative max-w-6xl mx-auto transform perspective-1000">
                    {/* Glow Behind */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5100]/20 via-purple-500/10 to-blue-500/20 rounded-2xl blur-3xl opacity-30" style={{ top: '-22px' }}></div>

                    {/* Window Frame */}
                    <div className="relative bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 mt-[29px]">
                        {/* Title Bar */}
                        <div className="h-10 bg-[#0A0A0A] border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                            <div className="ml-4 px-3 py-1 bg-[#1A1A1A] rounded-md border border-white/5 text-[10px] text-gray-500 font-mono flex items-center gap-2">
                                <Shield className="w-3 h-3" /> vaya.trade/dashboard
                            </div>
                        </div>

                        {/* App Content */}
                        <div className="flex h-[500px] bg-[#080808]">
                            {/* Sidebar */}
                            <div className="w-64 border-r border-white/5 p-4 flex flex-col hidden md:flex">
                                <div className="flex items-center gap-2 mb-8 px-2">
                                    <div className="w-6 h-6 bg-[#FF5100] rounded-sm flex items-center justify-center text-black font-bold text-xs">V</div>
                                    <span className="font-bold text-white">Vaya</span>
                                </div>
                                <div className="space-y-1">
                                    {[
                                        { name: "Overview", icon: Layout, active: true },
                                        { name: "HS Search", icon: Search },
                                        { name: "CBAM Reports", icon: BarChart3 },
                                        { name: "Shipments", icon: Box },
                                        { name: "Suppliers", icon: Users },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-[#FF5100]/10 text-[#FF5100]' : 'text-gray-500 hover:text-white'}`}>
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3 px-3 py-2 text-gray-500 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10"></div>
                                        <div>
                                            <div className="text-white text-xs">Demo User</div>
                                            <div className="text-[10px]">Pro Plan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Area */}
                            <div className="flex-1 p-8 bg-[#080808] relative overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        { label: "Total Shipments", val: "1,284", change: "+12%", color: "text-white" },
                                        { label: "CBAM Compliant", val: "98.5%", change: "+2.1%", color: "text-[#FF5100]" },
                                        { label: "Pending Review", val: "12", change: "-4", color: "text-white" },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#0F0F0F] border border-white/5 rounded-xl p-5">
                                            <div className="text-gray-500 text-xs font-medium mb-2">{stat.label}</div>
                                            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.val}</div>
                                            <div className="text-[10px] text-emerald-500 font-mono bg-emerald-500/10 inline-block px-1.5 py-0.5 rounded">{stat.change}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mock Chart */}
                                <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 h-64 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-semibold text-white">Compliance Trend</h3>
                                        <div className="flex gap-2">
                                            <div className="w-20 h-2 bg-white/5 rounded-full"></div>
                                            <div className="w-8 h-2 bg-white/5 rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Simulated Wave Chart */}
                                    <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end px-6 gap-2 opacity-50">
                                        {[40, 65, 45, 70, 50, 80, 60, 90, 75, 85, 65, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-[#FF5100]/20 to-[#FF5100] rounded-t-sm transition-all duration-500 hover:opacity-100" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Integration Section */}
            <section className="py-24 px-4 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FF5100]/5 rounded-full blur-[150px] pointer-events-none" />

                    {/* Left Side Icons with Curved Connection Lines */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-4" style={{ left: '20px' }}>
                        {[
                            { icon: FileText, color: "#22C55E", bg: "#22C55E/10", label: "Excel" },
                            { icon: BarChart3, color: "#3B82F6", bg: "#3B82F6/10", label: "Analytics" },
                            { icon: MessageSquare, color: "#8B5CF6", bg: "#8B5CF6/10", label: "Teams" },
                            { icon: Globe, color: "#F59E0B", bg: "#F59E0B/10", label: "Web" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-0">
                                <div
                                    className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                                    style={{
                                        backgroundColor: `${item.color}15`,
                                        borderColor: `${item.color}30`
                                    }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                                {/* Curved Connection Line */}
                                <svg width="80" height="20" className="overflow-visible">
                                    <path
                                        d={`M 0 10 Q 40 10, 40 ${i < 2 ? 30 : -10} Q 40 ${i < 2 ? 50 : -30}, 80 ${i < 2 ? 50 : -30}`}
                                        stroke={`${item.color}40`}
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                            </div>
                        ))}
                    </div>

                    {/* Right Side Icons with Curved Connection Lines */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-start gap-4" style={{ right: '20px' }}>
                        {[
                            { icon: Zap, color: "#FF5100", bg: "#FF5100/10", label: "API" },
                            { icon: Ship, color: "#EC4899", bg: "#EC4899/10", label: "Shipping" },
                            { icon: Shield, color: "#14B8A6", bg: "#14B8A6/10", label: "CBAM" },
                            { icon: Factory, color: "#F97316", bg: "#F97316/10", label: "ERP" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-0">
                                {/* Curved Connection Line */}
                                <svg width="80" height="20" className="overflow-visible">
                                    <path
                                        d={`M 80 10 Q 40 10, 40 ${i < 2 ? 30 : -10} Q 40 ${i < 2 ? 50 : -30}, 0 ${i < 2 ? 50 : -30}`}
                                        stroke={`${item.color}40`}
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                                <div
                                    className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                                    style={{
                                        backgroundColor: `${item.color}15`,
                                        borderColor: `${item.color}30`
                                    }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Kanban Board */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Window Frame */}
                        <div className="rounded-[24px] bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5100]" />
                                    <div className="w-3 h-3 rounded-full bg-[#444]" />
                                    <div className="w-3 h-3 rounded-full bg-[#444]" />
                                </div>
                                <div className="text-[#666] text-xs">VAYA Workflow Manager</div>
                                <div className="w-6" />
                            </div>

                            {/* Kanban Columns */}
                            <div className="p-6 grid md:grid-cols-3 gap-4">
                                {/* To-Do Column */}
                                <div>
                                    <div className="text-[#666] text-sm font-medium mb-4">To-Do</div>
                                    <div className="space-y-3">
                                        {[
                                            { labels: ["Import", "Steel"], title: "Map Steel Fasteners", count: 3 },
                                            { labels: ["Export", "Textile"], title: "Classify Cotton Shirts", count: 2 }
                                        ].map((card, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-[#0F0F0F]/80 border border-white/5 hover:border-[#FF5100]/20 transition-all cursor-pointer">
                                                <div className="flex gap-2 mb-2">
                                                    {card.labels.map((label, j) => (
                                                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FF5100]/10 text-[#FF5100]">{label}</span>
                                                    ))}
                                                </div>
                                                <div className="text-white text-sm font-medium mb-3">{card.title}</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5100] to-[#FF8F00] border border-[#0A0A0A]" />
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#666] to-[#333] border border-[#0A0A0A]" />
                                                    </div>
                                                    <span className="text-[#555] text-xs">○ {card.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* In Progress Column */}
                                <div>
                                    <div className="text-[#FF5100] text-sm font-medium mb-4">In Progress</div>
                                    <div className="space-y-3">
                                        {[
                                            { labels: ["CBAM", "Export"], title: "Cement CBAM Report", count: 4 },
                                            { labels: ["API", "Bulk"], title: "Batch HS Translation", count: 5 }
                                        ].map((card, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-[#0F0F0F]/80 border border-[#FF5100]/20 shadow-[0_0_20px_-5px_rgba(255,81,0,0.2)] transition-all cursor-pointer">
                                                <div className="flex gap-2 mb-2">
                                                    {card.labels.map((label, j) => (
                                                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FF5100]/10 text-[#FF5100]">{label}</span>
                                                    ))}
                                                </div>
                                                <div className="text-white text-sm font-medium mb-3">{card.title}</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5100] to-[#FF8F00] border border-[#0A0A0A]" />
                                                    </div>
                                                    <span className="text-[#555] text-xs">○ {card.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Complete Column */}
                                <div>
                                    <div className="text-[#4ADE80] text-sm font-medium mb-4">Complete</div>
                                    <div className="space-y-3">
                                        {[
                                            { labels: ["Verified", "Export"], title: "Aluminum Sheets Mapped", count: 3 },
                                            { labels: ["CBAM", "Report"], title: "Q4 CBAM Submission", count: 2 }
                                        ].map((card, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-[#0F0F0F]/80 border border-white/5 opacity-70 transition-all cursor-pointer">
                                                <div className="flex gap-2 mb-2">
                                                    {card.labels.map((label, j) => (
                                                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4ADE80]/10 text-[#4ADE80]">{label}</span>
                                                    ))}
                                                </div>
                                                <div className="text-white text-sm font-medium mb-3">{card.title}</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#22C55E] border border-[#0A0A0A]" />
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#666] to-[#333] border border-[#0A0A0A]" />
                                                    </div>
                                                    <span className="text-[#555] text-xs flex items-center gap-1"><Check className="w-3 h-3 text-[#4ADE80]" /> {card.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose VAYA Codes - Bento Grid */}
            <section className="py-24 px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                        Why Choose <span className="text-[#FF5100]">VAYA Codes</span>
                    </h2>

                    {/* Bento Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Card 1 - Cross-Channel Mapping */}
                        <div className="group relative p-8 rounded-[32px] overflow-hidden min-h-[380px] border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(15,15,15,1) 100%)' }}>
                            {/* Precise Spotlight Gradient - Matches Reference 'Hill of Light' */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,81,0,0.25) 0%, rgba(255,81,0,0.1) 50%, transparent 100%)'
                                }}
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(255,81,0,0.4) 0%, rgba(255,81,0,0.1) 60%, transparent 100%)'
                                }}
                            />

                            <div className="relative z-10 h-full flex flex-col">
                                {/* Header */}
                                <div className="mb-auto">
                                    <h3 className="text-xl font-bold text-white leading-tight mb-1">
                                        VAYA Enables Seamless Code Translation
                                    </h3>
                                    <h3 className="text-xl font-bold text-[#999] mb-4">
                                        Across All Trade Channels
                                    </h3>
                                    <p className="text-[#666] text-sm leading-relaxed max-w-sm">
                                        With VAYA, effortlessly connect exporters and importers through intelligent code mapping on ITC-HS, CN, and beyond.
                                    </p>
                                </div>

                                {/* Modern Hub Diagram */}
                                <div className="relative flex items-center justify-center pt-8 mt-auto">
                                    {/* Connection Lines - SVG for clean lines */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                                        {/* Top Line */}
                                        <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="rgba(255,81,0,0.2)" strokeWidth="1" />
                                        {/* Bottom Line */}
                                        <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="rgba(255,81,0,0.2)" strokeWidth="1" />
                                        {/* Left Line */}
                                        <line x1="50%" y1="50%" x2="20%" y2="50%" stroke="rgba(255,81,0,0.2)" strokeWidth="1" />
                                        {/* Right Lines */}
                                        <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="rgba(255,81,0,0.2)" strokeWidth="1" />
                                    </svg>

                                    {/* Top Node - India */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#1A1A1A]/80 border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-[#FF5100]" />
                                            <div className="text-left">
                                                <div className="text-white text-xs font-medium">India ·</div>
                                                <div className="text-[#FF5100] text-[10px] font-mono">ITC-HS</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Left Node - Voice & API */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#1A1A1A]/80 border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-[#FF5100]" />
                                            <span className="text-white text-xs font-medium">Voice & API</span>
                                        </div>
                                    </div>

                                    {/* Center Hub */}
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#FF5100] flex items-center justify-center shadow-[0_0_60px_rgba(255,81,0,0.4)] rotate-3 hover:rotate-0 transition-transform">
                                            <Languages className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Right Nodes - Icons */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A]/80 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                            <Ship className="w-5 h-5 text-[#FF5100]" />
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A]/80 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                            <Globe className="w-5 h-5 text-[#FF5100]" />
                                        </div>
                                    </div>

                                    {/* Bottom Node - EU */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#1A1A1A]/80 border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <Flag className="w-4 h-4 text-[#FF5100]" />
                                            <div className="text-left">
                                                <div className="text-white text-xs font-medium">EU ·</div>
                                                <div className="text-[#FF5100] text-[10px] font-mono">CN Code</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - AI Task Automation */}
                        <div className="group relative p-8 rounded-[32px] overflow-hidden min-h-[380px] border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(15,15,15,1) 100%)' }}>
                            {/* Precise Spotlight Gradient - Matches Reference 'Hill of Light' */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,81,0,0.25) 0%, rgba(255,81,0,0.1) 50%, transparent 100%)'
                                }}
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(255,81,0,0.4) 0%, rgba(255,81,0,0.1) 60%, transparent 100%)'
                                }}
                            />

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    VAYA AITask Automation<br />
                                    <span className="text-[#FF5100]">Powered by AI</span>
                                </h3>
                                <p className="text-[#666] text-sm mb-8">
                                    End-to-end task automation powered by VAYA AI for greater accuracy, speed, and control.
                                </p>

                                {/* Workflow Diagram */}
                                <div className="flex flex-col gap-4 items-center">
                                    {/* Avatars Row */}
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5100] to-[#FF8F00] border-2 border-[#080808]" />
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#666] to-[#333] border-2 border-[#080808]" />
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#444] to-[#222] border-2 border-[#080808]" />
                                    </div>

                                    {/* Status Pills */}
                                    <div className="flex gap-3">
                                        <span className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#FF5100]/30 text-[#FF5100] text-xs font-semibold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100]" />
                                            Started
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/10 text-white text-xs font-semibold flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Virtual Agents */}
                        <div className="group relative p-8 rounded-[32px] overflow-hidden min-h-[320px] border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(15,15,15,1) 100%)' }}>
                            {/* Precise Spotlight Gradient - Matches Reference 'Hill of Light' */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,81,0,0.25) 0%, rgba(255,81,0,0.1) 50%, transparent 100%)'
                                }}
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(255,81,0,0.4) 0%, rgba(255,81,0,0.1) 60%, transparent 100%)'
                                }}
                            />

                            <div className="relative z-10">
                                {/* Floating Icon */}
                                <div className="w-10 h-10 rounded-full bg-[#FF5100] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,81,0,0.4)]">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>

                                {/* User Cards */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5100] to-[#FF8F00]" />
                                        <span className="text-white text-sm font-medium">Export Manager</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#666] to-[#333]" />
                                        <span className="text-white text-sm font-medium">Compliance Officer</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">AI's Human-Like Virtual Agents</h3>
                                <p className="text-[#666] text-sm">
                                    VAYA AI creates virtual agents that adapt to your style and deliver tailored trade experiences.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 - Full Autopilot */}
                        <div className="group relative p-8 rounded-[32px] overflow-hidden min-h-[320px] border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(15,15,15,1) 100%)' }}>
                            {/* Precise Spotlight Gradient - Matches Reference 'Hill of Light' */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,81,0,0.25) 0%, rgba(255,81,0,0.1) 50%, transparent 100%)'
                                }}
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(255,81,0,0.4) 0%, rgba(255,81,0,0.1) 60%, transparent 100%)'
                                }}
                            />

                            <div className="relative z-10">
                                {/* Floating Icon */}
                                <div className="w-10 h-10 rounded-full bg-[#FF5100] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,81,0,0.4)]">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>

                                {/* Task Cards */}
                                <div className="flex gap-3 mb-6">
                                    <div className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-white/5">
                                        <div className="text-white text-xs font-semibold mb-1">• Map HS Codes</div>
                                        <div className="text-[#555] text-[10px]">Today at  08:45</div>
                                    </div>
                                    <div className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-white/5">
                                        <div className="text-white text-xs font-semibold mb-1">• Generate CBAM Report</div>
                                        <div className="text-[#555] text-[10px]">Today at  09:15</div>
                                    </div>
                                </div>

                                {/* Avatars + Status */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5100] to-[#FF8F00] border-2 border-[#080808]" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#666] to-[#333] border-2 border-[#080808]" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-[#FF5100]/10 border border-[#FF5100]/20 text-[#FF5100] text-xs font-semibold">
                                        Started
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Full Autopilot for Smarter Operations</h3>
                                <p className="text-[#666] text-sm">
                                    VAYA AI automates routine work so your team can focus on high-value, strategic initiatives.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Bridge - Visual Section */}
            <section id="bridge" className="py-24 px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="relative bg-[#0F0F0F] border border-white/5 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5100]/5 via-transparent to-[#FF5100]/5 pointer-events-none" />

                        <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                            {/* India Side */}
                            <div className="text-center md:text-left p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#FF5100]/20 transition-all">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FF5100]/10 flex items-center justify-center text-[#FF5100]">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-[#FF5100]">INDIA (Exporter)</span>
                                </div>
                                <div className="text-4xl font-mono font-bold text-white mb-2 tracking-tight">
                                    <span className="text-[#555]">7318</span> <span className="text-[#FF5100]">15 00</span>
                                </div>
                                <p className="text-sm text-[#999]">ITC-HS Code (8-digit)</p>
                            </div>

                            {/* Bridge / Arrow */}
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className={`relative w-full max-w-[200px] h-2 bg-gradient-to-r from-[#333] via-[#FF5100] to-[#333] rounded-full overflow-hidden`}>
                                    <div className={`absolute top-0 left-0 h-full w-8 bg-white/50 rounded-full blur-sm ${animateBridge ? 'animate-bridge-flash' : 'opacity-0'}`}></div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 bg-[#FF5100]/10 text-[#FF5100] px-4 py-2 rounded-full text-sm font-bold border border-[#FF5100]/20">
                                    <Languages className="w-4 h-4" />
                                    VAYA BRIDGE
                                </div>
                            </div>

                            {/* EU Side */}
                            <div className="text-center md:text-right p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#FF5100]/20 transition-all">
                                <div className="flex items-center justify-center md:justify-end gap-3 mb-4">
                                    <span className="font-bold text-[#FAFAFA]">EUROPE (Importer)</span>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                                        <Ship className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-4xl font-mono font-bold text-white mb-2 tracking-tight">
                                    <span className="text-[#555]">7318</span> <span className="text-white">15 90</span>
                                </div>
                                <p className="text-sm text-[#999]">CN Code (8-digit)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Demo Section */}
            <section id="demo" className="py-24 px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">Try the Translation Engine</h2>
                        <p className="text-[#999]">Type a product name and watch the bridge in action.</p>
                    </div>

                    <div className="bg-[#0F0F0F] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
                        {/* Search Input */}
                        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                                <input
                                    type="text"
                                    placeholder="Try: Steel Screws, Aluminum Sheets, Nut Bolt..."
                                    className="w-full pl-14 pr-4 py-5 bg-[#080808] border border-white/10 rounded-2xl text-white placeholder-[#444] focus:outline-none focus:border-[#FF5100] transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="w-full md:w-auto px-8 py-5 bg-[#FAFAFA] text-black font-bold rounded-2xl hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="flex items-center gap-2"><span>Translate</span> <ArrowRight className="w-4 h-4" /></div>}
                            </button>
                        </div>

                        {/* Results Area */}
                        <div className="p-12 min-h-[350px] bg-gradient-to-b from-[#0F0F0F] to-[#080808]">
                            {!mappingResult && !isSearching && (
                                <div className="h-full flex flex-col items-center justify-center text-[#444] py-12">
                                    <ArrowRightLeft className="w-16 h-16 mb-6 opacity-20" />
                                    <p className="text-lg">Enter a product to see the India ↔ EU code translation</p>
                                </div>
                            )}

                            {isSearching && (
                                <div className="h-full flex flex-col items-center justify-center text-[#FF5100] py-12">
                                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                    <p className="text-lg animate-pulse text-[#666]">Mapping customs codes...</p>
                                </div>
                            )}

                            {mappingResult && !isSearching && (
                                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                                    {/* Result Cards - New Theme */}
                                    {/* India */}
                                    <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 flex flex-col relative group">
                                        <div className="text-[#FF5100] font-bold text-sm mb-4 tracking-widest uppercase">From India</div>
                                        <div className="text-4xl font-mono font-bold text-white mb-2">{mappingResult.indian}</div>
                                        <p className="text-sm text-[#888] mb-4">{mappingResult.indianDesc}</p>
                                        <div className="mt-auto pt-4 border-t border-white/5">
                                            <span className="text-xs text-[#444]">ITC-HS Standard</span>
                                        </div>
                                    </div>

                                    {/* Mapped Arrow */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className={`p-4 rounded-full bg-[#FF5100]/10 text-[#FF5100] mb-2 transition-all duration-500 ${animateBridge ? 'scale-110 bg-[#FF5100] text-black' : ''}`}>
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-widest text-[#444] uppercase">Matched</span>
                                    </div>

                                    {/* EU */}
                                    <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 flex flex-col relative group">
                                        <div className="text-white font-bold text-sm mb-4 tracking-widest uppercase flex justify-between">
                                            <span>To Europe</span>
                                            {mappingResult.cbam && <span className="bg-[#FF5100] text-black text-[10px] px-2 py-0.5 rounded font-bold">CBAM</span>}
                                        </div>
                                        <div className="text-4xl font-mono font-bold text-white mb-2">{mappingResult.eu}</div>
                                        <p className="text-sm text-[#888] mb-4">{mappingResult.euDesc}</p>
                                        <div className="mt-auto pt-4 border-t border-white/5">
                                            <span className="text-xs text-[#444]">CN Code Standard</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section - With Scroll Animation */}
            <section id="process-section" className="py-24 px-4 relative z-10 bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20">
                    {/* Left Column: Sticky Heading */}
                    <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[#FF5100] font-semibold text-sm">//</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5100] to-[#FAFAFA] font-semibold text-sm uppercase tracking-wider">
                                Process
                            </span>
                        </div>

                        {/* Scroll-Linked Gradient Title */}
                        <h2
                            className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text mb-8 leading-[0.9] transition-all duration-75 ease-linear"
                            style={{
                                backgroundImage: `linear-gradient(to right, #FF5100 ${scrollProgress * 100}%, #FAFAFA ${Math.min(100, (scrollProgress * 100) + 20)}%)`
                            }}
                        >
                            Approach
                        </h2>

                        <p className="text-[#999999] text-lg max-w-md mb-12">
                            From automation to advanced analytics, we bring your vision to life with custom AI.
                        </p>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/30 transition-all group"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5100] to-white font-semibold group-hover:opacity-80 transition-opacity">
                                Start Mapping
                            </span>
                        </Link>
                    </div>

                    {/* Right Column: Steps */}
                    <div className="lg:w-1/2 flex flex-col gap-6">
                        {[
                            {
                                num: "01",
                                title: "Subscribe",
                                desc: "Choose your plan and launch in minutes — upgrade, pause, or cancel anytime."
                            },
                            {
                                num: "02",
                                title: "Analyze",
                                desc: "We begin by auditing your workflows to pinpoint where AI can streamline and elevate your processes."
                            },
                            {
                                num: "03",
                                title: "Build & Implement",
                                desc: "Next, our engineers craft bespoke AI solutions for your company — relentlessly prioritizing quality and safety."
                            },
                            {
                                num: "04",
                                title: "Test & Optimise",
                                desc: "You approve or request revisions — we iterate fast, polishing each build until you’re fully satisfied."
                            }
                        ].map((step, i) => (
                            <div
                                key={i}
                                data-index={i}
                                className={`group relative p-8 rounded-2xl bg-[#0F0F0F] border transition-all duration-300 min-h-[220px] flex flex-col justify-between ${activeProcessStep === i
                                    ? 'border-[#FF5100]/40 shadow-[0_0_80px_-20px_rgba(255,81,0,0.15)] opacity-100'
                                    : 'border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-60'
                                    }`}
                            >
                                {/* Highlighter Bars - Global Progress Logic */}
                                <div className="absolute top-8 right-8 flex gap-1">
                                    {[...Array(4)].map((_, barIndex) => (
                                        <div
                                            key={barIndex}
                                            className={`w-1.5 h-4 rounded-sm transition-all duration-300 ${barIndex <= activeProcessStep
                                                ? 'bg-[#FF5100] shadow-[0_0_10px_rgba(255,81,0,0.6)]'
                                                : 'bg-[#333]'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <span className={`text-4xl font-bold font-mono transition-colors duration-300 ${activeProcessStep === i
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FF5100]/50 drop-shadow-[0_0_15px_rgba(255,81,0,0.3)]'
                                        : 'text-white/20'
                                        }`}>
                                        {step.num}.
                                    </span>
                                </div>

                                <div>
                                    <h3 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${activeProcessStep === i ? 'text-white' : 'text-white/60'
                                        }`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-[#999] leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section id="faq" className="py-24 px-4 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 tracking-tighter">Understanding the <span className="text-[#999]">Bridge</span></h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="group border border-white/5 rounded-2xl bg-[#0F0F0F] overflow-hidden hover:border-[#FF5100]/20 transition-all">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-6 text-left flex items-center justify-between"
                                >
                                    <span className="font-semibold text-lg group-hover:text-white text-[#FAFAFA] transition-colors">{faq.q}</span>
                                    <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                                        <ChevronDown className={`w-5 h-5 ${openFaq === i ? 'text-[#FF5100]' : 'text-[#666]'}`} />
                                    </div>
                                </button>
                                {openFaq === i && (
                                    <div className="p-6 pt-0 text-[#999] leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer - Minimal */}
            <footer className="py-12 border-t border-white/5 bg-[#080808] text-[#444] text-sm text-center relative z-10">
                <p>© 2025 VAYA Logistics. The Bridge for Indian Exporters.</p>
            </footer>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes bridge-flash {
                  0% { left: 0; opacity: 1; }
                  100% { left: 100%; opacity: 0; }
                }
                .animate-bridge-flash {
                  animation: bridge-flash 1s ease-out forwards;
                }
                @media (min-width: 768px) {
                  :global(.hero-title) {
                    font-size: 70px;
                  }
                }
              `}</style>
        </div>
    );
}
