'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    MessageCircle,
    Send,
    Search,
    FileText,
    Bot,
    Smartphone,
    CheckCircle,
    Clock,
    Zap,
    Copy,
    Check
} from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'HS Code Lookup',
        description: 'Send "HS: steel screw" to get instant HS code suggestions',
        command: 'HS: [product]',
    },
    {
        icon: FileText,
        title: 'CBAM Questions',
        description: 'Ask about emission calculations, reporting deadlines, etc.',
        command: 'CBAM: [question]',
    },
    {
        icon: Bot,
        title: 'Trade Advice',
        description: 'General trade compliance questions answered by AI',
        command: 'Any question',
    },
];

const sampleConversation = [
    { type: 'user', message: 'HS: stainless steel screws for furniture' },
    { type: 'bot', message: '🔍 **HS Code Suggestions:**\n\n**73181500** - Screws and bolts of iron/steel with nuts/washers\n• Basic Duty: 10%\n• CBAM: ✅ Applicable (Iron & Steel)\n\n**94039000** - Parts of furniture\n• Basic Duty: 15%\n• CBAM: ❌ Not applicable\n\nReply with a number for more details.' },
    { type: 'user', message: '1' },
    { type: 'bot', message: '📋 **HS 73181500 Details:**\n\nDescription: Screws and bolts, whether or not with their nuts or washers, of iron or steel\n\n🏭 **CBAM Category:** Iron & Steel\n💰 **Basic Duty:** 10%\n📊 **IGST:** 18%\n🌍 **EU CN Code:** 7318 15 00\n\nNeed a CBAM report? Reply "CBAM report"' },
];

export default function WhatsAppPage() {
    const [copied, setCopied] = useState(false);
    const phoneNumber = '+91-9876543210';

    const copyNumber = () => {
        navigator.clipboard.writeText('919876543210');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">WhatsApp Integration</h1>
                            <p className="text-sm text-gray-400">Trade compliance on the go</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
                {/* Hero */}
                <section className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/20 rounded-full mb-6">
                        <Zap className="w-4 h-4 text-[#25D366]" />
                        <span className="text-[#25D366] text-sm font-medium">Instant Responses • No App Required</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Trade Compliance via<br />
                        <span className="text-[#25D366]">WhatsApp</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Get HS codes, CBAM answers, and trade advice directly in WhatsApp.
                        Available 24/7, no login required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/919876543210?text=Hi%20VAYA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20BD5A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Start Chat on WhatsApp
                        </a>
                        <button
                            onClick={copyNumber}
                            className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copied!' : phoneNumber}
                        </button>
                    </div>
                </section>

                {/* Features */}
                <section className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <div className="w-14 h-14 mx-auto rounded-xl bg-[#25D366]/20 flex items-center justify-center mb-4">
                                <feature.icon className="w-7 h-7 text-[#25D366]" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                            <code className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm">
                                {feature.command}
                            </code>
                        </div>
                    ))}
                </section>

                {/* Demo Conversation */}
                <section className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">See it in action</h3>
                        <p className="text-gray-400 mb-6">
                            Our AI-powered bot understands natural language. Just describe your product
                            or ask a question, and get instant, accurate responses.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: CheckCircle, text: 'No app installation needed' },
                                { icon: Clock, text: '24/7 availability' },
                                { icon: Zap, text: 'Instant AI responses' },
                                { icon: Smartphone, text: 'Works on any phone' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-300">
                                    <item.icon className="w-5 h-5 text-[#25D366]" />
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-3xl p-4 border border-white/10">
                        <div className="bg-[#075E54] rounded-t-2xl px-4 py-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-medium">VAYA Trade Bot</p>
                                <p className="text-xs text-white/60">Online</p>
                            </div>
                        </div>

                        <div className="bg-[#0B141A] p-4 space-y-3 min-h-[300px]">
                            {sampleConversation.map((msg, i) => (
                                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user'
                                            ? 'bg-[#005C4B] text-white rounded-br-sm'
                                            : 'bg-[#202C33] text-white rounded-bl-sm'
                                        }`}>
                                        <p className="whitespace-pre-line">{msg.message.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1F2C34] rounded-b-2xl px-4 py-3 flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Type a message"
                                className="flex-1 bg-[#2A3942] text-white px-4 py-2 rounded-full text-sm placeholder:text-gray-500"
                                disabled
                            />
                            <button className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center">
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Commands Reference */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Commands</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { cmd: 'HS: [product]', desc: 'Get HS code suggestions' },
                            { cmd: 'CBAM: [question]', desc: 'CBAM compliance questions' },
                            { cmd: 'DUTY [hs_code]', desc: 'Get duty rates for HS code' },
                            { cmd: 'EUDR', desc: 'EUDR compliance information' },
                            { cmd: 'HELP', desc: 'List all available commands' },
                            { cmd: 'ACCOUNT', desc: 'View your subscription status' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                <code className="px-3 py-1.5 bg-[#25D366]/20 text-[#25D366] rounded-lg text-sm font-medium">
                                    {item.cmd}
                                </code>
                                <span className="text-gray-400 text-sm">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <a
                        href="https://wa.me/919876543210?text=Hi%20VAYA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-[#25D366] text-white rounded-xl font-medium text-lg hover:bg-[#20BD5A] transition-all shadow-lg shadow-[#25D366]/25"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Start Chatting Now
                    </a>
                </section>
            </main>
        </div>
    );
}
