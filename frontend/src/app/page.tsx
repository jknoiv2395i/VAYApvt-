
"use client";

import Link from "next/link";
import Image from "next/image";
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
  Box,
  LayoutDashboard
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Classification", "Compliance", "Logistics", "Reporting"];

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
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden text-white font-sans selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <LayoutDashboard className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">VAYA <span className="text-emerald-500">HS Code</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</Link>
              <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-emerald-500 text-black text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">AI-Powered Trade Compliance</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Simplify Your <br />
                <span className="text-emerald-500">
                  {words[currentWord]}
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                Instantly find accurate HS Codes, calculate duties, and ensure EU compliance with our advanced AI engine. visual, practical, and built for modern logistics.
              </p>

              {/* Search Box */}
              <div className="relative max-w-lg mb-10 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-500"></div>
                <div className="relative flex items-center bg-[#111] rounded-xl overflow-hidden border border-white/10">
                  <Search className="absolute left-4 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Describe your product (e.g. 'Steel Pipes')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  />
                  <div className="pr-2">
                    <button
                      onClick={handleSearch}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-emerald-400 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>99.9% Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>EU Compliant</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
              {/* Using a standard img tag for local file handling ease in this environment, or Next/Image if configured. 
                  Since we copied to public/, /hero-logistics.png should work. */}
              <img
                src="/hero-logistics.png"
                alt="Logistics Manager using VAYA"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Cards (UI Elements overlay) */}
              <div className="absolute bottom-8 left-8 right-8 z-20 grid gap-4">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center gap-4 animate-fade-in-up">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Identified Code</div>
                    <div className="text-white font-mono text-lg font-bold">7318.15.00</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Duty Rate</div>
                    <div className="text-emerald-400 font-bold">0%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0F0F0F] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Practical Tools for Practical Problems</h2>
            <p className="text-gray-400">We don't just give you data. We give you actionable insights integrated directly into your workflow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Visual Search",
                desc: "Don't know the code? Upload a photo or describe the product. Our AI understands logistics context.",
                icon: Upload
              },
              {
                title: "Cross-Border Mapping",
                desc: "Automatically map Indian HS Codes to EU CN Codes for seamless CBAM compliance.",
                icon: Globe
              },
              {
                title: "Smart Alerts",
                desc: "Get notified immediately if a code is restricted, requires a license, or has high anti-dumping duties.",
                icon: Zap
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-[#151515] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all group">
                <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#111] to-[#151515] border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Seamlessly Integrated Dashboard</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              The landing page is just the beginning. Your saved searches, reports, and team collaboration live in the robust VAYA Dashboard.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <LayoutDashboard className="w-5 h-5" />
              Enter Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2025 VAYA Logistics. Built for the modern supply chain.</p>
        </div>
      </footer>
    </div>
  );
}
