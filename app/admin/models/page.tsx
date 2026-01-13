import { getModels } from '@/app/actions/admin';
import { ModelsManager } from '@/components/admin/ModelsManager';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ModelsPage() {
  const models = await getModels();

  return (
    <div className="p-8 lg:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Model <span className="text-blue-500">Inventory</span>
        </h1>
        <p className="text-slate-400 font-medium">Configure and manage AI deployment engines</p>
      </div>

      <Suspense fallback={<div className="h-64 bg-white/5 rounded-3xl animate-pulse" />}>
        <ModelsManager models={models} />
      </Suspense>
    </div>
  );
}