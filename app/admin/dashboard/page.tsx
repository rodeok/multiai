import { getAdminStats, getUsers, getModels, getAnalyticsData } from '@/app/actions/admin';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { UserTable } from '@/components/admin/UserTable';
import { ModelsManager } from '@/components/admin/ModelsManager';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { SystemHealth } from '@/components/admin/SystemHealth';
import { Suspense } from 'react';
import { HiLightningBolt } from 'react-icons/hi';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const [stats, users, models, analyticsData] = await Promise.all([
    getAdminStats(),
    getUsers(),
    getModels(),
    getAnalyticsData(),
  ]);

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            System <span className="text-blue-500">Overview</span>
          </h1>
          <p className="text-slate-400 font-medium">Real-time performance metrics and platform health</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-6 py-3 rounded-2xl backdrop-blur-md">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <HiLightningBolt className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</p>
            <p className="text-white font-bold text-sm tracking-tight">All Operations Normal</p>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <Suspense fallback={<div className="h-32 bg-white/5 rounded-3xl animate-pulse" />}>
        <DashboardStats stats={stats} />
      </Suspense>

      {/* Analytics & System Health */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Traffic & Engagement</h2>
          </div>
          <div className="p-6 rounded-[2.5rem] border border-white/5 bg-slate-800/40 backdrop-blur-md shadow-2xl">
            <Suspense fallback={<div className="h-[300px] bg-white/5 rounded-2xl animate-pulse" />}>
              <AnalyticsChart data={analyticsData} />
            </Suspense>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Hardware Vitals</h2>
          <SystemHealth />
        </div>
      </div>

      {/* Secondary Management Area */}
      <div className="grid xl:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Suspense fallback={<div className="h-64 bg-white/5 rounded-3xl animate-pulse" />}>
            <UserTable users={users.slice(0, 5)} />
          </Suspense>
        </div>

        <div className="space-y-8">
          <Suspense fallback={<div className="h-64 bg-white/5 rounded-3xl animate-pulse" />}>
            <ModelsManager models={models.slice(0, 6)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}