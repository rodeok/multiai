'use client';

import { FaUsers, FaComments, FaRobot, FaArrowUp } from 'react-icons/fa';

interface DashboardStatsProps {
    stats: {
        usersCount: number;
        sessionsCount: number;
        activeModels: number;
    };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.usersCount,
            label: 'Registered accounts',
            icon: FaUsers,
            color: 'blue',
            bg: 'from-blue-600/20 to-blue-400/5',
            accent: 'bg-blue-500'
        },
        {
            title: 'Total Sessions',
            value: stats.sessionsCount,
            label: 'Chat sessions created',
            icon: FaComments,
            color: 'green',
            bg: 'from-green-600/20 to-green-400/5',
            accent: 'bg-green-500'
        },
        {
            title: 'Active Models',
            value: stats.activeModels,
            label: 'Models available',
            icon: FaRobot,
            color: 'purple',
            bg: 'from-purple-600/20 to-purple-400/5',
            accent: 'bg-purple-500'
        }
    ];

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {statCards.map((stat) => (
                <div
                    key={stat.title}
                    className={`relative overflow-hidden p-6 rounded-3xl border border-white/5 bg-gradient-to-br ${stat.bg} backdrop-blur-md group transition-all duration-300 hover:-translate-y-1 hover:border-white/10`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${stat.accent}/10 text-white`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                            <FaArrowUp className="w-2 h-2" />
                            <span>12%</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">
                                {stat.value.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium">{stat.label}</p>
                    </div>

                    {/* Decorative glow */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.accent}/10 blur-3xl group-hover:${stat.accent}/20 transition-all duration-300`} />
                </div>
            ))}
        </div>
    );
}
