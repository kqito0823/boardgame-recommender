"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import "@/styles/markdown_style.css";

export default function SimpleStreamTest() {
    const [content, setContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        // 1. 状態の初期化とハードコードしたプロンプトの準備
        setContent("");
        setIsGenerating(true);
        const prompt = "こんにちは！ボドゲについて300文字程度で熱く語ってください。";

        try {
            // 2. FastAPIサーバーへPOSTリクエスト
            const response = await fetch("http://localhost:3000/api/py/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.body) throw new Error("レスポンスボディがありません");

            // 3. ストリームを読み取るための準備
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            // 4. データが来るたびにループ処理で読み込む
            while (true) {
                const { done, value } = await reader.read();
                if (done) break; // ストリーム終了

                // バイトデータを文字列に変換
                const chunkString = decoder.decode(value, { stream: true });

                // SSEのフォーマット ("data: {chunk}\n\n") をパースする
                const lines = chunkString.split("\n");
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        // "data: " の部分 (6文字) を取り除いて抽出
                        const text = line.slice(6);

                        // 抽出したテキストを既存のcontentの末尾に追加
                        setContent((prev) => prev + text);
                    }
                }
            }
        } catch (error) {
            console.error("通信エラー:", error);
            setContent("エラーが発生しました。コンソールを確認してください。");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-2xl p-8 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">SSE シンプルテスト</h1>

            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 mb-6 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {isGenerating ? "生成中..." : "テスト実行"}
            </button>

            <div className="p-6 bg-white border rounded-lg shadow-sm min-h-50">
                {/* 受け取った文字列をそのまま表示。改行を反映させるために whitespace-pre-wrap を指定 */}
                <div className="text-gray-800 whitespace-pre-wrap">
                    {content || (
                        <div className="markdown">
                            <Markdown>{content}</Markdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
