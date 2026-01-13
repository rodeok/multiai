'use client';

import { useState, useEffect } from 'react';
import { FaMicrochip, FaMemory, FaGlobeAmericas } from 'react-icons/fa';

export function SystemHealth() {
    const [health, setHealth] = useState({
        cpu: 45,
        memory: 62,
        latency: 120
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setHealth({
                cpu: Math.floor(Math.random() * 30) + 40,
                memory: Math.floor(Math.random() * 20) + 50,
                latency: Math.floor(Math.random() * 50) + 100
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-800 border-slate-700 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">System Health (Live)</h3>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                        <FaMicrochip /> CPU Usage
                    </span>
                    <span className="text-white">{health.cpu}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${health.cpu}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                        <FaMemory /> Memory Usage
                    </span>
                    <span className="text-white">{health.memory}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${health.memory}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                        <FaGlobeAmericas /> Network Latency
                    </span>
                    <span className="text-white">{health.latency}ms</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${health.latency / 2}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
