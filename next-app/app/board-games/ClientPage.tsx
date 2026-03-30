"use client";

import { Plus, Search, Star, User, X } from "lucide-react";
import { useState } from "react";

import GameModal from "@/components/ui/modal";
import { Game } from "@/types/game";
import dayjs from "dayjs";

const url = process.env.NEXT_PUBLIC_API_URL!;

interface Props {
  data: Game[];
}

// モーダルのState型定義
type ModalState = {
  isOpen: boolean;
  mode: "create" | "edit";
  game: Game | null;
};

export default function BoardGamesClientPage({ data }: Props) {
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリ
  const [games, setGames] = useState(data); // ゲーム情報
  // モーダルの状態
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: "create",
    game: null,
  });

  // 検索条件適用 (フィルターされたGamesを返す)
  const filteredGames = games.filter(
    (game) =>
      game.name.includes(searchQuery) || game.description.includes(searchQuery),
  );

  // 編集モーダル
  const openEditModal = (game: Game) => {
    setModalState({ isOpen: true, mode: "edit", game });
  };

  // 新規作成モーダル
  const openCreateModal = () => {
    setModalState({ isOpen: true, mode: "create", game: null });
  };

  //「遊んだ！」の更新
  const handlePlayed = async (game_id: number) => {
    await fetch(`${url}/api/db/update_num_of_played`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ game_id }),
    });
    const now = new Date();
    setGames((prevGames) =>
      prevGames.map((g) =>
        g.game_id === game_id
          ? {
              ...g,
              num_of_played: g.num_of_played + 1,
              day_of_last_play: now.toISOString(),
            }
          : g,
      ),
    );
  };

  //　日付フォーマット
  const formattedGames = filteredGames.map((game) => ({
    ...game,
    day_of_last_play: dayjs(game.day_of_last_play).format("YYYY/MM/DD"),
  }));

  return (
    <div className="w-full max-w-5xl p-4 mx-auto space-y-6 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800">保有ゲーム一覧</h2>
        <button
          onClick={openCreateModal}
          className="bg-lime-500 text-white font-medium px-5 py-2.5 rounded-full shadow-sm shadow-lime-500/20 hover:bg-lime-600 hover:shadow transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
        >
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
        {formattedGames.length === 0 ? (
          <div className="py-16 text-center text-gray-400 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <p>見つかりませんでした。</p>
          </div>
        ) : (
          formattedGames.map((game: Game) => (
            <div
              key={game.game_id}
              onClick={() => openEditModal(game)}
              className="flex items-center justify-between p-4 transition-all bg-white border border-gray-100 cursor-pointer rounded-2xl sm:p-5 hover:shadow-md hover:border-lime-200 group"
            >
              <div className="flex items-center flex-1 min-w-0 gap-4 sm:gap-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 親のクリックを止める
                    handlePlayed(game.game_id);
                  }}
                  className="flex items-center justify-center w-12 h-12 font-bold transition-all rounded-full sm:w-14 sm:h-14 bg-lime-50 text-lime-600 shrink-0 hover:bg-lime-100 active:scale-95"
                  title="遊んだ！を記録"
                >
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
                    className="p-2 transition-colors rounded-full hover:bg-gray-50"
                  >
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
                    className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-500 hover:bg-red-50"
                  >
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
      {modalState.isOpen && (
        <GameModal
          mode={modalState.mode}
          initialData={modalState.game}
          onClose={() =>
            setModalState({ isOpen: false, mode: "create", game: null })
          }
          // onSave={saveGame}
          // onDelete={(id) => handleDelete(id, null)}
        />
      )}
    </div>
  );
}
