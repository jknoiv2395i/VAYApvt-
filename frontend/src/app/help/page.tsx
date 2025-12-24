'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    HelpCircle,
    FileText,
    Factory,
    Leaf,
    MessageCircle,
    ChevronDown,
    ChevronRight,
    Bot,
    Mail,
    ExternalLink
} from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQ[] = [
    {
        category: 'CBAM',
        question: 'What is CBAM and who does it affect?',
        answer: 'CBAM (Carbon Border Adjustment Mechanism) is an EU regulation that puts a price on carbon emissions for imported goods. It affects Indian exporters of iron & steel, aluminium, cement, fertilisers, electricity, and hydrogen products entering the EU market. From October 2023, importers must report emissions, and from 2026, they must pay for carbon certificates.',
    },
    {
        category: 'CBAM',
        question: 'How do I calculate emissions for CBAM?',
        answer: 'Emissions are calculated based on direct emissions (from production) and indirect emissions (from electricity). You need to know the specific embedded emissions per tonne of product. VAYA automatically calculates this based on your product category and weight using EU-approved default values or your specific emission data.',
    },
    {
        category: 'CBAM',
        question: 'What format should my CBAM report be in?',
        answer: 'The EU requires CBAM reports in XML format following the official schema. VAYA automatically generates EU-compliant XML files that can be directly uploaded to the EU CBAM portal. Each report includes all required fields: HS codes, quantities, emission values, and origin details.',
    },
    {
        category: 'HS Codes',
        question: 'What are HS Codes?',
        answer: 'HS (Harmonized System) Codes are 6-10 digit numbers used worldwide to classify traded products. India uses 8-digit codes. The first 6 digits are international, while additional digits are country-specific. Correct HS code classification is crucial for duties, taxes, and compliance.',
    },
    {
        category: 'HS Codes',
        question: 'How do I find the right HS code for my product?',
        answer: 'Use VAYA\'s AI-powered search: describe your product in plain English and our AI will suggest the most appropriate HS codes. You can also search by code number, product keywords, or browse categories. Always verify with official sources for final classification.',
    },
    {
        category: 'EUDR',
        question: 'What is EUDR?',
        answer: 'EUDR (EU Deforestation Regulation) requires companies to prove their products are "deforestation-free" before exporting to the EU. It covers commodities like coffee, cocoa, palm oil, soy, beef, wood, and rubber. Exporters must provide geolocation data and due diligence statements.',
    },
    {
        category: 'EUDR',
        question: 'When does EUDR take effect?',
        answer: 'EUDR applies from December 30, 2024 for large operators and from June 30, 2025 for small/medium enterprises. Products placed on the EU market after these dates must comply with the regulation, including geolocation requirements and due diligence documentation.',
    },
    {
        category: 'Account',
        question: 'How do I upgrade my plan?',
        answer: 'Go to Settings > Subscription and click "Manage Billing." You can upgrade from Free to Pro or contact us for Enterprise pricing. All upgrades are prorated, and you can downgrade anytime.',
    },
    {
        category: 'Account',
        question: 'Can I use VAYA via WhatsApp?',
        answer: 'Yes! Send a message to our WhatsApp number to get quick HS code lookups and trade compliance answers. Type "HS:" followed by your product description, or just ask any trade-related question. Available 24/7.',
    },
];

const categories = ['All', 'CBAM', 'HS Codes', 'EUDR', 'Account'];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">Help & Support</h1>
                        <p className="text-sm text-gray-400">FAQs and documentation</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Search */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">How can we help?</h2>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Factory, label: 'CBAM Guide', href: '/cbam', color: 'violet' },
                        { icon: FileText, label: 'HS Code Search', href: '/dashboard', color: 'emerald' },
                        { icon: Leaf, label: 'EUDR Info', href: '#', color: 'green' },
                        { icon: Bot, label: 'AI Advisor', href: '/advisor', color: 'cyan' },
                    ].map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group text-center"
                        >
                            <div className={`w-12 h-12 mx-auto rounded-xl bg-${link.color}-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <link.icon className={`w-6 h-6 text-${link.color}-400`} />
                            </div>
                            <span className="text-white font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/10 text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-2xl">
                            <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No FAQs found. Try a different search.</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-md">
                                            {faq.category}
                                        </span>
                                        <span className="text-white font-medium">{faq.question}</span>
                                    </div>
                                    {expandedFaq === i ? (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedFaq === i && (
                                    <div className="px-5 pb-5 text-gray-400 border-t border-white/10">
                                        <p className="pt-4">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
                    <p className="text-gray-400 mb-6">Our team is here to assist you</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/advisor"
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Bot className="w-5 h-5" />
                            Ask AI Advisor
                        </Link>
                        <a
                            href="https://wa.me/919876543210"
                            className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp Support
                        </a>
                        <a
                            href="mailto:support@vaya.trade"
                            className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                            Email Us
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
