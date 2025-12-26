'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    FileText,
    Sparkles,
    Shield,
    TrendingUp,
    Package,
    CheckCircle,
    Factory,
    Globe,
    Zap,
    FileCheck,
    Layers,
    BarChart3,
    Clock,
    Download,
    Upload,
    Play,
    Check,
    Star,
    Users,
    Award,
    Lock,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Mail,
    Phone,
    MapPin,
    Leaf,
    Target,
    Calculator,
    FileCode,
    Database,
    RefreshCw
} from 'lucide-react';

export default function CBAMFeaturesPage() {
    const [activeScreenshot, setActiveScreenshot] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveScreenshot((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const screenshots = [
        { src: '/cbam-dashboard.png', title: 'Dashboard Overview', desc: 'Track all reports, emissions & costs at a glance' },
        { src: '/cbam-modal.png', title: 'Create Reports', desc: 'Simple form with smart defaults and validation' },
        { src: '/cbam-xml.png', title: 'EU-Compliant XML', desc: 'Auto-generated XML ready for submission' },
    ];

    const faqs = [
        {
            q: 'What is CBAM and why do Indian exporters need it?',
            a: 'The Carbon Border Adjustment Mechanism (CBAM) is an EU regulation requiring importers to purchase certificates for the carbon emissions embedded in goods like steel, aluminum, cement, fertilizers, hydrogen, and electricity imported into the EU. Indian exporters must provide accurate emissions data to their EU buyers to remain competitive and avoid additional costs.'
        },
        {
            q: 'What documents do I need to generate a CBAM report?',
            a: 'You need: HS code of your product, quantity exported (in kg), your production facility details, direct emissions data (fuel consumption), and indirect emissions data (electricity consumption). VAYA can estimate emissions using default factors if you don\'t have exact data.'
        },
        {
            q: 'Is VAYA\'s XML output accepted by the EU CBAM registry?',
            a: 'Yes! VAYA generates XML files that comply with EU Regulation 2023/956 and the technical specifications published by the European Commission. The XML structure follows the official urn:ec.europa.eu:taxud:cbam namespace.'
        },
        {
            q: 'How are emissions calculated?',
            a: 'VAYA calculates both direct emissions (Scope 1 from fuel combustion) and indirect emissions (Scope 2 from electricity). For Indian exports, we use the Central Electricity Authority\'s grid emission factor of 0.82 kgCO2/kWh. You can also input actual measured emissions if available.'
        },
        {
            q: 'What is the current carbon price and CBAM cost?',
            a: 'As of 2024, the EU ETS carbon price is approximately €93 per tonne of CO2. During the transitional period (2023-2025), no actual payment is required, but accurate reporting is mandatory. From 2026, importers will need to purchase CBAM certificates.'
        },
        {
            q: 'Can I merge multiple invoices into one quarterly report?',
            a: 'Absolutely! VAYA\'s Multi-Invoice Merge feature allows you to combine multiple goods and invoices into a single quarterly CBAM submission, perfect for high-volume exporters with diverse product lines.'
        }
    ];

    const comparisonFeatures = [
        { feature: 'EU-Compliant XML Generation', vaya: true, manual: false, others: true },
        { feature: 'AI-Powered HS Code Classification', vaya: true, manual: false, others: false },
        { feature: 'India-Specific Emission Factors', vaya: true, manual: false, others: false },
        { feature: 'Multi-Invoice Merging', vaya: true, manual: false, others: false },
        { feature: 'Real-Time Validation', vaya: true, manual: false, others: true },
        { feature: 'Carbon Cost Estimation', vaya: true, manual: false, others: true },
        { feature: 'Status Workflow Tracking', vaya: true, manual: false, others: false },
        { feature: 'Report Generation Time', vaya: '<5 min', manual: '2-4 hours', others: '15-30 min' },
        { feature: 'Accuracy', vaya: '99.5%', manual: '~85%', others: '95%' },
        { feature: 'Cost per Report', vaya: 'Free / Low', manual: 'High (labor)', others: '$$' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Factory className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">VAYA <span className="text-emerald-400">CBAM</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
                        <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a>
                        <a href="#comparison" className="text-gray-400 hover:text-white transition-colors text-sm">Compare</a>
                        <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm hidden sm:block">Login</Link>
                        <Link href="/cbam" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg font-medium text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25">
                            Open Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-16 pb-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Text */}
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">EU Reg. 2023/956</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs text-amber-400 font-medium">Transitional Period Active</span>
                                </div>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Simplify Your <br />
                                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text">
                                    CBAM Compliance
                                </span>
                            </h1>

                            <p className="text-lg text-gray-400 mb-6">
                                AI-powered Carbon Border Adjustment Mechanism reporting for <strong className="text-white">Indian exporters</strong>.
                                Generate EU-compliant XML reports in minutes, not days.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'No complex spreadsheets or manual calculations',
                                    'India-specific grid emission factors built-in',
                                    'Instant validation against EU requirements',
                                    'Download XML ready for CBAM transitional registry'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/cbam" className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl shadow-emerald-500/30">
                                    Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#demo" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                                    <Play className="w-5 h-5" /> Watch Demo
                                </a>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">No credit card required • Free forever for basic reports</p>
                        </div>

                        {/* Right - Screenshot Carousel */}
                        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-slate-900">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center gap-2 px-4 z-10">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-xs text-gray-500 ml-4">vaya.app/cbam</span>
                                </div>
                                <div className="pt-8">
                                    <img
                                        src={screenshots[activeScreenshot].src}
                                        alt={screenshots[activeScreenshot].title}
                                        className="w-full transition-all duration-500"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="flex justify-center gap-3 mt-6">
                                {screenshots.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveScreenshot(i)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-all ${activeScreenshot === i
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                                : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {s.title}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-3">{screenshots[activeScreenshot].desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="relative z-10 py-8 px-6 border-y border-white/5 bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <img src="https://flagcdn.com/32x24/eu.png" alt="EU" className="opacity-80" />
                            <div>
                                <p className="text-xs text-gray-500">Compliant With</p>
                                <p className="text-sm font-medium">EU CBAM Registry</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src="https://flagcdn.com/32x24/in.png" alt="India" className="opacity-80" />
                            <div>
                                <p className="text-xs text-gray-500">Built For</p>
                                <p className="text-sm font-medium">Indian Exporters</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Lock className="w-6 h-6 text-emerald-400" />
                            <div>
                                <p className="text-xs text-gray-500">Data Security</p>
                                <p className="text-sm font-medium">256-bit Encryption</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-amber-400" />
                            <div>
                                <p className="text-xs text-gray-500">Accuracy Rate</p>
                                <p className="text-sm font-medium">99.5% Validated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '100%', label: 'EU Regulation Compliant', icon: Shield, color: 'emerald' },
                        { value: '<5 min', label: 'Average Report Time', icon: Clock, color: 'violet' },
                        { value: '€93/t', label: 'Current Carbon Price', icon: TrendingUp, color: 'amber' },
                        { value: '6', label: 'CBAM Product Categories', icon: Layers, color: 'teal' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                            <stat.icon className={`w-10 h-10 text-${stat.color}-400 mx-auto mb-3`} />
                            <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Problem Statement */}
            <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-red-500/5 to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        The <span className="text-amber-400">CBAM Challenge</span> for Indian Exporters
                    </h2>
                    <p className="text-lg text-gray-400 mb-8">
                        From 2026, EU importers must purchase CBAM certificates for carbon embedded in imported goods.
                        Accurate emissions reporting is <strong className="text-white">mandatory during the transitional period (2023-2025)</strong>
                        or risk losing EU market access.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        {[
                            { stat: '€93', label: 'per tonne CO2 in 2024', icon: TrendingUp },
                            { stat: '30%', label: 'of India\'s steel exports go to EU', icon: Factory },
                            { stat: '₹8,400 Cr', label: 'estimated annual CBAM impact', icon: Target },
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/5 border border-amber-500/20 rounded-2xl">
                                <item.icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                                <p className="text-2xl font-bold text-white">{item.stat}</p>
                                <p className="text-sm text-gray-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Features</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">Everything You Need for <span className="text-emerald-400">CBAM Compliance</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Comprehensive tools designed specifically for Indian exporters to meet EU carbon border requirements</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Sparkles,
                                title: 'AI-Powered HS Code Classification',
                                desc: 'Automatically identify CBAM categories (Iron & Steel, Aluminium, Cement, Fertilizers, Hydrogen, Electricity) from your 8-digit HS codes using smart AI matching.',
                                color: 'emerald',
                                tag: 'AI'
                            },
                            {
                                icon: FileCode,
                                title: 'EU-Compliant XML Generation',
                                desc: 'Generate XML files that meet EU Regulation 2023/956 specifications. Ready for direct upload to the CBAM transitional registry without modifications.',
                                color: 'violet',
                                tag: 'Core'
                            },
                            {
                                icon: Calculator,
                                title: 'Smart Emissions Calculator',
                                desc: 'Calculate Scope 1 (direct) and Scope 2 (indirect) emissions automatically. Uses India\'s CEA grid factor (0.82 kgCO2/kWh) for accurate electricity emissions.',
                                color: 'amber',
                                tag: 'Calculator'
                            },
                            {
                                icon: Layers,
                                title: 'Multi-Invoice Merging',
                                desc: 'Combine multiple invoices, goods, and shipments into a single quarterly CBAM submission. Perfect for high-volume exporters with diverse product lines.',
                                color: 'blue',
                                tag: 'Pro'
                            },
                            {
                                icon: FileCheck,
                                title: 'Real-Time Validation',
                                desc: 'Instant validation of EORI numbers, HS code formats, reporting periods, and emissions data. Catch errors before submission to avoid rejections.',
                                color: 'purple',
                                tag: 'Validation'
                            },
                            {
                                icon: RefreshCw,
                                title: 'Complete Status Workflow',
                                desc: 'Track reports from Draft → Generated → Validated → Submitted. Full audit trail with timestamps for compliance documentation requirements.',
                                color: 'teal',
                                tag: 'Workflow'
                            },
                            {
                                icon: Database,
                                title: 'Report History & Archive',
                                desc: 'Maintain a complete history of all CBAM reports with secure cloud storage. Search, filter, and download past reports anytime for audits.',
                                color: 'cyan',
                                tag: 'Storage'
                            },
                            {
                                icon: Download,
                                title: 'Flexible Download Options',
                                desc: 'Download individual XML files or complete ZIP packages with XML + certificate + summary PDF. Ready for EU importer handoff.',
                                color: 'pink',
                                tag: 'Export'
                            },
                            {
                                icon: Globe,
                                title: 'Carbon Price Tracking',
                                desc: 'Real-time EU ETS carbon price integration. See estimated CBAM costs for each shipment based on current market rates (€93/tCO2 as of 2024).',
                                color: 'orange',
                                tag: 'Live'
                            },
                        ].map((f, i) => (
                            <div key={i} className="group p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <span className={`text-xs px-2 py-1 rounded-full bg-${f.color}-500/20 text-${f.color}-400 border border-${f.color}-500/30`}>
                                        {f.tag}
                                    </span>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${f.color}-500/20 to-${f.color}-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <f.icon className={`w-7 h-7 text-${f.color}-400`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="relative z-10 py-24 px-6 bg-black/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Demo</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">See It In <span className="text-emerald-400">Action</span></h2>
                        <p className="text-gray-400">Click through our actual interface to explore the workflow</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {screenshots.map((s, i) => (
                            <div key={i} className="group cursor-pointer" onClick={() => setActiveScreenshot(i)}>
                                <div className={`relative rounded-xl overflow-hidden border-2 transition-all ${activeScreenshot === i ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' : 'border-white/10 hover:border-white/30'
                                    }`}>
                                    <img src={s.src} alt={s.title} className="w-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Step {i + 1}</span>
                                            </div>
                                            <h4 className="font-bold text-white">{s.title}</h4>
                                            <p className="text-xs text-gray-400">{s.desc}</p>
                                        </div>
                                    </div>
                                    {activeScreenshot === i && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Process</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">How It <span className="text-emerald-400">Works</span></h2>
                        <p className="text-gray-400">From invoice to EU submission in 4 simple steps</p>
                    </div>

                    <div className="relative">
                        {/* Connection line */}
                        <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent hidden md:block" />

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { step: '01', title: 'Upload Invoice', desc: 'Upload PDF/image or enter product details manually. Our AI extracts HS codes and quantities automatically.', icon: Upload },
                                { step: '02', title: 'AI Classification', desc: 'AI identifies CBAM category, validates HS codes, and maps products to correct emissions factors.', icon: Sparkles },
                                { step: '03', title: 'Calculate & Generate', desc: 'System calculates direct and indirect emissions, applies India grid factors, generates EU-compliant XML.', icon: FileText },
                                { step: '04', title: 'Download & Submit', desc: 'Download XML + certificate package. Share with EU importer for CBAM registry submission.', icon: Download },
                            ].map((item, i) => (
                                <div key={i} className="relative text-center group">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-emerald-500 transition-all">
                                        <item.icon className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <span className="inline-block text-xs text-emerald-500 font-bold mb-2 px-3 py-1 bg-emerald-500/10 rounded-full">STEP {item.step}</span>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CBAM Categories */}
            <section className="relative z-10 py-24 px-6 bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Coverage</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">All <span className="text-emerald-400">CBAM Product Categories</span></h2>
                        <p className="text-gray-400">Complete coverage for all goods under EU CBAM regulation</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Iron & Steel', code: 'Ch. 72-73', color: 'from-slate-400 to-slate-600', examples: 'Hot-rolled, Cold-rolled, Tubes, Pipes' },
                            { name: 'Aluminium', code: 'Ch. 76', color: 'from-zinc-300 to-zinc-500', examples: 'Unwrought, Bars, Plates, Foils' },
                            { name: 'Cement', code: 'Ch. 25', color: 'from-stone-400 to-stone-600', examples: 'Portland, Aluminous, Clinkers' },
                            { name: 'Fertilizers', code: 'Ch. 28, 31', color: 'from-green-400 to-green-600', examples: 'Urea, Ammonia, Nitrates' },
                            { name: 'Hydrogen', code: 'Ch. 28', color: 'from-cyan-400 to-cyan-600', examples: 'Green, Grey, Blue Hydrogen' },
                            { name: 'Electricity', code: 'CN 2716', color: 'from-yellow-400 to-amber-600', examples: 'Electrical Energy' },
                        ].map((cat, i) => (
                            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 hover:scale-105 transition-all cursor-pointer group">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                    <Factory className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="font-bold text-base mb-1">{cat.name}</h4>
                                <p className="text-xs text-emerald-400 font-medium mb-2">{cat.code}</p>
                                <p className="text-xs text-gray-500">{cat.examples}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section id="comparison" className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Comparison</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">Why Choose <span className="text-emerald-400">VAYA CBAM</span>?</h2>
                        <p className="text-gray-400">See how VAYA stacks up against alternatives</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                                    <th className="py-4 px-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-2">
                                                <Factory className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-bold text-emerald-400">VAYA</span>
                                        </div>
                                    </th>
                                    <th className="py-4 px-4 text-center text-gray-400 font-medium">Manual Process</th>
                                    <th className="py-4 px-4 text-center text-gray-400 font-medium">Other Tools</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-4 px-4 text-gray-300">{row.feature}</td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row.vaya === 'boolean' ? (
                                                row.vaya ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <span className="text-gray-600">—</span>
                                            ) : <span className="text-emerald-400 font-bold">{row.vaya}</span>}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row.manual === 'boolean' ? (
                                                row.manual ? <Check className="w-5 h-5 text-gray-400 mx-auto" /> : <span className="text-gray-600">—</span>
                                            ) : <span className="text-gray-400">{row.manual}</span>}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row.others === 'boolean' ? (
                                                row.others ? <Check className="w-5 h-5 text-gray-400 mx-auto" /> : <span className="text-gray-600">—</span>
                                            ) : <span className="text-gray-400">{row.others}</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="relative z-10 py-24 px-6 bg-black/20">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">FAQ</span>
                        <h2 className="text-4xl font-bold mb-4 mt-2">Frequently Asked <span className="text-emerald-400">Questions</span></h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-medium text-white pr-4">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-12 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)]" />
                        <div className="relative z-10 text-center">
                            <Leaf className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                            <h2 className="text-4xl font-bold mb-4">Ready to Simplify Your CBAM Compliance?</h2>
                            <p className="text-gray-400 max-w-xl mx-auto mb-8">
                                Join hundreds of Indian exporters already using VAYA to generate EU-compliant CBAM reports.
                                Start free today — no credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/cbam" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl shadow-emerald-500/30">
                                    Start Free Now <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/pricing" className="inline-flex items-center gap-2 px-10 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                                    View Pricing
                                </Link>
                            </div>
                            <p className="text-xs text-gray-500 mt-6">Free plan includes 5 reports/month • Pro plans from ₹999/month</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-16 px-6 bg-black/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                                    <Factory className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">VAYA CBAM</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                AI-powered CBAM compliance for Indian exporters. Generate EU-compliant reports in minutes.
                            </p>
                            <div className="flex items-center gap-2">
                                <img src="https://flagcdn.com/24x18/eu.png" alt="EU" className="opacity-60" />
                                <span className="text-xs text-gray-500">EU Reg. 2023/956 Compliant</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/cbam" className="hover:text-white transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">CBAM Guide</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">HS Code Lookup</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <a href="mailto:support@vaya.trade" className="hover:text-white transition-colors">support@vaya.trade</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+91 80 4567 8900</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    <span>Bangalore, India</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">© 2024 VAYA Trade Technologies. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
