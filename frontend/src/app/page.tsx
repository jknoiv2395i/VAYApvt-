"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Upload,
  Factory,
  MessageCircle,
  Play,
  Check,
  Menu,
  X,
  Bot,
  Mail,
  Calendar,
  Database,
  Search,
  BarChart,
  Shield,
  Phone,
  Link2,
  Users,
  Target,
  LineChart,
  Smile,
  Star,
  CheckCircle2,
  Plus,
  Minus,
  ChevronDown,
  Briefcase,
  Layers,
  GripVertical
} from "lucide-react";

export default function Home() {
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const processStepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const processSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (processSectionRef.current) {
        const rect = processSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Calculate progress: 0 when section enters, 1 when section leaves (roughly)
        // Adjust logic: We want 0% when the first card is focused, 100% when last is.
        // Let's us the Sticky behavior duration.
        // rect.top is position of top of section relative to viewport top.
        // When rect.top is 128 (top-32), we are at start.
        // When rect.bottom is windowHeight, we are at end.

        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const scrollRange = sectionHeight - windowHeight;

        // Progress of scrolling *through* the sticky area
        // We start counting when top reaches close to 0 (or sticky offset)
        const startOffset = windowHeight / 3; // Start animating when section is a bit up
        let progress = (windowHeight - sectionTop - startOffset) / (sectionHeight - startOffset);

        progress = Math.max(0, Math.min(1, progress));
        setScrollProgress(progress);

        // Map progress to steps (0-3)
        // We have 4 steps. 
        // 0.0 - 0.25 -> Step 0
        // 0.25 - 0.5 -> Step 1
        // 0.5 - 0.75 -> Step 2
        // 0.75 - 1.0 -> Step 3
        const stepIndex = Math.min(3, Math.floor(progress * 4));
        setActiveProcessStep(stepIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#FF5100] selection:text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-[120vh] pointer-events-none">
        <Image
          src="/hero-new-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-top opacity-100"
          priority
        />
        {/* Overlay to ensure text readability if needed, matching the user's black gradient hint if transparency exists, but usually the image carries the look */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-6 transition-all duration-300">
        <div className="max-w-[1350px] mx-auto px-6">
          <div className="flex items-center justify-between h-[57px] rounded-full bg-[#080808]/40 border border-white/5 backdrop-blur-xl px-2 pl-6 shadow-lg shadow-black/20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 pr-8">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4C6 4 3 7 3 12C3 17 6 20 10 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M14 20C18 20 21 17 21 12C21 7 18 4 14 4" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="font-semibold text-[19px] tracking-tight text-[#FAFAFA]">VAYA</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-1">
              {[
                "Services",
                "Case Studies",
                "Process",
                "Metrix",
                "Pricing",
                "Reviews",
                "Team",
                "FAQs"
              ].map((item) => (
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
                href="/book-call"
                className="group relative flex items-center justify-center w-[169px] h-[46px] rounded-full bg-[#0F0F0F] border border-white/5 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(50%_42.6%_at_50%_100%,_#FF5100_0%,_rgba(255,81,0,0.00)_100%)] opacity-80" />

                {/* Text Content */}
                <span className="relative z-10 text-[16px] font-semibold bg-gradient-to-r from-[#FF5100] to-[#FAFAFA] bg-clip-text text-transparent group-hover:to-white transition-all">
                  Book a free call
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

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[75vh] pt-32 pb-16">
          {/* Status Badge */}
          <div className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-white/5 mx-auto hover:border-[#FF5100]/30 transition-colors cursor-default backdrop-blur-sm" style={{ position: 'absolute', top: '-267px' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5100] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5100]"></span>
            </span>
            <span className="text-[12px] font-semibold tracking-wide text-[#999999] group-hover:text-white transition-colors">
              Available for Work
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-[88px] font-bold tracking-[-0.02em] leading-[1.1] mb-8 mx-auto max-w-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF5100] via-[#FF8F00] to-[#FFE0CC]" style={{ position: 'absolute', top: '38px' }}>
            Build Smarter <br />
            Growth With AI
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-[#999999] max-w-2xl mx-auto mb-12 font-medium" style={{ position: 'absolute', top: '237px' }}>
            Supercharge your workflow with AI automation.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6" style={{ position: 'absolute', top: '282px' }}>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-full bg-[#0F0F0F] border border-white/5 text-[#FF5100] font-semibold hover:border-[#FF5100]/50 transition-all duration-300"
            >
              See our pricing
            </Link>

            <Link
              href="/book-call"
              className="group relative px-8 py-4 rounded-full bg-[#0F0F0F] border border-white/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(50%_42.6%_at_50%_100%,_#FF5100_0%,_rgba(255,81,0,0.00)_100%)] opacity-80" />
              <span className="relative z-10 font-semibold bg-gradient-to-r from-[#FF5100] to-[#FAFAFA] bg-clip-text text-transparent group-hover:to-white transition-all">
                Book a free call
              </span>
            </Link>
          </div>
        </section>

        {/* Marquee/Ticker Section */}
        <section
          className="w-full py-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          style={{ position: 'absolute', top: '437px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1400px', zIndex: 20 }}
        >
          {/* Removed manual gradient divs in favor of mask-image for true transparency */}

          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="flex gap-6 animate-scroll whitespace-nowrap min-w-full hover:[animation-play-state:paused]">
              <div className="flex gap-6">
                <TickerItem
                  icon={<Bot className="w-5 h-5 text-white" />}
                  title="Lead Qualification Bot"
                  stat="38% Conversion increased"
                />
                <TickerItem
                  icon={<MessageCircle className="w-5 h-5 text-white" />}
                  title="Voice Support Assistant"
                  stat="2X recurring revenue"
                />
                <TickerItem
                  icon={<Search className="w-5 h-5 text-white" />}
                  title="RAG Knowledge Search"
                  stat="25% Conversion increased"
                />
                <TickerItem
                  icon={<BarChart className="w-5 h-5 text-white" />}
                  title="Post-Call Analytics"
                  stat="3X faster feedback loops"
                />
              </div>
              {/* Duplicate for smooth scroll */}
              <div className="flex gap-6">
                <TickerItem
                  icon={<Bot className="w-5 h-5 text-white" />}
                  title="Lead Qualification Bot"
                  stat="38% Conversion increased"
                />
                <TickerItem
                  icon={<MessageCircle className="w-5 h-5 text-white" />}
                  title="Voice Support Assistant"
                  stat="2X recurring revenue"
                />
                <TickerItem
                  icon={<Search className="w-5 h-5 text-white" />}
                  title="RAG Knowledge Search"
                  stat="25% Conversion increased"
                />
                <TickerItem
                  icon={<BarChart className="w-5 h-5 text-white" />}
                  title="Post-Call Analytics"
                  stat="3X faster feedback loops"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-6 animate-scroll-reverse whitespace-nowrap min-w-full hover:[animation-play-state:paused]">
              <div className="flex gap-6">
                <TickerItem
                  icon={<CheckCircle2 className="w-5 h-5 text-white" />}
                  title="Payment Recovery Nudges"
                  stat="57% Conversion increased"
                />
                <TickerItem
                  icon={<Database className="w-5 h-5 text-white" />}
                  title="Data Cleanup & Sync"
                  stat="22% churn rate decreased"
                />
                <TickerItem
                  icon={<Mail className="w-5 h-5 text-white" />}
                  title="Sales Email Drafter"
                  stat="45% churn rate decreased"
                />
                <TickerItem
                  icon={<Calendar className="w-5 h-5 text-white" />}
                  title="Booking Concierge"
                  stat="1.5X recurring revenue"
                />
              </div>
              {/* Duplicate for smooth scroll */}
              <div className="flex gap-6">
                <TickerItem
                  icon={<CheckCircle2 className="w-5 h-5 text-white" />}
                  title="Payment Recovery Nudges"
                  stat="57% Conversion increased"
                />
                <TickerItem
                  icon={<Database className="w-5 h-5 text-white" />}
                  title="Data Cleanup & Sync"
                  stat="22% churn rate decreased"
                />
                <TickerItem
                  icon={<Mail className="w-5 h-5 text-white" />}
                  title="Sales Email Drafter"
                  stat="45% churn rate decreased"
                />
                <TickerItem
                  icon={<Calendar className="w-5 h-5 text-white" />}
                  title="Booking Concierge"
                  stat="1.5X recurring revenue"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services / Bento Grid Section */}
        <section id="solutions" className="px-6 max-w-7xl mx-auto py-24">
          <div className="mb-16">
            <span className="text-[#FF5100] font-semibold tracking-wider text-sm uppercase mb-2 block">
              // Services
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2
                className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(71, 29, 114, 0) 100%)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                AI Solutions
              </h2>
              <p className="text-[#999999] max-w-md text-lg leading-relaxed">
                From automation to advanced analytics, we bring your vision to life with custom AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ROW 1: Chatbot (2/3) + Tools (1/3) */}

            {/* Card 1: Chatbot Development */}
            <div className="md:col-span-2 group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden min-h-[400px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <GripVertical className="w-5 h-5 text-[#333]" />
                </div>

                <div className="mt-8">
                  <h3 className="text-3xl font-semibold text-white mb-3">Chatbot Development</h3>
                  <p className="text-[#999999] text-lg max-w-lg mb-8">
                    We build custom AI chat for instant support and streamlined operations.
                  </p>

                  {/* Tags */}
                  <div className="flex gap-3 text-xs font-mono text-[#FF5100]">
                    <div className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#FF5100]/20">PLAN</div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#FF5100]/20">ANALYZE</div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#FF5100]/20">FORECAST</div>
                  </div>
                </div>

                {/* Input Simulation at Bottom */}
                <div className="mt-auto pt-8">
                  <div className="text-sm text-[#666] mb-3">Build your AI assistant with confidence</div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10">
                    <Plus className="w-4 h-4 text-[#FF5100]" />
                    <div className="h-1.5 w-24 bg-[#333] rounded-full"></div>
                    <div className="ml-auto flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#333]"></div>
                      <div className="w-4 h-4 rounded-full bg-[#333]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gradient Effect */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF5100] opacity-[0.03] blur-[100px] group-hover:opacity-[0.06] transition-opacity pointer-events-none" />
            </div>

            {/* Card 2: Tools Integrations */}
            <div className="group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden min-h-[400px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                    <Link2 className="w-6 h-6 text-white" />
                  </div>
                  <GripVertical className="w-5 h-5 text-[#333]" />
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-semibold text-white mb-3">Tools Integrations</h3>
                  <p className="text-[#999999] text-sm leading-relaxed">
                    We plug AI into your software, CRM systems, and marketing touchpoints.
                  </p>
                </div>

                {/* Logo Grid */}
                <div className="grid grid-cols-4 gap-3 mt-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center group-hover:border-[#FF5100]/20 transition-colors">
                      <Zap className="w-4 h-4 text-[#444] group-hover:text-[#FF5100] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 2: Workflows (1/3) + Strategy (2/3) */}

            {/* Card 3: Automated Workflows */}
            <div className="group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden min-h-[400px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <GripVertical className="w-5 h-5 text-[#333]" />
                </div>

                <div className="mt-6 mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">Automated Workflows</h3>
                  <p className="text-[#999999] text-sm">
                    Streamline tasks and save time.
                  </p>
                </div>

                {/* Workflow Items List */}
                <div className="space-y-3">
                  {[
                    { title: "Invoice Data Extraction", stat: "3X faster processing" },
                    { title: "HS Code Classification", stat: "99% accuracy" },
                    { title: "Supplier Outreach", stat: "Automated follow-ups" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white/40" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.title}</div>
                          <div className="text-[10px] text-[#FF5100] font-semibold">{item.stat}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Compliance Strategy / Analytics */}
            <div className="md:col-span-2 group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden min-h-[400px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                    <LineChart className="w-6 h-6 text-white" />
                  </div>
                  <GripVertical className="w-5 h-5 text-[#333]" />
                </div>

                <div className="mt-6 mb-auto">
                  <h3 className="text-3xl font-semibold text-white mb-3">Compliance Strategy</h3>
                  <p className="text-[#999999] text-lg max-w-lg mb-4">
                    Get expert guidance to navigate EUDR & CBAM regulations with AI-driven insights.
                  </p>
                </div>

                {/* Chart Visual */}
                <div className="relative h-40 w-full mt-8 flex items-end gap-4 px-4 pb-4 border-b border-l border-white/10">
                  <div className="w-full bg-[#1A1A1A] rounded-t-lg h-[40%] group-hover:bg-[#FF5100]/20 transition-colors relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#666]">+10%</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-t-lg h-[65%] group-hover:bg-[#FF5100]/40 transition-colors relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#666]">+25%</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-t-lg h-[50%] group-hover:bg-[#FF5100]/30 transition-colors relative">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#666]">Mar</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-t-lg h-[85%] group-hover:bg-[#FF5100]/60 transition-colors relative">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#666]">Apr</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-t-lg h-[100%] bg-gradient-to-t from-[#FF5100] to-[#FF8F00] relative shadow-[0_0_20px_rgba(255,81,0,0.3)]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#FFF]">May</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Process Section - With Scroll Animation */}
        <section id="process-section" ref={processSectionRef} className="py-24 px-4 relative z-10 bg-[#080808]">
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
                  desc: "You approve or request revisions — we iterate fast, polishing each build until you're fully satisfied."
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

        {/* Metrics Section */}
        <section className="border-y border-white/5 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Clients", value: "500+" },
                { label: "Uptime", value: "99.9%" },
                { label: "Support", value: "24/7" },
                { label: "Integrations", value: "50+" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-[#666] font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Reviews Section */}
        <section className="py-32 bg-[#080808] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between">
            <div>
              <span className="text-[#FF5100] font-semibold tracking-wider text-sm uppercase mb-2 block">
                // Reviews
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Trusted by innovators
              </h2>
            </div>
            <div className="flex gap-2 text-[#FF5100]">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080808] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080808] to-transparent z-10" />

            <div className="flex gap-6 animate-scroll whitespace-nowrap px-6">
              {[
                { name: "Alex Chen", role: "CTO, TechFlow", text: "VAYA transformed our compliance workflow. The AI reporting is a game changer." },
                { name: "Sarah Miller", role: "Ops Lead, GlobalScale", text: "Incredible attention to detail. The custom chatbot handles 90% of our queries now." },
                { name: "David Park", role: "Founder, DataSync", text: "Fastest implementation we've ever seen. The return on investment was immediate." },
                { name: "Emma Wilson", role: "PM, Innovate", text: "Beautifully designed dashboard and powerful API. Exactly what we needed." },
                { name: "James Hall", role: "Director, FutureCorp", text: "The support team is world-class. They built a custom model for us in days." }
              ].map((review, i) => (
                <div key={i} className="w-[400px] p-8 rounded-3xl bg-[#0F0F0F] border border-white/5 mx-4 whitespace-normal">
                  <div className="flex gap-1 text-[#FF5100] mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-lg text-white mb-6 leading-relaxed">"{review.text}"</p>
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <p className="text-[#666] text-sm">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 max-w-7xl mx-auto py-32">
          <div className="mb-16 text-center">
            <span className="text-[#FF5100] font-semibold tracking-wider text-sm uppercase mb-2 block">
              // Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[#999] max-w-xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$499",
                desc: "Perfect for startups and small teams.",
                features: ["5 AI Workflows", "Basic Support", "1 User", "Standard Analytics"]
              },
              {
                name: "Pro",
                price: "$999",
                isPopular: true,
                desc: "For growing companies scaling operations.",
                features: ["15 AI Workflows", "Priority Support", "5 Users", "Advanced Analytics", "Custom Integrations"]
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large organizations with complex needs.",
                features: ["Unlimited Workflows", "24/7 Dedicated Support", "Unlimited Users", "Custom AI Models", "SLA & Security"]
              }
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border flex flex-col ${plan.isPopular ? 'bg-[#0F0F0F] border-[#FF5100] shadow-[0_0_30px_rgba(255,81,0,0.1)]' : 'bg-[#0F0F0F] border-white/5'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-[#FF5100] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-4">{plan.price}<span className="text-lg text-[#666] font-normal">/mo</span></div>
                <p className="text-[#999] text-sm mb-8">{plan.desc}</p>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-[#CCC]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5100]" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.isPopular ? 'bg-[#FF5100] text-white hover:bg-[#FF6600]' : 'bg-white text-black hover:bg-gray-200'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>


        {/* Team Section */}
        <section className="px-6 max-w-7xl mx-auto py-32 border-t border-white/5">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-[#FF5100] font-semibold tracking-wider text-sm uppercase mb-2 block">
                // Team
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Meet the experts
              </h2>
            </div>
            <p className="text-[#999] text-lg max-w-md">
              We are a team of engineers, designers, and strategists obsessed with automation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Michael Ross", role: "CEO & Founder", icon: <Briefcase className='w-6 h-6' /> },
              { name: "Lara Croft", role: "Head of AI", icon: <Bot className='w-6 h-6' /> },
              { name: "James Bond", role: "Security Lead", icon: <Shield className='w-6 h-6' /> },
              { name: "Tony Stark", role: "Engineering", icon: <Layers className='w-6 h-6' /> },
            ].map((member, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-[#0F0F0F] border border-white/5 text-center hover:border-[#FF5100]/20 transition-colors">
                <div className="w-20 h-20 rounded-full bg-[#1A1A1A] mx-auto mb-6 flex items-center justify-center text-[#FF5100]/80 group-hover:scale-110 transition-transform border border-white/5">
                  {member.icon}
                </div>
                <h3 className="font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#666] text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 max-w-4xl mx-auto py-20 border-t border-white/5">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How quickly can we get started?", a: "You can be up and running within 24 hours. Our onboarding team will guide you through the setup process." },
              { q: "Do you offer custom AI solutions?", a: "Yes! Our Enterprise plan includes fully bespoke AI model development tailored to your specific data and use cases." },
              { q: "Is my data secure?", a: "Absolutely. We use bank-grade encryption and strictly adhere to GDPR and SOC2 compliance standards." },
              { q: "Can I cancel anytime?", a: "Yes, all our plans are month-to-month. You can cancel or upgrade/downgrade at any time without penalty." }
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-2xl bg-[#0F0F0F] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1A1A1A] transition-colors"
                >
                  <span className="font-semibold text-lg text-white">{item.q}</span>
                  {openFaq === i ? <Minus className="w-5 h-5 text-[#FF5100]" /> : <Plus className="w-5 h-5 text-[#666]" />}
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 pt-0 text-[#999] leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32 text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-[40px] bg-gradient-to-b from-[#0F0F0F] to-[#080808] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF5100] opacity-[0.15] blur-[120px] rounded-full" />

            <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">
              Ready to automate?
            </h2>
            <div className="flex justify-center gap-4 relative z-10">
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-full bg-[#FF5100] text-white font-semibold hover:bg-[#FF6600] transition-colors shadow-[0_0_30px_rgba(255,81,0,0.3)] hover:shadow-[0_0_50px_rgba(255,81,0,0.5)]"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 py-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  src="/vaya-logo.png"
                  alt="VAYA Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold text-xl">VAYA</h4>
            </div>
            <p className="text-[#666] text-sm">
              Trade Compliance Made Intelligent.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4 text-white">Product</h5>
            <ul className="space-y-3 text-sm text-[#999]">
              <li><Link href="#" className="hover:text-[#FF5100]">Features</Link></li>
              <li><Link href="#" className="hover:text-[#FF5100]">Pricing</Link></li>
              <li><Link href="#" className="hover:text-[#FF5100]">API</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4 text-white">Company</h5>
            <ul className="space-y-3 text-sm text-[#999]">
              <li><Link href="#" className="hover:text-[#FF5100]">About</Link></li>
              <li><Link href="#" className="hover:text-[#FF5100]">Blog</Link></li>
              <li><Link href="#" className="hover:text-[#FF5100]">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4 text-white">Legal</h5>
            <ul className="space-y-3 text-sm text-[#999]">
              <li><Link href="#" className="hover:text-[#FF5100]">Privacy</Link></li>
              <li><Link href="#" className="hover:text-[#FF5100]">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-[#444] text-xs">
          © 2025 VAYA Trade Compliance. All rights reserved.
        </div>
      </footer>

      {/* Custom Styles not needing globals.css */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
        }
      `}</style>
    </div>
  );
}

function TickerItem({ icon, title, stat }: { icon: React.ReactNode; title: string; stat: string }) {
  return (
    <div className="flex items-center justify-between gap-6 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 min-w-[340px] group hover:border-[#FF5100]/40 transition-all duration-300 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#141414] flex items-center justify-center border border-white/5 text-white group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <h4 className="font-semibold text-white text-[15px] leading-tight mb-1">{title}</h4>
          <span className="text-xs font-semibold text-[#FF5100]">
            {stat}
          </span>
        </div>
      </div>
      <GripVertical className="w-5 h-5 text-[#333]" />
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-white/5 text-xs font-medium text-white/80">
      {icon} {text}
    </span>
  )
}
