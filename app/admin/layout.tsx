'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const isAuthPage = pathname === '/admin/auth';

    useEffect(() => {
        if (status === 'unauthenticated' && !isAuthPage) {
            router.push('/admin/auth');
        }
    }, [status, router, isAuthPage]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (!session) return null;

    return (
        <div className="flex min-h-screen bg-[#0f172a]">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-900 shadow-2xl m-4 rounded-3xl border border-slate-800/50 backdrop-blur-md">
                <div className="container mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
