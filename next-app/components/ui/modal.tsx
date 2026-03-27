"use client";

import { Star, X, User } from "lucide-react";
import { Game } from "@/types/game";
import { SubmitHandler, useForm } from "react-hook-form";

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
}

// ゲーム詳細・追加モーダル コンポーネント
export default function GameModal({ mode, initialData, onClose }: Props) {
    // フォーム情報管理
    const { register, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            id: initialData?.game_id,
            name: initialData?.name,
            players: initialData?.num_of_player,
            description: initialData?.description,
            isFavorite: initialData?.is_favorite,
        },
    });

    // 送信処理
    const onSubmit: SubmitHandler<Inputs> = async (inputData) => {
        console.log(inputData);

        // CRUDなど
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 bg-gray-900/40 animate-in fade-in">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative w-full max-w-lg p-6 duration-200 bg-white shadow-2xl rounded-3xl md:p-8 animate-in zoom-in-95">
                    {/* 閉じるボタン（右上に配置） */}
                    <button
                        onClick={onClose}
                        className="absolute p-2 text-gray-400 transition-colors rounded-full top-6 right-6 hover:text-gray-600 hover:bg-gray-100">
                        <X size={20} />
                    </button>

                    <div className="pr-12 mb-8">
                        {mode === "create" ? (
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="ゲーム名を入力"
                                className="w-full pb-2 text-2xl font-bold text-gray-800 placeholder-gray-300 transition-colors border-b border-gray-200 focus:outline-none focus:border-emerald-500"
                            />
                        ) : (
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {initialData?.name}
                                </h2>
                                <Star
                                    className={
                                        initialData?.is_favorite
                                            ? "fill-yellow-400 text-yellow-400 w-6 h-6"
                                            : "text-gray-200 w-6 h-6"
                                    }
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center mt-4 text-sm text-gray-500 gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
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
                                    <span>
                                        プレイ:{" "}
                                        <strong className="text-gray-700">
                                            {initialData?.num_of_played}回
                                        </strong>
                                    </span>
                                    <span>最終: {initialData?.day_of_last_play}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">説明・メモ</label>
                            <button
                                // onClick={handleGenerateDesc}
                                // disabled={isGeneratingDesc}
                                className="text-emerald-600 hover:bg-emerald-50 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50">
                                {/* {isGeneratingDesc ? "AI生成中..." : "✨ AIで生成"} */}
                            </button>
                        </div>
                        <textarea
                            {...register("description")}
                            placeholder="自由にメモを残せます..."
                            rows={4}
                            className="w-full p-4 text-sm text-gray-700 transition-all border border-gray-200 resize-none rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        {mode === "edit" && (
                            <button
                                // onClick={() => onDelete(formData.id)}
                                className="px-5 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors mr-auto">
                                削除
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:bg-emerald-600 hover:shadow transition-all">
                            {mode === "create" ? "保存する" : "更新する"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
