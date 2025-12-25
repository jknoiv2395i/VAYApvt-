
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
  Star
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Simple", "Fast", "Accurate", "Compliant"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">VAYA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hs-codes" className="text-gray-400 hover:text-white transition-colors">HS Codes</Link>
              <Link href="/cbam-engine" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-4 h-4" />
                CBAM Engine
              </Link>
              <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/advisor" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <Bot className="w-4 h-4" />
                AI Advisor
              </Link>
            </div>

            <div className="flex items-center gap-3">
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
      <section className="relative pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Trusted by 500+ Indian Exporters</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">EU Ready</span>
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

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Navigate <span className="text-emerald-400 font-medium">EU CBAM</span> and{" "}
            <span className="text-violet-400 font-medium">EUDR</span> regulations effortlessly.
            Generate compliant reports in minutes, not days.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-16">
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "15K+", label: "HS Codes", icon: FileText },
              { value: "99%", label: "Accuracy", icon: Check },
              { value: "<5m", label: "Report Gen", icon: Zap },
              { value: "24/7", label: "AI Support", icon: Bot },
            ].map((stat) => (
              <div key={stat.label} className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:bg-white/10 transition-all">
                <stat.icon className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium">FEATURES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Everything for EU Trade Compliance
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              One platform for all your export documentation and regulatory needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "AI HS Code Lookup",
                description: "Describe your product in plain English and get accurate HS code suggestions powered by Gemini AI",
                color: "emerald",
                link: "/hs-codes",
              },
              {
                icon: Factory,
                title: "CBAM Reports",
                description: "Auto-calculate carbon emissions, validate against EU rules, generate XML reports for the CBAM portal",
                color: "violet",
                link: "/cbam",
              },
              {
                icon: Leaf,
                title: "EUDR Compliance",
                description: "Geolocation validation, GeoJSON generation, and due diligence statements for deforestation-free exports",
                color: "green",
                link: "#",
                soon: true,
              },
              {
                icon: Upload,
                title: "Invoice OCR",
                description: "Upload invoices and let AI extract HS codes, quantities, and values automatically",
                color: "amber",
                link: "/cbam",
              },
              {
                icon: Bot,
                title: "AI Trade Advisor",
                description: "Ask questions about duties, regulations, and compliance in natural language",
                color: "cyan",
                link: "/advisor",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp Bot",
                description: "Quick HS code lookups and trade questions via WhatsApp - no app install needed",
                color: "teal",
                link: "#",
              },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.link}
                className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all relative overflow-hidden"
              >
                {feature.soon && (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                    Coming Soon
                  </span>
                )}
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-medium">PRICING</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "₹0",
                period: "forever",
                features: ["10 HS Code lookups/month", "Basic CBAM reports", "WhatsApp support", "Email support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "₹2,499",
                period: "/month",
                features: ["Unlimited HS lookups", "Unlimited CBAM reports", "AI document extraction", "Priority support", "API access"],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"],
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
                    <li key={feature} className="flex items-center gap-3 text-gray-300">
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Simplify Your<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  EU Export Compliance?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                Join 500+ Indian exporters who trust VAYA for CBAM & EUDR compliance
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
                  href="/advisor"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Bot className="w-5 h-5" />
                  Try AI Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-gray-500">© 2025 VAYA. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
