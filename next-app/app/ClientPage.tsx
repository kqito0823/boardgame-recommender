"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  people: string;
  genre: string;
  request: string;
};

export default function ClientHome(genreData) {
  // State
  const [active, setActive] = useState(false); // タブ切り替え（今日遊ぶゲームを提案 | 新しいゲームを提案）

  // register: フィールド登録, handleSubmit: 送信処理, watch: リアルタイム監視
  const { register, handleSubmit } = useForm<Inputs>();

  const [content, setContent] = useState(""); // 生成されたテキストを受け取る
  const [isGenerating, setIsGenerating] = useState(false); // 生成中のローディング

  // タブ切り替え
  const toggleActiveTub = () => {
    setActive((prev) => !prev);
  };

  // ジャンル一覧
  const genres = genreData;

  // 送信処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log("入力されたデータ:", data);
    // 値を初期化
    setContent("");
    setIsGenerating(true);

    const prompt = "こんにちは。LLMについて教えてください";

    try {
      const response = await fetch("/api/py/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // ストリームリーダーの取得
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8"); // バイナリデータのデコーダー
      if (!reader)
        throw new Error(
          `ストリームの読み込みに失敗しました: ${response.status}`,
        );

      // ストリームデータの逐次読み込みとパース
      while (true) {
        const { done, value } = await reader.read();
        if (done) break; // ストリーム終了

        // バイナリデータを文字列に変換
        const chunkText = decoder.decode(value, { stream: true });

        // SSEのフォーマット ("data: {chunk}\n\n") をパースする
        const lines = chunkText.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            // "data: " のプレフィックスを取り除く
            const text = line.replace("data: ", "");
            // 抽出したテキストを既存のcontentの末尾に追加
            setContent((prev) => prev + text);
          }
        }
      }
    } catch (error) {
      console.log("エラーが発生しました", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl px-20">
      {/* タブ切り替え */}
      <div className="flex items-center justify-between w-full pb-4 mt-6 text-xl border-b border-lime-500/20">
        <button
          className={`${active && "bg-lime-500 text-white"} flex justify-center w-full p-2 rounded-xl`}
          onClick={toggleActiveTub}
          disabled={active}
        >
          <span>今日遊ぶボードゲーム</span>
        </button>
        <button
          className={`${!active && "bg-lime-500 text-white"} flex justify-center w-full p-2 rounded-xl`}
          onClick={toggleActiveTub}
          disabled={!active}
        >
          <span>新しく買うボードゲーム</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* オプション */}
        <div className="w-full pt-6">
          <details className="flex flex-col w-full max-w-xl mx-auto">
            <summary className="mb-5 text-lg cursor-default">詳細設定</summary>
            <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
              {/* 人数選択 */}
              <div className="flex flex-col max-w-xs">
                <label htmlFor="people">プレイ人数</label>
                <select
                  {...register("people")} // name属性に相当
                  id="people"
                  className="mt-1 ml-10 text-sm border border-gray-300 rounded-md shadow-2xs"
                >
                  <option value="">人数を選択してください</option>
                  <option value="1">1人</option>
                  <option value="2">2人</option>
                  <option value="3-4">3~4人</option>
                  <option value="more">5人以上</option>
                </select>
              </div>
              {/* ジャンル選択 */}
              <div className="text-sm">
                <label htmlFor="" className="text-[16px]">
                  ジャンル
                </label>
                <div className="flex flex-wrap gap-0.5 mt-2 ml-10">
                  {genres.map((genre, k) => (
                    <div key={k} className="p-1">
                      <input
                        type="radio"
                        {...register("genre")} // name属性に相当
                        id={genre.id}
                        value={genre.name}
                        className="hidden peer"
                      />
                      <label
                        htmlFor={genre.id}
                        className="p-1 border border-gray-200 rounded-lg cursor-pointer shadow-2xs peer-checked:text-white peer-checked:bg-lime-500 "
                      >
                        {genre.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* その他要望(自由記載) */}
              <div className="">
                <label htmlFor="request">その他の要望（自由記載）</label>
                <textarea
                  {...register("request")} // name属性に相当
                  id="request"
                  placeholder="例: 初心者でも楽しめるルールが簡単なもの"
                  cols={10}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-blue-200 shadow-2xs"
                />
              </div>
            </div>
          </details>
        </div>
        {/* 生成ボタン */}
        <div className="pt-10">
          <button
            type="submit"
            className="p-40 text-white shadow-2xl text-8xl bg-lime-500 rounded-4xl"
          >
            生成！
          </button>
        </div>
      </form>
      {/* 生成テスト */}
      <div className="w-full p-6 mt-10 bg-white border rounded-lg shadow-sm min-h-50">
        {/* 受け取った文字列をそのまま表示。改行を反映させるために whitespace-pre-wrap を指定 */}
        <div className="mt-20 text-gray-800 whitespace-pre-wrap">
          {content || (
            <span className="text-gray-400">
              ここに生成結果が表示されます...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
