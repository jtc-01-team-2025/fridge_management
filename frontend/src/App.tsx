import { useEffect, useMemo, useState, useCallback } from "react";
// import type { FoodType } from "./types/FoodType";
import { ItemAddPage } from "./pages/ItemAddPage";
import { ExpirationStatus } from "./components/Expiration";
import { HomePage } from "./pages/HomePage";
import { ItemDeletePage } from "./pages/ItemDeletePage";
import type { FoodTypeNew, Page } from "./types/FoodType";
import PopUp from "./components/PopUP";
import { generateTestItems } from "./utils/generateDummyData";
import "./styles/Homepage.css";
import Header from "./components/Header";

// --- 2. API設定 ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ユーザーIDの永続化と取得
// Docker Compose環境での開発のため、簡易的なセッションIDとしてLocalStorageを使用
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem("app_user_id");
  if (!userId) {
    userId = `user-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("app_user_id", userId);
  }
  return userId;
};

// --- 3. ユーティリティコンポーネント ---

const Footer = () => (
  <footer className="w-full text-center p-4 mt-8 bg-gray-100 text-gray-600 text-sm border-t">
    <p>© 2025 Refrigerator Manager App</p>
  </footer>
);

// const Header = ({
//   navigate,
//   currentPage,
// }: {
//   navigate: (path: Page) => void;
//   currentPage: Page;
// }) => (
//   <header className="w-full bg-indigo-700 shadow-lg sticky top-0 z-40">
//     <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
//       <h2 className="text-2xl font-bold text-white tracking-wider">Fridge Manager</h2>
//       <nav className="space-x-4">
//         <button
//           onClick={() => navigate("home")}
//           className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "home" ? "border-b-2 border-white" : ""}`}
//         >
//           ホーム
//         </button>
//         <button
//           onClick={() => navigate("add")}
//           className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "add" ? "border-b-2 border-white" : ""}`}
//         >
//           登録
//         </button>
//         <button
//           onClick={() => navigate("delete")}
//           className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "delete" ? "border-b-2 border-white" : ""}`}
//         >
//           削除
//         </button>
//       </nav>
//     </div>
//   </header>
// );

