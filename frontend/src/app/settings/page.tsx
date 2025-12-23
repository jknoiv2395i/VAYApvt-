'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Bell,
    Globe,
    Shield,
    CreditCard,
    Moon,
    Sun,
    ChevronRight,
    Save,
    Check,
    LogOut
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        fullName: user?.full_name || 'Demo User',
        email: user?.email || 'demo@vaya.trade',
        company: 'Export Corp India',
        notifications: {
            email: true,
            whatsapp: true,
            reports: true,
        },
        preferences: {
            darkMode: true,
            currency: 'EUR',
            language: 'en',
        }
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem('vaya_unlocked');
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">Settings</h1>
                        <p className="text-sm text-gray-400">Manage your account preferences</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Profile Section */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Profile</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={settings.fullName}
                                    onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                            <input
                                type="text"
                                value={settings.company}
                                onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-violet-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { key: 'whatsapp', label: 'WhatsApp Alerts', desc: 'Get alerts on WhatsApp' },
                            { key: 'reports', label: 'Report Ready Alerts', desc: 'Notify when reports are generated' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <p className="text-white font-medium">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => setSettings({
                                        ...settings,
                                        notifications: {
                                            ...settings.notifications,
                                            [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications]
                                        }
                                    })}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.notifications[item.key as keyof typeof settings.notifications]
                                            ? 'bg-emerald-500'
                                            : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications[item.key as keyof typeof settings.notifications]
                                            ? 'left-6'
                                            : 'left-1'
                                        }`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Preferences */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Preferences</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                                <select
                                    value={settings.preferences.currency}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        preferences: { ...settings.preferences, currency: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                >
                                    <option value="EUR">€ Euro (EUR)</option>
                                    <option value="USD">$ US Dollar (USD)</option>
                                    <option value="INR">₹ Indian Rupee (INR)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                                <select
                                    value={settings.preferences.language}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        preferences: { ...settings.preferences, language: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">हिंदी (Hindi)</option>
                                    <option value="de">Deutsch (German)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Subscription */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Subscription</h2>
                                <p className="text-sm text-gray-400">Pro Plan • ₹2,499/month</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                            Active
                        </span>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                            Manage Billing
                        </button>
                        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                            View Invoices
                        </button>
                    </div>
                </section>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
                    >
                        {saved ? (
                            <>
                                <Check className="w-5 h-5" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-4 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
}
