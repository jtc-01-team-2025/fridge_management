export interface FoodTypeNew {
  // APIレスポンスで取得されるデータベースID
  id: number;
  name: string;
  date_expiration: string; // YYYY-MM-DD 形式
  quantity: number;
}
export interface FoodType {
  itemID: number; // アイテムの一意の識別子
  name: string; // アイテム名
  category: string; // カテゴリ（例: 乳製品）
  date_purchase: string; // 購入日 (ISO 8601形式: YYYY-MM-DD)
  date_expiration: string; // 消費期限 (ISO 8601形式: YYYY-MM-DD)
}
export type FoodCategory =
  | "野菜"
  | "果物"
  | "肉類"
  | "魚介類"
  | "乳製品"
  | "調味料"
  | "飲料"
  | "その他";

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  checked: boolean;
};
