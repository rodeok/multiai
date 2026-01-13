'use client';

import React from 'react';

interface SettingsSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
    return (
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-800/40 backdrop-blur-md shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-2">{title}</h2>
                <p className="text-slate-400 text-sm font-medium">{description}</p>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
