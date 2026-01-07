'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Search,
    FileText,
    Leaf,
    Settings,
    HelpCircle,
    Bell,
    LogOut,
    Menu
} from 'lucide-react';

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Search, label: 'HS Calculator', path: '/search' },
        { icon: Leaf, label: 'CBAM Manager', path: '/cbam' },
        { icon: FileText, label: 'Documents', path: '/documents' },
    ];

    const bottomItems = [
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: HelpCircle, label: 'Support', path: '/support' },
    ];

    return (
        <aside className={`w-20 h-screen fixed left-0 top-0 bg-[#050505] border-r border-[#151515] flex flex-col items-center py-6 z-50 ${className || ''}`}>
            {/* Logo */}
            <div className="mb-12">
                <div className="w-10 h-10 bg-[#FF5100] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,81,0,0.3)]">
                    <span className="text-white font-bold text-xl">V</span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 w-full px-3 flex flex-col gap-4">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="relative group w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-300"
                        >
                            {/* Hover/Active Background */}
                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${active ? 'bg-[#FF5100]/10' : 'group-hover:bg-white/5'}`} />

                            {/* Active Indicator Bar */}
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF5100] rounded-r-full shadow-[0_0_10px_rgba(255,81,0,0.5)]" />
                            )}

                            {/* Icon */}
                            <item.icon
                                className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-[#FF5100]' : 'text-gray-500 group-hover:text-white'}`}
                            />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1A1A1A] border border-[#333] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {item.label}
                                {/* Arrow */}
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#333]" />
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="w-full px-3 flex flex-col gap-4">
                {bottomItems.map((item) => (
                    <button
                        key={item.label}
                        className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-white/5 transition-all text-gray-500 hover:text-white"
                    >
                        <item.icon className="w-5 h-5" />
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1A1A1A] border border-[#333] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {item.label}
                        </div>
                    </button>
                ))}

                <div className="w-full h-px bg-[#151515] my-2" />

                <button className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-red-500/10 transition-all text-gray-500 hover:text-red-500">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
