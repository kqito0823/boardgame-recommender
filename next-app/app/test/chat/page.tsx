// next-app/app/test/page.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "@/styles/markdown_style.css"

export default function ChatPage() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        // 状態の初期化
        setIsLoading(true);
        setResult("");
        setError(null);

        try {
            const response = await fetch("/api/py/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });
            // エラーハンドリング
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // 結果取得
            setResult(data.text)

        } catch (error) {
            console.error("Fetch error:", error);
            setError(error instanceof Error ? error.message : String(error))
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl p-6 mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Gemini Chat Test</h1>

            {/* 入力フォーム */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">プロンプト</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Geminiに質問してみましょう..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoading ? "生成中..." : "送信"}
                </button>
            </form>

            {/* エラー表示 */}
            {error && (
                <div className="p-4 text-red-600 rounded bg-red-50">
                    <p className="font-bold">エラーが発生しました</p>
                    <p>{error}</p>
                </div>
            )}

            {/* 結果表示 (react-markdown) */}
            {result && (
                <div className="p-4 prose border rounded markdown bg-gray-50 prose-slate max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}
