"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
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
              <div className="w-[21px] h-[21px] flex items-center justify-center">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.36 10.5C3.36 7.09191 5.68743 4.23444 8.82 3.4692V0C3.81969 0.81438 0 5.20548 0 10.5C0 15.7945 3.81969 20.1856 8.82 21V17.5308C5.68743 16.7656 3.36 13.9081 3.36 10.5ZM21 10.5C21 15.7945 17.1803 20.1856 12.18 21V17.5308C15.3128 16.7656 17.64 13.9081 17.64 10.5C17.64 7.09191 15.3128 4.23444 12.18 3.4692V0C17.1803 0.81438 21 5.20548 21 10.5Z" fill="white" />
                </svg>
              </div>
              <span className="font-semibold text-[19px] tracking-tight text-[#FAFAFA]">Genesy</span>
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
          <h1 className="text-6xl md:text-8xl lg:text-[88px] font-bold tracking-[-0.02em] leading-[1.1] mb-8 mx-auto max-w-6xl" style={{ position: 'absolute', top: '38px' }}>
            Build Smarter <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5100] via-[#FF8F00] to-[#FF5100] animate-gradient-x bg-[length:200%_auto]">
              Growth With AI
            </span>
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
        <section className="relative w-full py-20 overflow-hidden border-t border-white/5 bg-[#080808]">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080808] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080808] to-transparent z-10" />

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
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                AI Solutions
              </h2>
              <p className="text-[#999999] max-w-md text-lg leading-relaxed">
                From automation to advanced analytics, we bring your vision to life with custom AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Card 1: Chatbot */}
            <div className="lg:col-span-2 group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden min-h-[400px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-white mb-3">Chatbot Development</h3>
                  <p className="text-[#999999] text-lg">
                    We build custom AI chat for instant support and streamlined operations.
                  </p>
                </div>

                {/* Simulated Ticker/Features inside card */}
                <div className="mt-8 flex gap-3 overflow-hidden opacity-50 text-xs font-mono text-white/40">
                  <div className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-white/5">PLAN</div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-white/5">ANALYZE</div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-white/5">FORECAST</div>
                </div>
              </div>

              {/* Graduate Effect */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF5100] opacity-[0.03] blur-[100px] group-hover:opacity-[0.08] transition-opacity" />
            </div>

            {/* Side Card: Tools */}
            <div className="group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden min-h-[400px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                    <Zap className="w-6 h-6 text-[#FF5100]" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                    <Link2 className="w-6 h-6 text-[#FF5100]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Tools Integrations</h3>
                  <p className="text-[#999999]">
                    We plug AI into your software, CRM systems, and marketing touchpoints.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FF5100]/5 to-transparent pointer-events-none" />
            </div>

            {/* Wide Card 2: Reporting */}
            <div className="lg:col-span-3 group relative p-8 rounded-[32px] bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/20 transition-all duration-500 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-white/5 mb-8">
                    <BarChart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-semibold text-white mb-4">CBAM Reporting Engine</h3>
                  <p className="text-[#999999] text-lg mb-8">
                    Automate your carbon reporting with our intelligent XML generation and validation engine.
                    Certified for EU compliance.
                  </p>
                  <div className="flex gap-4">
                    <FeatureBadge icon={<Check className="w-3 h-3" />} text="XML Generation" />
                    <FeatureBadge icon={<Check className="w-3 h-3" />} text="Validation" />
                    <FeatureBadge icon={<Check className="w-3 h-3" />} text="Archives" />
                  </div>
                </div>
                <div className="relative h-[300px] rounded-2xl bg-[#080808] border border-white/5 p-6 overflow-hidden">
                  {/* Abstract Visual Rep of Reporting */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                  <div className="space-y-4">
                    <div className="h-2 w-1/3 bg-[#1A1A1A] rounded-full"></div>
                    <div className="h-32 w-full bg-[#1A1A1A]/50 rounded-xl border border-white/5 flex items-center justify-center">
                      <BarChart className="w-12 h-12 text-[#333]" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-12 w-full bg-[#1A1A1A]/50 rounded-xl border border-white/5"></div>
                      <div className="h-12 w-full bg-[#1A1A1A]/50 rounded-xl border border-white/5"></div>
                    </div>
                  </div>

                  {/* Floating Success Toast */}
                  <div className="absolute bottom-6 right-6 px-4 py-3 bg-[#0F0F0F] rounded-lg border border-[#FF5100]/20 flex items-center gap-3 shadow-2xl">
                    <div className="h-2 w-2 rounded-full bg-[#FF5100] animate-pulse"></div>
                    <span className="text-xs font-mono text-white/80">Report Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Approach Section */}
        <section className="px-6 max-w-7xl mx-auto py-32 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="sticky top-32">
              <span className="text-[#FF5100] font-semibold tracking-wider text-sm uppercase mb-4 block">
                // Process
              </span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF5100]">
                  Approach
                </span>
              </h2>
              <p className="text-[#999999] text-xl leading-relaxed mb-8 max-w-md">
                From automation to advanced analytics, we bring your vision to life with custom AI.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-white border-b border-[#FF5100] pb-1 hover:text-[#FF5100] transition-colors"
              >
                See our pricing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-12">
              {[
                {
                  step: "01.",
                  title: "Subscribe",
                  desc: "Choose your plan and launch in minutes —upgrade, pause, or cancel anytime."
                },
                {
                  step: "02.",
                  title: "Analyze",
                  desc: "We begin by auditing your workflows to pinpoint where AI can streamline and elevate your processes."
                },
                {
                  step: "03.",
                  title: "Build & Implement",
                  desc: "Next, our engineers craft bespoke AI solutions for your company—relentlessly prioritizing quality and safety."
                },
                {
                  step: "04.",
                  title: "Test & Optimize",
                  desc: "You approve or request revisions—we iterate fast, polishing each build until you're fully satisfied."
                }
              ].map((item, i) => (
                <div key={i} className="group flex gap-8 p-6 rounded-3xl bg-[#0F0F0F] border border-white/5 hover:border-[#FF5100]/30 transition-all duration-300">
                  <span className="text-2xl font-mono text-[#FF5100]/60 group-hover:text-[#FF5100] pt-1">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5100] transition-colors">{item.title}</h3>
                    <p className="text-[#999] leading-relaxed">
                      {item.desc}
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
    <div className="flex items-center justify-between gap-6 bg-[#0F0F0F] border border-white/5 rounded-2xl p-5 min-w-[340px] group hover:border-[#FF5100]/30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center border border-white/5 text-white group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <h4 className="font-semibold text-white text-[15px] leading-tight mb-1">{title}</h4>
          <span className="text-xs font-semibold text-[#FF5100]">
            {stat}
          </span>
        </div>
      </div>
      <GripVertical className="w-5 h-5 text-[#222]" />
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
