'use client';

import React, { useEffect, useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { getSystemSettings, updateSystemSettings } from '@/app/actions/admin';
import { toast } from 'sonner';

export function AISettings() {
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
            toast.success('AI configuration updated');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (!settings) return <div className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />;

    return (
        <SettingsSection
            title="AI Engine Configuration"
            description="Fine-tune the global AI behavior and model parameters."
        >
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Default Model</label>
                        <select
                            value={settings.defaultModel}
                            onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
                        >
                            <option>GPT-4 Turbo</option>
                            <option>Claude 3.5 Sonnet</option>
                            <option>Gemini 1.5 Pro</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Temperature ({settings.temperature})</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.temperature}
                            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-4"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                            <span>Precise</span>
                            <span>Creative</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Global System Prompt</label>
                    <textarea
                        rows={6}
                        value={settings.systemPrompt}
                        onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium leading-relaxed resize-none"
                    />
                    <p className="text-[10px] text-slate-500 font-medium px-2">This prompt defines the base identity for all conversations unless overridden by model-specific settings.</p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:scale-100"
                >
                    {isSaving ? 'Applying...' : 'Apply AI Config'}
                </button>
            </div>
        </SettingsSection>
    );
}
