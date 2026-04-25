
// ============================================================
// APIレスポンス型
// ============================================================

/**
 * 検索結果リストの1要素
 */
export type RakutenItem = {
    itemName: string;
    itemCaption: string;
    catchcopy: string;
    itemPrice: number;
    itemUrl: string;
    imageFlag: number;
    mediumImageUrls: string[];
    reviewCount: number;
    reviewAverage: number;
    shopName: string;
    shopUrl: string;
    llm: string;
};

/**
 * 検索結果全体
 */
export type RakutenResponse = {
    keyword: string;
    hits: number;
    count: number;
    page: number;
    pageCount: number;
    Items: RakutenItem[];
};

// ============================================================
// 整形型
// ============================================================

/**
 * 整形された検索結果の1要素
 */
export type CleanedItem = {
    itemId: number;
    itemCount: string;
    itemName: string;
    catchcopy: string;
    itemPrice: number;
    itemCaption: string;
    itemUrl: string;
    imageFlag: number;
    mediumImageUrls: string[];
    reviewCount: number;
    reviewAverage: number;
    shopName: string;
    shopUrl: string;
    llm: string;
};

/**
 * 整形された検索結果全体
 */
export type CleanedResult = {
    keyword: string;
    hits: number;
    count: number;
    page: number;
    pageCount: number;
    items: CleanedItem[];
    llmContext: string;
};
