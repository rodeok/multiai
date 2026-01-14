'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HiChartBar,
    HiUsers,
    HiDatabase,
    HiCog,
    HiOutlineLogout,
    HiShieldCheck
} from 'react-icons/hi';
import { signOut } from 'next-auth/react';

const menuItems = [
    { name: 'Overview', icon: HiChartBar, href: '/admin/dashboard' },
    { name: 'Users', icon: HiUsers, href: '/admin/users' },
    { name: 'AI Models', icon: HiDatabase, href: '/admin/models' },
    { name: 'Settings', icon: HiCog, href: '/admin/settings' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-[#0f172a] p-6 flex flex-col h-screen sticky top-0">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <HiShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-tight">Admin Portal</h1>
                    <p className="text-slate-500 text-xs font-medium">Multiai Management</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4 pt-6 border-t border-slate-800/50">
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-600">
                            AD
                        </div>
                        <div>
                            <p className="text-white text-xs font-bold">Admin User</p>
                            <p className="text-slate-500 text-[10px]">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/auth' })}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-xs font-medium w-full"
                    >
                        <HiOutlineLogout className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
