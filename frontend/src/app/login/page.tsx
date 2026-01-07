'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    useEffect(() => {
        // Auto-login as demo user and bypass login screen
        setUser({
            id: 'demo-user',
            email: 'demo@vaya.trade',
            full_name: 'Demo User',
            is_active: true,
        });
        localStorage.setItem('vaya_unlocked', 'true');
        router.push('/dashboard');
    }, [setUser, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#080808] text-[#FAFAFA]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-[#FF5100] border-t-transparent animate-spin" />
                <p className="text-sm text-[#999]">Accessing Dashboard...</p>
            </div>
        </div>
    );
}
