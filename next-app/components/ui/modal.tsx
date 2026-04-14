"use client";

import { Game } from "@/types/game";
import { Star, User, X } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const url = process.env.NEXT_PUBLIC_API_URL!;

type Inputs = {
    id?: number;
    name?: string;
    players?: string;
    description?: string;
    isFavorite: boolean;
};

interface Props {
    mode: string;
    initialData: Game | null; // 新規作成の場合はnull
    onClose: () => void;
    onDelete: (game_id: number) => void;
}

// ゲーム詳細・追加モーダル コンポーネント
export default function GameModal({ mode, initialData, onClose, onDelete }: Props) {
    const [game, setGame] = useState<Game | null>(initialData);

    const toggleFavorite = () => {
        setGame({
            ...game,
            is_favorite: !game.is_favorite,
        });
    };

    const generateDescription = async (name: string) => {
        console.log(name);
        const response = await fetch(`${url}/api/chat/make_description`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });
        const result = await response.json();
        setValue("description", result.answer, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    // フォーム情報管理
    const { register, handleSubmit, setValue } = useForm<Inputs>({
        defaultValues: {
            id: initialData?.game_id,
            name: initialData?.name,
            players: initialData?.num_of_player,
            description: initialData?.description,
            isFavorite: initialData?.is_favorite,
            numOfPlayed: initialData?.num_of_played,
            dayOfLastPlay: initialData?.day_of_last_play,
        },
    });

    // 送信処理
    const onSubmit: SubmitHandler<Inputs> = async (inputData) => {
        // CRUDなど
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
                <div className="relative p-6 duration-200 bg-white shadow-xl rounded-2xl md:p-8 animate-in zoom-in-95">
                    {/* 閉じる */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute p-2 text-gray-400 transition rounded-full top-5 right-5 hover:text-gray-600 hover:bg-gray-100">
                        <X size={18} />
                    </button>

                    {/* タイトル */}
                    <div className="pr-10 mb-6">
                        {mode === "create" ? (
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="ゲーム名を入力"
                                className="w-full pb-2 text-2xl font-semibold text-gray-800 placeholder-gray-300 transition border-b border-gray-200 focus:outline-none focus:border-emerald-500"
                            />
                        ) : (
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    {...register("name")}
                                    placeholder="ゲーム名を入力"
                                    className="flex-1 pb-2 text-2xl font-semibold text-gray-800 placeholder-gray-300 transition border-b border-gray-200 focus:outline-none focus:border-emerald-500"
                                />

                                <button
                                    type="button"
                                    onClick={toggleFavorite}
                                    className="p-1 transition rounded-md hover:bg-gray-100">
                                    <Star
                                        className={
                                            game.is_favorite
                                                ? "w-6 h-6 text-yellow-400 fill-yellow-400"
                                                : "w-6 h-6 text-gray-300"
                                        }
                                    />
                                </button>
                            </div>
                        )}

                        {/* メタ情報 */}
                        <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
                            {/* プレイヤー */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
                                <User size={14} />
                                <input
                                    type="text"
                                    {...register("players")}
                                    placeholder="2〜4人"
                                    className="w-16 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
                                />
                            </div>

                            {mode === "edit" && (
                                <>
                                    {/* プレイ回数 */}
                                    <div className="flex items-center gap-3 px-3 py-2 transition bg-gray-100 rounded-lg hover:bg-gray-200/60">
                                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                            プレイ回数
                                        </span>
                                        <input
                                            type="number"
                                            {...register("numOfPlayed")}
                                            placeholder="0"
                                            className="w-20 px-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                        />
                                    </div>

                                    {/* 最終プレイ日 */}
                                    <div className="flex items-center gap-3 px-3 py-2 transition bg-gray-100 rounded-lg hover:bg-gray-200/60">
                                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                            最終プレイ
                                        </span>
                                        <input
                                            type="date"
                                            {...register("dayOfLastPlay")}
                                            className="px-1 text-sm text-gray-800 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 説明 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">説明・メモ</label>

                            <button
                                type="button"
                                onClick={() => {
                                    generateDescription(game?.name);
                                }}
                                className="px-2 py-1 text-xs font-medium transition rounded-md text-emerald-600 hover:bg-emerald-50 disabled:opacity-50">
                                ✨ AIで生成
                            </button>
                        </div>

                        <textarea
                            {...register("description")}
                            rows={4}
                            placeholder="自由にメモを残せます..."
                            className="w-full p-3 text-sm text-gray-700 transition border border-gray-200 resize-none rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:bg-white"
                        />
                    </div>

                    {/* ボタン */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        {mode === "edit" && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(initialData.game_id);
                                    onClose();
                                }}
                                className="px-4 py-2 mr-auto text-sm font-medium text-red-600 transition rounded-lg hover:bg-red-50">
                                削除
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 transition rounded-lg hover:bg-gray-100">
                            キャンセル
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-medium text-white transition rounded-lg shadow-sm bg-emerald-500 hover:bg-emerald-600 hover:shadow-md">
                            {mode === "create" ? "保存する" : "更新する"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
