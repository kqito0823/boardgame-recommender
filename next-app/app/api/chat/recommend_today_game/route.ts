// next-app/app/api/chat/recommend_game/route.ts

import gemini from "@/lib/google";
import { RecommendInputs } from "@/types/input"; // インプット情報の型

export async function POST(req: Request) {
    // リクエスト情報受け取り
    const inputData: RecommendInputs = await req.json();

    // ============================================================
    // 出力スキーマ定義
    // ============================================================

    const boardgameSchema = {
        type: "object",
        properties: {
            recommend: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        game_id: {
                            type: "string",
                            description: "推薦したボードゲームのID",
                        },
                        reason: {
                            type: "string",
                            description: "推薦理由",
                        },
                    },
                    required: ["game_id", "reason"],
                },
            },
        },
        required: ["recommend"],
    };

    // ============================================================
    // インプット情報加工
    // ============================================================

    // ボードゲーム情報を整形された文字列に変換
    const gameData = inputData.gameData
        .map(
            (game) => `
### ${game.name}
- id: ${game.game_id}
- プレイ人数: ${game.num_of_player}
- 説明: ${game.description}
- お気に入り${game.is_favorite}
- プレイ回数: ${game.num_of_played}
- ジャンル: ${game.genre.name}
- 最後に遊んだ日: ${game.day_of_last_play}
`,
        )
        .join("");

    // プロンプト構築
    const recommendPrompt: string = `
以下の情報に基づき、おすすめのボードゲームを提案してください。
提案するボードゲームは必ず後述する保有ボードゲーム情報の中からとってきてください。
該当するボードゲームがない場合は、id欄にnullを返してください。

# ユーザー入力

- 提案する方向性: ${inputData.tab}
- プレイ人数: ${inputData.people}
- 希望するジャンル: ${inputData.genre}
- その他要望:
    ${inputData.request || "なし"}

## 保有ボードゲーム情報
${gameData}
`;

    // ============================================================
    // 生成処理
    // ============================================================
    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: recommendPrompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: boardgameSchema,
            thinkingConfig: {
                includeThoughts: false,
                thinkingBudget: 0,
            },
        },
    });
    const answer = response.text;
    console.log("回答:\n", answer);

    return Response.json({ answer });
}
