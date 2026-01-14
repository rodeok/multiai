'use client';

import React, { useEffect, useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { getSystemSettings, updateSystemSettings } from '@/app/actions/admin';
import { toast } from 'sonner';

export function GeneralSettings() {
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
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (!settings) return <div className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />;

    return (
        <SettingsSection
            title="General Configuration"
            description="Manage your platform's basic identity and operational status."
        >
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Site Name</label>
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Support Email</label>
                    <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Pro Price (NGN)</label>
                    <input
                        type="number"
                        value={settings.proPriceNgn}
                        onChange={(e) => setSettings({ ...settings, proPriceNgn: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Pro Price (USD)</label>
                    <input
                        type="number"
                        value={settings.proPriceUsd}
                        onChange={(e) => setSettings({ ...settings, proPriceUsd: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10">
                <div className="space-y-1">
                    <h3 className="text-white font-bold leading-none">Maintenance Mode</h3>
                    <p className="text-slate-500 text-xs">Restrict access to the platform for scheduled maintenance.</p>
                </div>
                <div
                    className="relative inline-flex items-center cursor-pointer"
                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                >
                    <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={() => { }} // Controlled by div onClick for better hit area
                        className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:scale-100"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </SettingsSection>
    );
}
