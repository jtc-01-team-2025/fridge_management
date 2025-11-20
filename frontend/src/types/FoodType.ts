export interface FoodType {
  itemID: number; // アイテムの一意の識別子
  name: string; // アイテム名
  category: string; // カテゴリ（例: 乳製品）
  date_purchase: string; // 購入日 (ISO 8601形式: YYYY-MM-DD)
  date_expiration: string; // 消費期限 (ISO 8601形式: YYYY-MM-DD)
}