// next-app/app/api/chat/recommend_game/route.ts

/**
 * 今回はFunction Callingではなく2回の構造化出力を重ねるアプローチで実行
 * 関数実行結果もUIで表示したいため
 */

import gemini from "@/lib/google";
import { searchBoardgameTool } from "@/services/searchRakutenIchiba"; // ボードゲーム検索関数
import type { RecommendInputs } from "@/types/input"; // インプット情報の型
import type { CleanedResult } from "@/types/rakuten"; // 検索APIのリザルト

export async function POST(req: Request) {
    // リクエスト情報受け取り
    const inputData: RecommendInputs = await req.json();

    // ============================================================
    // 出力スキーマ定義
    // ============================================================

    // 検索クエリ指定のスキーマ
    const searchBoardgameSchema = {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "検索クエリ",
            },
        },
        required: ["query"],
    };

    // 最終回答のスキーマ
    const recommendSchema = {
        type: "object",
        properties: {
            recommend: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        itemId: {
                            type: "number",
                            description: "推薦するボードゲームのitemId (RakutenResultsのid)",
                        },
                        reason: {
                            type: "string",
                            description: "推薦理由",
                        },
                    },
                    required: ["itemId", "reason"],
                },
            },
        },
        required: ["recommend"],
    };

    // ============================================================
    // インプット情報加工
    // ============================================================

    // 保存しているすべてのボードゲーム情報を整形された文字列に変換
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

    // ============================================================
    // 検索プロンプト構築
    // ============================================================

    const searchPrompt: string = `
新しく購入するボードゲームを検索します。

検索ワードを生成する前に、ユーザーの嗜好性を考察・分析してください。
その上で、ユーザーにとって最適なボードゲームが検索できるような検索ワードを生成してください。

検索ワードを生成するにあたり、以下に示すユーザー入力や保有ボードゲーム情報を参考にしてください。

## 検索ワードの注意点

必ず最初に"ボードゲーム"という語を入れてください。

最終的な検索ワードは以下のような形式になります:
「ボードゲーム {任意の検索ワード}」

- 半角スペースでOR検索が可能です。
- いくつかのワードを繋げると効果的です。

## ユーザー入力

- 提案する方向性: ${inputData.tab}
- プレイ人数: ${inputData.people}
- 希望するジャンル: ${inputData.genre}
- その他要望:
    ${inputData.request || "なし"}

## 保有ボードゲーム情報
${gameData}
`;

    // ============================================================
    // 検索処理
    // ============================================================
    // 検索クエリ生成
    const searchQueryResponse = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: searchPrompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: searchBoardgameSchema,
            temperature: 2, // ランダム性を持たせるため`2`に。（検索ワードを生成するだけであるため、ハルシネーションのリスクは低い）
            thinkingConfig: {
                includeThoughts: false,
                thinkingBudget: -1,
            },
        },
    });
    const generatedQuery = searchQueryResponse.text;
    // nullチェック
    if (!generatedQuery) {
        return null;
    }
    // JSONに変換
    const queryJson = JSON.parse(generatedQuery);
    console.log("生成された検索クエリ:\n", queryJson);

    // 検索API実行
    const RakutenResults: CleanedResult = await searchBoardgameTool(queryJson.query);

    // ============================================================
    // 最終回答生成
    // ============================================================

    const recommendPrompt: string = `
## 指示

ユーザー入力や保有ボードゲームを参考に、新規購入に適したボードゲームを検索結果の中から、最低5件おすすめしてください。

---

## ユーザー入力

- 提案する方向性: ${inputData.tab}
- プレイ人数: ${inputData.people}
- 希望するジャンル: ${inputData.genre}
- その他要望:
    ${inputData.request || "なし"}

---

## 既存の保有ボードゲーム情報
${gameData}
---

## ボードゲーム検索結果

${RakutenResults.llmContext}
`;

    // 生成処理 (JSONスキーマを指定)
    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: recommendPrompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: recommendSchema,
            thinkingConfig: { includeThoughts: false, thinkingBudget: 0 },
        },
    });

    const llmOutput = response.text;
    if (!llmOutput) return Response.json({ answer: "{}" });

    // ============================================================
    // データのマージ処理
    // ============================================================
    const llmJson = JSON.parse(llmOutput);
    console.log("おすすめのゲーム:\n", llmJson);

    // LLMが返す1件あたりのデータの型を定義
    type LlmRecommendItem = {
        itemId: number;
        reason: string;
    };

    // LLMが選んだitemIdをもとに、楽天の元データから必要な情報を抽出
    const mergedRecommend = llmJson.recommend.map((reccommendItem: LlmRecommendItem) => {
        const rakutenItem = RakutenResults.items.find(
            (item) => item.itemId === reccommendItem.itemId,
        );

        return {
            game_id: null, // 新規購入なので保有DBのIDは無い
            name: rakutenItem?.itemName || "不明な商品",
            reason: reccommendItem.reason, // 推薦理由
            price: rakutenItem?.itemPrice, // 価格
            imageUrl: rakutenItem?.mediumImageUrls?.[0] || "", // 画像URLを取得
            itemUrl: rakutenItem?.itemUrl,
            shopName: rakutenItem?.shopName,
        };
    });

    // フロントエンドの仕様に合わせて文字列化したJSONを返す
    const answer = JSON.stringify({ recommend: mergedRecommend });

    return Response.json({ answer });
}
