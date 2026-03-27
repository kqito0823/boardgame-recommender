// types/game.ts
export type Game = {
    game_id: number; // ゲームid
    name: string; // ゲーム名
    num_of_player: string; // プレイ人数
    description: string; // 説明
    is_favorite: boolean; // お気に入り
    num_of_played: number; // プレイ回数
    day_of_last_play: string; // 最終プレイ日
    genre_id: number; // ジャンルid
    genre: Genre; // ジャンル
};

export type Genre = {
    id: number; // ジャンルid
    name: string; // ジャンル名
};
