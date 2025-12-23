'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Factory,
    FileText,
    AlertCircle,
    Leaf,
    BarChart3,
    PieChart,
    Calendar,
    Download,
    Filter
} from 'lucide-react';

interface AnalyticsData {
    totalReports: number;
    totalEmissions: number;
    estimatedCost: number;
    documentsProcessed: number;
    complianceScore: number;
    monthlyData: { month: string; emissions: number; reports: number }[];
    categoryBreakdown: { category: string; percentage: number; color: string }[];
    recentActivity: { date: string; action: string; status: string }[];
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('6m');
    const [data, setData] = useState<AnalyticsData>({
        totalReports: 47,
        totalEmissions: 483790.1,
        estimatedCost: 3870321,
        documentsProcessed: 156,
        complianceScore: 94,
        monthlyData: [
            { month: 'Jul', emissions: 45000, reports: 5 },
            { month: 'Aug', emissions: 62000, reports: 8 },
            { month: 'Sep', emissions: 78000, reports: 7 },
            { month: 'Oct', emissions: 95000, reports: 12 },
            { month: 'Nov', emissions: 88000, reports: 9 },
            { month: 'Dec', emissions: 115790, reports: 6 },
        ],
        categoryBreakdown: [
            { category: 'Iron & Steel', percentage: 45, color: '#6366f1' },
            { category: 'Aluminium', percentage: 28, color: '#8b5cf6' },
            { category: 'Cement', percentage: 18, color: '#a855f7' },
            { category: 'Fertilisers', percentage: 9, color: '#c084fc' },
        ],
        recentActivity: [
            { date: '2024-12-23', action: 'CBAM Report #47 created', status: 'success' },
            { date: '2024-12-22', action: 'Invoice INV-2024-156 processed', status: 'success' },
            { date: '2024-12-21', action: 'Emission validation warning', status: 'warning' },
            { date: '2024-12-20', action: 'XML export completed', status: 'success' },
            { date: '2024-12-19', action: 'CBAM Report #46 created', status: 'success' },
        ],
    });

    const maxEmission = Math.max(...data.monthlyData.map(d => d.emissions));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">Analytics</h1>
                            <p className="text-sm text-gray-400">Track your compliance metrics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
                        >
                            <option value="1m">Last Month</option>
                            <option value="3m">Last 3 Months</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-6 h-6 text-violet-400" />
                            <span className="flex items-center text-emerald-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" /> +12%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-white">{data.totalReports}</p>
                        <p className="text-sm text-gray-500">Total Reports</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Factory className="w-6 h-6 text-amber-400" />
                            <span className="flex items-center text-red-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" /> +8%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-white">{(data.totalEmissions / 1000).toFixed(1)}k</p>
                        <p className="text-sm text-gray-500">tCO₂e Emissions</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">€</span>
                            <span className="flex items-center text-red-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" /> +15%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-white">€{(data.estimatedCost / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-500">Est. CBAM Cost</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-6 h-6 text-cyan-400" />
                            <span className="flex items-center text-emerald-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" /> +24%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-white">{data.documentsProcessed}</p>
                        <p className="text-sm text-gray-500">Docs Processed</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Leaf className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{data.complianceScore}%</p>
                        <p className="text-sm text-gray-500">Compliance Score</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Emissions Chart */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-lg font-semibold text-white">Emissions Trend</h3>
                            </div>
                        </div>

                        <div className="flex items-end gap-4 h-64">
                            {data.monthlyData.map((month, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <span className="text-xs text-gray-500 mb-1">{(month.emissions / 1000).toFixed(0)}k</span>
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all hover:opacity-80"
                                            style={{ height: `${(month.emissions / maxEmission) * 180}px` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-400">{month.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-violet-400" />
                            <h3 className="text-lg font-semibold text-white">By Category</h3>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="relative w-40 h-40">
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                    {data.categoryBreakdown.reduce((acc, cat, i) => {
                                        const offset = acc.offset;
                                        const dash = (cat.percentage / 100) * 251.2;
                                        acc.elements.push(
                                            <circle
                                                key={i}
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={cat.color}
                                                strokeWidth="20"
                                                strokeDasharray={`${dash} 251.2`}
                                                strokeDashoffset={-offset}
                                            />
                                        );
                                        acc.offset += dash;
                                        return acc;
                                    }, { offset: 0, elements: [] as React.ReactNode[] }).elements}
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {data.categoryBreakdown.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-sm text-gray-300">{cat.category}</span>
                                    </div>
                                    <span className="text-sm font-medium text-white">{cat.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-400" />
                            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                        </div>
                        <Link href="/cbam" className="text-sm text-emerald-400 hover:text-emerald-300">
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {data.recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-emerald-500' :
                                            activity.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                                        }`} />
                                    <div>
                                        <p className="text-white">{activity.action}</p>
                                        <p className="text-sm text-gray-500">{activity.date}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${activity.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                        activity.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
