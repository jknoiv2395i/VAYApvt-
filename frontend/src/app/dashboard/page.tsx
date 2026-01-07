"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import {
    Search,
    Bell,
    ChevronDown,
    MoreHorizontal,
    ArrowUpRight,
    Eye,
    Filter,
    Download
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

// Mock Data for the Chart
const chartData = [
    { d: "1", v: 120 }, { d: "2", v: 132 }, { d: "3", v: 101 }, { d: "4", v: 134 },
    { d: "5", v: 190 }, { d: "6", v: 230 }, { d: "7", v: 210 }, { d: "8", v: 220 },
    { d: "9", v: 232 }, { d: "10", v: 201 }, { d: "11", v: 234 }, { d: "12", v: 290 },
    { d: "13", v: 330 }, { d: "14", v: 310 }, { d: "15", v: 320 }, { d: "16", v: 332 },
    { d: "17", v: 301 }, { d: "18", v: 334 }, { d: "19", v: 390 }, { d: "20", v: 330 }
];

// Mock Data for "Recent Leads" -> "Recent Transactions"
const transactions = [
    { id: 1, name: "Steel Rods Class A", user: "Ryan Brown", email: "ryan@vaya.trade", status: "In Progress", date: "Today at 12:32 PM", initials: "RB" },
    { id: 2, name: "Aluminum Scraps", user: "William Dose", email: "william@vaya.trade", status: "Closed", date: "Today at 03:23 PM", initials: "WD" },
    { id: 3, name: "Textile Machinery", user: "Marcus S.", email: "marcus@vaya.trade", status: "In Progress", date: "Yesterday at 09:12 AM", initials: "MS" },
    { id: 4, name: "Chemical Compounds", user: "Sarah J.", email: "sarah@vaya.trade", status: "Completed", date: "Yesterday at 02:45 PM", initials: "SJ" },
];

