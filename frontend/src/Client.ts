// import type { FoodType } from "./types/FoodType";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/items";

// export interface ApiResponse {
//   message: string;
// }

// export async function fetchData(): Promise<FoodType[]> {
//   const response = await fetch(`${API_BASE_URL}/`);
//   if (!response.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
//   }
//   const data = (await response.json()) as Promise<FoodType[]>;
//   console.log("Fetched data:", data);
//   return data;
// }

import type { FoodType } from "./types/FoodType";

// 環境変数からAPIのベースURLを取得。取得できない場合はローカル環境のデフォルトURLを使用。
// ★注: /itemsをここで指定している場合、下の関数内のURLは適宜修正が必要です。
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// APIレスポンスの型定義（成功時のメッセージを想定）
export interface ApiResponse {
  message: string;
}

// ----------------------------------------------------
// ★ 1. 食材一覧を取得する関数 (GET)
// ----------------------------------------------------
export async function fetchData(): Promise<FoodType[]> {
  // API_BASE_URLが "http://127.0.0.1:8000" の場合、エンドポイントは "/items/" になる想定
  const response = await fetch(`${API_BASE_URL}/items/`); 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as FoodType[]; // Promise<FoodType[]>ではなく、FoodType[]が正しいです
  console.log("Fetched data:", data);
  return data;
}

// ----------------------------------------------------
// ★ 2. 食材を登録する関数 (POST) を追加
// ----------------------------------------------------
/**
 * 新しい食材データをバックエンドAPIにPOSTで送信し、登録する
 * @param foodData 登録する食材データ（FoodTypeのオブジェクト）
 * @returns 成功時のAPIレスポンス
 */
export async function registerFoodItem(foodData: Omit<FoodType, 'management_id'>): Promise<ApiResponse> {
  
  // API_BASE_URLが "http://127.0.0.1:8000" の場合、エンドポイントは "/items/" になる想定
  // ★重要: 食材登録のAPIエンドポイントは、`/api/v1/inventory/items`など、お使いのサーバーのルートと一致するように修正してください。
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

// ----------------------------------------------------