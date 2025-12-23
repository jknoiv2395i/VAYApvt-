'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Send,
    Sparkles,
    Bot,
    User,
    Loader2,
    Copy,
    Check,
    FileText,
    Globe,
    Scale,
    HelpCircle
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const QUICK_PROMPTS = [
    { icon: FileText, text: "What is CBAM and how does it affect Indian exporters?" },
    { icon: Scale, text: "Explain HS code 73181500 and its duty rates" },
    { icon: Globe, text: "What are EUDR compliance requirements?" },
    { icon: HelpCircle, text: "How do I calculate carbon emissions for steel?" },
];

export default function AIAdvisorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "👋 Hello! I'm VAYA's AI Trade Advisor. I can help you with:\n\n• **HS Code lookup** - Find the right classification for your products\n• **CBAM compliance** - Carbon border adjustment requirements\n• **EUDR regulations** - EU deforestation rules\n• **Duty calculations** - Import duties and taxes\n• **Trade documentation** - Invoice and shipping requirements\n\nHow can I assist you today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/v1/ai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: messageText }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer || "I apologize, but I couldn't process that request. Please try again.",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to the server. Please ensure the backend is running and try again.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatMessage = (content: string) => {
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map((line, i) => {
                // Bold text
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Bullet points
                if (line.startsWith('• ') || line.startsWith('- ')) {
                    return `<li class="ml-4">${line.slice(2)}</li>`;
                }
                // Numbered lists
                if (/^\d+\.\s/.test(line)) {
                    return `<li class="ml-4">${line.slice(line.indexOf(' ') + 1)}</li>`;
                }
                return line ? `<p>${line}</p>` : '<br/>';
            })
            .join('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">AI Trade Advisor</h1>
                                <p className="text-xs text-gray-400">Powered by Google Gemini</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm text-emerald-400">Online</span>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                    : 'bg-gradient-to-br from-violet-500 to-purple-600'
                                }`}>
                                {message.role === 'user' ? (
                                    <User className="w-5 h-5 text-white" />
                                ) : (
                                    <Bot className="w-5 h-5 text-white" />
                                )}
                            </div>

                            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                                <div className={`inline-block p-4 rounded-2xl ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                        : 'bg-white/5 border border-white/10 text-gray-200'
                                    }`}>
                                    <div
                                        className="prose prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                                    />
                                </div>

                                {message.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => copyToClipboard(message.content, message.id)}
                                            className="text-gray-500 hover:text-white transition-colors p-1"
                                        >
                                            {copiedId === message.id ? (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <span className="text-xs text-gray-600">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                    <span className="text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
                <div className="max-w-4xl mx-auto px-4 pb-4">
                    <p className="text-sm text-gray-500 mb-3">Try asking:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {QUICK_PROMPTS.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(prompt.text)}
                                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <prompt.icon className="w-4 h-4 text-violet-400" />
                                </div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                    {prompt.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Ask about HS codes, CBAM, duties, compliance..."
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 pr-12"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                        AI responses are for guidance only. Verify with official sources for compliance decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
