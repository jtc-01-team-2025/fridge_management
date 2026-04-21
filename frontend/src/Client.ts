// src/Client.ts
import type { FoodType } from "./types/FoodType";

// 環境変数からAPIのベースURLを取得。取得できない場合はローカル環境のデフォルトURLを使用。
// 例: "http://127.0.0.1:8000"
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// APIレスポンスの型定義（成功時のメッセージを想定）
export interface ApiResponse {
  message: string;
}

// ----------------------------------------------------
// 1. 食材一覧を取得する関数 (GET)
// ----------------------------------------------------
/**
 * バックエンドAPIから登録されているすべての食材データを取得する
 * @returns FoodTypeの配列
 */
export async function fetchData(): Promise<FoodType[]> {
  // エンドポイントは "/items/" を想定
  const response = await fetch(`${API_BASE_URL}/items/`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as FoodType[];
  console.log("Fetched data:", data);
  return data;
}

// ----------------------------------------------------
// 3. カテゴリごとにグループ化された食材を取得する関数 (GET)
// ----------------------------------------------------
/**
 * バックエンドAPIからカテゴリごとにグループ化された食材データを取得する
 * @returns カテゴリ名をキーとしたFoodTypeNewの配列の辞書
 */
export async function fetchGroupedItems(): Promise<Record<string, FoodTypeNew[]>> {
  // エンドポイントは "/items/grouped/" を想定
  const response = await fetch(`${API_BASE_URL}/items/grouped/`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Record<string, FoodTypeNew[]>;
  console.log("Fetched grouped data:", data);
  return data;
}
