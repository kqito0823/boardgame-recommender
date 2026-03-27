"use client";

import { Game, Genre } from "@/types/game";
import { RecommendInputs } from "@/types/input";
import { OutputBoardgame } from "@/types/output";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// ジャンルの型
interface Props {
    gameData: Game[];
    genreData: Genre[];
}

export default function ClientHome({ genreData, gameData }: Props) {
    // register: フィールド登録, handleSubmit: 送信処理, watch: リアルタイム監視
    const { register, handleSubmit } = useForm<RecommendInputs>();
    const [isGenerating, setIsGenerating] = useState(false); // 生成中のローディング
    const [outputText, setOutputText] = useState<OutputBoardgame[]>([]); // 生成テキスト

    // ジャンル一覧
    const genres = genreData;

    // 送信処理
    const onSubmit: SubmitHandler<RecommendInputs> = async (inputData) => {
        // 値を初期化
        setIsGenerating(true);
        // inputDataにgameDB情報を追加
        inputData.gameData = gameData;
        try {
            const response = await fetch("/api/chat/recommend_game", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputData),
            });
            const data = await response.json();
            const answer = JSON.parse(data.answer);
            // game_idをもとにgameDataにあるデータを追加する。
            for (const recommend of answer.recommend) {
                // game_idが存在するかチェック
                if (recommend.game_id != null) {
                    const id = Number.parseInt(recommend.game_id, 10);

                    // gameDataから一致するゲームを探す
                    const game = gameData.find((g) => g.game_id === id);

                    // 見つかった場合のみ代入
                    if (game) {
                        recommend.name = game.name;
                        recommend.description = game.description;
                        recommend.num_of_player = game.num_of_player;
                    }
                }
            }
            setOutputText(answer.recommend);
        } catch (error) {
            console.log("エラーが発生しました", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-6xl px-4 py-10 mx-auto sm:px-20">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
                {/* タブ切り替え */}
                <div className="flex items-center justify-between w-full gap-2 pb-4 mt-6 text-lg border-b sm:text-xl border-lime-500/20">
                    <div className="flex-1">
                        <input
                            type="radio"
                            defaultChecked
                            {...register("tab")} // name属性に相当
                            id="today-game"
                            value="today-game"
                            className="hidden peer"
                        />
                        <label
                            htmlFor="today-game"
                            className="flex justify-center w-full p-3 font-medium text-gray-600 transition-all cursor-pointer rounded-xl hover:bg-lime-400 peer-checked:bg-lime-500 peer-checked:text-white peer-checked:shadow-md">
                            今日遊ぶゲーム
                        </label>
                    </div>
                    <div className="flex-1">
                        <input
                            type="radio"
                            {...register("tab")}
                            id="new-game"
                            value="new-game"
                            className="hidden peer"
                        />
                        <label
                            htmlFor="new-game"
                            className="flex justify-center w-full p-3 font-medium text-gray-600 transition-all cursor-pointer rounded-xl hover:bg-lime-400 peer-checked:bg-lime-500 peer-checked:text-white peer-checked:shadow-md">
                            新しく買うゲーム
                        </label>
                    </div>
                </div>

                {/* オプション */}
                <div className="w-full pt-8">
                    <details className="flex flex-col w-full mx-auto group" open>
                        <summary className="mb-5 text-lg font-bold text-gray-700 transition-colors cursor-pointer hover:text-lime-600">
                            詳細設定
                        </summary>
                        <div className="flex flex-col gap-6 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                            {/* 人数選択 */}
                            <div className="flex flex-col">
                                <label htmlFor="people" className="font-medium text-gray-700">
                                    プレイ人数
                                </label>
                                <select
                                    {...register("people")}
                                    id="people"
                                    defaultValue={1}
                                    className="w-full max-w-xs mt-2 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 transition-shadow">
                                    <option value="">人数を選択してください</option>
                                    <option value="1">1人</option>
                                    <option value="2">2人</option>
                                    <option value="3-4">3~4人</option>
                                    <option value="more">5人以上</option>
                                </select>
                            </div>

                            {/* ジャンル選択 */}
                            <div className="text-sm">
                                <label className="text-[16px] font-medium text-gray-700">
                                    ジャンル
                                </label>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {genres.map((genre, k) => (
                                        <div key={k}>
                                            <input
                                                type="radio"
                                                {...register("genre")}
                                                id={`${genre.id}`}
                                                value={genre.name}
                                                className="hidden peer"
                                            />
                                            <label
                                                htmlFor={`${genre.id}`}
                                                className="inline-block px-4 py-2 text-gray-600 transition-all border border-gray-200 rounded-full cursor-pointer hover:border-lime-400 hover:bg-lime-500 peer-checked:text-white peer-checked:bg-lime-500 ">
                                                {genre.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* その他要望(自由記載) */}
                            <div>
                                <label htmlFor="request" className="font-medium text-gray-700">
                                    その他の要望（自由記載）
                                </label>
                                <textarea
                                    {...register("request")}
                                    id="request"
                                    placeholder="例: 初心者でも楽しめるルールが簡単なもの"
                                    rows={4}
                                    className="w-full p-4 mt-2 transition-shadow bg-white border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500"
                                />
                            </div>
                        </div>
                    </details>
                </div>

                {/* 生成ボタン */}
                <div className="flex justify-center pt-10">
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className={`w-full max-w-sm py-4 text-xl font-bold text-white transition-all shadow-lg rounded-full 
                        ${isGenerating ? "cursor-not-allowed" : "bg-lime-500 hover:bg-lime-600 text-black hover:shadow-lime-500/30 active:scale-95"}`}>
                        {isGenerating ? "生成中..." : "生成する！"}
                    </button>
                </div>
            </form>

            {/* 生成結果表示 */}
            {outputText.length > 0 && !isGenerating && (
                <div className="w-full max-w-3xl mt-16 duration-500 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-6 bg-white border border-gray-100 shadow-xl sm:p-8 rounded-3xl">
                        <h2 className="flex items-center justify-center gap-2 mb-8 text-2xl font-bold text-center text-gray-800">
                            <span className="w-8 h-1 rounded-full bg-lime-500"></span>
                            おすすめのボードゲーム
                            <span className="w-8 h-1 rounded-full bg-lime-500"></span>
                        </h2>

                        <div className="space-y-5">
                            {outputText.map((output, k) => (
                                <div
                                    key={k}
                                    className="flex flex-col w-full p-6 mt-2 transition-all duration-300 border-l-4 shadow-sm bg-gray-50 border-lime-500 rounded-2xl hover:shadow-md hover:bg-white">
                                    {/* DBにないゲームが提案された場合は name が無いので条件付き表示 */}
                                    {output.name && (
                                        <h3 className="mb-3 text-lg font-bold text-gray-800">
                                            {output.name}
                                        </h3>
                                    )}
                                    <p className="text-base leading-relaxed text-gray-700">
                                        {output.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
