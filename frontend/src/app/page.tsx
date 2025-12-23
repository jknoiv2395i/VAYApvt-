"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, FileText, Shield, Globe, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-white font-bold text-xl">VAYA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered Trade Compliance</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Trade Compliance <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Navigate EU CBAM and EUDR regulations effortlessly. Generate compliant reports in minutes, not days.
          </p>

          {/* HS Code Search */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search HS Code or product description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Link
                href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "#"}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              Try: "steel screw", "73181500", "aluminum sheet"
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "15,000+", label: "HS Codes" },
              { value: "99%", label: "Accuracy" },
              { value: "5 min", label: "Report Time" },
              { value: "24/7", label: "WhatsApp Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Everything You Need for EU Compliance
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "HS Code Lookup",
                description: "Instant search across 15,000+ Indian HS codes with EU CN code mapping and CBAM applicability checks.",
                color: "from-purple-500 to-indigo-500",
              },
              {
                icon: FileText,
                title: "CBAM Reports",
                description: "Upload invoices, auto-extract data with AI, validate against EU rules, and generate XML reports instantly.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Globe,
                title: "EUDR Compliance",
                description: "Geolocation validation, GeoJSON generation, and due diligence statements for deforestation-free exports.",
                color: "from-orange-500 to-amber-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Simplify Compliance?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join hundreds of Indian exporters who trust VAYA for their EU trade compliance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition font-medium"
              >
                Start Free Trial
              </Link>
              <Link
                href="https://wa.me/919876543210"
                className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition font-medium border border-white/20"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="text-gray-400 text-sm">© 2025 VAYA. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
