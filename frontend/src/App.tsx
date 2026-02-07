import "./App.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ItemAddPage } from "./pages/ItemAddPage";
import { ExpirationStatus } from "./components/Expiration";
import { HomePage } from "./pages/HomePage";
import { ItemDeletePage } from "./pages/ItemDeletePage";
import type { FoodTypeNew } from "./types/FoodType";
import PopUp from "./components/PopUP";
import { generateTestItems } from "./utils/generateDummyData";

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

// --- 2. 共通パーツ (CSSを反映させるための構造) ---

const Header = ({
  navigate,
  currentPage,
}: {
  navigate: (path: Page) => void;
  currentPage: Page;
}) => (
  // インラインスタイルで App.css と調和する色を設定
  <header style={{ backgroundColor: "#38c172", padding: "15px 0", color: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
      <h2 style={{ margin: 0 }}>🧊 Fridge Manager</h2>
      <nav>
        <button 
          onClick={() => navigate("home")} 
          className={`action-button ${currentPage === "home" ? "primary" : ""}`}
          style={{ padding: "8px 15px", marginLeft: "10px", fontSize: "0.9em" }}
        >ホーム</button>
        <button 
          onClick={() => navigate("add")} 
          className={`action-button ${currentPage === "add" ? "primary" : ""}`}
          style={{ padding: "8px 15px", marginLeft: "10px", fontSize: "0.9em" }}
        >登録</button>
        <button 
          onClick={() => navigate("delete")} 
          className={`action-button ${currentPage === "delete" ? "primary" : ""}`}
          style={{ padding: "8px 15px", marginLeft: "10px", fontSize: "0.9em" }}
        >削除</button>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer style={{ textAlign: "center", padding: "20px", marginTop: "40px", color: "#888", borderTop: "1px solid #eee" }}>
    <p>© 2026 Refrigerator Manager App</p>
  </footer>
);

// --- 3. メインAppコンポーネント ---

type Page = "home" | "delete" | "add";

export function App() {
  const [data, setData] = useState<FoodTypeNew[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoading, setIsLoading] = useState(true);
  
  const useApiFlag = import.meta.env.VITE_USE_API === "true";
  const userId = useMemo(() => getOrCreateUserId(), []);

  // データ取得ロジック
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (useApiFlag) {
        const response = await fetch(`${API_BASE_URL}/items`, {
          headers: { "X-User-Id": userId },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const items: FoodTypeNew[] = await response.json();
        setData(items.sort((a, b) => new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime()));
      } else {
        setData(generateTestItems(5));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, useApiFlag]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // CRUD操作
  const handleAddItem = useCallback(async (name: string, days: number) => {
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    try {
      await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": userId },
        body: JSON.stringify({ name, date_expiration: expiryDate }),
      });
      await fetchItems();
    } catch (e) { console.error(e); throw e; }
  }, [userId, fetchItems]);

  const handleDeleteItem = useCallback(async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "DELETE",
        headers: { "X-User-Id": userId },
      });
      await fetchItems();
    } catch (e) { console.error(e); throw e; }
  }, [userId, fetchItems]);

  const urgentItems = useMemo(() => 
    data.filter(item => {
      const diff = (new Date(item.date_expiration).getTime() - new Date().setHours(0,0,0,0)) / 86400000;
      return diff <= 7;
    }), [data]
  );

  const navigate = (page: Page) => setCurrentPage(page);
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  // ページレンダリング
  const renderPage = () => {
    if (isLoading) return <div className="home-container" style={{ textAlign: "center" }}><h3>データを読み込み中...</h3></div>;

    switch (currentPage) {
      case "home":
        return (
          <HomePage
            items={data}
            urgentItems={urgentItems}
            togglePopup={togglePopup}
            navigate={navigate}
            getStatusComponent={ExpirationStatus}
            userId={userId}
          />
        );
      case "delete":
        return <ItemDeletePage items={data} onBack={() => navigate("home")} onDeleteItem={handleDeleteItem} />;
      case "add":
        return <ItemAddPage onBack={() => navigate("home")} onAddItem={handleAddItem} />;
    }
  };

  return (
    <div id="root"> {/* App.css の #root 設定を適用 */}
      <Header navigate={navigate} currentPage={currentPage} />
      
      <main style={{ padding: "20px" }}>
        {renderPage()}
      </main>

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

      <Footer />
    </div>
  );
}

export default App;