"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Simple client-side protection that doesn't render UI
    // The actual layout is handled by DashboardWrapper in the page files
    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, mounted, router]);

    if (!mounted) return null;

    if (!isAuthenticated) return null;

    return (
        // Render children directly without any wrapper divs that add colors/margins
        // The pages (dashboard/page.tsx, cbam/page.tsx) use DashboardWrapper which handles the full screen layout
        <>
            {children}
        </>
    );
}
