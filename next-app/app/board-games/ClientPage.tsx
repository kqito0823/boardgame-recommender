"use client";

type Games = {
    game_id: number // ゲームid
    name:             string // ゲーム名
    num_of_player:    string // プレイ人数
    description:      string // 説明
    is_favorite:      boolean // お気に入り
    num_of_played:    number // プレイ回数
    day_of_last_play: Date // 最終プレイ日
    genre_id:         number

}

export default function BoardGamesClientPage({games: Games }) {
  console.log(games)
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800">保有ゲーム一覧</h2>
        <button
          //   onClick={openCreateModal}
          className="bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-full shadow-sm shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
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
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-2.5 pl-11 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-shadow text-sm"
          />
        </div>
        <select className="border border-gray-300 rounded-full px-5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm">
          <option>並べ替え</option>
          <option>最後に遊んだ日</option>
          <option>遊んだ回数</option>
          <option>お気に入り</option>
        </select>
      </div>

      {/* ゲームリスト */}
      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            //   onClick={() => openEditModal(game)}
            className="flex items-center justify-between p-4 transition-all bg-white border border-gray-100 cursor-pointer rounded-2xl sm:p-5 hover:shadow-md hover:border-gray-200 group"
          >
            <div className="flex items-center flex-1 min-w-0 gap-4 sm:gap-5">
              <button
                //   onClick={(e) => handlePlayed(game.id, e)}
                className="flex items-center justify-center w-12 h-12 font-bold transition-all rounded-full sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 shrink-0 hover:bg-emerald-100 active:scale-95"
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
                    遊んだ回数: {game.playCount}回
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                    <User size={12} /> {game.players}
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
                      game.isFavorite
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
                最終プレイ: {game.lastPlayed}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )</div>
  );
}
