import type { FoodType } from "./types/FoodType";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/items";

export interface ApiResponse {
  message: string;
}

export async function fetchData(): Promise<FoodType[]> {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Promise<FoodType[]>;
  console.log("Fetched data:", data);
  return data;
}
