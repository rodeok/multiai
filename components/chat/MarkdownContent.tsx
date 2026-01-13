'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HiOutlineClipboardCopy, HiOutlineClipboardCheck } from 'react-icons/hi';
import { useState } from 'react';

interface MarkdownContentProps {
    content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-white mb-4 tracking-tight" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-extrabold text-white mb-3 tracking-tight mt-6" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mb-2 tracking-tight mt-4" {...props} />,
                    p: ({ node, ...props }) => <p className="text-slate-300 leading-relaxed mb-4 text-[15px]" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-black text-white" {...props} />,
                    em: ({ node, ...props }) => <em className="text-blue-400 font-medium not-italic" {...props} />,
                    code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const [isCopied, setIsCopied] = useState(false);

                        const copyToClipboard = () => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                        };

                        return match ? (
                            <div className="group relative my-6">
                                <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={copyToClipboard}
                                        type="button"
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md border border-white/10 transition-all active:scale-95"
                                        title="Copy code"
                                    >
                                        {isCopied ? (
                                            <HiOutlineClipboardCheck className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <HiOutlineClipboardCopy className="w-4 h-4 text-slate-300" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-white/5 rounded-t-2xl">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{match[1]}</span>
                                </div>
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="!m-0 !rounded-b-2xl !bg-slate-900/50 !p-4 !text-[13px] border-x border-b border-white/5"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[13px]" {...props}>
                                {children}
                            </code>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <div className="my-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-800/30 backdrop-blur-md shadow-xl">
                            <table className="w-full text-left text-sm" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-white/5 border-b border-white/5" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 font-black text-white uppercase tracking-wider text-[11px]" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 text-slate-400 border-b border-white/5" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-slate-300" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-slate-300" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 bg-blue-500/10 px-6 py-4 rounded-r-2xl my-6 italic text-slate-300" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
