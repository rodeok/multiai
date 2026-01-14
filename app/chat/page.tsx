'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getActiveModels } from '@/app/actions/admin';
import { getChatMessages, createChatSession, getChatSession } from '@/app/actions/chat';
import { MarkdownContent } from '@/components/chat/MarkdownContent';
import { ChatHistorySidebar } from '@/components/chat/ChatHistorySidebar';
import { AIModel, ChatSession } from '@/types';
import { FaThumbsUp, FaThumbsDown, FaCopy, FaRedo, FaRegComment } from 'react-icons/fa';
import { HiPaperClip, HiMicrophone, HiCog } from 'react-icons/hi';

interface ModelResponse {
  modelId: string;
  modelName: string;
  content: string;
  error?: string;
  likes?: number;
  dislikes?: number;
}

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  message?: string;
  responses?: ModelResponse[];
  timestamp: Date;
}

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const sid = searchParams.get('session');
    const mid = searchParams.get('models');

    if (sid) {
      setSessionId(sid);
      loadHistory(sid);
    } else if (mid) {
      setSelectedModels(mid.split(','));
      // We don't create the session until the first message, 
      // or we can create it immediately if we want it in history.
      // Let's create it immediately for better DX.
      handleNewSession(mid.split(','));
    } else {
      router.push('/workspace');
    }
  }, [status, searchParams, router]);

  async function handleNewSession(modelIds: string[]) {
    try {
      const id = await createChatSession('New Chat', modelIds);
      router.push(`/chat?session=${id}`, { scroll: false });
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  async function loadHistory(sid: string) {
    try {
      const [messages, sessionData] = await Promise.all([
        getChatMessages(sid),
        getChatSession(sid)
      ]);

      if (sessionData) {
        setSelectedModels((sessionData as any).selectedModels || []);
      }

      setChatHistory(messages.map((m: any) => ({
        role: m.role,
        message: m.role === 'user' ? m.content : undefined,
        responses: m.role === 'assistant' ? Object.entries(m.modelResponses || {}).map(([id, r]: [string, any]) => ({
          modelId: id,
          modelName: models.find(mod => mod.id === id)?.displayName || id,
          content: r.content,
          likes: r.likes,
          dislikes: r.dislikes
        })) : undefined,
        timestamp: new Date(m.timestamp)
      })));
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (status === 'loading' || loadingModels) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!session) {
    return null;
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading || !sessionId) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage('');

    // Optimistically add user message
    const userMsg: any = {
      role: 'user',
      message: currentMessage,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          modelIds: selectedModels,
          sessionId: sessionId
        }),
      });

      const data = await response.json();

      if (data.responses) {
        const newResponses = data.responses.map((resp: any) => ({
          ...resp,
          likes: 0,
          dislikes: 0,
        }));

        const assistantMsg: any = {
          role: 'assistant',
          responses: newResponses,
          timestamp: new Date(),
        };

        setChatHistory(prev => [...prev, assistantMsg]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white whitespace-nowrap hidden sm:inline">NexusChat</span>
            </div>

            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaRegComment className="w-5 h-5" />
            </button>

            {/* Active Models */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {selectedModels.map(id => models.find(m => m.id === id)).filter(Boolean).map(model => (
                <div key={model?.id} className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/20 rounded-full flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-[10px] sm:text-xs font-medium whitespace-nowrap">{model?.displayName.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/workspace')}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              Models
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] sm:text-sm font-medium">
                  {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-400 hover:text-white text-[10px] sm:text-sm transition-colors whitespace-nowrap hidden xs:block"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <ChatHistorySidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

        {/* Main Chat */}
        <div className="flex-1 flex flex-col w-full min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {chatHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <h3 className="text-xl font-medium mb-2">Ready to compare AI models</h3>
                  <p>Start a conversation to see responses from {selectedModels.length} models side-by-side</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {chatHistory.map((chat, chatIndex) => (
                  <div key={chatIndex} className="space-y-6">
                    {/* User Message */}
                    {chat.role === 'user' ? (
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">ME</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white mb-2 font-bold text-sm tracking-tight">YOU</div>
                          <div className="text-slate-200">
                            <MarkdownContent content={chat.message || ''} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Model Responses */
                      <div className={`grid gap-4 sm:gap-6 ${selectedModels.length === 1 ? 'grid-cols-1' :
                        selectedModels.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                          'grid-cols-1 lg:grid-cols-3 md:grid-cols-2'
                        }`}>
                        {chat.responses?.map((response, responseIndex) => {
                          const model = models.find(m => m.id === response.modelId);
                          return (
                            <div key={responseIndex} className="bg-slate-800/40 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl flex flex-col group transition-all duration-300 hover:border-white/10">
                              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                                    {response.modelName[0]}
                                  </div>
                                  <div className="text-[11px] font-black text-blue-400 uppercase tracking-widest">
                                    {response.modelName}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => copyToClipboard(response.content)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                    title="Copy full response"
                                  >
                                    <FaCopy className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    <FaRedo className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="p-6 flex-1">
                                {response.error ? (
                                  <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-2xl border border-red-400/20 font-medium">
                                    System Error: {response.error}
                                  </div>
                                ) : (
                                  <div className="text-slate-200 text-sm leading-relaxed">
                                    <MarkdownContent content={response.content} />
                                  </div>
                                )}

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                                  <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                                    <FaThumbsUp className="w-4 h-4" />
                                    <span className="text-sm">{response.likes || 0}</span>
                                  </button>
                                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                                    <FaThumbsDown className="w-4 h-4" />
                                    <span className="text-sm">{response.dislikes || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 bg-slate-800/50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask all models..."
                    className="w-full px-4 py-3 pr-24 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base min-h-[48px] max-h-40 overflow-y-auto"
                    rows={Math.min(message.split('\n').length, 5)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 bottom-2 pr-1 pb-1 flex items-center gap-1 sm:gap-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
                      <HiPaperClip className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <HiMicrophone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black">
                    {selectedModels.length} MODELS
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || isLoading}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base shadow-lg shadow-blue-500/20"
                  >
                    {isLoading ? 'Thinking...' : 'Send'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-400 text-xs">
                Multi-Model AI can make mistakes. Verify important information across results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}