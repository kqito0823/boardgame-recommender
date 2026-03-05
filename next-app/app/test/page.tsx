'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

import Markdown from "react-markdown";
import "@/styles/markdown_style.css";

export default function Chat() {
    const [input, setInput] = useState('');

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage({ text: input });
        setInput('');
    };

    const isLoading = status === 'streaming' || status === 'submitted';

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力..."
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {status === 'streaming' 
                        ? 'AI応答中...' 
                        : status === 'submitted' 
                        ? '送信中...' 
                        : '送信'}
                </button>
            </form>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-100 ml-auto max-w-[80%]'
                                : 'bg-gray-100 mr-auto max-w-[80%]'
                        }`}
                    >
                        <p className="text-sm font-semibold mb-1">
                            {message.role === 'user' ? 'You' : 'AI'}
                        </p>
                        <div className="whitespace-pre-wrap">
                            {message.parts?.map((part, index) => {
                                if (part.type === 'text') {
                                    return <div key={index} className='markdown'><Markdown>{part.text}</Markdown></div>;
                                }
                                return null;
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}