export default function DashboardPage() {
    const { user, isAuthenticated, setUser } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            setUser({
                id: "demo",
                email: "demo@vaya.trade",
                full_name: "Demo User",
                subscription_tier: "pro"
            });
        }
    }, [isAuthenticated, setUser]);

    return (
        <DashboardWrapper className="!p-0 !max-w-none min-h-screen bg-[#050505]">
            <div className="p-8 lg:p-12 w-full max-w-[1600px] mx-auto">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[#666] text-sm font-medium mb-1">Insights</p>
                        <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">Overview</h1>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-medium">Performance This Month</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#222] rounded-lg text-sm text-white hover:border-[#333] transition-colors">
                        This Month <ChevronDown className="w-4 h-4 text-[#666]" />
                    </button>
                </div>

                {/* 2. Main Performance Chart Card */}
                <div className="bg-[#121212] border border-[#1A1A1A] rounded-2xl p-6 lg:p-8 mb-8 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8">
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[#666] text-sm font-medium mb-2">Total Classifications</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white tracking-tight">1,240</span>
                                    <span className="text-[#666] text-xl">.00</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#666] text-sm font-medium mb-2">Active Reports</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white tracking-tight">102</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Toggles (Visual only) */}
                        <div className="flex items-center p-1 bg-[#0A0A0A] border border-[#222] rounded-lg">
                            <button className="px-3 py-1.5 text-xs font-medium bg-[#1A1A1A] text-white rounded shadow-sm border border-[#222]">Line</button>
                            <button className="px-3 py-1.5 text-xs font-medium text-[#666] hover:text-white">Bar</button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-8 border-b border-[#222] mb-8 overflow-x-auto">
                        {['All', 'Classified', 'Pending', 'Reported', 'Failed'].map((tab, i) => (
                            <button key={tab} className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${i === 0 ? 'text-white border-[#FF5100]' : 'text-[#666] border-transparent hover:text-white'
                                }`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="relative h-[300px] w-full">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[0, 1, 2, 3].map((_, i) => (
                                <div key={i} className="w-full h-px bg-[#222] border-t border-dashed border-[#222]" />
                            ))}
                        </div>

                        {/* SVG Chart */}
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#FF5100" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#FF5100" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Area Path */}
                            <path d="M0,80 C10,70 20,75 30,60 C40,45 50,55 60,40 C70,25 80,30 90,15 L100,10 L100,100 L0,100 Z"
                                fill="url(#chartGradient)" />
                            {/* Line Path */}
                            <path d="M0,80 C10,70 20,75 30,60 C40,45 50,55 60,40 C70,25 80,30 90,15 L100,10"
                                fill="none" stroke="#FF5100" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

                            {/* Tooltip Point (Mock) */}
                            <circle cx="60" cy="40" r="1" fill="#0A0A0A" stroke="#FF5100" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                        </svg>

                        {/* Floating Tooltip Label (Mock) */}
                        <div className="absolute top-[30%] left-[58%] transform -translate-x-1/2 -translate-y-full mb-2">
                            <div className="bg-[#0A0A0A] text-white text-xs font-bold py-1 px-3 rounded border border-[#FF5100] shadow-[0_0_15px_rgba(255,81,0,0.2)]">
                                1,240.00
                            </div>
                            <div className="w-px h-8 bg-[#FF5100] mx-auto opacity-50"></div>
                        </div>
                    </div>

                    {/* X Axis Labels */}
                    <div className="flex justify-between mt-4 text-[#444] text-xs font-mono">
                        {['Sep', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map(label => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>
                </div>

                {/* 3. Bottom Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Recent Activity (2/3 width) */}
                    <div className="lg:col-span-2 bg-[#121212] border border-[#1A1A1A] rounded-2xl flex flex-col">
                        <div className="p-6 flex items-center justify-between border-b border-[#222]">
                            <div className="flex items-center gap-3">
                                <h3 className="text-white font-semibold">Recent Transactions</h3>
                                <div className="px-2 py-0.5 bg-[#222] rounded-full text-xs text-white">12</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333] rounded text-sm text-white hover:bg-[#222]">This Week</button>
                                <button className="px-3 py-1.5 bg-transparent text-sm text-[#666] hover:text-white">This Month</button>
                            </div>
                        </div>

                        <div className="p-2">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-[#666] uppercase tracking-wider border-b border-[#1A1A1A]">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1A1A1A]">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="group hover:bg-[#161616] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-xs font-bold text-[#FF5100]">
                                                        {t.initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white group-hover:text-[#FF5100] transition-colors">{t.name}</p>
                                                        <p className="text-xs text-[#666]">{t.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-[#888]">{t.email}</p>
                                                </div>
                                                <p className="text-xs text-[#444]">{t.user}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium capitalize ${t.status === 'In Progress' ? 'bg-[#FF5100]/10 text-[#FF5100]' :
                                                        t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            'bg-[#222] text-[#888]'
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-xs font-medium text-[#666] hover:text-white flex items-center gap-1 ml-auto">
                                                    <Eye className="w-3 h-3" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Usage/Revenue (1/3 width) */}
                    <div className="bg-[#121212] border border-[#1A1A1A] rounded-2xl flex flex-col">
                        <div className="p-6 border-b border-[#222] flex justify-between items-center">
                            <h3 className="text-white font-semibold">Credits Used</h3>
                            <button className="text-xs text-[#666] hover:text-white border border-[#222] px-2 py-1 rounded">See all</button>
                        </div>

                        <div className="p-8">
                            <h4 className="text-5xl font-bold text-white tracking-tight mb-8">
                                8,940 <span className="text-lg font-light text-[#666]">/ 10k</span>
                            </h4>

                            {/* Split Bar Chart */}
                            <div className="flex h-16 w-full rounded-md overflow-hidden mb-8">
                                <div className="w-[70%] bg-[#FF5100] relative group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="w-[30%] bg-[#1A1A1A] relative group border-l border-[#050505]">
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* Stats Breakdown */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-xl font-bold text-white">8,940</p>
                                    <p className="text-xs text-[#666]">Credits Used</p>
                                </div>
                                <div className="relative pl-6 border-l border-[#222]">
                                    <div className="absolute left-0 top-1 w-0.5 h-8 bg-[#222]" /> {/* Custom Divider */}
                                    <p className="text-xl font-bold text-white">1,060</p>
                                    <p className="text-xs text-[#666]">Remaining</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardWrapper>
    );
}
