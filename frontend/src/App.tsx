import "./App.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ItemAddPage } from "./pages/ItemAddPage";
import { ItemConsumePage } from "./pages/ItemComsumePage";
import { HomePage } from "./pages/HomePage";
import { ItemDeletePage } from "./pages/ItemDeletePage";
import type { FoodTypeNew } from "./types/FoodType";
import { generateTestItems } from "./utils/generateDummyData";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import PopUp from "./components/PopUP";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import { RecipePage } from "./pages/RecipePage";
import ProfilePage from "./pages/ProfilePage";
import { ShoppingListPage } from "./pages/ShoppingListPage";
import { ChatPage } from "./pages/ChatPage";

// --- 1. API設定 & ユーザー管理 ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem("app_user_id");
  if (!userId) {
    userId = `user-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("app_user_id", userId);
  }
  return userId;
};

export function App() {
  const [data, setData] = useState<FoodTypeNew[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const useApiFlag = import.meta.env.VITE_USE_API === "true";
  const userId = useMemo(() => getOrCreateUserId(), []);

  // データ取得ロジック
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (useApiFlag) {
        // 通常のアイテムリストを取得
        const response = await fetch(`${API_BASE_URL}/items`, {
          headers: { "X-User-Id": userId },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const items: FoodTypeNew[] = await response.json();
        console.log("items from API", items);
        setData(
          items.sort(
            (a, b) => new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime()
          )
        );
      } else {
        setData(generateTestItems(5));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, useApiFlag]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // CRUD操作

  // kyoji 
  // const handleAddItem = useCallback(
  //   async (name: string, days: number, quantity: number, category: string) => {
  //     const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  //       .toISOString()
  //       .split("T")[0];
  const handleAddItem = useCallback(async (name: string, days: number, quantity: number, category: number) => {
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    try {
      await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": userId },
        body: JSON.stringify({ name, date_expiration: expiryDate, quantity, category }),
      });
      await fetchItems();
    } catch (e) { console.error(e); throw e; }
  }, [userId, fetchItems]);

  const handleDeleteItems = useCallback(async (ids: number[]) => {
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE_URL}/items/${id}`, {
            method: "DELETE",
            headers: { "X-User-Id": userId },
          })
        )
      );
      await fetchItems();
    } catch (e) { console.error(e); throw e; }
  }, [userId, fetchItems]);

  const handleConsumeItem = useCallback(
    async (id: number, quantity: number) => {
      try {
        if (useApiFlag) {
          await fetch(`${API_BASE_URL}/items/${id}/consume/?consume_item=${quantity}`, {
            method: "PUT",
            headers: { "X-User-Id": userId },
          });
          await fetchItems();
        } else {
          setData((prev) =>
            prev.map((it) =>
              it.id === id ? { ...it, quantity: Math.max(0, (it.quantity ?? 0) - quantity) } : it
            )
          );
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    [userId, fetchItems]
  );

  const urgentItems = useMemo(
    () =>
      data.filter((item) => {
        const diff =
          (new Date(item.date_expiration).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000;
        return diff <= 7;
      }),
    [data]
  );

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  return (
    <div id="root">
      {isLoading ? (
        <div className="home-container" style={{ textAlign: "center" }}>
          <h3>データを読み込み中...</h3>
        </div>
      ) : (
        <>
          <PopUp isVisible={isPopupVisible} onClose={togglePopup}>
            <div className="item-list-panel" style={{ border: "none", boxShadow: "none" }}>
              <h3 style={{ color: "#e3342f" }}>🚨 期限アラート</h3>
              <ul>
                {urgentItems.map((item) => (
                  <li key={item.id} className="urgent">
                    {item.name} <span className="expiry-date">({item.date_expiration})</span>
                  </li>
                ))}
              </ul>
            </div>
          </PopUp>
          <ErrorBoundary>
            <Routes>
              <Route
                path="/"
                element={<HomePage items={data} urgentItems={urgentItems} userId={userId} />}
              />
              <Route
                path="/delete"
                element={
                  <ItemDeletePage
                    items={data}
                    onBack={() => {
                      window.location.href = "/";
                    }}
                    onDeleteItems={handleDeleteItems}
                  />
                }
              />
              <Route
                path="/add"
                element={
                  <ItemAddPage
                    onBack={() => (window.location.href = "/")}
                    onAddItem={handleAddItem}
                  />
                }
              />
              <Route
                path="/consume"
                element={
                  <ItemConsumePage
                    items={data}
                    onBack={() => (window.location.href = "/")}
                    onConsumeItems={handleConsumeItem}
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/recipes" element={<RecipePage userId={userId} />} />
              <Route path="/profile" element={<ProfilePage userId={userId} />} />
              <Route path="/shopping" element={<ShoppingListPage userId={userId} />} />
              <Route path="/chat" element={<ChatPage userId={userId} />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
