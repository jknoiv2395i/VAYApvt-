'use client';

import Sidebar from './Sidebar';

interface DashboardWrapperProps {
    children: React.ReactNode;
    className?: string; // Allow implementing page logic to override layout details if needed
}

export default function DashboardWrapper({ children, className }: DashboardWrapperProps) {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area - Pushed to the right of sidebar */}
            <div className="flex-1 ml-20 h-screen overflow-y-auto overflow-x-hidden">
                <main className={`min-h-full p-4 md:p-6 lg:p-8 max-w-[1920px] mx-auto ${className || ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
