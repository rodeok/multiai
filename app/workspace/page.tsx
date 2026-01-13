'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getActiveModels } from '@/app/actions/admin';
import { AIModel } from '@/types';

export default function Workspace() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [filterProvider, setFilterProvider] = useState<string>('All Providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchModels() {
      try {
        const activeModels = await getActiveModels();
        setModels(activeModels);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoadingModels(false);
      }
    }
    fetchModels();
  }, []);

  if (status === 'loading' || loadingModels) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!session) {
    return null;
  }

  const providers = ['All Providers', ...Array.from(new Set(models.map(model => model.provider)))];

  const filteredModels = models.filter(model => {
    const matchesProvider = filterProvider === 'All Providers' || model.provider === filterProvider;
    const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else if (prev.length < 3) {
        return [...prev, modelId];
      }
      return prev;
    });
  };

  const startChatting = () => {
    if (selectedModels.length > 0) {
      const params = new URLSearchParams({ models: selectedModels.join(',') });
      router.push(`/chat?${params}`);
    }
  };

  const getProviderColor = (provider: string) => {
    const colors = {
      'OpenAI': 'bg-green-600',
      'Anthropic': 'bg-orange-600',
      'Google': 'bg-blue-600',
      'Meta': 'bg-purple-600',
      'Mistral': 'bg-red-600',
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-600';
  };

  const getProviderIcon = (provider: string) => {
    const icons = {
      'OpenAI': '🤖',
      'Anthropic': '🧠',
      'Google': '🔍',
      'Meta': '🦙',
      'Mistral': '🌟',
    };
    return icons[provider as keyof typeof icons] || '⚡';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-white">NexusChat</span>
            </div>
            <nav className="flex items-center gap-6 text-gray-300">
              <button className="text-blue-400 font-medium">Explore Models</button>
              <button className="hover:text-white transition-colors">Chat History</button>
              {/* <button className="hover:text-white transition-colors">API Keys</button> */}
              {/* <button className="hover:text-white transition-colors">Settings</button> */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Configure Workspace</h1>
          <p className="text-gray-400 text-lg">
            Select two or more models to compare responses in real-time. Use the filters
            to find specific providers or capabilities.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          {providers.map(provider => (
            <button
              key={provider}
              onClick={() => setFilterProvider(provider)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterProvider === provider
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                }`}
            >
              {provider === 'All Providers' ? '📊 All Providers' : `${getProviderIcon(provider)} ${provider}`}
            </button>
          ))}
          <div className="ml-auto">
            <button className="px-4 py-2 bg-slate-700 text-gray-300 rounded-md text-sm font-medium hover:bg-slate-600 transition-colors">
              Advanced ▼
            </button>
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {filteredModels.map(model => {
            const isSelected = selectedModels.includes(model.id);
            const canSelect = selectedModels.length < 3 || isSelected;

            return (
              <div
                key={model.id}
                onClick={() => canSelect && toggleModelSelection(model.id)}
                className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : canSelect
                    ? 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700/50'
                    : 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${getProviderColor(model.provider)} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {getProviderIcon(model.provider)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {model.provider}
                      </div>
                      <div className="text-lg font-bold text-white">
                        {model.displayName}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {model.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${model.speed === 'Fast' ? 'bg-green-500/20 text-green-400' :
                    model.speed === 'Express' ? 'bg-orange-500/20 text-orange-400' :
                      model.speed === 'Balanced' ? 'bg-blue-500/20 text-blue-400' :
                        model.speed === 'Advanced' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                    }`}>
                    ⚡ {model.speed}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${model.pricing === 'Premium' ? 'bg-yellow-500/20 text-yellow-400' :
                    model.pricing === 'Cost-Effective' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                    💎 {model.pricing}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        {selectedModels.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {selectedModels.map(modelId => {
                    const model = models.find(m => m.id === modelId);
                    return (
                      <div
                        key={modelId}
                        className={`w-10 h-10 ${model ? getProviderColor(model.provider) : 'bg-gray-600'} rounded-full border-2 border-slate-800 flex items-center justify-center`}
                      >
                        <span className="text-white text-sm">
                          {model ? getProviderIcon(model.provider) : '?'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-white">
                  <div className="font-medium">{selectedModels.length} Models Selected</div>
                  <div className="text-sm text-gray-400">
                    {selectedModels.map(id => models.find(m => m.id === id)?.displayName).join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedModels([])}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={startChatting}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium flex items-center gap-2 transition-colors"
                >
                  Start Comparing
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}