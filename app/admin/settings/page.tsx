import { GeneralSettings } from '@/components/admin/GeneralSettings';
import { SecuritySettings } from '@/components/admin/SecuritySettings';
import { AISettings } from '@/components/admin/AISettings';

export default function SettingsPage() {
    return (
        <div className="p-8 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                    System <span className="text-blue-500">Settings</span>
                </h1>
                <p className="text-slate-400 font-medium">Configure platform-wide parameters and security protocols</p>
            </div>

            <div className="grid gap-12">
                <GeneralSettings />
                <SecuritySettings />
                <AISettings />
            </div>
        </div>
    );
}
