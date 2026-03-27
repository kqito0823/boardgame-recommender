import { Game } from "./game";

// レコメンドボードゲーム生成のインプット型
export type RecommendInputs = {
    tab: string;
    people: string; // プレイ人数
    genre: string; // ジャンル
    request: string; // その他要望
    gameData: Game[]; // ゲームデータ（送信用）
};
