'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    User,
    Building,
    Loader2,
    AlertCircle,
    Check
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        industry: 'manufacturing',
        agreedToTerms: false,
    });

    const validateStep1 = () => {
        if (!form.fullName || !form.email || !form.password) {
            setError('Please fill in all fields');
            return false;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (validateStep1()) {
                setStep(2);
            }
            return;
        }

        if (!form.agreedToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    full_name: form.fullName,
                }),
            });

            if (res.ok) {
                // Auto-login after registration
                setUser({
                    id: 'new-user',
                    email: form.email,
                    full_name: form.fullName,
                    is_active: true,
                });
                localStorage.setItem('vaya_unlocked', 'true');
                router.push('/dashboard');
            } else {
                const errorData = await res.json();
                setError(errorData.detail || 'Registration failed');
            }
        } catch (err) {
            // Demo mode
            setUser({
                id: 'demo-user',
                email: form.email,
                full_name: form.fullName,
                is_active: true,
            });
            localStorage.setItem('vaya_unlocked', 'true');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col justify-center p-16">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <span className="text-white font-bold text-xl">V</span>
                        </div>
                        <span className="text-white font-bold text-3xl">VAYA</span>
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-6">
                        Start Your<br />
                        <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                            Compliance Journey
                        </span>
                    </h1>

                    <div className="space-y-4 mb-8">
                        {[
                            'Instant HS Code Lookup',
                            'AI-Powered CBAM Reports',
                            'EUDR Compliance Tools',
                            '24/7 WhatsApp Support',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-gray-500 text-sm">
                        Free trial • No credit card required
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">V</span>
                            </div>
                            <span className="text-white font-bold text-2xl">VAYA</span>
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
                    <p className="text-gray-400 mb-6">
                        {step === 1 ? 'Enter your details to get started' : 'Tell us about your business'}
                    </p>

                    {/* Progress */}
                    <div className="flex gap-2 mb-8">
                        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="you@company.com"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            placeholder="Min 8 characters"
                                            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            value={form.confirmPassword}
                                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                            placeholder="Confirm password"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            placeholder="Acme Industries"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Industry</label>
                                    <select
                                        value={form.industry}
                                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="trading">Trading / Import-Export</option>
                                        <option value="freight">Freight / Logistics</option>
                                        <option value="consulting">Consulting</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10">
                                    <input
                                        type="checkbox"
                                        checked={form.agreedToTerms}
                                        onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                                        className="mt-0.5 w-5 h-5 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500/50"
                                    />
                                    <span className="text-sm text-gray-400">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
                                    </span>
                                </label>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {step === 1 ? 'Continue' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full py-3 text-gray-400 hover:text-white transition-colors"
                            >
                                ← Back
                            </button>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
