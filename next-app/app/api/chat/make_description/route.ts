// next-app/app/api/chat/make_description/route.ts

import gemini from "@/lib/google";

export async function POST(req: Request) {
    // リクエスト情報受け取り
    const inputGame = await req.json();

    // プロンプト構築
    const recommendPrompt: string = `
以下のボードゲームのルールを書いてください。
Markdownは用いず、1~2文程度に収めてください。

対象のゲーム名:
「${inputGame.name}」
`;

    console.log(recommendPrompt);

    // ============================================================
    // 生成処理
    // ============================================================
    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: recommendPrompt,
        config: {
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
