"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Shield,
  Globe,
  ArrowRight,
  Sparkles,
  Check,
  Zap,
  Bot,
  Upload,
  Factory,
  Leaf,
  MessageCircle,
  ChevronRight,
  Star,
  Play,
  ChevronDown,
  Building2,
  FileCode,
  Database,
  Users,
  Award,
  Lock,
  Target,
  Calculator,
  TrendingUp,
  BarChart3,
  Layers,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const words = ["Simple", "Fast", "Accurate", "Compliant"];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/dashboard';
    }
  };

  const mainFeatures = [
    {
      id: 'cbam',
      icon: Factory,
      title: 'CBAM Reporting',
      subtitle: 'EU Carbon Border Adjustment',
      description: 'Generate EU-compliant XML reports for carbon border adjustment mechanism. Calculate emissions, estimate costs, and submit to the CBAM transitional registry.',
      screenshot: '/cbam-dashboard.png',
      color: 'emerald',
      link: '/cbam',
      stats: [
        { label: 'Report Time', value: '<5 min' },
        { label: 'Accuracy', value: '99.5%' },
        { label: 'Carbon Price', value: '€93/t' },
      ],
      features: ['AI HS Code Classification', 'Emissions Calculator', 'Multi-Invoice Merge', 'Status Workflow']
    },
    {
      id: 'advisor',
      icon: Bot,
      title: 'AI Trade Advisor',
      subtitle: 'Intelligent Trade Assistant',
      description: 'Ask any trade compliance question in natural language. Get expert answers on duties, regulations, HS codes, CBAM, EUDR, and Indian export procedures.',
      screenshot: '/cbam-modal.png',
      color: 'violet',
      link: '/advisor',
      stats: [
        { label: 'Response Time', value: '<3 sec' },
        { label: 'Knowledge Base', value: '50K+ docs' },
        { label: 'Languages', value: '5+' },
      ],
      features: ['Natural Language Q&A', 'HS Code Suggestions', 'Duty Rate Lookup', 'Compliance Guidance']
    },
    {
      id: 'documents',
      icon: Upload,
      title: 'Smart Document Processing',
      subtitle: 'AI-Powered Extraction',
      description: 'Upload invoices, packing lists, and shipping documents. AI automatically extracts HS codes, quantities, and values for compliance checks.',
      screenshot: '/cbam-xml.png',
      color: 'amber',
      link: '/documents',
      stats: [
        { label: 'Extraction Time', value: '<10 sec' },
        { label: 'Supported Formats', value: 'PDF, IMG' },
        { label: 'Fields Extracted', value: '15+' },
      ],
      features: ['PDF/Image Upload', 'Auto HS Detection', 'Data Validation', 'CBAM Integration']
    },
    {
      id: 'hscode',
      icon: Search,
      title: 'HS Code Intelligence',
      subtitle: 'Smart Classification',
      description: 'Search 15,000+ HS codes with AI. Describe your product in plain text and get accurate 8-digit codes with duty rates and compliance requirements.',
      screenshot: '/cbam-dashboard.png',
      color: 'cyan',
      link: '/dashboard',
      stats: [
        { label: 'HS Codes', value: '15K+' },
        { label: 'Accuracy', value: '99%' },
        { label: 'Countries', value: '180+' },
      ],
      features: ['Natural Language Search', 'Duty Calculators', 'FTA Analysis', 'Export Controls']
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background with Ethereal Shadow */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden">
        {/* Ethereal Shadow Background */}
        <div className="absolute inset-0 z-0">
          <EtherealShadow
            color="rgba(16, 185, 129, 0.8)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">VAYA</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
                <Link href="/cbam-features" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                  <Factory className="w-4 h-4" /> CBAM
                </Link>
                <Link href="/advisor" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                  <Bot className="w-4 h-4" /> AI Advisor
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm hidden sm:block">Login</Link>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pt-28 pb-16 px-4 z-10">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Trusted by 500+ Indian Exporters</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">EU CBAM Ready</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
                  <Leaf className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs text-violet-400 font-medium">EUDR Compliant</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Trade Compliance <br />
                <span className="relative">
                  Made{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500">
                    {words[currentWord]}
                  </span>
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                The complete platform for <span className="text-emerald-400 font-medium">EU CBAM</span>,{" "}
                <span className="text-violet-400 font-medium">EUDR</span>, and trade compliance.
                AI-powered HS code lookup, carbon reporting, and smart document processing for Indian exporters.
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all" />
                  <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden">
                    <Search className="absolute left-5 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search HS Code or describe your product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-14 pr-36 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                    >
                      <Sparkles className="w-4 h-4" />
                      Search
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <span className="text-sm text-gray-500">Popular:</span>
                  {["73181500", "Steel Sheet", "Aluminium foil", "Cement"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 text-sm bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <Link href="/cbam" className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all">
                  <Factory className="w-5 h-5" /> Create CBAM Report
                </Link>
                <Link href="/advisor" className="flex items-center gap-2 px-6 py-3 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-xl hover:bg-violet-500/20 transition-all">
                  <Bot className="w-5 h-5" /> Ask AI Advisor
                </Link>
                <Link href="/documents" className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/20 transition-all">
                  <Upload className="w-5 h-5" /> Upload Invoice
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {[
                { value: "15K+", label: "HS Codes", icon: FileText },
                { value: "99%", label: "Accuracy", icon: Target },
                { value: "<5m", label: "Report Gen", icon: Zap },
                { value: "€93/t", label: "Carbon Price", icon: TrendingUp },
                { value: "24/7", label: "AI Support", icon: Bot },
              ].map((stat) => (
                <div key={stat.label} className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:bg-white/10 transition-all text-center">
                  <stat.icon className="w-6 h-6 text-emerald-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              One Platform, Complete <span className="text-emerald-400">Compliance</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to navigate EU trade regulations - from HS codes to CBAM reports
            </p>
          </div>

          {/* Feature Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {mainFeatures.map((feature, i) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeFeature === i
                    ? `bg-${feature.color}-500/20 text-${feature.color}-400 border border-${feature.color}-500/50`
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
              >
                <feature.icon className="w-4 h-4" />
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Display */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Feature Info */}
            <div className={`transition-all duration-500`}>
              <div className={`w-16 h-16 rounded-2xl bg-${mainFeatures[activeFeature].color}-500/20 flex items-center justify-center mb-6`}>
                {(() => {
                  const IconComponent = mainFeatures[activeFeature].icon;
                  return <IconComponent className={`w-8 h-8 text-${mainFeatures[activeFeature].color}-400`} />;
                })()}
              </div>
              <span className={`text-${mainFeatures[activeFeature].color}-400 text-sm font-medium`}>
                {mainFeatures[activeFeature].subtitle}
              </span>
              <h3 className="text-3xl font-bold text-white mt-2 mb-4">
                {mainFeatures[activeFeature].title}
              </h3>
              <p className="text-lg text-gray-400 mb-8">
                {mainFeatures[activeFeature].description}
              </p>

              {/* Feature Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {mainFeatures[activeFeature].stats.map((stat) => (
                  <div key={stat.label} className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Feature List */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {mainFeatures[activeFeature].features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-gray-300">
                    <Check className={`w-4 h-4 text-${mainFeatures[activeFeature].color}-400 flex-shrink-0`} />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href={mainFeatures[activeFeature].link}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-${mainFeatures[activeFeature].color}-500/20 border border-${mainFeatures[activeFeature].color}-500/50 text-${mainFeatures[activeFeature].color}-400 rounded-xl hover:bg-${mainFeatures[activeFeature].color}-500/30 transition-all`}
              >
                Try {mainFeatures[activeFeature].title} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right - Screenshot */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-slate-900">
                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center gap-2 px-4 z-10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500 ml-4">vaya.app/{mainFeatures[activeFeature].id}</span>
                </div>
                <div className="pt-8">
                  <img
                    src={mainFeatures[activeFeature].screenshot}
                    alt={mainFeatures[activeFeature].title}
                    className="w-full transition-all duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating badge */}
              <div className={`absolute -bottom-4 -right-4 px-4 py-2 bg-${mainFeatures[activeFeature].color}-500 text-white rounded-xl font-medium text-sm shadow-lg`}>
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-24 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Complete Toolkit</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-4">Everything for <span className="text-emerald-400">EU Trade Compliance</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Comprehensive tools designed for Indian exporters to meet EU regulations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Factory, title: "CBAM Reports", description: "EU-compliant XML generation with emissions calculation and carbon cost estimation", color: "emerald", link: "/cbam", tag: "Core" },
              { icon: Bot, title: "AI Trade Advisor", description: "Natural language Q&A for duties, regulations, and compliance guidance", color: "violet", link: "/advisor", tag: "AI" },
              { icon: Upload, title: "Invoice OCR", description: "Upload documents and auto-extract HS codes, quantities, and values", color: "amber", link: "/documents", tag: "Smart" },
              { icon: Search, title: "HS Code Lookup", description: "Search 15K+ codes with AI classification and duty calculators", color: "cyan", link: "/dashboard", tag: "Database" },
              { icon: Leaf, title: "EUDR Compliance", description: "Geolocation validation and due diligence for deforestation-free exports", color: "green", link: "#", soon: true, tag: "Soon" },
              { icon: MessageCircle, title: "WhatsApp Bot", description: "Quick HS code lookups and trade questions via WhatsApp", color: "teal", link: "#", tag: "Mobile" },
              { icon: Layers, title: "Multi-Invoice Merge", description: "Combine multiple invoices into single quarterly CBAM submissions", color: "purple", link: "/cbam", tag: "Pro" },
              { icon: RefreshCw, title: "Status Workflow", description: "Track reports from Draft → Validated → Submitted with audit trail", color: "pink", link: "/cbam", tag: "Workflow" },
              { icon: BarChart3, title: "Analytics Dashboard", description: "Track carbon footprint, costs, and compliance metrics over time", color: "orange", link: "/analytics", tag: "Insights" },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.link}
                className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all relative overflow-hidden"
              >
                {feature.soon ? (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded-full">Coming Soon</span>
                ) : (
                  <span className={`absolute top-4 right-4 px-2 py-1 text-xs bg-${feature.color}-500/20 text-${feature.color}-400 rounded-full`}>{feature.tag}</span>
                )}
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{feature.description}</p>
                <span className={`text-${feature.color}-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all`}>
                  Explore <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Process</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-4">How VAYA <span className="text-emerald-400">Works</span></h2>
            <p className="text-gray-400">From upload to compliant report in 4 simple steps</p>
          </div>

          <div className="relative">
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent hidden md:block" />

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Upload or Search', desc: 'Upload invoice/PDF or search HS codes by product description', icon: Upload },
                { step: '02', title: 'AI Processing', desc: 'AI extracts data, classifies products, and validates codes', icon: Sparkles },
                { step: '03', title: 'Generate Reports', desc: 'Create CBAM/EUDR reports with calculated emissions and costs', icon: FileCode },
                { step: '04', title: 'Submit & Track', desc: 'Download XML, submit to EU registry, and track status', icon: Check },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-emerald-500 transition-all">
                    <item.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="inline-block text-xs text-emerald-500 font-bold mb-2 px-3 py-1 bg-emerald-500/10 rounded-full">STEP {item.step}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 border-y border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            <div className="flex items-center gap-3">
              <img src="https://flagcdn.com/32x24/eu.png" alt="EU" className="opacity-80" />
              <div>
                <p className="text-xs text-gray-500">Compliant With</p>
                <p className="text-sm font-medium text-white">EU CBAM Registry</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://flagcdn.com/32x24/in.png" alt="India" className="opacity-80" />
              <div>
                <p className="text-xs text-gray-500">Built For</p>
                <p className="text-sm font-medium text-white">Indian Exporters</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-xs text-gray-500">Security</p>
                <p className="text-sm font-medium text-white">256-bit Encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-xs text-gray-500">Accuracy</p>
                <p className="text-sm font-medium text-white">99.5% Validated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold text-white mt-4 mb-4">Simple, <span className="text-emerald-400">Transparent</span> Pricing</h2>
            <p className="text-gray-400">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "₹0",
                period: "forever",
                features: ["10 HS Code lookups/month", "3 CBAM reports/month", "AI Trade Advisor", "Email support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "₹2,499",
                period: "/month",
                features: ["Unlimited HS lookups", "Unlimited CBAM reports", "Invoice OCR & extraction", "Multi-invoice merge", "Priority support", "API access"],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise deployment", "Training & onboarding"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${plan.popular
                  ? "bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/50 relative"
                  : "bg-white/5 border-white/10"
                  }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-300 text-sm">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block w-full py-3 text-center rounded-xl font-medium transition-all ${plan.popular
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 rounded-3xl blur-xl" />
            <div className="relative p-12 bg-slate-900/80 border border-white/10 rounded-3xl">
              <Leaf className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Simplify Your<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  EU Export Compliance?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                Join 500+ Indian exporters who trust VAYA for CBAM, EUDR, and trade compliance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Free
                </Link>
                <Link
                  href="/cbam"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Factory className="w-5 h-5" />
                  Try CBAM Reports
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-6">No credit card required • Free plan includes 3 CBAM reports/month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-bold text-xl text-white">VAYA</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Complete trade compliance platform for Indian exporters. CBAM, EUDR, HS codes, and more.
              </p>
              <div className="flex items-center gap-2">
                <img src="https://flagcdn.com/24x18/eu.png" alt="EU" className="opacity-60" />
                <span className="text-xs text-gray-500">EU Reg. 2023/956 Compliant</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/cbam" className="hover:text-white transition-colors">CBAM Reports</Link></li>
                <li><Link href="/advisor" className="hover:text-white transition-colors">AI Trade Advisor</Link></li>
                <li><Link href="/documents" className="hover:text-white transition-colors">Document Processing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">HS Code Lookup</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/cbam-features" className="hover:text-white transition-colors">CBAM Guide</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
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
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="https://wa.me/919876543210" className="hover:text-white transition-colors flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
