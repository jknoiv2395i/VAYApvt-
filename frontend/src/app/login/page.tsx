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
    Sparkles,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth, setUser } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: form.email,
                    password: form.password,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setAuth(data.access_token, data.refresh_token);

                // Fetch user profile
                const userRes = await fetch('http://localhost:8000/api/v1/auth/me', {
                    headers: { 'Authorization': `Bearer ${data.access_token}` },
                });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }

                router.push('/dashboard');
            } else {
                const errorData = await res.json();
                setError(errorData.detail || 'Invalid credentials');
            }
        } catch (err) {
            // Demo mode - allow login with demo credentials
            if (form.email === 'demo@vaya.trade' && form.password === 'demo123') {
                setUser({
                    id: 'demo-user',
                    email: 'demo@vaya.trade',
                    full_name: 'Demo User',
                    is_active: true,
                });
                localStorage.setItem('vaya_unlocked', 'true');
                router.push('/dashboard');
            } else {
                setError('Login failed. Try demo@vaya.trade / demo123');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col justify-center p-16">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <span className="text-white font-bold text-xl">V</span>
                        </div>
                        <span className="text-white font-bold text-3xl">VAYA</span>
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-6">
                        Trade Compliance<br />
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Made Simple
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-8 max-w-md">
                        Generate EU-compliant CBAM reports, validate HS codes, and stay ahead of regulations.
                    </p>

                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex -space-x-2">
                            {['E', 'A', 'S', 'R'].map((initial, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium border-2 border-slate-900"
                                >
                                    {initial}
                                </div>
                            ))}
                        </div>
                        <span>500+ exporters trust VAYA</span>
                    </div>
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

                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                    <p className="text-gray-400 mb-8">Sign in to your account to continue</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@company.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
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
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500/50" />
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-gray-400">Don't have an account? </span>
                        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Sign up
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span>Demo: <code className="text-emerald-300">demo@vaya.trade</code> / <code className="text-emerald-300">demo123</code></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
