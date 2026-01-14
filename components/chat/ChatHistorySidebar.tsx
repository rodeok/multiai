'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getChatSessions, deleteChatSession } from '@/app/actions/chat';
import { FaTrash, FaPlus, FaRegComment } from 'react-icons/fa';
import { format } from 'date-fns';

interface ChatSession {
    id: string;
    title: string;
    updatedAt: Date;
}

export function ChatHistorySidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const currentSessionId = params?.sessionId as string;

    useEffect(() => {
        loadSessions();
    }, []);

    async function loadSessions() {
        try {
            const data = await getChatSessions();
            setSessions(data as any);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this chat?')) {
            await deleteChatSession(id);
            loadSessions();
            if (currentSessionId === id) {
                router.push('/workspace');
            }
        }
    }

    return (
        <div className={`
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 fixed md:relative z-40 md:z-auto
            w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full
            transition-transform duration-300 ease-in-out
        `}>
            {onClose && (
                <button
                    onClick={onClose}
                    className="md:hidden absolute right-[-40px] top-4 p-2 bg-slate-800 border border-slate-700 rounded-r-lg text-white"
                >
                    ✕
                </button>
            )}
            <div className="p-4">
                <button
                    onClick={() => router.push('/workspace')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
                >
                    <FaPlus className="w-3 h-3" />
                    <span>New Chat</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {isLoading ? (
                    <div className="p-4 text-slate-400 text-sm">Loading history...</div>
                ) : sessions.length === 0 ? (
                    <div className="p-4 text-slate-500 text-sm text-center">No recent chats</div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => router.push(`/chat?session=${session.id}`)}
                            className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentSessionId === session.id
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                }`}
                        >
                            <FaRegComment className="w-3 h-3 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                    {session.title || 'Untitled Chat'}
                                </div>
                                <div className="text-[10px] opacity-50">
                                    {format(new Date(session.updatedAt), 'MMM dd, HH:mm')}
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDelete(e, session.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                            >
                                <FaTrash className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-slate-500 text-center">
                    Persisted to MongoDB
                </div>
            </div>
        </div>
    );
}
