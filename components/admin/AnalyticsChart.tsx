'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface AnalyticsChartProps {
    data: {
        name: string;
        users: number;
        sessions: number;
    }[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
    return (
        <div className="bg-slate-800 border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Usage Analytics</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                            name="New Users"
                        />
                        <Area
                            type="monotone"
                            dataKey="sessions"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#colorSessions)"
                            name="Active Sessions"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
