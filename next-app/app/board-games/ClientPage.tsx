"use client";

import { useState } from "react";
import { Star, X, Search, User, Plus } from "lucide-react";

import { Game } from "@/types/game";

interface Props {
    data: Game[];
}

export default function BoardGamesClientPage({ data }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [games, setGames] = useState(data);
    console.log(games); // デバッグ

    const filteredGames = games.filter(
        (g) => g.name.includes(searchQuery) || g.description.includes(searchQuery),
    );

    return (
        <div className="w-full max-w-5xl p-4 mx-auto space-y-6 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold text-gray-800">保有ゲーム一覧</h2>
                <button
                    //   onClick={openCreateModal}
                    className="bg-lime-500 text-white font-medium px-5 py-2.5 rounded-full shadow-sm shadow-lime-500/20 hover:bg-lime-600 hover:shadow transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                    <Plus size={18} /> 新規登録
                </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute text-gray-400 -translate-y-1/2 left-4 top-1/2"
                    />
                    <input
                        type="text"
                        placeholder="ゲーム名や説明で検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-full py-2.5 pl-11 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 transition-shadow text-sm"
                    />
                </div>
                <select className="border border-gray-300 rounded-full px-5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-sm">
                    <option>並べ替え</option>
                    <option>最後に遊んだ日</option>
                    <option>遊んだ回数</option>
                    <option>お気に入り</option>
                </select>
            </div>

            {/* ゲームリスト */}
            <div className="space-y-3">
                {filteredGames.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 bg-white border border-gray-100 shadow-sm rounded-2xl">
                        <p>見つかりませんでした。</p>
                    </div>
                ) : (
                    filteredGames.map((game: Game) => (
                        <div
                            key={game.game_id}
                            //   onClick={() => openEditModal(game)}
                            className="flex items-center justify-between p-4 transition-all bg-white border border-gray-100 cursor-pointer rounded-2xl sm:p-5 hover:shadow-md hover:border-lime-200 group">
                            <div className="flex items-center flex-1 min-w-0 gap-4 sm:gap-5">
                                <button
                                    //   onClick={(e) => handlePlayed(game.id, e)}
                                    className="flex items-center justify-center w-12 h-12 font-bold transition-all rounded-full sm:w-14 sm:h-14 bg-lime-50 text-lime-600 shrink-0 hover:bg-lime-100 active:scale-95"
                                    title="遊んだ！を記録">
                                    <span className="text-[10px] sm:text-xs">遊んだ!</span>
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h3 className="mb-1 text-lg font-bold text-gray-800 truncate">
                                        {game.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate sm:text-sm">
                                        {game.description || "説明なし"}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-400 sm:gap-4">
                                        <span className="bg-gray-50 px-2 py-0.5 rounded-md">
                                            遊んだ回数: {game.num_of_played}回
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                                            <User size={12} /> {game.num_of_player}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 ml-4 shrink-0">
                                <div className="flex items-center gap-1 transition-opacity opacity-100 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100">
                                    <button
                                        // onClick={(e) => toggleFavorite(game.id, e)}
                                        className="p-2 transition-colors rounded-full hover:bg-gray-50">
                                        <Star
                                            size={20}
                                            className={
                                                game.is_favorite
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    </button>
                                    <button
                                        // onClick={(e) => handleDelete(game.id, e)}
                                        className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-500 hover:bg-red-50">
                                        <X size={18} />
                                    </button>
                                </div>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    最終プレイ: {game.day_of_last_play}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
