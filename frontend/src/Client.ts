const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface ApiResponse {
  message: string;
}

export async function fetchData(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Promise<ApiResponse>;
  return data;
}
