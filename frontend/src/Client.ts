// src/Client.ts
import type { FoodType } from "./types/FoodType";
//const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// 環境変数からAPIのベースURLを取得。取得できない場合はローカル環境のデフォルトURLを使用。
// 例: "http://127.0.0.1:8000"
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
// 2. 食材を登録する関数 (POST)
// ----------------------------------------------------
/**
 * 新しい食材データをバックエンドAPIにPOSTで送信し、登録する
 * @param foodData 登録する食材データ（FoodTypeからIDフィールドを除いたオブジェクト）
 * @returns 成功時のAPIレスポンス
 */
export async function registerFoodItem(foodData: Omit<FoodType, 'id'>): Promise<ApiResponse> {
  
  // エンドポイントは "/items/" を想定
  const response = await fetch(`${API_BASE_URL}/items/`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // 認証が必要な場合
    },
    body: JSON.stringify(foodData),
  });

  // レスポンスが成功ステータス (200-299) でない場合はエラーを投げる
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: '不明なサーバーエラー' }));
    throw new Error(`登録失敗! Status: ${response.status}. Message: ${errorBody.message || JSON.stringify(errorBody)}`);
  }

  // サーバーからの成功メッセージを返す
  return (await response.json()) as ApiResponse;
}