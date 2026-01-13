'use client';

import React, { useEffect, useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { HiShieldCheck } from 'react-icons/hi';
import { getSystemSettings, updateSystemSettings } from '@/app/actions/admin';
import { toast } from 'sonner';

export function SecuritySettings() {
    const [settings, setSettings] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSystemSettings();
            setSettings(data);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSystemSettings(settings);
            toast.success('Security settings updated');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (!settings) return <div className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />;

    return (
        <SettingsSection
            title="Security & Access"
            description="Control user registration and authentication protocols."
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                    <div className="space-y-1">
                        <h3 className="text-white font-bold leading-none">Public Registration</h3>
                        <p className="text-slate-500 text-xs">Allow new users to create accounts without an invitation.</p>
                    </div>
                    <div
                        className="relative inline-flex items-center cursor-pointer"
                        onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                    >
                        <input type="checkbox" checked={settings.registrationEnabled} onChange={() => { }} className="sr-only peer" />
                        <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Session Duration (Hours)</label>
                        <input
                            type="number"
                            value={settings.sessionDuration}
                            onChange={(e) => setSettings({ ...settings, sessionDuration: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Max Login Attempts</label>
                        <input
                            type="number"
                            value={settings.maxLoginAttempts}
                            onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="p-6 bg-yellow-500/10 rounded-[2rem] border border-yellow-500/20 flex gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-2xl h-fit">
                        <HiShieldCheck className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-white font-bold leading-none">Two-Factor Authentication</h3>
                        <p className="text-slate-400 text-sm">Require all administrator accounts to use two-factor authentication for enhanced security.</p>
                        <button className="text-yellow-500 hover:text-yellow-400 font-bold text-sm transition-colors">
                            Configure 2FA Policies →
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:scale-100"
                >
                    {isSaving ? 'Updating...' : 'Update Security'}
                </button>
            </div>
        </SettingsSection>
    );
}
