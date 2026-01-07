'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'yellow' | 'green' | 'orange' | 'default' | 'glass';
    className?: string;
    onClick?: () => void;
}

export default function StatCard({
    title,
    value,
    subValue,
    icon: Icon,
    trend,
    color = 'default',
    className,
    onClick
}: StatCardProps) {

    // Color mapping for banking style cards (gradient backgrounds)
    const colorStyles = {
        default: 'bg-[#121212] border-white/5 hover:border-white/10',
        glass: 'bg-white/[0.03] backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/[0.05] shadow-2xl shadow-black/50',
        blue: 'bg-[#121212] border-white/5 hover:border-[#FF5100]/50 group-hover:bg-[#FF5100]/5', // Mapped to neutral with orange hover
        yellow: 'bg-[#121212] border-white/5 hover:border-[#FF5100]/50 group-hover:bg-[#FF5100]/5', // Mapped to neutral
        green: 'bg-[#121212] border-white/5 hover:border-[#FF5100]/50 group-hover:bg-[#FF5100]/5', // Mapped to neutral
        orange: 'bg-gradient-to-br from-[#FF5100]/10 to-transparent border-[#FF5100]/20 hover:border-[#FF5100]/40 shadow-[0_0_30px_rgba(255,81,0,0.1)]',
    };

    const iconColors = {
        default: 'text-gray-400',
        glass: 'text-white',
        blue: 'text-white group-hover:text-[#FF5100]',
        yellow: 'text-white group-hover:text-[#FF5100]',
        green: 'text-white group-hover:text-[#FF5100]',
        orange: 'text-[#FF5100]',
    };

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 group
                ${colorStyles[color]}
                ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}
                ${className || ''}
            `}
        >
            {/* Background Glow Effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className={`text-sm font-medium ${color === 'default' ? 'text-gray-400' : 'text-gray-300'}`}>
                        {title}
                    </p>
                    {Icon && (
                        <div className={`p-2 rounded-lg bg-white/5 ${iconColors[color]}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {value}
                    </h3>
                    {subValue && (
                        <span className="text-xs text-gray-500 font-medium">
                            {subValue}
                        </span>
                    )}
                </div>

                {trend && (
                    <div className={`mt-3 flex items-center text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                        <span className="ml-1.5 text-gray-500">from last week</span>
                    </div>
                )}
            </div>
        </div>
    );
}
