// next-app/types/output.ts

export type OutputBoardgame = {
    id?: string;
    game_id?: string; // ClientPageの処理に合わせる
    name: string;
    description?: string;
    num_of_player?: string;
    reason: string;
    // 新規購入時専用
    price?: number;
    imageUrl?: string;
    itemUrl?: string;
    shopName?: string;
};
