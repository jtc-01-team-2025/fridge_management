// src/Client.ts
import type { FoodType, ShoppingItem } from "./types/FoodType";

// 環境変数からAPIのベースURLを取得。取得できない場合はローカル環境のデフォルトURLを使用。
// 例: "http://127.0.0.1:8000"
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// APIレスポンスの型定義（成功時のメッセージを想定）
export interface ApiResponse {
  message: string;
}

type ShoppingItemApi = {
  id: number;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
};

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
export async function registerFoodItem(foodData: Omit<FoodType, "id">): Promise<ApiResponse> {
  // エンドポイントは "/items/" を想定
  const response = await fetch(`${API_BASE_URL}/items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // 認証が必要な場合
    },
    body: JSON.stringify(foodData),
  });

  // レスポンスが成功ステータス (200-299) でない場合はエラーを投げる
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: "不明なサーバーエラー" }));
    throw new Error(
      `登録失敗! Status: ${response.status}. Message: ${errorBody.message || JSON.stringify(errorBody)}`
    );
  }

  // サーバーからの成功メッセージを返す
  return (await response.json()) as ApiResponse;
}

export async function fetchShoppingList(userId: string): Promise<ShoppingItem[]> {
  const url = `${API_BASE_URL}/shopping/?user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GET /shopping failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as ShoppingItemApi[];

  // フロントの型に合わせる（id を string に寄せる）
  return data.map((item) => ({
    id: String(item.id),
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    category: item.category as ShoppingItem["category"],
    checked: item.checked,
  }));
}

type CreateShoppingItemInput = {
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: ShoppingItem["category"];
};

export async function registerShoppingItem(
  itemData: CreateShoppingItemInput
): Promise<ShoppingItemApi> {
  const response = await fetch(`${API_BASE_URL}/shopping/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`POST /shopping failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as ShoppingItemApi;
  return data;
}

export async function deleteShoppingItem(itemId: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/shopping/${itemId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`DELETE /shopping/${itemId} failed: ${response.status} ${body}`);
  }

  return (await response.json()) as ApiResponse;
}

export async function updateShoppingItemCheck(itemId: string, checked: boolean): Promise<ShoppingItem> {
  const response = await fetch(`${API_BASE_URL}/shopping/${itemId}/check/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ checked }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`PUT /shopping/${itemId}/check/ failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as ShoppingItemApi;

  return {
    id: String(data.id),
    name: data.name,
    quantity: data.quantity,
    unit: data.unit,
    category: data.category as ShoppingItem["category"],
    checked: data.checked,
  };
}