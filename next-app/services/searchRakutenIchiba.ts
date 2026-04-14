import "dotenv/config";
import type { RakutenItem, RakutenResponse, CleanedItem, CleanedResult } from "@/types/rakuten";

// ============================================================
// 環境変数
// ============================================================

const RAKUTEN_API_ENDPOINT = process.env.RAKUTEN_API_ENDPOINT; // 楽天市場商品検索APIエンドポイント
const RAKUTEN_API_ACCESS_KEY = process.env.RAKUTEN_API_ACCESS_KEY; // 楽天APIアクセスキー
const RAKUTEN_APPLICATION_ID = process.env.RAKUTEN_APPLICATION_ID; // 楽天のアプリケーションID

// ============================================================
// 関数
// ============================================================

/**
 * 楽天市場商品検索APIで検索を実行する
 * @param keyword - 検索キーワード
 * @returns 検索結果
 */

const searchRakutenIchiba = async (keyword: string) => {
    //
    if (!RAKUTEN_APPLICATION_ID || !RAKUTEN_API_ACCESS_KEY) {
        throw new Error("APIキーが設定されていません");
    }
    // パラメータに全て含める
    const params = new URLSearchParams({
        applicationId: RAKUTEN_APPLICATION_ID,
        accessKey: RAKUTEN_API_ACCESS_KEY, // 2026年2月以降必須（認証）
        keyword: keyword, // 検索キーワード
        format: "json", // jsonレスポンス指定
        formatVersion: "2", // アクセスしやすい出力フォーマット
        hits: "10", // 1ページあたりの取得件数
        page: "1", // 取得ページ
        sort: "standard", // ソート（楽天標準ソート順）
        orFlag: "1", // OR検索有効（※AND検索だと複雑な検索ワードの場合にヒットしない）
    });

    try {
        const response = await fetch(`${RAKUTEN_API_ENDPOINT}?${params.toString()}`, {
            method: "GET",
        });
        // 200番台以外の場合に例外発生
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // 検索結果取得
        data.keyword = keyword; // 検索キーワードをオブジェクトに含める
        return data;
    } catch (error) {
        console.log("エラー:", error);
        return null;
    }
};

// ---------- 整形メイン関数 ----------
/**
 * 楽天市場商品検索APIのレスポンスから、必要なフィールドを抽出して整形する関数
 * @param results APIのレスポンス
 * @returns 整形されたAPIのレスポンス
 */
export const cleanRakutenIchibaResults = (results: RakutenResponse) => {
    const items: CleanedItem[] = [];

    results["Items"].forEach((item: RakutenItem, index: number) => {
        const i = index + 1;

        // 商品説明文の整形
        const itemCaption = formatItemCaption(item["itemCaption"]);

        // LLM向けテキスト構築
        const itemTextForLlm = [
            `  <item id='${i}'>`,
            `    <item_name>${item["itemName"]}</item_name>`,
            `    <catch_copy>${item["catchcopy"]}</catch_copy>`,
            `    <item_price>${item["itemPrice"]}円</item_price>`,
            `    <item_caption>\n${itemCaption}\n    </item_caption>`,
            `    <shop_name>:${item["shopName"]}</shop_name>`,
            "  </item>",
        ];

        items.push({
            itemId: i,
            itemCount: `${i}件目`,
            itemName: item["itemName"],
            catchcopy: item["catchcopy"],
            itemPrice: item["itemPrice"],
            itemCaption: itemCaption,
            itemUrl: item["itemUrl"],
            imageFlag: item["imageFlag"],
            mediumImageUrls: item["mediumImageUrls"],
            reviewCount: item["reviewCount"],
            reviewAverage: item["reviewAverage"],
            shopName: item["shopName"],
            shopUrl: item["shopUrl"],
            llm: itemTextForLlm.join("\n"),
        });
    });

    // LLM向けテキスト結合
    const llmItems = items.map((item) => item.llm);

    const llmContext = [
        `<items search_word='${results["keyword"]}' item_count='${items.length}件'>`,
        llmItems.join("\n"),
        "</items>",
    ];

    const cleanedResults: CleanedResult = {
        keyword: results["keyword"],
        hits: results["hits"],
        count: results["count"],
        page: results["page"],
        pageCount: results["pageCount"],
        items: items,
        llmContext: llmContext.join("\n"),
    };

    return cleanedResults;
};

// ---------- 整形補助関数 ----------
/**
 * 商品説明文を整形する補助関数
 * @param 商品説明文(Caption)
 * @returns 整形された商品説明文
 */
export const formatItemCaption = (caption: string): string => {
    if (!caption) return "";

    let text = caption;

    // 1. 同じ記号がスペースを挟んで連続している場合、スペースを詰めて結合
    // 例: "■ ■ 商品詳細 ■ ■" -> "■■ 商品詳細 ■■"
    text = text.replace(/([■◆●※▼])[\s　]+(?=\1)/g, "$1");

    // 2. 全角スペース、または2つ以上連続する半角スペースを改行に変換
    text = text.replace(/　+| {2,}/g, "\n");

    // 3. 句点（。）や感嘆符（！）の後の半角スペースを改行に変換
    text = text.replace(/([。！!])\s+/g, "$1\n");

    // 4. 見出し記号の前に改行を挿入（連続する記号の塊を1つとみなす）
    text = text.replace(/([【■◆●※▼]+)/g, "\n$1");

    // 5. 「・」の処理：文頭や空白の直後にある「・」だけを箇条書きとみなし改行
    // （これにより「ご予約・お取り寄せ」のような単語間の・での改行を防ぐ）
    text = text.replace(/(^|[\n\s])(・)/g, "$1\n$2");

    // 6. 「■■ 商品詳細 ■■」のように後ろに記号が残った場合、その後ろで改行
    text = text.replace(/([■◆●※▼]+)\s*\n/g, "$1\n"); // 記号の後ろの余分な空白を削除
    text = text.replace(/([^\n])\s+([■◆●※▼]+)(?=\n|$)/g, "$1\n$2");

    // 7. 3つ以上連続する改行を2つの改行（空行1行）にまとめる
    text = text.replace(/\n{3,}/g, "\n\n");

    return text.trim();
};

/**
 * ボードゲームを検索するツール
 * - 検索キーワードは日本語で入力
 * - 半角スペースでOR検索が可能
 * - 単語を複数並べると効果的
 * @param keyword 検索キーワード（prefix: "ボードゲーム"）
 * @returns 整形された検索結果
 */
export const searchBoardgameTool = async (keyword: string) => {

    // 検索実行（楽天市場商品検索API）
    const searchResults: RakutenResponse = await searchRakutenIchiba(keyword);

    // 検索結果整形
    const cleanedResults: CleanedResult = cleanRakutenIchibaResults(searchResults);

    return cleanedResults;
};
