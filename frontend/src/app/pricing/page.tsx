'use client';

import Link from 'next/link';
import {
    ArrowLeft,
    Check,
    Star,
    Zap,
    Building,
    MessageCircle,
    ArrowRight
} from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '₹0',
        period: 'forever',
        description: 'Perfect for trying out VAYA',
        features: [
            '10 HS Code lookups/month',
            '3 CBAM reports/month',
            'Basic AI assistance',
            'WhatsApp support',
            'Email support',
        ],
        notIncluded: [
            'Document OCR',
            'API access',
            'Priority support',
        ],
        cta: 'Get Started Free',
        href: '/register',
        popular: false,
    },
    {
        name: 'Pro',
        price: '₹2,499',
        period: '/month',
        description: 'For growing export businesses',
        features: [
            'Unlimited HS Code lookups',
            'Unlimited CBAM reports',
            'AI document extraction',
            'Full AI Advisor access',
            'Priority WhatsApp support',
            'API access (10K calls/mo)',
            'EUDR compliance tools',
            'Analytics dashboard',
        ],
        notIncluded: [],
        cta: 'Start 14-Day Trial',
        href: '/register?plan=pro',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large-scale operations',
        features: [
            'Everything in Pro',
            'Unlimited API calls',
            'Dedicated account manager',
            'Custom integrations',
            'On-premise deployment',
            'SLA guarantee (99.9%)',
            'Training & onboarding',
            'Custom reporting',
        ],
        notIncluded: [],
        cta: 'Contact Sales',
        href: '/contact?plan=enterprise',
        popular: false,
    },
];

const addons = [
    {
        name: 'Extra API Calls',
        price: '₹499',
        unit: 'per 10K calls',
        description: 'Add more API calls to your Pro plan',
    },
    {
        name: 'Priority Support',
        price: '₹999',
        unit: 'per month',
        description: '4-hour response time SLA',
    },
    {
        name: 'Custom Training',
        price: '₹9,999',
        unit: 'one-time',
        description: '2-hour onboarding session',
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">V</span>
                                </div>
                                <span className="text-white font-bold text-xl">VAYA</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
                            <Link href="/pricing" className="text-white font-medium">Pricing</Link>
                            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                        </div>
                        <Link
                            href="/register"
                            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-6">
                        Simple, Transparent Pricing
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Choose the plan that's<br />
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            right for you
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Plans */}
            <section className="pb-20 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-3xl border ${plan.popular
                                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/50'
                                    : 'bg-white/5 border-white/10'
                                } p-8`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-full flex items-center gap-1.5">
                                    <Star className="w-4 h-4" /> Most Popular
                                </span>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-500">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-gray-300">
                                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-gray-600">
                                        <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center">−</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`block w-full py-4 text-center rounded-xl font-medium transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Add-ons */}
            <section className="py-16 px-4 bg-slate-900/50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Add-ons</h2>
                        <p className="text-gray-400">Enhance your plan with extra features</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {addons.map((addon) => (
                            <div key={addon.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-2">{addon.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{addon.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">{addon.price}</span>
                                    <span className="text-gray-500 text-sm">{addon.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-3xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Building className="w-6 h-6 text-violet-400" />
                                    <span className="text-violet-400 font-medium">Enterprise</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    Need a custom solution?
                                </h3>
                                <p className="text-gray-400 max-w-md">
                                    Get dedicated support, custom integrations, and unlimited usage for your team.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/contact?plan=enterprise"
                                    className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all flex items-center gap-2"
                                >
                                    Contact Sales
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <a
                                    href="https://wa.me/919876543210"
                                    className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Link */}
            <section className="pb-20 px-4 text-center">
                <p className="text-gray-400">
                    Have questions?{' '}
                    <Link href="/help" className="text-emerald-400 hover:text-emerald-300">
                        Check our FAQ →
                    </Link>
                </p>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">V</span>
                        </div>
                        <span className="text-gray-500 text-sm">© 2025 VAYA. All rights reserved.</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