// const PopUp = ({
//   isVisible,
//   onClose,
//   children,
// }: {
//   isVisible: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300">
//         <div className="flex justify-between items-start border-b pb-3 mb-4">
//           <h2 className="text-xl font-semibold text-red-700">🚨 期限アラート</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
//           >
//             &times;
//           </button>
//         </div>
//         {children}
//         <div className="mt-6 pt-4 border-t flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-150 shadow-md"
//           >
//             閉じる
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ExpirationStatus = (date: string) => {

// --- 7. メインAppコンポーネント (APIロジックを統合) ---

export function App() {
  const [data, setData] = useState<FoodTypeNew[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoading, setIsLoading] = useState(true);
  // API使用フラグ
  const useApiFlag = import.meta.env.VITE_USE_API === "true";
  // セッションIDの取得
  const userId = useMemo(() => getOrCreateUserId(), []);

  // データの取得 (GET /items)
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (useApiFlag) {
        const response = await fetch(`${API_BASE_URL}/items`, {
          headers: {
            "X-User-Id": userId, // FastAPIにユーザーIDを渡す
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items: FoodTypeNew[] = await response.json();
        // API側でソートされているはずだが、念のためクライアント側でもソート
        const sortedItems = items.sort(
          (a, b) => new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime()
        );
        setData(sortedItems);
        console.log("Data fetched successfully:", sortedItems.length);
      } else {
        const items = generateTestItems(Math.floor(Math.random() * 11));
        setData(items);
      }
    } catch (error) {
      console.error("Failed to fetch data from API:", error);
      // エラー時もロード状態を解除
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // データ取得をコンポーネントマウント時とCRUD操作後に実行
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 食材登録ロジック (POST /items)
  const handleAddItem = useCallback(
    async (name: string, days: number): Promise<void> => {
      const today = new Date();
      // 期限日をYYYY-MM-DD形式で計算
      const expiryDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      const dateString = expiryDate.toISOString().split("T")[0];

      const newItemData = {
        name: name,
        date_expiration: dateString, // FastAPIのPydanticモデルに合わせてフォーマット
      };

      try {
        const response = await fetch(`${API_BASE_URL}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
          body: JSON.stringify(newItemData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 成功したらデータを再取得してリストを更新
        await fetchItems();
        console.log(`アイテム: ${name} がAPI経由で登録されました。`);
      } catch (error) {
        console.error("Failed to add item via API:", error);
        throw error;
      }
    },
    [userId, fetchItems]
  );

  // 削除ロジック (DELETE /items/{item_id})
  const handleDeleteItem = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
          method: "DELETE",
          headers: {
            "X-User-Id": userId,
          },
        });

        if (response.status === 404) {
          console.warn(`Item with ID ${id} already deleted or not found.`);
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 成功したらデータを再取得してリストを更新
        await fetchItems();
        console.log(`アイテム (ID: ${id}) がAPI経由で削除されました。`);
      } catch (error) {
        console.error("Failed to delete item via API:", error);
        throw error; // エラーを上位に投げてItemDeletePageで処理させる
      }
    },
    [userId, fetchItems]
  );

  // 期限が近い・期限切れアイテムのフィルタリング (変更なし)
  const urgentItems = useMemo(
    () =>
      data.filter((item) => {
        const today = new Date();
        const expiryDate = new Date(item.date_expiration);
        expiryDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        return diffDays <= 7; // 7日以内または期限切れ
      }),
    [data]
  );

  // ページナビゲーションの代替 (変更なし)
  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  // ページレンダリングの切り替え
  const renderPage = () => {
    // データロード中はローディング画面を表示
    if (isLoading) {
      return (
        <div className="text-center p-20 bg-white rounded-xl shadow-2xl">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-700 font-semibold">FastAPIサーバーからデータをロード中...</p>
          <p className="text-sm text-gray-500 mt-2">
            （FastAPIコンテナが起動しているか確認してください: `http://localhost:8000/docs`）
          </p>
        </div>
      );
    }

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
        return (
          <ItemDeletePage
            items={data}
            onBack={() => setCurrentPage("home")}
            onDeleteItem={handleDeleteItem}
          />
        );
      case "add":
        return <ItemAddPage onBack={() => setCurrentPage("home")} onAddItem={handleAddItem} />;
      default:
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-0 font-sans">
      <Header navigate={navigate} />

      <main className="flex-grow p-4 md:p-8">{renderPage()}</main>

      <PopUp isVisible={isPopupVisible} onClose={togglePopup}>
        <div className="space-y-4">
          {urgentItems.length === 0 ? (
            <p className="text-gray-600">
              期限が近い、または期限切れの食材はありません。素晴らしい！
            </p>
          ) : (
            <>
              <h3 className="text-lg font-bold text-red-600">期限が近い、期限切れの食材一覧</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {urgentItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">消費期限：{item.date_expiration}</p>
                    </div>
                    <ExpirationStatus date_expiration={item.date_expiration} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </PopUp>

      <Footer />
    </div>
  );
}

// export default App;
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import ItemAddPage from './pages/ItemAddPage';
// import ItemDeletePage from './pages/ItemDeletePage';
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     fetch("http://localhost:8000/ping")
//       .then((res) => res.json())
//       .then((data) => console.log("バックエンドからの応答:", data))
//       .catch((err) => console.error("接続エラー:", err));
//   }, []);

//   return (

//     <div>
//       <h1>冷蔵庫管理アプリ</h1>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/item/add" element={<ItemAddPage />} />
//         <Route path="/item/delete" element={<ItemDeletePage />} />
//       </Routes>
//     </div>

//   );
// }

// export default App;
