// src/Client.ts
import type { FoodType, FoodTypeNew, ShoppingItem } from "./types/FoodType";

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
  category: number;
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

export async function updateShoppingItemCheck(
  itemId: string,
  checked: boolean
): Promise<ShoppingItem> {
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
